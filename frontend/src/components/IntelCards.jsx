function StatRow({ label, value, mono = true, color }) {
  if (value == null || value === '' || (Array.isArray(value) && !value.length)) return null
  return (
    <div className="flex justify-between items-start gap-2 py-1.5" style={{ borderBottom: '1px solid var(--border-dim)' }}>
      <span className="text-[11px] shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
      <span className={`text-[11px] text-right break-all ${mono ? 'font-mono' : ''}`} style={{ color: color || 'var(--text-primary)' }}>
        {Array.isArray(value) ? value.join(', ') : String(value)}
      </span>
    </div>
  )
}

function Card({ title, icon, children, accent }) {
  return (
    <div className="card fade-in" style={accent ? { borderColor: accent + '33' } : {}}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <h3 className="font-mono text-xs font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export function VirusTotalCard({ data }) {
  if (!data) return (
    <Card title="VIRUSTOTAL" icon="🦠">
      <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>No API key / no data</p>
    </Card>
  )
  const total = data.malicious + data.suspicious + data.harmless + data.undetected
  const pct = total ? Math.round(((data.malicious + data.suspicious) / total) * 100) : 0
  const color = data.malicious > 0 ? '#ef4444' : data.suspicious > 0 ? '#f59e0b' : '#00d4aa'
  return (
    <Card title="VIRUSTOTAL" icon="🦠" accent={color}>
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-2xl font-bold" style={{ color }}>{pct}%</span>
        <div className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>Detection rate</div>
      </div>
      <StatRow label="Malicious" value={data.malicious} color="#ef4444" />
      <StatRow label="Suspicious" value={data.suspicious} color="#f59e0b" />
      <StatRow label="Harmless" value={data.harmless} color="#00d4aa" />
      <StatRow label="Undetected" value={data.undetected} />
      <StatRow label="Community" value={data.communityScore} color={data.communityScore < 0 ? '#ef4444' : '#00d4aa'} />
      {data.lastAnalysis && <StatRow label="Last Scan" value={new Date(data.lastAnalysis).toLocaleDateString()} />}
      {data.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {data.tags.slice(0,5).map((t,i) => (
            <span key={i} className="font-mono text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-dim)' }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </Card>
  )
}

export function AbuseIPDBCard({ data }) {
  if (!data) return (
    <Card title="ABUSEIPDB" icon="🚨">
      <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>No API key / not an IP</p>
    </Card>
  )
  const color = data.abuseScore > 75 ? '#ef4444' : data.abuseScore > 30 ? '#f59e0b' : '#00d4aa'
  return (
    <Card title="ABUSEIPDB" icon="🚨" accent={color}>
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-2xl font-bold" style={{ color }}>{data.abuseScore}%</span>
        <div className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>Abuse confidence</div>
      </div>
      <StatRow label="ISP" value={data.isp} />
      <StatRow label="Usage Type" value={data.usageType} />
      <StatRow label="Total Reports" value={data.totalReports} color={data.totalReports > 0 ? '#f59e0b' : '#00d4aa'} />
      <StatRow label="Distinct Users" value={data.numDistinctUsers} />
      <StatRow label="Domain" value={data.domain} />
      {data.lastReportedAt && <StatRow label="Last Report" value={new Date(data.lastReportedAt).toLocaleDateString()} />}
      {data.isWhitelisted && <StatRow label="Whitelisted" value="Yes" color="#00d4aa" />}
    </Card>
  )
}

export function ShodanCard({ data }) {
  if (!data) return (
    <Card title="SHODAN" icon="🔭">
      <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>No API key / not indexed</p>
    </Card>
  )
  const hasVulns = data.vulns?.length > 0
  return (
    <Card title="SHODAN" icon="🔭" accent={hasVulns ? '#ef4444' : undefined}>
      <StatRow label="Open Ports" value={data.ports?.join(', ')} color={data.ports?.length > 10 ? '#ef4444' : '#f59e0b'} />
      <StatRow label="OS" value={data.os} />
      <StatRow label="Hostnames" value={data.hostnames?.slice(0,3).join(', ')} />
      <StatRow label="Tags" value={data.tags?.join(', ')} />
      {hasVulns && (
        <div className="mt-2">
          <p className="font-mono text-[10px] font-bold mb-1" style={{ color: '#ef4444' }}>⚠ CVEs ({data.vulns.length})</p>
          <div className="flex flex-wrap gap-1">
            {data.vulns.slice(0,6).map((v,i) => (
              <a key={i} href={`https://nvd.nist.gov/vuln/detail/${v}`} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[9px] px-1.5 py-0.5 rounded hover:opacity-80"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                {v}
              </a>
            ))}
          </div>
        </div>
      )}
      {data.services?.slice(0,3).map((s,i) => (
        <div key={i} className="mt-1 font-mono text-[10px] p-1.5 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          :{s.port} {s.product} {s.version}
        </div>
      ))}
    </Card>
  )
}

export function WhoisCard({ data, dns }) {
  return (
    <Card title="WHOIS / DNS" icon="📋">
      {data && <>
        <StatRow label="Registrar" value={data.registrar} />
        <StatRow label="Created" value={data.createdAt ? new Date(data.createdAt).toLocaleDateString() : null} />
        <StatRow label="Expires" value={data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : null}
          color={data.expiresAt && new Date(data.expiresAt) < new Date() ? '#ef4444' : undefined} />
        <StatRow label="Nameservers" value={data.nameservers?.slice(0,3).join(', ')} />
        <StatRow label="Status" value={data.status?.slice(0,2).join(', ')} />
      </>}
      {dns && <>
        <StatRow label="A Records" value={dns.a?.slice(0,3).join(', ')} color="#00d4aa" />
        <StatRow label="MX Records" value={dns.mx?.slice(0,2).join(', ')} />
        <StatRow label="NS Records" value={dns.ns?.slice(0,2).join(', ')} />
        {dns.txt?.slice(0,1).map((t,i) => <StatRow key={i} label="TXT" value={t?.substring(0,60)} />)}
      </>}
      {!data && !dns && <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>N/A for this indicator type</p>}
    </Card>
  )
}

export function SSLCard({ data }) {
  if (!data) return (
    <Card title="SSL / CERTIFICATES" icon="🔐">
      <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>No certificate data</p>
    </Card>
  )
  const expired = data.notAfter && new Date(data.notAfter) < new Date()
  return (
    <Card title="SSL / CERTIFICATES" icon="🔐" accent={expired ? '#ef4444' : '#00d4aa'}>
      <StatRow label="Issuer" value={data.issuer?.split(',')[0]} />
      <StatRow label="Valid From" value={data.notBefore ? new Date(data.notBefore).toLocaleDateString() : null} />
      <StatRow label="Expires" value={data.notAfter ? new Date(data.notAfter).toLocaleDateString() : null}
        color={expired ? '#ef4444' : '#00d4aa'} />
      <StatRow label="Total Certs" value={data.totalCerts} />
      {data.subdomains?.length > 0 && (
        <div className="mt-2">
          <p className="font-mono text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Subdomains ({data.subdomains.length})</p>
          <div className="flex flex-col gap-0.5 max-h-24 overflow-y-auto">
            {data.subdomains.slice(0,8).map((s,i) => (
              <span key={i} className="font-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
