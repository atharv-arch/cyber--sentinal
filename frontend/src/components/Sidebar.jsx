const RISK_COLORS = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#00d4aa', CLEAN: '#22c55e' }
const TYPE_ICONS = { ip: '🌐', ipv6: '🌐', domain: '🔗', url: '🔗', md5: '🔑', sha1: '🔑', sha256: '🔑', email_header: '✉' }

export default function Sidebar({ history, onSelect, onClear }) {
  return (
    <aside className="no-print w-60 shrink-0 border-r border-border-dim overflow-y-auto flex flex-col"
      style={{ background: 'var(--bg-secondary)' }}>
      <div className="flex items-center justify-between px-3 py-3 border-b border-border-dim">
        <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          HISTORY
        </span>
        {history.length > 0 && (
          <button onClick={onClear} className="font-mono text-[10px] px-2 py-0.5 rounded"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border-dim)' }}
            title="Clear history">
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="font-mono text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
            No analyses yet.<br />Search an IP, domain,<br />hash, or URL above.
          </p>
        </div>
      ) : (
        <ul className="flex-1 py-2">
          {history.map((entry, i) => {
            const riskColor = entry.riskLevel ? RISK_COLORS[entry.riskLevel] : '#475569'
            return (
              <li key={i}>
                <button onClick={() => onSelect(entry)}
                  className="w-full text-left px-3 py-2.5 transition-colors"
                  style={{ borderBottom: '1px solid var(--border-dim)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded uppercase"
                      style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-dim)' }}>
                      {TYPE_ICONS[entry.type] || '?'} {entry.type?.replace('_',' ')}
                    </span>
                    {entry.riskScore != null && (
                      <span className="font-mono text-[10px] font-bold" style={{ color: riskColor }}>
                        {entry.riskScore}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] truncate" style={{ color: 'var(--text-primary)' }} title={entry.input}>
                    {entry.input}
                  </p>
                  <p className="font-mono text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}
