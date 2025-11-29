# Veris Agent Service - State-of-the-Art Fact-Checking AI

Agentic AI system implementing ClaimCheck methodology for real-time fact verification.

## 🔬 Research-Backed Approach

This agent implements **ClaimCheck** [1], a state-of-the-art real-time fact-checking system from the University of Texas at Arlington. ClaimCheck uses small language models with a tiered source verification strategy to achieve high accuracy while maintaining speed.

**Reference**: Putta, A. R., Devasier, J., & Li, C. (2024). *ClaimCheck: Real-Time Fact-Checking with Small Language Models*. University of Texas at Arlington.

## Key Features

- **Tiered Source Strategy**: Verifies claims using authoritative sources in priority order
- **Multi-Model Support**: OpenAI GPT-4 and Google Gemini integration
- **Confidence Scoring**: 0-100% confidence with evidence attribution
- **Multi-Modal**: Handles text, images, and videos
- **Real-Time**: 2-3 minute verification time

## Tech Stack

- Python 3.11+
- Google ADK (Agent Development Kit)
- OpenAI API (GPT-4)
- Google Gemini API
- PostgreSQL (Neon)
- ClaimCheck Methodology

## How It Works

1. **Claim Reception**: Receives claims from web app or extension
2. **Source Gathering**: Uses ClaimCheck's tiered source strategy
3. **Evidence Analysis**: AI analyzes claim against gathered evidence
4. **Verdict Assignment**: TRUE, FALSE, DISPUTED, or UNVERIFIABLE
5. **Database Storage**: Stores results for feed display

## ClaimCheck Implementation

Our implementation follows the ClaimCheck paper's methodology:

- **Tier 1 Sources**: Fact-checking organizations (Snopes, PolitiFact)
- **Tier 2 Sources**: News agencies (Reuters, AP)
- **Tier 3 Sources**: Academic and government sources
- **Confidence Scoring**: Based on source agreement and quality

## Setup

### Prerequisites

- Python 3.11+
- OpenAI API key
- Google Gemini API key
- PostgreSQL database

### Installation

```bash
cd services/agent_service
pip install -r requirements.txt
```

### Configuration

Create `.env`:
```env
AI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
DATABASE_URL=postgresql://...
```

### Run

```bash
python agent.py
```

## API Endpoints

### POST /run_sse
Submit claim for verification

**Body**:
```json
{
  "app_name": "veris_agent",
  "user_id": "user_id",
  "session_id": "session_id",
  "newMessage": {
    "role": "user",
    "parts": [
      {
        "text": "Claim text"
      }
    ]
  }
}
```

## Project Structure

```
agent_service/
├── agent.py              # Main agent entry point
├── prompt.py             # System prompts
├── model_callbacks.py    # AI model integration
├── tools/
│   └── claimcheck/      # ClaimCheck implementation
│       ├── factchecker.py
│       ├── modules.py
│       ├── prompts.py
│       └── web_tools.py
├── sub_agents/
│   └── verify_claim_agent/  # Verification logic
└── database/            # Database operations
```

## Links

- [Main Project](../../README.md)
- [Web App](../web-app/README.md)
- [Chrome Extension](../veris_extension/README.md)
- [ClaimCheck Paper](https://arxiv.org/abs/2410.08376)
