const BREAKDOWN_KEYS = ['reputation', 'infrastructure', 'geolocation', 'certificates', 'networkExposure']
const BREAKDOWN_LABELS = {
  reputation: 'Reputation',
  infrastructure: 'Infrastructure',
  geolocation: 'Geolocation Risk',
  certificates: 'Certificates',
  networkExposure: 'Network Exposure'
}

function scoreColorClass(v) {
  if (v >= 81) return 'bg-error shadow-[0_0_8px_#ef4444]'
  if (v >= 61) return 'bg-secondary shadow-[0_0_8px_#f97316]'
  if (v >= 31) return 'bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]'
  return 'bg-primary shadow-[0_0_8px_#46f1c5]'
}

function scoreTextColor(v) {
  if (v >= 81) return 'text-error'
  if (v >= 61) return 'text-secondary'
  if (v >= 31) return 'text-[#fbbf24]'
  return 'text-primary'
}

export default function ScoreBreakdown({ breakdown = {} }) {
  return (
    <div className="flex flex-col gap-4 w-full px-2">
      {BREAKDOWN_KEYS.map(key => {
        const val = breakdown[key] ?? 0
        const barClass = scoreColorClass(val)
        const textClass = scoreTextColor(val)

        return (
          <div key={key} className="group">
            <div className="flex justify-between items-end mb-1">
              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                {BREAKDOWN_LABELS[key]}
              </span>
              <span className={`font-mono text-[10px] font-bold ${textClass}`}>
                {val}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-none overflow-hidden border border-outline-variant/20">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${barClass}`} 
                style={{ width: `${val}%` }} 
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
