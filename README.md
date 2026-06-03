# creda

> Verify your team's credibility on-chain.

Creda is a decentralized publishing platform that solves one of crypto's biggest problems — fake founders and impersonators. Every post is stored permanently on Walrus with a wallet address and timestamp, creating unforgeable proof of authorship. Anyone can verify a team's identity in one click.

---

## The Problem

In the memecoin space, fake founders and vampire accounts are everywhere. When a coin starts pumping, random people claim to be the real team and post fake announcements. There's no way to prove who published first — until now.

---

## The Solution

Creda gives every team a permanent, verifiable publishing identity on Sui.

- The real team publishes on Creda → stored on Walrus → returns a Blob ID
- That Blob ID + wallet address + timestamp = unforgeable proof of authorship
- Anyone can hit the verify link and instantly see the full picture

---

## How It Works

1. **Publish** — Team publishes an announcement with their Sui wallet
2. **Store** — Post is stored permanently on Walrus as a blob
3. **Verify** — Anyone clicks the verify link to see:
   - Wallet balance and network confirmation via Tatum Sui RPC
   - Full on-chain transaction history via Tatum Data API
   - AI trust analysis — activity level, red flags, trust score out of 10

---

## Why Creda

The memecoin space has no trust layer. Anyone can claim to be a founder. Creda fixes this by making authorship provable, permanent, and verifiable in one click. Built for the entire Sui ecosystem — any project can use it.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Storage | Walrus Protocol (Sui) |
| Blockchain | Sui Mainnet |
| RPC & Data API | Tatum |
| AI Agent | Claude (Anthropic) |
| Frontend | React |
| Backend | Node.js + Express |

---

## Getting Started

### Prerequisites
- Node.js
- Tatum API key
- Anthropic API key

### Installation

```bash
git clone https://github.com/amaylvia-gitseries/creda
cd creda
npm install
```

### Environment Variables

Create a `.env` file:
REACT_APP_TATUM_API_KEY=your_tatum_api_key
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key
### Run

```bash
# Terminal 1 - Backend
node server.js

# Terminal 2 - Frontend
npm start
```

App runs on `localhost:3000`

---
## Live App
https://credaapp.vercel.app
## Live Backend
https://creda-backend-1rcx.onrender.com
---

## Demo Flow

1. Visit the app → Creda landing page
2. Click **Publish Post** → enter wallet, title, announcement
3. Post stored on Walrus → Blob ID returned
4. Click **View Feed** → see verified posts
5. Click **Verify Wallet →** → full wallet profile + AI analysis

---

Built for the Tatum x Walrus Hackathon 2026
Powered by Walrus · Sui · Tatum · Anthropic
