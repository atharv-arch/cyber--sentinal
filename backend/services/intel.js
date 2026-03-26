import axios from 'axios';

const CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function cached(key, fn) {
  const now = Date.now();
  if (CACHE.has(key)) {
    const { data, ts } = CACHE.get(key);
    if (now - ts < CACHE_TTL) return Promise.resolve(data);
  }
  return fn().then(data => {
    CACHE.set(key, { data, ts: now });
    return data;
  });
}

// ─── Input Type Detection ─────────────────────────────────────────────────────
export function detectType(input) {
  const trimmed = input.trim();
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(trimmed)) return 'ip';
  if (/^[0-9a-fA-F:]+$/.test(trimmed) && trimmed.includes(':')) return 'ipv6';
  if (/^[a-fA-F0-9]{32}$/.test(trimmed)) return 'md5';
  if (/^[a-fA-F0-9]{40}$/.test(trimmed)) return 'sha1';
  if (/^[a-fA-F0-9]{64}$/.test(trimmed)) return 'sha256';
  if (/^https?:\/\//i.test(trimmed)) return 'url';
  if (/^Received:/im.test(trimmed) || trimmed.includes('DKIM-Signature')) return 'email_header';
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(trimmed)) return 'domain';
  return 'unknown';
}

// ─── Geolocation ──────────────────────────────────────────────────────────────
export async function getGeo(ip) {
  return cached(`geo:${ip}`, async () => {
    try {
      const { data } = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 5000 });
      return {
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || '',
        city: data.city || 'Unknown',
        lat: data.latitude || 0,
        lng: data.longitude || 0,
        asn: data.asn || '',
        org: data.org || '',
        timezone: data.timezone || ''
      };
    } catch (e) {
      return { country: 'Unknown', city: 'Unknown', lat: 0, lng: 0, asn: '', org: '' };
    }
  });
}

// ─── VirusTotal ───────────────────────────────────────────────────────────────
export async function getVirusTotal(indicator, type) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey || apiKey === 'your-vt-key-here') return null;

  return cached(`vt:${indicator}`, async () => {
    try {
      let endpoint;
      if (type === 'ip' || type === 'ipv6') endpoint = `https://www.virustotal.com/api/v3/ip_addresses/${indicator}`;
      else if (type === 'domain') endpoint = `https://www.virustotal.com/api/v3/domains/${indicator}`;
      else if (type === 'url') {
        const encoded = Buffer.from(indicator).toString('base64').replace(/=/g, '');
        endpoint = `https://www.virustotal.com/api/v3/urls/${encoded}`;
      } else if (['md5', 'sha1', 'sha256'].includes(type)) {
        endpoint = `https://www.virustotal.com/api/v3/files/${indicator}`;
      } else return null;

      const { data } = await axios.get(endpoint, {
        headers: { 'x-apikey': apiKey },
        timeout: 8000
      });

      const stats = data.data?.attributes?.last_analysis_stats || {};
      return {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
        lastAnalysis: data.data?.attributes?.last_analysis_date
          ? new Date(data.data.attributes.last_analysis_date * 1000).toISOString()
          : null,
        communityScore: data.data?.attributes?.reputation || 0,
        tags: data.data?.attributes?.tags || []
      };
    } catch (e) {
      console.error('VT error:', e.message);
      return null;
    }
  });
}

// ─── AbuseIPDB ────────────────────────────────────────────────────────────────
export async function getAbuseIPDB(ip) {
  const apiKey = process.env.ABUSEIPDB_API_KEY;
  if (!apiKey || apiKey === 'your-abuseipdb-key-here') return null;

  return cached(`abuse:${ip}`, async () => {
    try {
      const { data } = await axios.get('https://api.abuseipdb.com/api/v2/check', {
        headers: { Key: apiKey, Accept: 'application/json' },
        params: { ipAddress: ip, maxAgeInDays: 90, verbose: true },
        timeout: 8000
      });
      const d = data.data;
      return {
        abuseScore: d.abuseConfidenceScore || 0,
        isp: d.isp || 'Unknown',
        usageType: d.usageType || 'Unknown',
        totalReports: d.totalReports || 0,
        numDistinctUsers: d.numDistinctUsers || 0,
        lastReportedAt: d.lastReportedAt || null,
        countryCode: d.countryCode || '',
        isWhitelisted: d.isWhitelisted || false,
        domain: d.domain || ''
      };
    } catch (e) {
      console.error('AbuseIPDB error:', e.message);
      return null;
    }
  });
}

// ─── Shodan ───────────────────────────────────────────────────────────────────
export async function getShodan(ip) {
  const apiKey = process.env.SHODAN_API_KEY;
  if (!apiKey || apiKey === 'your-shodan-key-here') return null;

  return cached(`shodan:${ip}`, async () => {
    try {
      const { data } = await axios.get(`https://api.shodan.io/shodan/host/${ip}`, {
        params: { key: apiKey },
        timeout: 8000
      });
      return {
        ports: data.ports || [],
        hostnames: data.hostnames || [],
        os: data.os || null,
        tags: data.tags || [],
        vulns: data.vulns ? Object.keys(data.vulns) : [],
        services: (data.data || []).map(s => ({
          port: s.port,
          transport: s.transport,
          product: s.product,
          version: s.version,
          banner: s.data?.substring(0, 200)
        }))
      };
    } catch (e) {
      if (e.response?.status !== 404) console.error('Shodan error:', e.message);
      return null;
    }
  });
}

// ─── SSL / crt.sh ─────────────────────────────────────────────────────────────
export async function getSSL(domain) {
  return cached(`ssl:${domain}`, async () => {
    try {
      const { data } = await axios.get(`https://crt.sh/?q=${domain}&output=json`, { timeout: 8000 });
      const certs = Array.isArray(data) ? data : [];
      const subdomains = [...new Set(certs.map(c => c.name_value).join('\n').split('\n').filter(s => s && !s.includes('*')))].slice(0, 50);
      const latest = certs[0];
      return {
        issuer: latest?.issuer_name || 'Unknown',
        notBefore: latest?.not_before || null,
        notAfter: latest?.not_after || null,
        subdomains,
        totalCerts: certs.length
      };
    } catch (e) {
      return null;
    }
  });
}

// ─── DNS Resolution ───────────────────────────────────────────────────────────
export async function getDNS(domain) {
  return cached(`dns:${domain}`, async () => {
    try {
      const { data } = await axios.get(`https://dns.google/resolve?name=${domain}&type=A`, { timeout: 5000 });
      const aRecords = (data.Answer || []).filter(r => r.type === 1).map(r => r.data);

      const [mxRes, txtRes, nsRes] = await Promise.allSettled([
        axios.get(`https://dns.google/resolve?name=${domain}&type=MX`, { timeout: 5000 }),
        axios.get(`https://dns.google/resolve?name=${domain}&type=TXT`, { timeout: 5000 }),
        axios.get(`https://dns.google/resolve?name=${domain}&type=NS`, { timeout: 5000 })
      ]);

      return {
        a: aRecords,
        mx: mxRes.status === 'fulfilled' ? (mxRes.value.data.Answer || []).map(r => r.data) : [],
        txt: txtRes.status === 'fulfilled' ? (txtRes.value.data.Answer || []).map(r => r.data) : [],
        ns: nsRes.status === 'fulfilled' ? (nsRes.value.data.Answer || []).map(r => r.data) : []
      };
    } catch (e) {
      return { a: [], mx: [], txt: [], ns: [] };
    }
  });
}

// ─── WHOIS ────────────────────────────────────────────────────────────────────
export async function getWhois(domain) {
  return cached(`whois:${domain}`, async () => {
    try {
      // Use RDAP (publicly available, no key needed)
      const tld = domain.split('.').slice(-1)[0];
      const { data } = await axios.get(`https://rdap.org/domain/${domain}`, { timeout: 8000 });
      return {
        registrar: data.entities?.[0]?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'Unknown',
        createdAt: data.events?.find(e => e.eventAction === 'registration')?.eventDate || null,
        expiresAt: data.events?.find(e => e.eventAction === 'expiration')?.eventDate || null,
        updatedAt: data.events?.find(e => e.eventAction === 'last changed')?.eventDate || null,
        nameservers: (data.nameservers || []).map(ns => ns.ldhName),
        status: data.status || []
      };
    } catch (e) {
      return { registrar: 'Unknown', createdAt: null, expiresAt: null, nameservers: [] };
    }
  });
}

// ─── Email Header Parser ──────────────────────────────────────────────────────
export function parseEmailHeaders(rawHeader) {
  const receivedLines = rawHeader.match(/Received:[\s\S]*?(?=\n\S|\n$)/gim) || [];
  const hops = [];

  for (let i = 0; i < receivedLines.length; i++) {
    const line = receivedLines[i];
    const ipMatch = line.match(/\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]/);
    const dateMatch = line.match(/;\s*(.+)$/m);
    if (ipMatch) {
      hops.push({
        hopNumber: i + 1,
        ip: ipMatch[1],
        raw: line.replace(/\s+/g, ' ').trim(),
        timestamp: dateMatch ? dateMatch[1].trim() : null
      });
    }
  }
  return hops;
}
