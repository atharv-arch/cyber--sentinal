import { useState } from 'react'

const getIcon = (type) => {
  if (type === 'ip' || type === 'ipv6') return 'lan'
  if (type === 'domain') return 'public'
  if (type === 'url') return 'link'
  if (type === 'hash') return 'fingerprint'
  if (type === 'email_header') return 'mail'
  return 'travel_explore'
}

const getRiskColors = (level) => {
  if (level === 'CRITICAL') return 'bg-error-container text-on-error-container font-bold'
  if (level === 'HIGH' || level === 'WARNING') return 'bg-secondary-container text-on-secondary-container font-bold'
  if (level === 'LOW' || level === 'SAFE') return 'bg-surface-container-highest text-primary font-bold'
  return 'bg-surface-container text-slate-500'
}

export default function Sidebar({ history = [], clearHistory, onSelectHistory }) {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-[240px] bg-slate-900/50 dark:bg-slate-950 border-r border-[#46f1c5]/10 flex flex-col py-4 z-40">
      <div className="px-6 mb-6 flex justify-between items-center">
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">RECENT SCANS</h3>
          <p className="font-mono text-[9px] text-primary/60">0x44F_INTEL_FEED</p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="material-symbols-outlined text-sm text-slate-600 hover:text-error transition-colors">
            delete
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="px-4 py-8 text-center opacity-40">
            <span className="material-symbols-outlined text-3xl mb-2">history</span>
            <p className="font-mono text-[10px]">NO_ARCHIVE_DATA</p>
          </div>
        ) : (
          history.map((item, i) => (
            <div key={item.id || i} onClick={() => onSelectHistory(item)}
              className="group flex items-center justify-between p-3 border-l-2 border-transparent text-slate-500 hover:border-[#46f1c5]/50 hover:bg-white/5 transition-all duration-75 cursor-crosshair">
              
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="material-symbols-outlined text-sm shrink-0">{getIcon(item.type)}</span>
                <div className="flex flex-col truncate">
                  <span className="font-mono text-[10px] tracking-wider truncate text-ellipsis">{item.input}</span>
                  <span className="text-[8px] opacity-60">0x{item.id?.substring(0, 4) || 'AF22'}_SEC_CLEAR</span>
                </div>
              </div>
              
              <span className={`text-[9px] font-mono px-1 shrink-0 ml-2 ${getRiskColors(item.risk_level)}`}>
                {item.risk_score}/100
              </span>
            </div>
          ))
        )}
      </nav>

      <div className="mt-auto px-6 pt-4 border-t border-[#46f1c5]/5">
        <div className="bg-surface-container-lowest p-3 border border-outline-variant/20">
          <p className="font-mono text-[10px] text-slate-400 mb-2">SYSTEM_HEALTH</p>
          <div className="w-full bg-slate-800 h-1">
            <div className="bg-primary h-full glow-primary animate-pulse" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>
    </aside>
  )
}
