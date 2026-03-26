import { useState } from 'react'
import axios from 'axios'

export default function ShareButton({ intelBundle, aiReport }) {
  const [shareUrl, setShareUrl] = useState(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expiresAt, setExpiresAt] = useState(null)

  const handleShare = async () => {
    if (shareUrl) {
      copyToClipboard()
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

  const daysLeft = expiresAt
    ? Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="text-3xl">🔗</div>
      <div className="text-center">
        <p className="font-mono text-xs font-bold" style={{ color: 'var(--text-muted)' }}>SHARE REPORT</p>
        {daysLeft && <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Expires in {daysLeft} days</p>}
      </div>
      <button onClick={handleShare} disabled={saving}
        className="btn-primary w-full py-2 text-xs">
        {saving ? '⟳ Saving…' : copied ? '✓ Copied!' : shareUrl ? '📋 Copy Link' : '⬆ Generate Link'}
      </button>
      {shareUrl && (
        <p className="font-mono text-[10px] text-center break-all px-2"
          style={{ color: 'var(--accent-teal)' }}>
          {shareUrl}
        </p>
      )}
    </div>
  )
}
