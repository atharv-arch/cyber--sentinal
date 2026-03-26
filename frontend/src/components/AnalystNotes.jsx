export default function AnalystNotes({ notes, iocRelationships = [] }) {
  if (!notes) return null
  const paragraphs = notes.split(/\n+/).filter(Boolean)
  
  return (
    <div className="p-6 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-lg font-bold tracking-widest text-primary uppercase drop-shadow-[0_0_8px_rgba(70,241,197,0.3)] flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl font-light">memory</span>
          AI NEURAL SYNTHESIS
        </h3>
        <span className="font-mono text-[10px] text-primary animate-pulse border border-primary/30 px-2 py-0.5 uppercase tracking-widest">
          ACTIVE_STATE
        </span>
      </div>

      <div className="bg-surface-container-low border-l-2 border-primary p-5 relative">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none scanline-overlay"></div>
        
        <div className="flex flex-col gap-4 relative z-10">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-mono text-xs leading-relaxed text-[#46f1c5]/90 max-w-4xl tracking-widest">
              {p}
            </p>
          ))}
        </div>

        {iocRelationships.length > 0 && (
          <div className="mt-6 pt-4 border-t border-primary/20 relative z-10 w-full max-w-4xl">
            <p className="font-mono text-[10px] font-bold tracking-widest mb-3 text-slate-400 uppercase">
              IOC RELATIONSHIP GRAPH
            </p>
            <ul className="flex flex-col gap-2">
              {iocRelationships.map((rel, i) => (
                <li key={i} className="flex gap-3 text-xs font-mono text-slate-300 items-start">
                  <span className="text-primary font-bold">{'>'}</span>
                  <span>{rel}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
