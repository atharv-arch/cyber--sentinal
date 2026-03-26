function StatRow({ label, value, mono = true, colorClass }) {
  if (value == null || value === '' || (Array.isArray(value) && !value.length)) return null
  return (
    <div className="flex justify-between items-start gap-2 py-1.5 border-b border-outline-variant/10">
      <span className="text-[10px] shrink-0 font-mono text-slate-500 uppercase tracking-widest">{label}</span>
      <span className={`text-[11px] text-right break-all ${mono ? 'font-mono' : ''} ${colorClass || 'text-slate-300'}`}>
        {Array.isArray(value) ? value.join(', ') : String(value)}
      </span>
    </div>
  )
}

function Card({ title, icon, children, accentClass = 'border-outline-variant/20' }) {
  return (
    <div className={`p-5 bg-surface-container-lowest border ${accentClass} relative group overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[18px] text-slate-400">{icon}</span>
        <h3 className="font-headline text-xs font-bold tracking-widest text-slate-400 uppercase">{title}</h3>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export function VirusTotalCard({ data }) {
  if (!data) return (
    <Card title="VIRUSTOTAL" icon="coronavirus">
      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">No API key / no data</p>
    </Card>
  )
  const total = data.malicious + data.suspicious + data.harmless + data.undetected
  const pct = total ? Math.round(((data.malicious + data.suspicious) / total) * 100) : 0
  const isBad = data.malicious > 0
  const isWarn = data.suspicious > 0
  
  const accentClass = isBad ? 'border-error/50' : isWarn ? 'border-secondary/50' : 'border-primary/50'
  const textColor = isBad ? 'text-error' : isWarn ? 'text-secondary' : 'text-primary'

  return (
    <Card title="VIRUSTOTAL" icon="coronavirus" accentClass={accentClass}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`font-headline text-3xl font-bold ${textColor} drop-shadow-[0_0_8px_currentColor]`}>{pct}%</span>
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-tight">Detection<br/>Rate</div>
      </div>
      <StatRow label="Malicious" value={data.malicious} colorClass="text-error font-bold" />
      <StatRow label="Suspicious" value={data.suspicious} colorClass="text-secondary font-bold" />
      <StatRow label="Harmless" value={data.harmless} colorClass="text-primary" />
      <StatRow label="Undetected" value={data.undetected} />
      <StatRow label="Community" value={data.communityScore} colorClass={data.communityScore < 0 ? 'text-error' : 'text-primary'} />
      {data.lastAnalysis && <StatRow label="Last Scan" value={new Date(data.lastAnalysis).toLocaleDateString()} />}
      {data.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {data.tags.slice(0,5).map((t,i) => (
            <span key={i} className="font-mono text-[9px] px-1.5 py-0.5 border border-outline-variant/30 text-slate-400 bg-surface-container/50 uppercase tracking-widest">
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
    <Card title="ABUSEIPDB" icon="policy">
      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">No API key / not an IP</p>
    </Card>
  )
  const isBad = data.abuseScore > 75
  const isWarn = data.abuseScore > 30
  const accentClass = isBad ? 'border-error/50' : isWarn ? 'border-secondary/50' : 'border-primary/50'
  const textColor = isBad ? 'text-error' : isWarn ? 'text-secondary' : 'text-primary'

  return (
    <Card title="ABUSEIPDB" icon="policy" accentClass={accentClass}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`font-headline text-3xl font-bold ${textColor} drop-shadow-[0_0_8px_currentColor]`}>{data.abuseScore}%</span>
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-tight">Abuse<br/>Confidence</div>
      </div>
      <StatRow label="ISP" value={data.isp} />
      <StatRow label="Usage Type" value={data.usageType} />
      <StatRow label="Total Reports" value={data.totalReports} colorClass={data.totalReports > 0 ? 'text-secondary' : 'text-primary'} />
      <StatRow label="Distinct Users" value={data.numDistinctUsers} />
      <StatRow label="Domain" value={data.domain} />
      {data.lastReportedAt && <StatRow label="Last Report" value={new Date(data.lastReportedAt).toLocaleDateString()} />}
      {data.isWhitelisted && <StatRow label="Whitelisted" value="YES" colorClass="text-primary font-bold" />}
    </Card>
  )
}

export function ShodanCard({ data }) {
  if (!data) return (
    <Card title="SHODAN" icon="radar">
      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">No API key / not indexed</p>
    </Card>
  )
  const hasVulns = data.vulns?.length > 0
  return (
    <Card title="SHODAN" icon="radar" accentClass={hasVulns ? 'border-error/50' : 'border-outline-variant/20'}>
      <StatRow label="Open Ports" value={data.ports?.join(', ')} colorClass={data.ports?.length > 10 ? 'text-error' : 'text-secondary'} />
      <StatRow label="OS" value={data.os} />
      <StatRow label="Hostnames" value={data.hostnames?.slice(0,3).join(', ')} />
      <StatRow label="Tags" value={data.tags?.join(', ')} />
      
      {hasVulns && (
        <div className="mt-4 p-3 border border-error/20 bg-error/5">
          <p className="font-mono text-[10px] uppercase font-bold text-error tracking-widest mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">warning</span>
            CVEs Detected ({data.vulns.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {data.vulns.slice(0,6).map((v,i) => (
              <a key={i} href={`https://nvd.nist.gov/vuln/detail/${v}`} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[9px] px-1.5 py-0.5 border border-error/30 text-error hover:bg-error/10 transition-colors uppercase">
                {v}
              </a>
            ))}
          </div>
        </div>
      )}
      
      {data.services?.slice(0,4).map((s,i) => (
        <div key={i} className="mt-2 font-mono text-[10px] p-2 border border-outline-variant/10 bg-surface-container text-slate-400">
          <span className="text-primary mr-2">:{s.port}</span>
          {s.product} {s.version}
        </div>
      ))}
    </Card>
  )
}

export function WhoisCard({ data, dns }) {
  return (
    <Card title="WHOIS / DNS" icon="data_exploration">
      {data && <>
        <StatRow label="Registrar" value={data.registrar} />
        <StatRow label="Created" value={data.createdAt ? new Date(data.createdAt).toLocaleDateString() : null} />
        <StatRow label="Expires" value={data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : null}
          colorClass={data.expiresAt && new Date(data.expiresAt) < new Date() ? 'text-error font-bold' : ''} />
        <StatRow label="Nameservers" value={data.nameservers?.slice(0,3).join(', ')} />
        <StatRow label="Status" value={data.status?.slice(0,2).join(', ')} />
      </>}
      {dns && <>
        <StatRow label="A Records" value={dns.a?.slice(0,3).join(', ')} colorClass="text-primary" />
        <StatRow label="MX Records" value={dns.mx?.slice(0,2).join(', ')} />
        <StatRow label="NS Records" value={dns.ns?.slice(0,2).join(', ')} />
        {dns.txt?.slice(0,1).map((t,i) => <StatRow key={i} label="TXT" value={t?.substring(0,60)} />)}
        
        {dns.passiveDnsPivot?.length > 0 && (
          <div className="mt-4 border-t border-outline-variant/10 pt-3">
            <p className="font-mono text-[10px] text-primary uppercase font-bold tracking-widest mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">hub</span>
              Passive DNS Correlations
            </p>
            <div className="flex flex-col gap-1">
              {dns.passiveDnsPivot.map((d,i) => (
                <span key={i} className="font-mono text-[10px] text-slate-400 truncate w-full cursor-crosshair hover:text-primary transition-colors">
                  ↳ {d}
                </span>
              ))}
            </div>
          </div>
        )}
      </>}
      {!data && !dns && <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">N/A for this target</p>}
    </Card>
  )
}

export function SSLCard({ data }) {
  if (!data) return (
    <Card title="SSL CERT" icon="lock">
      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">No certificate data</p>
    </Card>
  )
  const expired = data.notAfter && new Date(data.notAfter) < new Date()
  return (
    <Card title="SSL CERT" icon="lock" accentClass={expired ? 'border-error/50' : 'border-primary/50'}>
      <StatRow label="Issuer" value={data.issuer?.split(',')[0]} />
      <StatRow label="Valid From" value={data.notBefore ? new Date(data.notBefore).toLocaleDateString() : null} />
      <StatRow label="Expires" value={data.notAfter ? new Date(data.notAfter).toLocaleDateString() : null}
        colorClass={expired ? 'text-error font-bold' : 'text-primary'} />
      <StatRow label="Total Certs" value={data.totalCerts} />
      
      {data.subdomains?.length > 0 && (
        <div className="mt-4 border-t border-outline-variant/10 pt-3">
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2">Subdomains ({data.subdomains.length})</p>
          <div className="flex flex-col gap-1 max-h-32 overflow-y-auto custom-scrollbar pr-2">
            {data.subdomains.slice(0,15).map((s,i) => (
              <span key={i} className="font-mono text-[10px] text-slate-400 truncate w-full">{s}</span>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export function DarkWebCard({ data }) {
  if (!data) return (
    <Card title="DARKWEB DB" icon="public">
      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">No exposure data</p>
    </Card>
  )
  const isExposed = data.exposed
  return (
    <Card title="DARKWEB DB" icon="public" accentClass={isExposed ? 'border-error/50' : 'border-primary/50'}>
      <StatRow label="Exposure Status" value={isExposed ? "COMPROMISED" : "CLEAN"} colorClass={isExposed ? 'text-error font-bold drop-shadow-[0_0_5px_currentColor]' : 'text-primary'} />
      <StatRow label="Known Breaches" value={data.breachCount} colorClass={data.breachCount > 0 ? 'text-error font-bold' : ''} />
      <StatRow label="Pastebin Mentions" value={data.pastebinMentions} colorClass={data.pastebinMentions > 0 ? 'text-secondary font-bold' : ''} />
      <StatRow label="Leaked Data Classes" value={data.dataClasses?.join(', ')} />
    </Card>
  )
}
