const countryFlag = (code) => {
  if (!code || code.length !== 2) return '🌐'
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
}

export default function EmailHopChain({ hops = [] }) {
  if (!hops.length) return null
  const suspicious = hops.reduce((worst, h) =>
    (h.abuseipdb?.abuseScore ?? 0) > (worst?.abuseipdb?.abuseScore ?? 0) ? h : worst, hops[0])

  return (
    <div className="card fade-in delay-1">
      <h3 className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
        EMAIL HOP CHAIN ({hops.length} hops)
      </h3>

      {suspicious && (
        <div className="mb-3 px-3 py-2 rounded-lg font-mono text-xs"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
          ⚠ Most suspicious hop: <strong>{suspicious.ip}</strong>
          {suspicious.geo && ` — ${suspicious.geo.city}, ${suspicious.geo.country}`}
          {suspicious.abuseipdb && ` (Abuse: ${suspicious.abuseipdb.abuseScore}%)`}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="hop-table w-full">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4">Hop</th>
              <th className="text-left py-2 pr-4">IP Address</th>
              <th className="text-left py-2 pr-4">Location</th>
              <th className="text-left py-2 pr-4">Abuse Score</th>
              <th className="text-left py-2 pr-4">VT Malicious</th>
              <th className="text-left py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {hops.map((hop, i) => {
              const abuse = hop.abuseipdb?.abuseScore ?? null
              const abuseColor = abuse > 50 ? '#ef4444' : abuse > 20 ? '#f59e0b' : '#00d4aa'
              return (
                <tr key={i} style={i === hops.indexOf(suspicious) ? { background: 'rgba(239,68,68,0.04)' } : {}}>
                  <td className="py-2 pr-4 font-bold" style={{ color: 'var(--accent-teal)' }}>#{hop.hopNumber}</td>
                  <td className="py-2 pr-4" style={{ color: 'var(--text-primary)' }}>{hop.ip}</td>
                  <td className="py-2 pr-4" style={{ color: 'var(--text-secondary)' }}>
                    {hop.geo ? `${countryFlag(hop.geo.countryCode)} ${hop.geo.city}, ${hop.geo.country}` : '—'}
                  </td>
                  <td className="py-2 pr-4">
                    {abuse !== null
                      ? <span style={{ color: abuseColor }}>{abuse}%</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td className="py-2 pr-4">
                    {hop.virustotal
                      ? <span style={{ color: hop.virustotal.malicious > 0 ? '#ef4444' : '#00d4aa' }}>
                          {hop.virustotal.malicious} / {hop.virustotal.malicious + hop.virustotal.harmless}
                        </span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td className="py-2" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                    {hop.timestamp ? hop.timestamp.substring(0, 25) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
