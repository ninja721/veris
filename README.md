# Veris - AI-Powered Fact Checking Platform

**Truth Matters.** Veris is an AI-powered fact-checking platform that helps combat misinformation by verifying claims from text, images, and videos.

## 🌐 Live Deployments

- **Web App**: [veris.vercel.app](https://veris.vercel.app)
- **ADK Agent**: [veris-ai-773695696004.us-central1.run.app](https://veris-ai-773695696004.us-central1.run.app)

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

### 1. Agent Service (Python)
AI-powered fact-checking agent using Google ADK and ClaimCheck methodology.

**Tech Stack**: Python, Google ADK, OpenAI, Gemini, PostgreSQL

[📖 Read More](./services/agent_service/README.md)

### 2. Crawler Service (TypeScript)
Automated RSS feed crawler that collects claims from news sources.

**Tech Stack**: TypeScript, Node.js, PostgreSQL

[📖 Read More](./services/crawler_service/README.md)

### 3. Web App (Next.js)
Modern web application for submitting and viewing verified claims.

**Tech Stack**: Next.js 14, React, TypeScript, Tailwind CSS, PostgreSQL

[📖 Read More](./services/web-app/README.md)

### 4. Chrome Extension
Browser extension with snipping tool for instant fact-checking.

**Tech Stack**: React, TypeScript, Vite, Tailwind CSS

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
cp services/veris_extension/env.example services/veris_extension/.env

# Edit with your credentials
```

4. **Run services**
```bash
# Web App
cd services/web-app
pnpm dev

# Agent Service
cd services/agent_service
python agent.py

# Crawler Service
cd services/crawler_service
pnpm dev

# Extension
cd services/veris_extension
pnpm dev
```

## 🔄 How It Works

1. **Content Submission**
   - Users submit claims via web app or extension
   - Content can be text, images, or videos

2. **AI Processing**
   - ADK agent receives submission
   - Uses ClaimCheck methodology for verification
   - Gathers evidence from authoritative sources

3. **Verification**
   - AI analyzes claim against evidence
   - Assigns verdict: TRUE, FALSE, DISPUTED, or UNVERIFIABLE
   - Provides confidence score and sources

4. **Display**
   - Results appear in web app feed within 2-3 minutes
   - Users can view evidence and sources

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

- ✅ Multi-modal verification (text, images, videos)
- ✅ AI-powered fact-checking with ClaimCheck
- ✅ Chrome extension with snipping tool
- ✅ Real-time feed with infinite scroll
- ✅ Mobile-responsive design
- ✅ Automated RSS crawling
- ✅ Source attribution and evidence display

## 🤝 Contributing

Each service has its own README with detailed setup instructions. Please refer to individual service documentation for contribution guidelines.

## 📄 License

[Add your license here]

## 🔗 Links

- [Web App](https://veris.vercel.app)
- [ADK Agent](https://veris-ai-773695696004.us-central1.run.app)
- [Agent Service Docs](./services/agent_service/README.md)
- [Web App Docs](./services/web-app/README.md)
- [Extension Docs](./services/veris_extension/README.md)
- [Crawler Docs](./services/crawler_service/README.md)
