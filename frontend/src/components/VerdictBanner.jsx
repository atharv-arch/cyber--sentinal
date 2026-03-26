const LEVEL_CONFIG = {
  CRITICAL: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', color: '#ef4444', icon: '🔴', label: 'CRITICAL THREAT' },
  HIGH:     { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.3)', color: '#f97316', icon: '🟠', label: 'HIGH RISK' },
  MEDIUM:   { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b', icon: '🟡', label: 'MEDIUM RISK' },
  LOW:      { bg: 'rgba(0,212,170,0.06)',  border: 'rgba(0,212,170,0.2)',  color: '#00d4aa', icon: '🟢', label: 'LOW RISK' },
  CLEAN:    { bg: 'rgba(34,197,94,0.06)',  border: 'rgba(34,197,94,0.2)',  color: '#22c55e', icon: '✅', label: 'CLEAN' },
}

export default function VerdictBanner({ verdict, riskLevel, threatCategories = [], input, type }) {
  const cfg = LEVEL_CONFIG[riskLevel] || LEVEL_CONFIG.MEDIUM
  return (
    <div className="rounded-xl p-4 fade-in delay-1"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Level label */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{cfg.icon}</span>
            <span className="font-mono text-xs font-bold tracking-widest" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
            {input && (
              <span className="font-mono text-xs px-2 py-0.5 rounded"
                style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-dim)' }}>
                {type?.toUpperCase().replace('_',' ')} · {input.length > 40 ? input.slice(0, 40) + '…' : input}
              </span>
            )}
          </div>
          {/* Verdict */}
          <p className="font-display text-base font-medium" style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {verdict}
          </p>
          {/* Threat categories */}
          {threatCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {threatCategories.map((cat, i) => (
                <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
