const BREAKDOWN_KEYS = ['reputation', 'infrastructure', 'geolocation', 'certificates', 'networkExposure']
const BREAKDOWN_LABELS = {
  reputation: 'Reputation',
  infrastructure: 'Infrastructure',
  geolocation: 'Geolocation Risk',
  certificates: 'Certificates',
  networkExposure: 'Network Exposure'
}

function scoreColor(v) {
  if (v >= 81) return '#ef4444'
  if (v >= 61) return '#f97316'
  if (v >= 31) return '#f59e0b'
  return '#00d4aa'
}

export default function ScoreBreakdown({ breakdown = {} }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {BREAKDOWN_KEYS.map(key => {
        const val = breakdown[key] ?? 0
        const color = scoreColor(val)
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                {BREAKDOWN_LABELS[key]}
              </span>
              <span className="font-mono text-[11px] font-bold" style={{ color }}>
                {val}
              </span>
            </div>
            <div className="score-bar-track">
              <div className="score-bar-fill" style={{ width: `${val}%`, background: color }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
