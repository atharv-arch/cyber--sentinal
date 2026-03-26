import { useState } from 'react'
import axios from 'axios'

export default function ShareButton({ intelBundle, aiReport }) {
  const [shareUrl, setShareUrl] = useState(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expiresAt, setExpiresAt] = useState(null)

  const handleShare = async () => {
    if (shareUrl) {
      await copyToClipboard()
      return
    }
    setSaving(true)
    try {
      const { data } = await axios.post('/api/report', { intelBundle, aiReport })
      const url = `${window.location.origin}/report/${data.id}`
      setShareUrl(url)
      setExpiresAt(data.expiresAt)
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Share error:', err)
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const handleSTIXExport = () => {
    const stixBundle = {
      type: "bundle",
      id: `bundle--${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
      spec_version: "2.1",
      objects: [
        {
          type: "indicator",
          name: intelBundle.input,
          pattern_type: "stix",
          pattern: `[${intelBundle.type}:value = '${intelBundle.input}']`,
          valid_from: new Date().toISOString()
        },
        {
          type: "report",
          name: "CyberSentinel Automated Analysis",
          description: aiReport?.verdict || "No verdict generated",
          published: new Date().toISOString(),
          object_refs: []
        }
      ]
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stixBundle, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `STIX2.1_${intelBundle.input.replace(/[^a-z0-9]/gi, '_')}.json`);
    dlAnchorElem.click();
  }

  const daysLeft = expiresAt
    ? Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant/30 w-full max-w-sm ml-auto relative group overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_8px_#46f1c5]">share</span>
        <div className="text-left">
          <p className="font-headline text-sm font-bold tracking-widest text-slate-300 uppercase">SHARE MISSION REPORT</p>
          {daysLeft ? (
            <p className="font-mono text-[9px] text-[#fbbf24] uppercase tracking-widest mt-0.5">Expires in {daysLeft} Days</p>
          ) : (
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Generates Immutable Link</p>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <button onClick={handleShare} disabled={saving}
          className="w-full bg-primary/10 hover:bg-primary/20 border border-primary/50 text-primary py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-all">
          {saving ? 'ENCRYPTING PAYLOAD...' : copied ? 'COPIED TO CLIPBOARD' : shareUrl ? 'COPY LINK' : 'INITIALIZE UPLINK'}
        </button>

        <button onClick={handleSTIXExport}
          className="w-full bg-slate-900 border border-outline-variant/30 text-slate-400 hover:text-white py-2 font-mono text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[14px]">download</span>
          STIX 2.1 EXPORT
        </button>
      </div>

      {shareUrl && (
        <div className="mt-3 bg-slate-900 border border-outline-variant/30 p-2 w-full flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-slate-500">link</span>
          <p className="font-mono text-[9px] text-primary truncate max-w-full m-0 select-all">
            {shareUrl}
          </p>
        </div>
      )}
    </div>
  )
}
