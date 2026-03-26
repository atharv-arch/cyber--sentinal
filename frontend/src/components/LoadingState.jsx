const API_LABELS = { geo: 'GeoIP', virustotal: 'VirusTotal', abuseipdb: 'AbuseIPDB', shodan: 'Shodan', ssl: 'crt.sh / SSL', dns: 'DNS', whois: 'WHOIS', ai: 'Claude AI' }

export default function LoadingState({ apiStatuses = {} }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* Animated logo */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border-2 border-teal/20 animate-ping" />
        <div className="absolute w-16 h-16 rounded-full border border-teal/30 animate-pulse" />
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7v5c0 5.25 3.9 10.15 9 11.35C17.1 22.15 21 17.25 21 12V7L12 2z"
            fill="rgba(0,212,170,0.15)" stroke="#00d4aa" strokeWidth="1.5"/>
          <path d="M9 12l2 2 4-4" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Title */}
      <div className="text-center">
        <p className="font-display font-bold text-xl mb-1" style={{ color: 'var(--accent-teal)' }}>
          Scanning Threat Intelligence
        </p>
        <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          Fanning out across {Object.keys(apiStatuses).length} data sources…
        </p>
      </div>

      {/* API status grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
        {Object.entries(apiStatuses).map(([key, status]) => {
          const color = status === 'done' ? '#00d4aa' : status === 'error' ? '#ef4444' : status === 'skipped' ? '#475569' : '#f59e0b'
          return (
            <div key={key} className="card flex items-center gap-2 py-2.5">
              <span className="blink-dot" style={{
                background: color,
                animation: status === 'loading' ? undefined : 'none',
                flexShrink: 0
              }} />
              <span className="font-mono text-[11px] truncate" style={{ color: status === 'loading' ? color : 'var(--text-secondary)' }}>
                {API_LABELS[key]}
              </span>
              {status === 'done' && <span style={{ color: '#00d4aa', fontSize: '10px', marginLeft: 'auto' }}>✓</span>}
              {status === 'error' && <span style={{ color: '#ef4444', fontSize: '10px', marginLeft: 'auto' }}>✗</span>}
            </div>
          )
        })}
      </div>

      <p className="font-mono text-xs animate-pulse" style={{ color: 'var(--text-muted)' }}>
        This typically takes 5–10 seconds
      </p>
    </div>
  )
}
