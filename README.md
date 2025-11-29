# Veris - AI-Powered Fact Checking Platform

> **Truth Matters.** Built in 16 hours at MumbaiHacks, Veris is a social media platform where powerful entities cannot create monopolies and fake news cannot thrive.

## 🎯 Vision

According to Reuters, over 50% of surveyed adults use social media as a source of news. While decentralized news is powerful, misinformation spreads through seemingly genuine creators. Veris aims to build a platform where:

- Powerful individuals cannot create information monopolies
- Fake news is automatically detected and flagged
- Every claim is verified by state-of-the-art AI
- Users can verify claims from any platform via browser extension

## 🌐 Live Deployments

- **Web App**: [veris-web-app.vercel.app](https://veris-web-app.vercel.app)
- **ADK Agent**: [veris-ai-773695696004.us-central1.run.app](https://veris-ai-773695696004.us-central1.run.app)

## 🔬 What Makes Us Different

**State-of-the-Art AI Verification**: We implement ClaimCheck [1], one of the leading real-time fact-checking systems, integrated with Google ADK. This research-backed approach ensures accurate, fast verification.

**Reference**: [1] Putta, A. R., Devasier, J., & Li, C. (2024). *ClaimCheck: Real-Time Fact-Checking with Small Language Models*. University of Texas at Arlington.

## 🏗️ Architecture

Veris is a monorepo consisting of multiple integrated services:

```
veris/
├── services/
│   ├── agent_service/      # Python ADK agent for AI fact-checking
│   ├── crawler_service/    # TypeScript RSS crawler
│   ├── web-app/           # Next.js web application
│   └── veris_extension/   # Chrome extension for in-browser verification
├── packages/
│   └── shared/            # Shared TypeScript utilities
└── scripts/               # Setup and deployment scripts
```

## 📦 Services

### 1. Agentic AI System (Python)
State-of-the-art fact-checking agent implementing ClaimCheck methodology with Google ADK. Uses tiered source verification and confidence scoring.

**Tech Stack**: Python, Google ADK, OpenAI, Gemini, ClaimCheck

[📖 Read More](./services/agent_service/README.md)

### 2. Web Crawler (TypeScript)
Automated multi-source crawler that collects claims from RSS feeds (BBC, Times of India, The Guardian) and Reddit (r/worldnews, r/news, r/india). Runs every 5 minutes, extracting full article content and submitting to ADK agent for verification.

**Tech Stack**: TypeScript, Node.js, RSS Parser, Cheerio, Axios

[📖 Read More](./services/crawler_service/README.md)

### 3. Social Media Platform (Next.js)
Modern web application where users can submit claims and view verified content. Features infinite scroll feed, mobile-responsive design, and real-time updates.

**Tech Stack**: Next.js 14, React, TypeScript, Tailwind CSS, PostgreSQL

[📖 Read More](./services/web-app/README.md)

### 4. Chrome Extension
Browser extension with snipping tool for instant fact-checking from any website. Drag to select any area, capture screenshot, and submit for verification. Results appear in web app feed within 2-3 minutes.

**Tech Stack**: React, TypeScript, Vite, Tailwind CSS, Chrome Extension API

**How to Use**:
1. Click extension icon
2. Click "Capture Area"
3. Drag to select area on page
4. Click "Verify Claim"
5. Check web app feed in 2-3 minutes

[📖 Read More](./services/veris_extension/README.md)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- pnpm
- PostgreSQL (Neon)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd veris
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
```bash
# Copy example env files
cp services/agent_service/.env.example services/agent_service/.env
cp services/web-app/.env.local.example services/web-app/.env.local
cp services/crawler_service/.env.example services/crawler_service/.env
cp services/veris_extension/env.example services/veris_extension/.env

# Edit with your credentials (API keys, database URL)
```

4. **Run services**

**Web App** (Next.js)
```bash
cd services/web-app
pnpm install
pnpm dev
# Open http://localhost:3000
```

**ADK Agent** (Python)
```bash
cd services/agent_service
pip install -r requirements.txt
python agent.py
# Runs on http://localhost:8080
```

**Crawler Service** (TypeScript)
```bash
cd services/crawler_service
pnpm install
pnpm dev
# Crawls every 5 minutes
```

**Chrome Extension**
```bash
cd services/veris_extension
pnpm install
pnpm build
# Load dist/ folder in Chrome as unpacked extension
# chrome://extensions/ → Enable Developer Mode → Load unpacked
```

## 🔄 How It Works

1. **Multi-Source Input**
   - **Automated Crawler**: Runs every 5 minutes, collecting claims from RSS feeds (BBC, Times of India, The Guardian) and Reddit (r/worldnews, r/news, r/india)
   - **User Submissions**: Via web app or Chrome extension
   - **Content Types**: Text, images, and videos

2. **ClaimCheck AI Processing**
   - Google ADK agent receives submission
   - Implements ClaimCheck research methodology
   - Gathers evidence from tiered authoritative sources
   - Uses OpenAI/Gemini for analysis

3. **Verification & Scoring**
   - AI analyzes claim against gathered evidence
   - Assigns verdict: TRUE, FALSE, DISPUTED, or UNVERIFIABLE
   - Provides confidence score (0-100%)
   - Cites all sources used

4. **Database & Feed Updates**
   - Verified claims stored in PostgreSQL database
   - **Feed automatically updates** with latest verified claims
   - Both crawler-generated and user-submitted claims appear in feed
   - Results visible within 2-3 minutes
   - Infinite scroll for seamless browsing

## 🛠️ Technology Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

**Backend**
- Python (ADK Agent)
- Node.js (Crawler)
- PostgreSQL (Neon)
- Google ADK
- OpenAI API
- Gemini API

**Infrastructure**
- Vercel (Web App)
- Google Cloud Run (ADK Agent)
- Neon PostgreSQL (Database)

## 📝 Key Features

- ✅ **Research-Backed AI**: Implements ClaimCheck methodology from University of Texas at Arlington
- ✅ **Multi-Modal Verification**: Text, images, and videos
- ✅ **Chrome Extension**: Verify claims from any website with snipping tool
- ✅ **Automated Crawling**: Continuous verification from news sources
- ✅ **Real-Time Feed**: Infinite scroll with 2-3 minute verification time
- ✅ **Source Attribution**: Full evidence and source citations
- ✅ **Mobile-First Design**: Works seamlessly on all devices

## 💼 Business Model

**Phase 1 (Current)**: Pre-revenue growth phase
- Focus on user acquisition via Chrome extension and Instagram bot
- Build trust through accurate, research-backed verification
- Grow user base organically

**Phase 2**: Ad-based revenue model
- Following proven strategies of Meta and Instagram
- Monetize once strong audience is established
- Maintain platform integrity while scaling

## 🏆 Built at MumbaiHacks

We traveled 1,728 km from Uttarakhand to attend this hackathon. In just 16 hours, we built:
- State-of-the-art agentic AI system using ClaimCheck research
- Full-stack web application with infinite scroll
- Chrome extension with snipping tool
- Automated web crawler
- Complete integration with Google ADK

While there may be bugs and the UI isn't perfect, we're proud to have turned our year-long dream into a working MVP in one night.

## 🤝 Contributing

Each service has its own README with detailed setup instructions. Contributions welcome!

## 🔗 Links

- [Web App](https://veris-web-app.vercel.app)
- [ADK Agent](https://veris-ai-773695696004.us-central1.run.app)
- [Agent Service Docs](./services/agent_service/README.md)
- [Web App Docs](./services/web-app/README.md)
- [Extension Docs](./services/veris_extension/README.md)
- [Crawler Docs](./services/crawler_service/README.md)
