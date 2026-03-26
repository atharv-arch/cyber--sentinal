const API_LABELS = { 
  geo: 'GEOLOCATION_ORACLE', 
  virustotal: 'VIRUSTOTAL_HASH_DB', 
  abuseipdb: 'ABUSEIPDB_REPUTATION', 
  shodan: 'SHODAN_PORT_ENUMERATOR', 
  ssl: 'SSL_CERT_AUTHORITY', 
  dns: 'DNS_RESOLVER', 
  whois: 'WHOIS_REGISTRANT', 
  ai: 'NEURAL_LINK_SYNTHESIS' 
}

const API_STATES = {
  geo: 'MAPPING_LAT_LONG_COORDINATES...',
  virustotal: 'QUERYING_HASH_DATABASE...',
  abuseipdb: 'REPUTATION_SCORE_CALCULATION...',
  shodan: 'OPEN_PORT_ENUMERATION_v2...',
  ssl: 'VERIFYING_SSL_CHAIN...',
  dns: 'RESOLVING_A_RECORDS...',
  whois: 'FETCHING_REGISTRANT_DETAILS...',
  ai: 'INITIALIZING_NEURAL_NET...'
}

export default function LoadingState({ apiStatuses = {} }) {
  const keys = Object.keys(apiStatuses)
  const doneCount = keys.filter(k => apiStatuses[k] === 'done').length
  const progress = `${Math.round((doneCount / (keys.length || 1)) * 100)}%`

  return (
    <div className="h-full relative flex flex-col items-center justify-center -m-6 p-6">
      {/* PROGRESS BAR (TOP) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-surface-container-high z-10">
        <div className="h-full bg-primary shadow-[0_0_10px_#46f1c5] transition-all duration-1000 ease-out progress-stripe"
             style={{ width: progress }}></div>
      </div>
      
      {/* BACKGROUND TEXT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1 className="text-[12vw] font-headline font-bold uppercase tracking-[0.2em] text-on-surface opacity-[0.02] whitespace-nowrap">
          ANALYZING...
        </h1>
      </div>
      
      <div className="w-full max-w-2xl space-y-4 relative z-10 mt-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="font-headline text-2xl font-bold tracking-widest text-primary uppercase">System Analysis</div>
            <div className="font-mono text-xs text-slate-500 uppercase tracking-widest">Target: ACTIVE / session_id: f8a2-99m1</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl text-primary drop-shadow-[0_0_10px_rgba(70,241,197,0.4)]">{progress}</div>
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-tighter">Global Progress</div>
          </div>
        </div>

        {/* API STATUS ROWS */}
        <div className="space-y-[1px] bg-outline-variant/10 border border-outline-variant/20 shadow-xl">
          {Object.entries(apiStatuses).map(([key, status]) => {
            const isLoading = status === 'loading'
            const isDone = status === 'done'
            const isErr = status === 'error'
            const colorClass = isDone ? 'text-primary' : isErr ? 'text-error' : isLoading ? 'text-secondary' : 'text-slate-500'
            const dotClass = isDone ? 'bg-primary' : isErr ? 'bg-error' : isLoading ? 'bg-secondary animate-pulse-amber' : 'bg-slate-700'
            const stateMsg = isDone ? 'O_X_CLEAR' : isErr ? 'FAIL_STATE' : isLoading ? API_STATES[key] : 'STANDBY'

            return (
              <div key={key} className="bg-surface-container-low p-4 flex items-center justify-between group hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${dotClass}`}></div>
                  <span className={`font-mono text-xs ${colorClass} w-40 truncate`}>{API_LABELS[key] || key.toUpperCase()}</span>
                  <span className="font-mono text-xs text-slate-400 hidden sm:inline-block">{stateMsg}</span>
                </div>
                <div className="font-mono text-[10px] text-slate-600 uppercase">
                  0x{Math.floor(Math.random() * 9000 + 1000).toString(16).toUpperCase()}_STATUS
                </div>
              </div>
            )
          })}
        </div>
        
        {/* TACTICAL LOGS BOTTOM */}
        <div className="mt-8 grid grid-cols-3 gap-6 fade-in delay-2">
          <div className="p-4 border border-outline-variant/10 bg-surface-container-lowest">
            <div className="font-mono text-[10px] text-slate-500 mb-2 uppercase">Network Jitter</div>
            <div className="font-mono text-lg text-primary tracking-tighter">0.02ms</div>
          </div>
          <div className="p-4 border border-outline-variant/10 bg-surface-container-lowest">
            <div className="font-mono text-[10px] text-slate-500 mb-2 uppercase">Packet Loss</div>
            <div className="font-mono text-lg text-primary tracking-tighter">0.00%</div>
          </div>
          <div className="p-4 border border-outline-variant/10 bg-surface-container-lowest">
            <div className="font-mono text-[10px] text-slate-500 mb-2 uppercase">Thread Count</div>
            <div className="font-mono text-lg text-primary tracking-tighter">1,024</div>
          </div>
        </div>

      </div>
    </div>
  )
}
