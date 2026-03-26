const PRIORITY_CONFIG = {
  immediate: { label: '🔴 Immediate', color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)' },
  'short-term': { label: '🟡 Short-Term', color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)' },
  'long-term': { label: '🟢 Long-Term', color: '#00d4aa', bg: 'rgba(0,212,170,0.06)', border: 'rgba(0,212,170,0.15)' }
}

export default function Recommendations({ recommendations = [] }) {
  if (!recommendations.length) return null
  const groups = { immediate: [], 'short-term': [], 'long-term': [] }
  recommendations.forEach(r => { if (groups[r.priority]) groups[r.priority].push(r) })

  return (
    <div className="fade-in delay-6">
      <h3 className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
        RECOMMENDATIONS
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(groups).map(([priority, items]) => {
          const cfg = PRIORITY_CONFIG[priority]
          return (
            <div key={priority} className="rounded-xl p-3"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
              <p className="font-mono text-[11px] font-bold mb-2" style={{ color: cfg.color }}>{cfg.label}</p>
              {items.length === 0
                ? <p className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>No actions</p>
                : items.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2 last:mb-0">
                    <span className="shrink-0 mt-0.5" style={{ color: cfg.color, fontSize: '10px' }}>▸</span>
                    <p className="font-display text-xs" style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.action}</p>
                  </div>
                ))
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
