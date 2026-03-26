import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import RiskGauge from './RiskGauge'
import VerdictBanner from './VerdictBanner'
import AttackMap from './AttackMap'
import MitreAttack from './MitreAttack'
import BreachTimeline from './BreachTimeline'
import { VirusTotalCard, AbuseIPDBCard, ShodanCard, WhoisCard, SSLCard } from './IntelCards'
import Recommendations from './Recommendations'
import AnalystNotes from './AnalystNotes'
import ScoreBreakdown from './ScoreBreakdown'

export default function SharedReport() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/report/${id}`)
      .then(({ data }) => setReport(data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load report'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="font-mono text-sm animate-pulse" style={{ color: 'var(--accent-teal)' }}>
        Loading shared report…
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <span className="text-4xl">⚠️</span>
      <p className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>{error}</p>
      <a href="/" className="btn-primary px-4 py-2 text-sm" style={{ textDecoration: 'none' }}>← New Analysis</a>
    </div>
  )

  const { intelBundle: b, aiReport: r, createdAt, expiresAt } = report
  const daysLeft = Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Read-only banner */}
      <div className="flex items-center justify-between px-4 py-2 rounded-lg font-mono text-xs no-print"
        style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)', color: 'var(--text-secondary)' }}>
        <span>📎 Shared report — read only · Created {new Date(createdAt).toLocaleString()} · Expires in {daysLeft} days</span>
        <a href="/" style={{ color: 'var(--accent-teal)', textDecoration: 'none' }}>← New Analysis</a>
      </div>

      {r && <VerdictBanner verdict={r.verdict} riskLevel={r.riskLevel} threatCategories={r.threatCategories} input={b.input} type={b.type} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`card flex flex-col items-center justify-center gap-4 ${r?.riskLevel === 'CRITICAL' ? 'critical' : ''}`}>
          <RiskGauge score={r?.riskScore ?? 0} level={r?.riskLevel ?? 'UNKNOWN'} confidence={r?.confidence} />
          {r?.scoreBreakdown && <div className="w-full pt-3" style={{ borderTop: '1px solid var(--border-dim)' }}>
            <ScoreBreakdown breakdown={r.scoreBreakdown} />
          </div>}
        </div>
        <div className="lg:col-span-2">
          <AttackMap geo={b.geo} />
        </div>
      </div>

      {(r?.mitreAttack?.length > 0 || r?.timeline?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {r?.mitreAttack?.length > 0 && <div className="card"><MitreAttack mitreAttack={r.mitreAttack} /></div>}
          {r?.timeline?.length > 0 && <div className="card"><BreachTimeline timeline={r.timeline} /></div>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <VirusTotalCard data={b.virustotal} />
        <AbuseIPDBCard data={b.abuseipdb} />
        <ShodanCard data={b.shodan} />
        <WhoisCard data={b.whois} dns={b.dns} />
        <SSLCard data={b.ssl} />
      </div>

      {r?.recommendations?.length > 0 && <div className="card"><Recommendations recommendations={r.recommendations} /></div>}
      {r?.analystNotes && <div className="card"><AnalystNotes notes={r.analystNotes} iocRelationships={r.iocRelationships} /></div>}
    </div>
  )
}
