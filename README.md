# 🛡️ CyberSentinel — AI Threat Intelligence Platform

> *"What took a SOC analyst 2 hours now takes 8 seconds."*

CyberSentinel is a full-stack, AI-powered threat intelligence platform built for hackathons. It takes any suspicious indicator — IP address, domain, URL, file hash, or raw email header — and produces a comprehensive, human-readable threat report in under 10 seconds by fanning out across multiple real-world threat intelligence APIs simultaneously, then using Claude AI to synthesize everything into an actionable security brief.

## 🚀 Demo Targets
- `185.220.101.47` — known Tor exit node, will score CRITICAL (90+)
- Paste any email header → see the full hop chain analyzed
- Any domain → SSL certs, subdomains, WHOIS, DNS, VirusTotal

## 🏗️ Architecture

```
cybersentinal/
├── backend/          # Node.js + Express API
│   ├── routes/       # analyze, report, chat, history
│   ├── services/     # intel.js (VirusTotal, AbuseIPDB, Shodan, crt.sh, DNS, WHOIS, GeoIP)
│   └── db/           # SQLite database (better-sqlite3)
└── frontend/         # React + Vite + TailwindCSS
    └── src/components/
        ├── Header.jsx         # Search bar, type detection, API status
        ├── Sidebar.jsx        # Search history
        ├── Dashboard.jsx      # Main layout
        ├── RiskGauge.jsx      # Animated SVG gauge
        ├── ScoreBreakdown.jsx # 5-bar breakdown chart
        ├── VerdictBanner.jsx  # AI verdict + threat categories
        ├── AttackMap.jsx      # Leaflet world map
        ├── MitreAttack.jsx    # MITRE ATT&CK grid
        ├── BreachTimeline.jsx # Recharts timeline
        ├── IntelCards.jsx     # VirusTotal, AbuseIPDB, Shodan, WHOIS, SSL
        ├── Recommendations.jsx# 3-column priority actions
        ├── AnalystNotes.jsx   # Claude AI prose analysis
        ├── ThreatChat.jsx     # Streaming chat interface
        ├── EmailHopChain.jsx  # Email header hop table
        ├── ShareButton.jsx    # Shareable link generator
        ├── SharedReport.jsx   # Shared report viewer
        └── LoadingState.jsx   # Animated loading screen
```

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
ANTHROPIC_API_KEY=sk-ant-...
VIRUSTOTAL_API_KEY=...
ABUSEIPDB_API_KEY=...
SHODAN_API_KEY=...
PORT=3001
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3001
```

## 🛠️ Setup & Run

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in your API keys
node server.js

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## 🌐 Free API Tiers
| API | Key Required | Free Tier |
|-----|-------------|-----------|
| VirusTotal | Yes | 4 req/min |
| AbuseIPDB | Yes | 1000 req/day |
| Shodan | Yes | 1 req/sec |
| crt.sh | No | Unlimited |
| ipapi.co | No | 1000 req/day |
| DNS (Google) | No | Unlimited |

## 🎨 Design System
Dark terminal-inspired cyberpunk aesthetic:
- Background: `#0a0a0f` (near-black)
- Cards: `#13131f` with `1px solid #1e1e3a` border
- Accent: `#00d4aa` (teal) for safe, `#f59e0b` (amber) for warning, `#ef4444` (red) for critical
- Fonts: JetBrains Mono (data) + Space Grotesk (UI)
- Scanline header texture, pulse animations, staggered fade-ins

## 📋 Features
- ✅ Auto-detect input type (IP/domain/URL/hash/email header)
- ✅ Parallel API fan-out with live status indicators
- ✅ Claude AI synthesis with streaming JSON
- ✅ Animated risk gauge (0–100 with color coding)
- ✅ Leaflet world map with geolocation markers
- ✅ MITRE ATT&CK mapping with clickable technique IDs
- ✅ Recharts breach timeline
- ✅ Email header parser with hop chain analysis
- ✅ Shareable report links (7-day expiry, SQLite backed)
- ✅ Search history sidebar (localStorage)
- ✅ Streaming threat chat with context
- ✅ PDF export via window.print()

## 🏆 Hackathon Pitch
> Security teams are drowning in alerts. Junior analysts spend hours manually correlating data across 6 different tools to investigate a single suspicious IP. CyberSentinel does it in 8 seconds — it fans out across all major threat intel sources simultaneously, and uses AI to synthesize everything into a single actionable report with MITRE ATT&CK mapping, a risk score breakdown, and natural language follow-up. We're not replacing analysts — we're giving them a superpower.

---
Built with ❤️  • [GitHub](https://github.com/atharv-arch/cyber--sentinal)
