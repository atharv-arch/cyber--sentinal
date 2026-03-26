import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-950 flex justify-between items-center px-6 z-50 border-b-0 scanline-header">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold text-[#46f1c5] tracking-tighter font-headline flex items-center gap-2" style={{ textDecoration: 'none' }}>
        <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>shield</span>
            CyberSentinel
        </Link>
        <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1 bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-mono text-[10px] text-primary uppercase tracking-widest">System_Active</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-8">
            <Link to="/" className="font-headline uppercase tracking-[0.15em] text-xs font-bold text-[#46f1c5] border-b border-[#46f1c5] pb-1" style={{ textDecoration: 'none' }}>Reports</Link>
            <a href="#" className="font-headline uppercase tracking-[0.15em] text-xs font-bold text-slate-500 hover:bg-[#46f1c5]/10 transition-all duration-150 px-2" style={{ textDecoration: 'none' }}>Network</a>
        </nav>
        
        <div className="flex items-center gap-4 border-l border-outline-variant/30 pl-6">
            <button className="material-symbols-outlined text-slate-500 cursor-crosshair hover:text-primary transition-colors">sensors</button>
            <button className="material-symbols-outlined text-slate-500 cursor-crosshair hover:text-primary transition-colors">settings</button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#46f1c5]/20 to-transparent shadow-[0_0_8px_#46f1c5]"></div>
    </header>
  )
}
