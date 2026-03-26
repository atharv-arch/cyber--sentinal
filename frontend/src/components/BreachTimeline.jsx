import {
  ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const DOT_COLORS = { high: '#ef4444', medium: '#f97316', low: '#46f1c5' }

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="bg-slate-950/90 border border-outline-variant/30 px-3 py-2 font-mono text-[10px] uppercase backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <p className="text-slate-500 mb-1">{d?.date}</p>
      <p className="text-slate-300 font-bold max-w-[200px] break-words whitespace-normal leading-tight">{d?.event}</p>
      <p className="mt-2 text-[9px] tracking-widest" style={{ color: DOT_COLORS[d?.severity] }}>
        SEVERITY: {d?.severity}
      </p>
    </div>
  )
}

export default function BreachTimeline({ timeline = [] }) {
  if (!timeline.length) return null

  const data = timeline.map((t, i) => ({
    ...t,
    index: i,
    value: t.severity === 'high' ? 90 : t.severity === 'medium' ? 55 : 25
  }))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-lg font-bold tracking-widest text-primary uppercase drop-shadow-[0_0_8px_rgba(70,241,197,0.3)] flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">timeline</span>
          BREACH TIMELINE
        </h3>
        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">{timeline.length} Events</span>
      </div>

      <ResponsiveContainer width="100%" height={260} className="mt-4">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'var(--font-mono)' }} 
            tickLine={false} 
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickFormatter={v => v?.substring(0, 10)} 
            dy={10}
          />
          <YAxis 
            tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'var(--font-mono)' }} 
            tickLine={false} 
            axisLine={false} 
            domain={[0, 100]}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(70,241,197,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Line 
            type="stepAfter" 
            dataKey="value" 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth={1}
            dot={false} 
          />
          <Scatter dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={DOT_COLORS[entry.severity]} className="drop-shadow-[0_0_5px_currentColor]" />
            ))}
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
