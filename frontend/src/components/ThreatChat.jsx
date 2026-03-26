import { useState, useRef, useEffect } from 'react'

const STARTER_QUESTIONS = [
  'Is this linked to ransomware?',
  'Suggest a firewall rule'
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
        body: JSON.stringify({ messages: newMessages, context })
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
    <div className="flex-1 flex flex-col pt-0 relative max-h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && !streamText ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center opacity-60 mt-10">
            <div className="w-16 h-16 border border-outline-variant/30 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-slate-700">chat_bubble</span>
            </div>
            <p className="font-mono text-[10px] text-slate-500 max-w-[200px] leading-relaxed">System standby. Awaiting telemetry data or tactical inquiries.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((m, i) => (
              m.role === 'user' ? (
                <div key={i} className="flex flex-col gap-1 items-end">
                  <div className="text-[9px] font-mono text-slate-500 mb-1 mr-2">ANALYST_01</div>
                  <div className="bg-surface-container-high p-3 max-w-[90%] border border-outline-variant/10">
                    <p className="font-mono text-xs text-on-surface/80 whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-col gap-1">
                  <div className="text-[9px] font-mono text-primary/60 mb-1 ml-2">CYBERSENTINEL_AI</div>
                  <div className="bg-primary/5 border-l-2 border-primary p-3">
                    <p className="font-mono text-xs text-primary/90 whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              )
            ))}
            {streamText && (
              <div className="flex flex-col gap-1">
                <div className="text-[9px] font-mono text-primary/60 mb-1 ml-2">CYBERSENTINEL_AI</div>
                <div className="bg-primary/5 border-l-2 border-primary p-3">
                  <p className="font-mono text-xs text-primary/90 whitespace-pre-wrap">{streamText}<span className="animate-pulse">_</span></p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {messages.length === 0 && (
          <div className="mt-8 space-y-3">
            {STARTER_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => send(q)}
                className="w-full text-left p-3 border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all text-slate-400 hover:text-primary group">
                <span className="font-mono text-[11px] block mb-1">PROMPT_0{i+1}</span>
                <span className="font-body text-xs leading-snug">{q}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-outline-variant/10 bg-slate-950/50 mt-auto shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={streaming}
            className="w-full bg-transparent border-b border-outline text-primary font-mono text-xs focus:border-primary transition-all py-2 pr-10 focus:ring-0 outline-none placeholder:text-slate-700"
            placeholder="TYPE_COMMAND..."
          />
          <button onClick={() => send()} disabled={streaming || !input.trim()}
            className="absolute right-0 text-primary hover:scale-110 active:scale-95 transition-transform disabled:opacity-50">
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-mono text-[9px] text-slate-600 truncate mr-2">
            CONTEXT_ID: {intelBundle ? intelBundle.input.substring(0, 15) : 'NONE'}
          </span>
          <button onClick={() => send()} disabled={streaming || !input.trim()}
            className="bg-primary/10 border border-primary/30 text-primary py-1.5 px-3 font-mono text-[10px] font-bold tracking-widest hover:bg-primary/20 transition-all uppercase whitespace-nowrap">
            {streaming ? 'PROCESSING...' : 'EXECUTE'}
          </button>
        </div>
      </div>
    </div>
  )
}
