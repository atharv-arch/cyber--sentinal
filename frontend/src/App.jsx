import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import RightSidebar from './components/RightSidebar'
import Dashboard from './components/Dashboard'
import SharedReport from './components/SharedReport'
import axios from 'axios'

function getInitialHistory() {
  const saved = localStorage.getItem('cybersentinel_history')
  if (saved) {
    try { return JSON.parse(saved) } catch {}
  }
  return []
}

export default function App() {
  const [inputMode, setInputMode] = useState('ioc') // ioc | email
  const [history, setHistory] = useState(getInitialHistory())
  
  // Dashboard state
  const [intelBundle, setIntelBundle] = useState(null)
  const [aiReport, setAiReport] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [apiStatuses, setApiStatuses] = useState({})

  // Fetch history on load
  useEffect(() => {
    axios.get('/api/history')
      .then(res => setHistory(res.data))
      .catch(() => {})
  }, [])

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('cybersentinel_history', JSON.stringify(history))
  }, [history])

  const analyze = async (query, type) => {
    if (!query) return
    setIsAnalyzing(true)
    setIntelBundle(null)
    setAiReport(null)
    const newStatuses = { geo: 'loading', virustotal: 'loading', abuseipdb: 'loading', shodan: 'loading', ssl: 'loading', whois: 'loading', dns: 'loading', ai: 'pending' }
    setApiStatuses(newStatuses)

    try {
      const payload = type === 'email_header' ? { emailHeader: query } : { ioc: query }
      
      // Fanout APIs
      const res = await axios.post('/api/analyze', payload)
      const bundle = res.data
      setIntelBundle(bundle)
      
      // Mark APIs done/error based on response
      const updatedStatuses = { ...newStatuses }
      Object.keys(bundle).forEach(k => {
        if (bundle[k] === null || bundle[k]?.error) updatedStatuses[k] = 'error'
        else if (bundle[k]) updatedStatuses[k] = 'done'
      })
      updatedStatuses.ai = 'loading'
      setApiStatuses(updatedStatuses)

      // Start Claude streaming
      const chatRes = await fetch('/api/chat/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intelBundle: bundle })
      })

      const reader = chatRes.body.getReader()
      const decoder = new TextDecoder()
      let analysisText = ''

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
              analysisText += parsed.text
              // We could show partial text in UI here if we want, but for now we wait for JSON
            }
          } catch {}
        }
      }

      const jsonStr = analysisText.substring(analysisText.indexOf('{'), analysisText.lastIndexOf('}') + 1)
      const finalReport = JSON.parse(jsonStr)
      setAiReport(finalReport)
      
      setApiStatuses(prev => ({ ...prev, ai: 'done' }))

      // Update history
      const newHistoryItem = {
        id: Date.now().toString(),
        input: bundle.input,
        type: bundle.type,
        risk_score: finalReport.riskScore,
        risk_level: finalReport.riskLevel,
        created_at: new Date().toISOString()
      }
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 20))

    } catch (err) {
      console.error(err)
      alert("Analysis failed: " + (err.response?.data?.error || err.message))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearHistory = async () => {
    setHistory([])
    try { await axios.delete('/api/history') } catch {}
  }

  return (
    <BrowserRouter>
      {/* Top App Bar */}
      <Header 
        inputMode={inputMode} 
        setInputMode={setInputMode} 
        onAnalyze={analyze} 
        isAnalyzing={isAnalyzing} 
      />
      
      <div className="flex pt-16 min-h-screen grid-bg">
        {/* Left Nav */}
        <Sidebar history={history} clearHistory={clearHistory} onSelectHistory={(item) => analyze(item.input, item.type)} />
        
        {/* Main Content */}
        <main className="flex-1 ml-[240px] mr-[320px] p-6 max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar relative">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                inputMode={inputMode}
                intelBundle={intelBundle} 
                aiReport={aiReport} 
                isAnalyzing={isAnalyzing} 
                apiStatuses={apiStatuses}
                onAnalyze={analyze}
              />
            } />
            <Route path="/report/:id" element={<SharedReport />} />
          </Routes>
        </main>
        
        {/* Right Nav (Threat Chat) */}
        <RightSidebar intelBundle={intelBundle} aiReport={aiReport} />
      </div>
    </BrowserRouter>
  )
}
