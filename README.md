# 🚀 GitHub Profile Analyzer

Turn any public GitHub profile URL or username into a detailed developer intelligence report using the official GitHub REST API.

![GitHub Profile Analyzer Banner](https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/github/github.png)

---

## 🌟 Overview

**GitHub Profile Analyzer** is a modern, full-stack developer report application. Enter any public GitHub username or profile URL (e.g. `https://github.com/torvalds` or `torvalds`) to generate comprehensive developer dashboards featuring repository distributions, language donut charts, activity timelines, factual insights, compare mode, and a transparent 0–100 **GitHub Activity Score**.

---

## ✨ Features

- 👤 **Profile Overview**: Header displaying avatar, name, username, bio, location, company, website, Twitter/X handle, creation date, followers, following, repos, and public gists count.
- 📊 **Statistics Cards**: Visual metric cards with animated icons for total repositories, stars, forks, followers, following, and original vs forked breakdown.
- 🍩 **Language Analytics**: Interactive Recharts Donut chart displaying language percentages, top 5 breakdown, and dominant language badge.
- 📈 **Repository Statistics Charts**: Interactive bar and area charts for Stars per repository, Forks per repository, and Repository creation timeline by year.
- 🏆 **Top Repositories Ranking**: Ranks top projects based on star impact, fork engagement, and activity.
- 🔍 **Repository Explorer**: Search repositories by keyword, filter by language or repository type (original/forked/archived), and sort by stars, forks, updated date, size, or name.
- 🪟 **Repository Detail Modal**: Click any repository card to view complete metrics, default branch, license, size, topics, pushed date, and direct GitHub links.
- ⚡ **Developer Activity Timeline**: Timeline feed summarizing public events (pushes, pull requests, issue creations, repository creation, and star events).
- 💡 **Developer Insights**: Clean, factual observations derived directly from GitHub API telemetry.
- 🛡️ **GitHub Activity Score (0–100)**: Transparent score calculation broken down into 5 factors with an explicit disclaimer label.
- ⚔️ **Compare Developers**: Side-by-side comparative analysis of two developers (User A vs User B).
- 📄 **Export PDF Report**: Download a clean PDF summary report of any analyzed profile.
- 🕒 **Recently Analyzed**: Fast 1-click re-analyzing using browser `localStorage`.
- ⏳ **UX Loading Skeletons**: Interactive step-by-step progress feedback ("Fetching profile...", "Analyzing repositories...", "Calculating score...").

---

## 🛠️ Recommended Tech Stack

### Frontend
- **React.js 18** + **Vite**
- **Tailwind CSS** (Dark theme with glassmorphism UI)
- **Recharts** (Interactive charts and data visualizations)
- **Lucide React** (Modern iconography)
- **html2canvas** & **jsPDF** (PDF report generation)

### Backend
- **Python 3.12** + **Flask API**
- **Flask-CORS**
- **Requests**
- **python-dotenv**

### API
- Official **GitHub REST API v3** (`/users`, `/repos`, `/events/public`)

---

## 📁 Project Architecture

```text
github-profile-analyzer/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── github.py          # Flask API Endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── github_service.py   # GitHub REST API client & pagination
│   │   │   └── analytics_service.py# Data processing & activity score algorithm
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── cache.py           # In-memory TTL Caching
│   │   └── __init__.py
│   ├── app.py                      # Flask App Server Entry
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/            # UI Components
│   │   ├── pages/                 # Home, Dashboard, Compare, About
│   │   ├── services/              # API Client
│   │   ├── utils/                 # Helpers & PDF Generator
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/github/profile/<username>` | Returns basic GitHub user profile data |
| `GET` | `/api/github/repos/<username>` | Returns all public repositories (paginated `per_page=100`) |
| `GET` | `/api/github/analyze/<username>` | Complete analyzed profile, repo analytics, timeline, and score |
| `GET` | `/api/github/repository/<owner>/<repo>` | Detailed breakdown for a single repository |
| `GET` | `/api/github/compare/<user1>/vs/<user2>` | Side-by-side comparison of two developers |

---

## ⚙️ Installation & Running Locally

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.9+)

### 1. Clone & Setup Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file (optional: add GITHUB_TOKEN to increase API limits)
cp .env.example .env

# Run Flask backend server (Runs on http://localhost:5000)
python app.py
```

### 2. Setup Frontend

```bash
# In a new terminal window:
cd frontend

# Install Node modules
npm install

# Start Vite dev server (Runs on http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🔑 Environment Variables Configuration

In `backend/.env`:

```env
# Optional Personal Access Token to raise GitHub rate limit from 60 to 5,000 requests/hr
GITHUB_TOKEN=your_personal_access_token_here

PORT=5000
CACHE_TTL=300
```

> **Note**: Tokens remain securely on the backend server and are never exposed to client-side JavaScript.

---

## 📄 License

MIT License. Built for developers worldwide.
