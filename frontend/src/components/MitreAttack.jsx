export default function MitreAttack({ mitreAttack = [] }) {
  if (!mitreAttack.length) return null

  const tactics = [...new Set(mitreAttack.map(m => m.tactic))]

  return (
    <div className="fade-in delay-4">
      <h3 className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
        MITRE ATT&CK MAPPING
      </h3>
      <div className="flex flex-col gap-3">
        {tactics.map(tactic => {
          const techniques = mitreAttack.filter(m => m.tactic === tactic)
          return (
            <div key={tactic}>
              <div className="font-mono text-[10px] font-bold tracking-wider mb-1.5 px-1"
                style={{ color: 'var(--accent-amber)' }}>
                {tactic.toUpperCase()}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {techniques.map((t, i) => (
                  <a key={i}
                    href={`https://attack.mitre.org/techniques/${t.techniqueId}/`}
                    target="_blank" rel="noopener noreferrer"
                    className="mitre-cell matched no-underline flex flex-col gap-0.5 hover:scale-105 transition-transform"
                    style={{ minWidth: '90px', maxWidth: '130px' }}
                    title={`${t.techniqueId} — ${t.technique}`}>
                    <span className="font-bold" style={{ fontSize: '10px', color: '#f59e0b' }}>{t.techniqueId}</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{t.technique}</span>
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
