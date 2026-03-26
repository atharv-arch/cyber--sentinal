const PRIORITY_CONFIG = {
  immediate: { label: '🔴 IMMEDIATE', colorClass: 'text-error', borderClass: 'border-error/50', bgClass: 'bg-error/10' },
  'short-term': { label: '🟡 SHORT-TERM', colorClass: 'text-secondary', borderClass: 'border-secondary/50', bgClass: 'bg-secondary/10' },
  'long-term': { label: '🟢 LONG-TERM', colorClass: 'text-primary', borderClass: 'border-primary/50', bgClass: 'bg-primary/10' }
}

export default function Recommendations({ recommendations = [] }) {
  if (!recommendations.length) return null
  const groups = { immediate: [], 'short-term': [], 'long-term': [] }
  recommendations.forEach(r => { if (groups[r.priority]) groups[r.priority].push(r) })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-lg font-bold tracking-widest text-[#fbbf24] uppercase drop-shadow-[0_0_8px_rgba(251,191,36,0.2)] flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">security</span>
          TACTICAL MITIGATION
        </h3>
        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">{recommendations.length} Actions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(groups).map(([priority, items]) => {
          const cfg = PRIORITY_CONFIG[priority]
          return (
            <div key={priority} className={`p-4 border ${cfg.borderClass} ${cfg.bgClass} relative group`}>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className={`font-mono text-[10px] font-bold tracking-widest ${cfg.colorClass}`}>
                  {cfg.label}
                </span>
                <span className="font-mono text-[9px] text-slate-500">[{items.length}]</span>
              </div>
              
              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="font-mono text-[10px] text-slate-500 opacity-50 uppercase tracking-widest leading-10 align-middle">NO_ACTIONS_REQUIRED</p>
                ) : items.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <span className={`shrink-0 ${cfg.colorClass} mt-0.5 text-[10px] font-mono`}>&gt;</span>
                    <p className="font-mono text-[11px] text-slate-300 leading-relaxed uppercase tracking-widest">{item.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
