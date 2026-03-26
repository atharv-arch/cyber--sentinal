import { useMemo } from 'react'

const CIRCUMFERENCE = 2 * Math.PI * 54 // r=54
const riskColor = (score) => {
  if (score >= 81) return '#ef4444'
  if (score >= 61) return '#f97316'
  if (score >= 31) return '#f59e0b'
  return '#00d4aa'
}

export default function RiskGauge({ score = 0, level = 'UNKNOWN', confidence }) {
  const color = riskColor(score)
  const offset = useMemo(() => CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE, [score])

  const confColor = { high: '#22c55e', medium: '#f59e0b', low: '#ef4444' }[confidence] || '#475569'

  return (
    <div className="flex flex-col items-center gap-3">
      {/* SVG Gauge */}
      <div className="relative">
        <svg className="gauge-svg" width="140" height="140" viewBox="0 0 140 140">
          {/* Track */}
          <circle className="track" cx="70" cy="70" r="54" />
          {/* Fill */}
          <circle
            className="fill"
            cx="70" cy="70" r="54"
            stroke={color}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease' }}
          />
          {/* Glow filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Score text */}
          <text x="70" y="63" textAnchor="middle" dominantBaseline="middle"
            style={{ fill: color, fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700 }}>
            {score}
          </text>
          <text x="70" y="83" textAnchor="middle" dominantBaseline="middle"
            style={{ fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
            RISK SCORE
          </text>
        </svg>
      </div>

      {/* Level badge */}
      <div className={`px-4 py-1.5 rounded-full font-mono text-sm font-bold risk-${level}`}>
        {level}
      </div>

      {/* Confidence */}
      {confidence && (
        <div className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span>Confidence:</span>
          <span style={{ color: confColor }} className="font-bold uppercase">{confidence}</span>
        </div>
      )}
    </div>
  )
}
