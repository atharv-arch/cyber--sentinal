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
      <div className="font-mono text-sm uppercase tracking-widest text-[#46f1c5] animate-pulse">
        [INITIALIZING DECLASSIFICATION RECORD...]
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <span className="material-symbols-outlined text-6xl text-error drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">gpp_bad</span>
      <p className="font-headline font-bold text-xl text-error tracking-widest uppercase">{error}</p>
      <a href="/" className="mt-4 font-mono text-xs text-primary border border-primary/30 px-6 py-2 hover:bg-primary/10 transition-colors uppercase tracking-widest">
        INITIALIZE NEW SCAN
      </a>
    </div>
  )

  const { intelBundle: b, aiReport: r, createdAt, expiresAt } = report
  const daysLeft = Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fadeIn max-w-[1600px] mx-auto">
      {/* Read-only banner */}
      <div className="flex items-center justify-between px-6 py-3 bg-primary/5 border border-primary/20 font-mono text-xs uppercase tracking-widest text-slate-400 no-print shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">lock_open</span>
          <span>DECLASSIFIED REPORT / CREATED {new Date(createdAt).toLocaleString()} / EXPIRES IN {daysLeft} DAYS</span>
        </div>
        <a href="/" className="text-primary hover:text-white transition-colors flex items-center gap-1 border-b border-primary/30 hover:border-white">
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          NEW ANALYSIS
        </a>
      </div>

      {r && <VerdictBanner verdict={r.verdict} riskLevel={r.riskLevel} threatCategories={r.threatCategories} input={b.input} type={b.type} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: INTEL & REPUTATION */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 flex flex-col items-center justify-center gap-4 p-6 relative">
            {r?.riskLevel === 'CRITICAL' && <div className="absolute inset-0 border border-error animate-pulse pointer-events-none"></div>}
            <RiskGauge score={r?.riskScore ?? 0} level={r?.riskLevel ?? 'UNKNOWN'} confidence={r?.confidence} />
            {r?.scoreBreakdown && (
              <div className="w-full pt-4 border-t border-outline-variant/20">
                <ScoreBreakdown breakdown={r.scoreBreakdown} />
              </div>
            )}
          </div>
          <WhoisCard data={b.whois} dns={b.dns} />
        </div>

        {/* COLUMN 2: ATTACK SURFACE & MAP */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 p-1 min-h-[300px] relative">
            <AttackMap geo={b.geo} />
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 p-4">
            <ShodanCard data={b.shodan} />
          </div>
        </div>

        {/* COLUMN 3: MITRE ATT&CK & TIMELINE */}
        <div className="space-y-6 lg:col-span-1 md:col-span-2">
          {r?.mitreAttack?.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/20">
              <MitreAttack mitreAttack={r.mitreAttack} />
            </div>
          )}
          {r?.timeline?.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/20">
              <BreachTimeline timeline={r.timeline} />
            </div>
          )}
        </div>
        
        {/* FULL WIDTH ROW */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <VirusTotalCard data={b.virustotal} />
              <AbuseIPDBCard data={b.abuseipdb} />
              <SSLCard data={b.ssl} />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {r?.recommendations?.length > 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant/20">
                <Recommendations recommendations={r.recommendations} />
              </div>
            )}

            {r?.analystNotes && (
              <div className="bg-surface-container-lowest border border-outline-variant/20">
                <AnalystNotes notes={r.analystNotes} iocRelationships={r.iocRelationships} />
              </div>
            )}
           </div>
        </div>
      </div>
    </div>
  )
}
