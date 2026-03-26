import express from 'express';
import {
  detectType, getGeo, getVirusTotal, getAbuseIPDB,
  getShodan, getSSL, getDNS, getWhois, parseEmailHeaders
} from '../services/intel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: 'Input required' });

    const type = detectType(input.trim());
    const timestamp = new Date().toISOString();

    if (type === 'email_header') {
      const hops = parseEmailHeaders(input);
      const hopResults = await Promise.allSettled(
        hops.map(async hop => {
          const [geo, abuseipdb, virustotal] = await Promise.allSettled([
            getGeo(hop.ip),
            getAbuseIPDB(hop.ip),
            getVirusTotal(hop.ip, 'ip')
          ]);
          return {
            ...hop,
            geo: geo.status === 'fulfilled' ? geo.value : null,
            abuseipdb: abuseipdb.status === 'fulfilled' ? abuseipdb.value : null,
            virustotal: virustotal.status === 'fulfilled' ? virustotal.value : null
          };
        })
      );

      return res.json({
        input: input.substring(0, 200) + '...',
        type: 'email_header',
        timestamp,
        hops: hopResults.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean)
      });
    }

    // Determine primary identifier
    let primaryTarget = input.trim();
    let domain = null;
    let ip = null;

    if (type === 'domain') domain = primaryTarget;
    else if (type === 'ip' || type === 'ipv6') ip = primaryTarget;
    else if (type === 'url') {
      try {
        const url = new URL(primaryTarget);
        domain = url.hostname;
        if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) ip = domain;
      } catch (e) {
        domain = primaryTarget.replace(/^https?:\/\//, '').split('/')[0];
      }
    }

    // Fan out to all APIs simultaneously
    const [geoRes, vtRes, abuseRes, shodanRes, sslRes, dnsRes, whoisRes] = await Promise.allSettled([
      ip ? getGeo(ip) : (domain ? getGeo(null).catch(() => null) : Promise.resolve(null)),
      getVirusTotal(primaryTarget, type),
      (ip || type === 'ip') ? getAbuseIPDB(ip || primaryTarget) : Promise.resolve(null),
      (ip || type === 'ip') ? getShodan(ip || primaryTarget) : Promise.resolve(null),
      domain ? getSSL(domain) : Promise.resolve(null),
      domain ? getDNS(domain) : Promise.resolve(null),
      domain ? getWhois(domain) : Promise.resolve(null)
    ]);

    // If domain, resolve IP for geo
    let resolvedIp = ip;
    if (!resolvedIp && dnsRes.status === 'fulfilled' && dnsRes.value?.a?.length) {
      resolvedIp = dnsRes.value.a[0];
    }
    const finalGeo = ip
      ? (geoRes.status === 'fulfilled' ? geoRes.value : null)
      : resolvedIp
        ? await getGeo(resolvedIp)
        : null;

    const bundle = {
      input: primaryTarget,
      type,
      timestamp,
      geo: finalGeo,
      virustotal: vtRes.status === 'fulfilled' ? vtRes.value : null,
      abuseipdb: abuseRes.status === 'fulfilled' ? abuseRes.value : null,
      shodan: shodanRes.status === 'fulfilled' ? shodanRes.value : null,
      ssl: sslRes.status === 'fulfilled' ? sslRes.value : null,
      dns: dnsRes.status === 'fulfilled' ? dnsRes.value : null,
      whois: whoisRes.status === 'fulfilled' ? whoisRes.value : null
    };

    res.json(bundle);
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
