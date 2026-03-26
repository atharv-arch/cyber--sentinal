const countryFlag = (code) => {
  if (!code || code.length !== 2) return '🌐'
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
}

export default function EmailHopChain({ hops = [] }) {
  if (!hops.length) return null
  const suspicious = hops.reduce((worst, h) =>
    (h.abuseipdb?.abuseScore ?? 0) > (worst?.abuseipdb?.abuseScore ?? 0) ? h : worst, hops[0])

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-lg font-bold tracking-widest text-[#fbbf24] uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">route</span>
          EMAIL HOP CHAIN
        </h3>
        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">[{hops.length}] Relays Detected</span>
      </div>

      {suspicious && suspicious.abuseipdb?.abuseScore > 0 && (
        <div className="mb-4 px-4 py-3 border-l-4 border-error bg-error/10 font-mono text-xs text-error flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            <span>Most suspicious hop: <strong>{suspicious.ip}</strong></span>
          </div>
          <span className="font-bold bg-error text-white px-2 py-0.5 ml-2">ABUSE: {suspicious.abuseipdb.abuseScore}%</span>
        </div>
      )}

      <div className="overflow-x-auto w-full custom-scrollbar pb-2">
        <table className="w-full text-left font-mono">
          <thead>
            <tr className="border-b border-outline-variant/30 text-[10px] text-slate-500 uppercase tracking-widest">
              <th className="py-3 pr-4 font-normal">Hop</th>
              <th className="py-3 pr-4 font-normal">IP Address</th>
              <th className="py-3 pr-4 font-normal">Location</th>
              <th className="py-3 pr-4 font-normal">Abuse Score</th>
              <th className="py-3 pr-4 font-normal">VT Malicious</th>
              <th className="py-3 font-normal">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-xs text-slate-300">
            {hops.map((hop, i) => {
              const abuse = hop.abuseipdb?.abuseScore ?? null
              const isSus = i === hops.indexOf(suspicious) && abuse > 0
              const abuseColor = abuse > 50 ? 'text-error font-bold' : abuse > 20 ? 'text-[#fbbf24] font-bold' : 'text-primary'
              const vtMal = hop.virustotal?.malicious ?? 0
              
              return (
                <tr key={i} className={`group hover:bg-white/[0.02] transition-colors ${isSus ? 'bg-error/5' : ''}`}>
                  <td className="py-3 pr-4 font-bold text-primary">#{hop.hopNumber}</td>
                  <td className="py-3 pr-4 group-hover:text-white transition-colors">{hop.ip}</td>
                  <td className="py-3 pr-4 text-slate-400">
                    {hop.geo ? <span className="flex items-center gap-1.5"><span className="text-[14px]">{countryFlag(hop.geo.countryCode)}</span> {hop.geo.city}, {hop.geo.country}</span> : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    {abuse !== null
                      ? <span className={abuseColor}>{abuse}%</span>
                      : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="py-3 pr-4">
                    {hop.virustotal
                      ? <span className={vtMal > 0 ? 'text-error font-bold drop-shadow-[0_0_5px_currentColor]' : 'text-primary'}>
                          {vtMal} / {hop.virustotal.malicious + hop.virustotal.harmless}
                        </span>
                      : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="py-3 text-[10px] text-slate-500 truncate max-w-[150px]" title={hop.timestamp}>
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
