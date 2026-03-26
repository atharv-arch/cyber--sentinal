import { useState, useRef } from 'react'
import axios from 'axios'

const TYPE_PATTERNS = {
  ip: /^(\d{1,3}\.){3}\d{1,3}$/,
  ipv6: /^[0-9a-fA-F:]+:[0-9a-fA-F:]+$/,
  md5: /^[a-fA-F0-9]{32}$/,
  sha1: /^[a-fA-F0-9]{40}$/,
  sha256: /^[a-fA-F0-9]{64}$/,
  url: /^https?:\/\//i,
  email_header: /^Received:/im,
}

const TYPE_COLORS = {
  ip: 'text-teal border-teal bg-teal-dim',
  ipv6: 'text-teal border-teal bg-teal-dim',
  domain: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  url: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  md5: 'text-amber border-amber/30 bg-amber-dim',
  sha1: 'text-amber border-amber/30 bg-amber-dim',
  sha256: 'text-amber border-amber/30 bg-amber-dim',
  email_header: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  unknown: 'text-text-muted border-border-dim bg-bg-secondary',
}

function detectType(input) {
  const t = input.trim()
  if (!t) return null
  if (TYPE_PATTERNS.email_header.test(t)) return 'email_header'
  if (TYPE_PATTERNS.ip.test(t)) return 'ip'
  if (TYPE_PATTERNS.ipv6.test(t)) return 'ipv6'
  if (TYPE_PATTERNS.md5.test(t)) return 'md5'
  if (TYPE_PATTERNS.sha1.test(t)) return 'sha1'
  if (TYPE_PATTERNS.sha256.test(t)) return 'sha256'
  if (TYPE_PATTERNS.url.test(t)) return 'url'
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(t)) return 'domain'
  return 'unknown'
}

const API_STEPS = ['geo', 'virustotal', 'abuseipdb', 'shodan', 'ssl', 'dns', 'whois', 'ai']
const API_LABELS = { geo: 'GeoIP', virustotal: 'VirusTotal', abuseipdb: 'AbuseIPDB', shodan: 'Shodan', ssl: 'crt.sh / SSL', dns: 'DNS', whois: 'WHOIS', ai: 'Claude AI' }

export default function Header({ onAnalyze, isAnalyzing, setIsAnalyzing, apiStatuses, setApiStatuses, inputMode, setInputMode }) {
  const [input, setInput] = useState('')
  const [detectedType, setDetectedType] = useState(null)
  const [emailInput, setEmailInput] = useState('')
  const abortRef = useRef(null)

  const handleInputChange = (e) => {
    const val = e.target.value
    setInput(val)
    setDetectedType(detectType(val))
  }

  const handleAnalyze = async () => {
    const query = inputMode === 'email' ? emailInput : input
    if (!query.trim() || isAnalyzing) return

    setIsAnalyzing(true)
    setApiStatuses({})
    const statuses = {}
    API_STEPS.forEach(k => { statuses[k] = 'loading' })
    setApiStatuses({ ...statuses })

    try {
      // Step 1: Fan-out intel
      const { data: bundle } = await axios.post('/api/analyze', {
        input: query,
        type: inputMode === 'email' ? 'email_header' : detectedType
      })

      // Mark data APIs done
      ;['geo', 'virustotal', 'abuseipdb', 'shodan', 'ssl', 'dns', 'whois'].forEach(k => {
        statuses[k] = bundle[k === 'geo' ? 'geo' : k] !== null ? 'done' : 'skipped'
      })
      setApiStatuses({ ...statuses })

      // Step 2: Claude streaming synthesis
      statuses.ai = 'loading'
      setApiStatuses({ ...statuses })

      let fullText = ''
      const response = await fetch('/api/chat/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intelBundle: bundle })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.text) fullText += parsed.text
          } catch {}
        }
      }

      // Parse Claude JSON
      let aiReport = null
      try {
        const jsonMatch = fullText.match(/\{[\s\S]*\}/)
        if (jsonMatch) aiReport = JSON.parse(jsonMatch[0])
      } catch {
        console.error('Failed to parse AI report')
      }

      statuses.ai = 'done'
      setApiStatuses({ ...statuses })
      onAnalyze(bundle, aiReport)
    } catch (err) {
      console.error('Analysis error:', err)
      Object.keys(statuses).forEach(k => { if (statuses[k] === 'loading') statuses[k] = 'error' })
      setApiStatuses({ ...statuses })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const typeKey = detectedType || 'unknown'
  const typeColor = TYPE_COLORS[typeKey] || TYPE_COLORS.unknown

  return (
    <header className="scanline-header shrink-0 border-b border-border-dim" style={{ background: 'var(--bg-secondary)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.9 10.15 9 11.35C17.1 22.15 21 17.25 21 12V7L12 2z" fill="rgba(0,212,170,0.2)" stroke="#00d4aa" strokeWidth="1.5"/>
              <path d="M9 12l2 2 4-4" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none glow-teal" style={{ color: 'var(--accent-teal)' }}>CyberSentinel</h1>
            <p className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>AI Threat Intelligence Platform</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-dim)' }}>
          {['single', 'email'].map(mode => (
            <button key={mode} onClick={() => setInputMode(mode)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${inputMode === mode ? 'bg-teal-dim text-teal' : 'text-text-secondary hover:text-text-primary'}`}
              style={inputMode === mode ? { color: 'var(--accent-teal)', background: 'rgba(0,212,170,0.1)' } : { color: 'var(--text-secondary)' }}>
              {mode === 'single' ? '⚡ Single IOC' : '✉ Email Header'}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="btn-ghost px-3 py-1.5 text-xs no-print">
            ⬇ Export PDF
          </button>
          <a href="https://github.com/atharv-arch/cyber--sentinal" target="_blank" rel="noopener noreferrer"
            className="btn-ghost px-3 py-1.5 text-xs no-print">
            ⁕ GitHub
          </a>
        </div>
      </div>

      {/* Search row */}
      <div className="px-4 pb-3 flex flex-col gap-2">
        {inputMode === 'single' ? (
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                placeholder="Enter IP, domain, URL, hash, or paste email headers…"
                className="w-full px-4 py-3 pr-28 text-sm"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
              />
              {detectedType && (
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${typeColor}`}>
                  {detectedType.toUpperCase().replace('_', ' ')}
                </span>
              )}
            </div>
            <button onClick={handleAnalyze} disabled={isAnalyzing || !input.trim()}
              className="btn-primary px-6 py-3 text-sm shrink-0">
              {isAnalyzing ? '⟳ Scanning…' : '⚡ Analyze'}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <textarea
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="Paste raw email headers here (Received:, DKIM-Signature:, etc.)…"
              rows={4}
              className="flex-1 px-4 py-3 text-xs resize-none"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            <button onClick={handleAnalyze} disabled={isAnalyzing || !emailInput.trim()}
              className="btn-primary px-6 text-sm shrink-0">
              {isAnalyzing ? '⟳ Scanning…' : '⚡ Analyze'}
            </button>
          </div>
        )}

        {/* API status indicators */}
        {Object.keys(apiStatuses).length > 0 && (
          <div className="flex flex-wrap gap-3">
            {API_STEPS.map(key => {
              const status = apiStatuses[key]
              const color = status === 'done' ? '#00d4aa' : status === 'error' ? '#ef4444' : status === 'skipped' ? '#475569' : '#f59e0b'
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="blink-dot" style={{ background: color, animation: status === 'loading' ? undefined : 'none', opacity: status === 'loading' ? 1 : 0.9 }} />
                  <span className="font-mono text-[10px]" style={{ color: status === 'loading' ? color : 'var(--text-secondary)' }}>
                    {API_LABELS[key]}
                  </span>
                  {status === 'done' && <span style={{ color: '#00d4aa', fontSize: '10px' }}>✓</span>}
                  {status === 'error' && <span style={{ color: '#ef4444', fontSize: '10px' }}>✗</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}
