export default function RiskGauge({ score = 0, level = 'UNKNOWN', confidence = 0 }) {
  const getLevelColor = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'text-error hover-shadow-error border-error drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
      case 'HIGH': return 'text-secondary drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] border-secondary hover-shadow-secondary'
      case 'MEDIUM': return 'text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] border-[#fbbf24]'
      case 'LOW':
      case 'SAFE': return 'text-primary drop-shadow-[0_0_8px_rgba(70,241,197,0.8)] border-primary hover-shadow-primary'
      default: return 'text-slate-500 border-slate-500'
    }
  }

  const getTextColor = (lvl) => {
    if (lvl === 'CRITICAL') return 'text-error drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'
    if (lvl === 'HIGH') return 'text-secondary drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]'
    if (lvl === 'MEDIUM') return 'text-[#fbbf24] drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
    return 'text-primary drop-shadow-[0_0_10px_rgba(70,241,197,0.5)]'
  }

  const colorClass = getLevelColor(level)
  const textClass = getTextColor(level)
  
  // Calculate SVG dash offset: Circumference = 2 * pi * 76 = ~477.5
  const circumference = 477.5
  const dashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-40 h-40 rounded-full border-4 border-slate-800 flex items-center justify-center group mb-4">
        {/* Progress Arc */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
          <circle className="text-slate-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="76" cx="80" cy="80" />
          <circle 
            className={`${colorClass} transition-all duration-1000 ease-out`} 
            strokeWidth="6" 
            strokeDasharray={circumference} 
            strokeDashoffset={dashoffset} 
            strokeLinecap="round" 
            stroke="currentColor" 
            fill="transparent" 
            r="76" cx="80" cy="80" 
          />
        </svg>

        {/* Center Readout */}
        <div className="text-center z-10 bg-slate-900 rounded-full w-32 h-32 flex flex-col items-center justify-center border border-outline-variant/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800/50 to-transparent pointer-events-none"></div>
          <span className={`text-5xl font-headline font-black ${textClass} leading-none`}>
            {score}
          </span>
          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mt-1">
            {level === 'UNKNOWN' ? 'CALCULATING' : level}
          </span>
        </div>
      </div>

      <div className="flex justify-between w-full max-w-[200px] px-2">
         <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Confidence</span>
         <span className="font-mono text-[10px] text-primary">{confidence}/100</span>
      </div>
    </div>
  )
}
