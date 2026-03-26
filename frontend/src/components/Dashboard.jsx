import { useState } from 'react'
import RiskGauge from './RiskGauge'
import ScoreBreakdown from './ScoreBreakdown'
import VerdictBanner from './VerdictBanner'
import AttackMap from './AttackMap'
import MitreAttack from './MitreAttack'
import BreachTimeline from './BreachTimeline'
import { VirusTotalCard, AbuseIPDBCard, ShodanCard, WhoisCard, SSLCard } from './IntelCards'
import Recommendations from './Recommendations'
import AnalystNotes from './AnalystNotes'
import ShareButton from './ShareButton'
import EmailHopChain from './EmailHopChain'
import LoadingState from './LoadingState'

export default function Dashboard({ intelBundle, aiReport, isAnalyzing, apiStatuses, onAnalyze, inputMode }) {
  const [query, setQuery] = useState('')

  if (isAnalyzing) return <LoadingState apiStatuses={apiStatuses} />

  if (!intelBundle) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-12 relative z-10 w-full mt-20">
        <div className="w-full max-w-2xl text-center mb-12">
          <h1 className="font-headline text-4xl font-extrabold uppercase tracking-widest text-on-surface mb-2">Initialize Intelligence</h1>
          <p className="font-mono text-xs text-primary/60 tracking-tight">ENCRYPTED_UPLINK_STABLE // READY_FOR_INPUT</p>
        </div>

        {/* Central Search Bar */}
        <div className="w-full max-w-3xl relative group">
          <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center bg-slate-950/80 backdrop-blur-xl border border-outline-variant focus-within:border-primary flicker-on-focus transition-all rounded-full h-16 px-6">
            <span className="material-symbols-outlined text-primary mr-4" style={{fontVariationSettings: "'FILL' 1"}}>search</span>
            <input 
              className="w-full bg-transparent border-none focus:ring-0 text-primary font-mono placeholder:text-slate-600 text-lg outline-none" 
              placeholder={inputMode === 'email' ? "Paste email headers here..." : "Enter an IP address, domain, or file hash..."} 
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onAnalyze(query, inputMode)}
            />
            <button 
              onClick={() => onAnalyze(query, inputMode)}
              className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded-full font-headline text-xs font-bold uppercase tracking-widest transition-all">
              Execute
            </button>
          </div>
        </div>

        {/* Quick-Scan Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 w-full max-w-3xl">
          <span className="font-mono text-[10px] text-slate-500 mr-2 flex items-center">QUICK_SCAN:</span>
          {['185.220.101.47', 'malware-c2.ru', '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f'].map(ex => (
            <button 
              key={ex} 
              onClick={() => onAnalyze(ex, 'ioc')}
              className="font-mono text-[10px] text-slate-400 bg-surface-container-low border border-outline-variant/30 px-3 py-1 rounded-full hover:border-[#46f1c5]/50 hover:text-[#46f1c5] transition-colors cursor-crosshair truncate max-w-[200px]">
              {ex}
            </button>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 rounded">
            <span className="material-symbols-outlined text-[#46f1c5] mb-3">hub</span>
            <h3 className="font-headline text-sm font-bold tracking-widest mb-1 text-on-surface">5-API FANOUT</h3>
            <p className="font-mono text-[10px] text-slate-500">Parallel queries to VirusTotal, AbuseIPDB, Shodan & more.</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 rounded">
            <span className="material-symbols-outlined text-[#ef4444] mb-3">memory</span>
            <h3 className="font-headline text-sm font-bold tracking-widest mb-1 text-on-surface">AI SYNTHESIS</h3>
            <p className="font-mono text-[10px] text-slate-500">Claude-driven report generation & tactical mitigation.</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 rounded">
            <span className="material-symbols-outlined text-[#fbbf24] mb-3">account_tree</span>
            <h3 className="font-headline text-sm font-bold tracking-widest mb-1 text-on-surface">MITRE MAPPING</h3>
            <p className="font-mono text-[10px] text-slate-500">Automatic TTP classification based on behavioral data.</p>
          </div>
        </div>
      </div>
    )
  }

  // Email header view
  if (intelBundle.type === 'email_header' && intelBundle.hops) {
    return (
      <div className="flex flex-col gap-6 pb-12 w-full animate-fadeIn">
        <VerdictBanner verdict={aiReport?.verdict} riskLevel={aiReport?.riskLevel}
          threatCategories={aiReport?.threatCategories} input="Email Header" type="email_header" />
        <EmailHopChain hops={intelBundle.hops} />
        <div className="bg-surface-container-lowest border border-outline-variant/20 p-1">
          <AttackMap emailHops={intelBundle.hops} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fadeIn max-w-[1600px] mx-auto">
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

      {/* MAIN LAYOUT GRID: 3 Columns matching Threat Genesis v4.0 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: INTEL & REPUTATION */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 flex flex-col items-center justify-center gap-4 p-6 relative">
            {aiReport?.riskLevel === 'CRITICAL' && <div className="absolute inset-0 border border-error animate-pulse pointer-events-none"></div>}
            <RiskGauge score={aiReport?.riskScore ?? 0} level={aiReport?.riskLevel ?? 'UNKNOWN'} confidence={aiReport?.confidence} />
            {aiReport?.scoreBreakdown && (
              <div className="w-full pt-4 border-t border-outline-variant/20">
                <ScoreBreakdown breakdown={aiReport.scoreBreakdown} />
              </div>
            )}
          </div>
          <WhoisCard data={intelBundle.whois} dns={intelBundle.dns} />
        </div>

        {/* COLUMN 2: ATTACK SURFACE & MAP */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 p-1 min-h-[300px] relative">
            <AttackMap geo={intelBundle.geo} />
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 p-4">
            <ShodanCard data={intelBundle.shodan} />
          </div>
          {intelBundle.geo && (
            <div className="flex flex-wrap gap-2">
              {[
                intelBundle.geo.country && `${intelBundle.geo.city}, ${intelBundle.geo.country}`,
                intelBundle.geo.org && `${intelBundle.geo.org}`,
                intelBundle.geo.asn && `${intelBundle.geo.asn}`
              ].filter(Boolean).map((item, i) => (
                <span key={i} className="font-mono text-[10px] px-3 py-1 border border-outline-variant/30 text-slate-400 bg-surface-container-lowest">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* COLUMN 3: MITRE ATT&CK & TIMELINE */}
        <div className="space-y-6 lg:col-span-1 md:col-span-2">
          {aiReport?.mitreAttack?.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/20">
              <MitreAttack mitreAttack={aiReport.mitreAttack} />
            </div>
          )}
          {aiReport?.timeline?.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/20">
              <BreachTimeline timeline={aiReport.timeline} />
            </div>
          )}
        </div>
        
        {/* FULL WIDTH ROW */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <VirusTotalCard data={intelBundle.virustotal} />
              <AbuseIPDBCard data={intelBundle.abuseipdb} />
              <SSLCard data={intelBundle.ssl} />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiReport?.recommendations?.length > 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant/20">
                <Recommendations recommendations={aiReport.recommendations} />
              </div>
            )}

            {aiReport?.analystNotes && (
              <div className="bg-surface-container-lowest border border-outline-variant/20">
                <AnalystNotes notes={aiReport.analystNotes} iocRelationships={aiReport.iocRelationships} />
              </div>
            )}
           </div>
        </div>

        {/* SHARE ROW */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
            <ShareButton intelBundle={intelBundle} aiReport={aiReport} />
        </div>
      </div>
    </div>
  )
}
