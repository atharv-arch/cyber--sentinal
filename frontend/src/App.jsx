import { Routes, Route } from 'react-router-dom'
import { useState, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import SharedReport from './components/SharedReport'

export default function App() {
  const [intelBundle, setIntelBundle] = useState(null)
  const [aiReport, setAiReport] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [apiStatuses, setApiStatuses] = useState({})
  const [inputMode, setInputMode] = useState('single') // 'single' | 'email'
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cs_history') || '[]') } catch { return [] }
  })

  const addToHistory = useCallback((entry) => {
    setHistory(prev => {
      const updated = [entry, ...prev.filter(h => h.input !== entry.input)].slice(0, 20)
      localStorage.setItem('cs_history', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem('cs_history')
    setHistory([])
  }, [])

  const handleNewReport = useCallback((bundle, report) => {
    setIntelBundle(bundle)
    setAiReport(report)
    addToHistory({
      input: bundle.input,
      type: bundle.type,
      riskScore: report?.riskScore,
      riskLevel: report?.riskLevel,
      timestamp: new Date().toISOString()
    })
  }, [addToHistory])

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Header
        onAnalyze={handleNewReport}
        isAnalyzing={isAnalyzing}
        setIsAnalyzing={setIsAnalyzing}
        apiStatuses={apiStatuses}
        setApiStatuses={setApiStatuses}
        inputMode={inputMode}
        setInputMode={setInputMode}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          history={history}
          onSelect={(entry) => {
            // Load from cache via report id or just set input
            setIntelBundle(null)
            setAiReport(null)
          }}
          onClear={clearHistory}
        />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/report/:id" element={<SharedReport />} />
            <Route path="*" element={
              <Dashboard
                intelBundle={intelBundle}
                aiReport={aiReport}
                isAnalyzing={isAnalyzing}
                apiStatuses={apiStatuses}
                inputMode={inputMode}
              />
            } />
          </Routes>
        </main>
      </div>
    </div>
  )
}
