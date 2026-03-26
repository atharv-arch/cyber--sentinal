import {
  ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const DOT_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#00d4aa' }

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <p style={{ color: 'var(--accent-teal)', marginBottom: 2 }}>{d?.date}</p>
      <p style={{ color: 'var(--text-primary)' }}>{d?.event}</p>
      <p style={{ color: DOT_COLORS[d?.severity], marginTop: 2 }}>Severity: {d?.severity?.toUpperCase()}</p>
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
    <div className="fade-in delay-5">
      <h3 className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
        BREACH TIMELINE
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} axisLine={false}
            tickFormatter={v => v?.substring(0, 7)} />
          <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke="var(--border-bright)" strokeWidth={1}
            dot={false} strokeDasharray="4 2" />
          <Scatter dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={DOT_COLORS[entry.severity]} />
            ))}
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
