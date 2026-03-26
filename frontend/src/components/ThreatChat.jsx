import { useState, useRef, useEffect } from 'react'

function Message({ role, content }) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
        style={{
          background: role === 'user' ? 'rgba(0,212,170,0.15)' : 'var(--bg-card)',
          border: `1px solid ${role === 'user' ? 'rgba(0,212,170,0.3)' : 'var(--border-dim)'}`
        }}>
        {role === 'user' ? '👤' : '🤖'}
      </div>
      <div className={`flex-1 px-3 py-2 text-sm ${role === 'user' ? 'chat-user' : 'chat-assistant'}`}
        style={{ maxWidth: '85%', fontFamily: 'var(--font-display)', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
        {content}
      </div>
    </div>
  )
}

const STARTER_QUESTIONS = [
  'What firewall rule should I add to block this?',
  'Is this linked to ransomware campaigns?',
  'What countries has this IP operated from?',
  'What SIEM detection rule should I write?'
]

export default function ThreatChat({ intelBundle, aiReport }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText])

  const send = async (text) => {
    const query = text || input.trim()
    if (!query || streaming) return
    setInput('')

    const userMsg = { role: 'user', content: query }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setStreaming(true)
    setStreamText('')

    try {
      const context = { intelBundle, aiReport }
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context
        })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

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
            if (parsed.text) {
              fullText += parsed.text
              setStreamText(fullText)
            }
          } catch {}
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullText }])
      setStreamText('')
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="fade-in delay-8">
      <h3 className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
        THREAT CHAT
      </h3>
      <div className="card flex flex-col gap-3" style={{ borderColor: 'rgba(0,212,170,0.1)' }}>
        {/* Starter questions */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => send(q)}
                className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all text-left"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-dim)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-teal)'; e.currentTarget.style.color = 'var(--accent-teal)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        {(messages.length > 0 || streamText) && (
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
            {messages.map((m, i) => <Message key={i} role={m.role} content={m.content} />)}
            {streamText && <Message role="assistant" content={streamText + '▊'} />}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask anything about this threat…"
            className="flex-1 px-3 py-2 text-sm"
            disabled={streaming}
          />
          <button onClick={() => send()} disabled={streaming || !input.trim()}
            className="btn-primary px-4 py-2 text-sm shrink-0">
            {streaming ? (
              <span className="flex items-center gap-1.5">
                <span className="blink-dot" style={{ background: 'var(--bg-primary)' }} />
                AI
              </span>
            ) : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
