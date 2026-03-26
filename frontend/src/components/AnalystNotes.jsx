export default function AnalystNotes({ notes, iocRelationships = [] }) {
  if (!notes) return null
  const paragraphs = notes.split(/\n+/).filter(Boolean)
  return (
    <div className="fade-in delay-7">
      <h3 className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
        ANALYST NOTES
      </h3>
      <div className="card" style={{ borderColor: 'rgba(0,212,170,0.1)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm" style={{ color: 'var(--accent-teal)' }}>🤖</span>
          <span className="font-mono text-[10px] font-bold tracking-widest" style={{ color: 'var(--accent-teal)' }}>
            CLAUDE AI SYNTHESIS
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-display text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {p}
            </p>
          ))}
        </div>
        {iocRelationships.length > 0 && (
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-dim)' }}>
            <p className="font-mono text-[10px] font-bold tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              IOC RELATIONSHIPS
            </p>
            <ul className="flex flex-col gap-1">
              {iocRelationships.map((rel, i) => (
                <li key={i} className="flex gap-2 text-xs font-display" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--accent-teal)', flexShrink: 0 }}>→</span>
                  {rel}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
