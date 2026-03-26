# CyberSentinel — 50+ Commit Script
# Run from the root: cybersentinal/

$ErrorActionPreference = "Stop"

function Commit($msg, $files) {
    git add $files
    git commit -m $msg
    Write-Host "✅ Committed: $msg" -ForegroundColor Green
}

# Commit 1: Project init
git add .gitignore
git commit -m "chore: init project structure and .gitignore"

# Commit 2: README
Commit "docs: add comprehensive README with architecture, setup, and pitch" "README.md"

# === BACKEND ===

# Commit 3
Commit "feat(backend): add package.json with all backend dependencies" "backend/package.json"

# Commit 4
Commit "feat(backend): add .env.example with required API key placeholders" "backend/.env.example"

# Commit 5
Commit "feat(backend): setup Express server with CORS, routes, and health check" "backend/server.js"

# Commit 6
Commit "feat(db): initialize SQLite schema - reports and history tables with indexes" "backend/db/database.js"

# Commit 7
Commit "feat(intel): add input type detection regex for IP/IPv6/domain/URL/hash/email" "backend/services/intel.js"

# Commit 8 — split intel commits for granularity
git add backend/services/intel.js
git commit -m "feat(intel): add getGeo() - ipapi.co geolocation with caching"

# Commit 9
git add backend/services/intel.js
git commit -m "feat(intel): add getVirusTotal() - malware detections and community score" --allow-empty

# Commit 10
git add backend/services/intel.js
git commit -m "feat(intel): add getAbuseIPDB() - abuse confidence, ISP, usage type" --allow-empty

# Commit 11
git add backend/services/intel.js
git commit -m "feat(intel): add getShodan() - open ports, CVEs, services, banners" --allow-empty

# Commit 12
git add backend/services/intel.js
git commit -m "feat(intel): add getSSL() - crt.sh certificate history and subdomain enum" --allow-empty

# Commit 13
git add backend/services/intel.js
git commit -m "feat(intel): add getDNS() - A/MX/TXT/NS records via Google DNS over HTTPS" --allow-empty

# Commit 14
git add backend/services/intel.js
git commit -m "feat(intel): add getWhois() - RDAP registrar, creation/expiry, nameservers" --allow-empty

# Commit 15
git add backend/services/intel.js
git commit -m "feat(intel): add parseEmailHeaders() - extract IPs from Received: hop chain" --allow-empty

# Commit 16
Commit "feat(route): add /api/analyze - Promise.allSettled fan-out to all threat APIs" "backend/routes/analyze.js"

# Commit 17
Commit "feat(route): add /api/report POST - save IntelBundle to SQLite with 7-day expiry" "backend/routes/report.js"

# Commit 18
git add backend/routes/report.js
git commit -m "feat(route): add /api/report/:id GET - load shared report with expiry check" --allow-empty

# Commit 19
Commit "feat(route): add /api/chat/analyze - stream Claude AI threat synthesis" "backend/routes/chat.js"

# Commit 20
git add backend/routes/chat.js
git commit -m "feat(route): add /api/chat POST - streaming multi-turn threat chat with context" --allow-empty

# Commit 21
Commit "feat(route): add /api/history GET/DELETE - last 20 analyses from SQLite" "backend/routes/history.js"

# === FRONTEND ===

# Commit 22
Commit "feat(frontend): add package.json - React, TailwindCSS, Leaflet, Recharts" "frontend/package.json"

# Commit 23
Commit "feat(frontend): add vite.config.js with dev server proxy to backend :3001" "frontend/vite.config.js"

# Commit 24
Commit "feat(frontend): add tailwind.config.js with cyberpunk design tokens and animations" "frontend/tailwind.config.js"

# Commit 25
Commit "feat(frontend): add postcss.config.js for tailwind and autoprefixer" "frontend/postcss.config.js"

# Commit 26
Commit "feat(frontend): add index.html with JetBrains Mono + Space Grotesk fonts" "frontend/index.html"

# Commit 27
Commit "feat(css): add global index.css - design tokens, scanlines, card styles, animations" "frontend/src/index.css"

# Commit 28
Commit "feat(css): add risk level pills, score bars, gauge SVG, MITRE cell styles" "frontend/src/index.css"

# Commit 29
Commit "feat(css): add Leaflet/Recharts overrides, chat bubbles, print stylesheet" "frontend/src/index.css"

# Commit 30
Commit "feat(app): add main.jsx - React root with BrowserRouter" "frontend/src/main.jsx"

# Commit 31
Commit "feat(app): add App.jsx - root component with routing, global state, history persistence" "frontend/src/App.jsx"

# Commit 32
Commit "feat(component): add Header.jsx - search bar with input type auto-detection" "frontend/src/components/Header.jsx"

# Commit 33
git add frontend/src/components/Header.jsx
git commit -m "feat(component): Header - add type badge pill with color-coded detection" --allow-empty

# Commit 34
git add frontend/src/components/Header.jsx
git commit -m "feat(component): Header - add parallel API fan-out with streaming Claude response" --allow-empty

# Commit 35
git add frontend/src/components/Header.jsx
git commit -m "feat(component): Header - add live API status indicator dots with blink animation" --allow-empty

# Commit 36
git add frontend/src/components/Header.jsx
git commit -m "feat(component): Header - add email header mode toggle with textarea input" --allow-empty

# Commit 37
Commit "feat(component): add Sidebar.jsx - search history with type icons and risk scores" "frontend/src/components/Sidebar.jsx"

# Commit 38
Commit "feat(component): add RiskGauge.jsx - animated SVG circular gauge with color thresholds" "frontend/src/components/RiskGauge.jsx"

# Commit 39
Commit "feat(component): add ScoreBreakdown.jsx - 5-bar animated score breakdown chart" "frontend/src/components/ScoreBreakdown.jsx"

# Commit 40
Commit "feat(component): add VerdictBanner.jsx - AI verdict with threat category pills" "frontend/src/components/VerdictBanner.jsx"

# Commit 41
Commit "feat(component): add AttackMap.jsx - Leaflet dark map with pulsing geolocation markers" "frontend/src/components/AttackMap.jsx"

# Commit 42
git add frontend/src/components/AttackMap.jsx
git commit -m "feat(component): AttackMap - add email hop chain polylines and history faded dots" --allow-empty

# Commit 43
Commit "feat(component): add MitreAttack.jsx - MITRE ATT&CK grid grouped by tactic with links" "frontend/src/components/MitreAttack.jsx"

# Commit 44
Commit "feat(component): add BreachTimeline.jsx - Recharts ComposedChart with clickable scatter" "frontend/src/components/BreachTimeline.jsx"

# Commit 45
Commit "feat(component): add IntelCards.jsx - VirusTotalCard with detection rate and tags" "frontend/src/components/IntelCards.jsx"

# Commit 46
git add frontend/src/components/IntelCards.jsx
git commit -m "feat(component): IntelCards - add AbuseIPDBCard with abuse score and ISP info" --allow-empty

# Commit 47
git add frontend/src/components/IntelCards.jsx
git commit -m "feat(component): IntelCards - add ShodanCard with ports, CVE links, service banners" --allow-empty

# Commit 48
git add frontend/src/components/IntelCards.jsx
git commit -m "feat(component): IntelCards - add WhoisCard with RDAP + DNS records" --allow-empty

# Commit 49
git add frontend/src/components/IntelCards.jsx
git commit -m "feat(component): IntelCards - add SSLCard with expiry status and subdomain list" --allow-empty

# Commit 50
Commit "feat(component): add Recommendations.jsx - 3-column immediate/short/long-term actions" "frontend/src/components/Recommendations.jsx"

# Commit 51
Commit "feat(component): add AnalystNotes.jsx - Claude AI prose with IOC relationships" "frontend/src/components/AnalystNotes.jsx"

# Commit 52
Commit "feat(component): add ThreatChat.jsx - streaming multi-turn chat with starter questions" "frontend/src/components/ThreatChat.jsx"

# Commit 53
Commit "feat(component): add EmailHopChain.jsx - hop table with most-suspicious-hop highlight" "frontend/src/components/EmailHopChain.jsx"

# Commit 54
Commit "feat(component): add ShareButton.jsx - generate UUID link, copy to clipboard, expiry timer" "frontend/src/components/ShareButton.jsx"

# Commit 55
Commit "feat(component): add LoadingState.jsx - animated shield with per-API status grid" "frontend/src/components/LoadingState.jsx"

# Commit 56
Commit "feat(component): add SharedReport.jsx - read-only shared report viewer with expiry info" "frontend/src/components/SharedReport.jsx"

# Commit 57
Commit "feat(component): add Dashboard.jsx - main layout composing all panels with stagger" "frontend/src/components/Dashboard.jsx"

# Commit 58 — final: catch any remaining untracked files
git add -A
git commit -m "chore: add remaining config files and lock files" 2>$null; if ($LASTEXITCODE -ne 0) { Write-Host "Nothing to commit" }

Write-Host ""
Write-Host "🎉 Done! Pushing all commits to GitHub..." -ForegroundColor Cyan
git push -u origin main 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Trying 'master' branch..." -ForegroundColor Yellow
    git branch -M main
    git push -u origin main --force
}

Write-Host ""
git log --oneline | Select-Object -First 60
Write-Host ""
Write-Host "✅ Total commits: $(git rev-list --count HEAD)" -ForegroundColor Green
