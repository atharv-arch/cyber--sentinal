import RiskGauge from './RiskGauge'
import ScoreBreakdown from './ScoreBreakdown'
import VerdictBanner from './VerdictBanner'
import AttackMap from './AttackMap'
import MitreAttack from './MitreAttack'
import BreachTimeline from './BreachTimeline'
import { VirusTotalCard, AbuseIPDBCard, ShodanCard, WhoisCard, SSLCard } from './IntelCards'
import Recommendations from './Recommendations'
import AnalystNotes from './AnalystNotes'
import ThreatChat from './ThreatChat'
import ShareButton from './ShareButton'
import EmailHopChain from './EmailHopChain'
import LoadingState from './LoadingState'

export default function Dashboard({ intelBundle, aiReport, isAnalyzing, apiStatuses, inputMode }) {
  if (isAnalyzing) return <LoadingState apiStatuses={apiStatuses} />

  if (!intelBundle) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 opacity-50">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7v5c0 5.25 3.9 10.15 9 11.35C17.1 22.15 21 17.25 21 12V7L12 2z"
            fill="rgba(0,212,170,0.1)" stroke="#00d4aa" strokeWidth="1"/>
          <path d="M9 12l2 2 4-4" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="text-center">
          <p className="font-display font-semibold text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>
            Ready to Analyze
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            Enter an IP, domain, URL, hash, or paste email headers above
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-lg">
          {['185.220.101.47', 'example.com', 'https://malicious.site', 'e3b0c44298fc1c149afb'].map(ex => (
            <div key={ex} className="card text-center" style={{ cursor: 'default' }}>
              <p className="font-mono text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{ex}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Email header view
  if (intelBundle.type === 'email_header' && intelBundle.hops) {
    return (
      <div className="flex flex-col gap-4 pb-8" data-timestamp={new Date().toISOString()}>
        <VerdictBanner verdict={aiReport?.verdict} riskLevel={aiReport?.riskLevel}
          threatCategories={aiReport?.threatCategories} input="Email Header" type="email_header" />
        <EmailHopChain hops={intelBundle.hops} />
        <AttackMap emailHops={intelBundle.hops} />
        {aiReport && <ThreatChat intelBundle={intelBundle} aiReport={aiReport} />}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-8" data-timestamp={new Date().toISOString()}>
      {/* Row 1: Verdict */}
      {aiReport && (
        <VerdictBanner
          verdict={aiReport.verdict}
          riskLevel={aiReport.riskLevel}
          threatCategories={aiReport.threatCategories}
          input={intelBundle.input}
          type={intelBundle.type}
        />
      )}

      {/* Row 2: Gauge + Breakdown + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`card fade-in delay-1 flex flex-col items-center justify-center gap-4 ${aiReport?.riskLevel === 'CRITICAL' ? 'critical' : ''}`}>
          <RiskGauge score={aiReport?.riskScore ?? 0} level={aiReport?.riskLevel ?? 'UNKNOWN'} confidence={aiReport?.confidence} />
          {aiReport?.scoreBreakdown && (
            <div className="w-full pt-3" style={{ borderTop: '1px solid var(--border-dim)' }}>
              <ScoreBreakdown breakdown={aiReport.scoreBreakdown} />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <AttackMap geo={intelBundle.geo} />
          {intelBundle.geo && (
            <div className="flex flex-wrap gap-3 mt-2">
              {[
                intelBundle.geo.country && `🌍 ${intelBundle.geo.city}, ${intelBundle.geo.country}`,
                intelBundle.geo.org && `🏢 ${intelBundle.geo.org}`,
                intelBundle.geo.asn && `🔌 ${intelBundle.geo.asn}`
              ].filter(Boolean).map((item, i) => (
                <span key={i} className="font-mono text-[11px] px-3 py-1 rounded-full"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-dim)' }}>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: MITRE + Timeline */}
      {(aiReport?.mitreAttack?.length > 0 || aiReport?.timeline?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiReport?.mitreAttack?.length > 0 && (
            <div className="card"><MitreAttack mitreAttack={aiReport.mitreAttack} /></div>
          )}
          {aiReport?.timeline?.length > 0 && (
            <div className="card"><BreachTimeline timeline={aiReport.timeline} /></div>
          )}
        </div>
      )}

      {/* Row 4: Intel cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 fade-in delay-3">
        <VirusTotalCard data={intelBundle.virustotal} />
        <AbuseIPDBCard data={intelBundle.abuseipdb} />
        <ShodanCard data={intelBundle.shodan} />
        <WhoisCard data={intelBundle.whois} dns={intelBundle.dns} />
        <SSLCard data={intelBundle.ssl} />
        {/* Share card */}
        <div className="card flex flex-col items-center justify-center gap-3">
          <ShareButton intelBundle={intelBundle} aiReport={aiReport} />
        </div>
      </div>

      {/* Row 5: Recommendations */}
      {aiReport?.recommendations?.length > 0 && (
        <div className="card">
          <Recommendations recommendations={aiReport.recommendations} />
        </div>
      )}

      {/* Row 6: Analyst Notes */}
      {aiReport?.analystNotes && (
        <div className="card">
          <AnalystNotes notes={aiReport.analystNotes} iocRelationships={aiReport.iocRelationships} />
        </div>
      )}

      {/* Row 7: Chat */}
      <ThreatChat intelBundle={intelBundle} aiReport={aiReport} />
    </div>
  )
}
