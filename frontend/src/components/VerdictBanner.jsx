const LEVEL_CONFIG = {
  CRITICAL: { 
    bgClass: 'bg-error-container/10', borderClass: 'border-error/30', hoverBg: 'group-hover:bg-error/10',
    tagBg: 'bg-error/20', tagText: 'text-error', tagBorder: 'border-error/50',
    gradientFrom: 'from-error/10',
    icon: 'warning', label: 'CRITICAL THREAT' 
  },
  HIGH: { 
    bgClass: 'bg-secondary-container/10', borderClass: 'border-secondary/30', hoverBg: 'group-hover:bg-secondary/10',
    tagBg: 'bg-secondary/20', tagText: 'text-secondary', tagBorder: 'border-secondary/50',
    gradientFrom: 'from-secondary/10',
    icon: 'warning', label: 'HIGH RISK' 
  },
  MEDIUM: { 
    bgClass: 'bg-[#fbbf24]/10', borderClass: 'border-[#fbbf24]/30', hoverBg: 'group-hover:bg-[#fbbf24]/10',
    tagBg: 'bg-[#fbbf24]/20', tagText: 'text-[#fbbf24]', tagBorder: 'border-[#fbbf24]/50',
    gradientFrom: 'from-[#fbbf24]/10',
    icon: 'error', label: 'MEDIUM RISK' 
  },
  LOW: { 
    bgClass: 'bg-primary/10', borderClass: 'border-primary/30', hoverBg: 'group-hover:bg-primary/10',
    tagBg: 'bg-primary/20', tagText: 'text-primary', tagBorder: 'border-primary/50',
    gradientFrom: 'from-primary/10',
    icon: 'check_circle', label: 'LOW RISK' 
  },
  CLEAN: { 
    bgClass: 'bg-primary/10', borderClass: 'border-primary/30', hoverBg: 'group-hover:bg-primary/10',
    tagBg: 'bg-primary/20', tagText: 'text-primary', tagBorder: 'border-primary/50',
    gradientFrom: 'from-primary/10',
    icon: 'check_circle', label: 'CLEAN' 
  },
}

export default function VerdictBanner({ verdict, riskLevel, threatCategories = [], input, type }) {
  const cfg = LEVEL_CONFIG[riskLevel] || LEVEL_CONFIG.MEDIUM

  return (
    <div className={`mb-2 p-6 ${cfg.bgClass} border ${cfg.borderClass} relative overflow-hidden group`}>
      <div className={`absolute inset-0 ${cfg.hoverBg} transition-colors pointer-events-none opacity-50`}></div>
      <div className="absolute inset-0 scanline-overlay opacity-30"></div>
      <div className={`absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l ${cfg.gradientFrom} to-transparent pointer-events-none`}></div>

      <div className="flex items-start justify-between relative z-10 w-full">
        <div className="flex-1 w-full">
          {/* Tags / ID */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`${cfg.tagBg} ${cfg.tagText} px-3 py-1 font-mono text-[10px] font-bold tracking-widest uppercase border ${cfg.tagBorder} flex items-center gap-1`}>
              <span className="material-symbols-outlined text-[10px]">{cfg.icon}</span>
              {cfg.label}
            </span>
            {input && (
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900/50 px-2 py-1 border border-outline-variant/30 flex items-center gap-2">
                IOC: {input.length > 50 ? input.slice(0, 50) + '…' : input}
              </span>
            )}
            {threatCategories.slice(0, 3).map((cat, i) => (
              <span key={i} className="font-mono text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 border border-secondary/20">
                {cat}
              </span>
            ))}
          </div>

          {/* Headline / Verdict */}
          <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-2 tracking-wide leading-tight max-w-[90%]">
            {verdict}
          </h2>
        </div>
      </div>
      
      {/* Aesthetic bottom border glow */}
      <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r ${cfg.gradientFrom} via-transparent to-transparent`}></div>
    </div>
  )
}
