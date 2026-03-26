import ThreatChat from './ThreatChat'

export default function RightSidebar({ intelBundle, aiReport }) {
  return (
    <aside className="fixed right-0 top-16 bottom-0 w-[320px] bg-slate-900/80 backdrop-blur-md border-l border-[#46f1c5]/10 flex flex-col z-40 shadow-[-10px_0_15px_rgba(70,241,197,0.05)]">
      <div className="p-6 border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-mono text-xs font-bold text-primary tracking-widest">THREAT INTEL CHAT</h3>
          <span className="material-symbols-outlined text-primary text-sm animate-pulse">auto_awesome</span>
        </div>
        <p className="font-mono text-[10px] text-slate-400 uppercase">AI_ASSISTANT_V2.1</p>
      </div>

      {/* Render the actual Chat component inside this sidebar wrapper */}
      <ThreatChat intelBundle={intelBundle} aiReport={aiReport} />
      
    </aside>
  )
}
