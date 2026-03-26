export default function MitreAttack({ mitreAttack = [] }) {
  if (!mitreAttack.length) return null

  const tactics = [...new Set(mitreAttack.map(m => m.tactic))]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-lg font-bold tracking-widest text-[#fbbf24] uppercase drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">account_tree</span>
          MITRE ATT&CK MAPPING
        </h3>
        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">{mitreAttack.length} Techniques</span>
      </div>
      
      <div className="flex flex-col gap-6">
        {tactics.map(tactic => {
          const techniques = mitreAttack.filter(m => m.tactic === tactic)
          return (
            <div key={tactic} className="bg-surface-container-low border border-outline-variant/20 p-4 relative group">
              <div className="absolute inset-0 bg-[#fbbf24]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: '#fbbf24' }}>
                {tactic.toUpperCase().replace('-', ' ')}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {techniques.map((t, i) => (
                  <a key={i}
                    href={`https://attack.mitre.org/techniques/${t.techniqueId}/`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex flex-col gap-1 p-2 bg-[#fbbf24]/10 border border-[#fbbf24]/30 hover:bg-[#fbbf24]/20 hover:border-[#fbbf24]/60 hover:-translate-y-0.5 transition-all outline-none"
                    title={`${t.techniqueId} — ${t.technique}`}>
                    <span className="font-mono text-[10px] font-bold text-[#fbbf24] drop-shadow-[0_0_5px_currentColor]">{t.techniqueId}</span>
                    <span className="font-mono text-[9px] text-slate-300 leading-tight uppercase tracking-widest truncate">{t.technique}</span>
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
