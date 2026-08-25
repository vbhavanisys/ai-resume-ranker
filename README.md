# AI Resume Ranker & Match Optimizer 🚀

An AI-powered, full-stack Web & Progressive Web Application (PWA) designed to analyze candidate resumes against job descriptions, calculate ATS match percentages, identify skill gaps, and provide actionable recommendations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://ais-dev-fdf6to5qywcuradkpo6l34-1051737372900.asia-southeast1.run.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/your-username/ai-resume-ranker)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 🔗 Project Links

- **Live Demo Application**: [https://ais-dev-fdf6to5qywcuradkpo6l34-1051737372900.asia-southeast1.run.app](https://ais-dev-fdf6to5qywcuradkpo6l34-1051737372900.asia-southeast1.run.app)
- **GitHub Repository Placeholder**: `https://github.com/your-username/ai-resume-ranker`

---

## 📖 Project Overview

The **AI Resume Ranker & Match Optimizer** bridges the gap between candidate job applications and modern Applicant Tracking Systems (ATS). Using Google Gemini 3.6 Flash AI and Natural Language Processing (NLP), the application parses candidate resumes (PDF, DOCX, DOC, TXT), compares extracted credentials against target job descriptions, identifies missing skills, computes ATS match percentages, and offers actionable bullet-point optimizations.

---

## 🌟 Key Features

- **Multi-Format Document Parsing**: Extract text from **PDF, DOCX, DOC, and TXT** documents up to 25MB.
- **AI-Powered Multi-Metric Scoring**: Powered by Gemini 3.6 Flash AI:
  - **Overall Job Match %**
  - **Resume Structure & Content Score**
  - **Skill Alignment Percentage**
  - **Keyword Coverage Percentage**
- **In-Depth Gap Analysis**: Categorized list of matched skills vs. missing critical skills.
- **Candidate Strengths & Weaknesses**: Highlight competitive advantages and address resume deficiencies.
- **ATS Bullet Point Optimizer**: Transforms passive task descriptions into quantified impact statements.
- **MongoDB Persistence**: User authentication with PBKDF2 password hashing + HMAC SHA-256 JWT tokens. User-isolated evaluation history.
- **Printable Executive Reports**: One-click printable summary modal and PDF export generator (`window.print()`).
- **Progressive Web App (PWA)**: Mobile-optimized, installable application with offline service worker support.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express REST API, JSON Web Tokens (JWT), PBKDF2 Crypto Hashing
- **Database**: MongoDB / MongoDB Atlas (Mongoose schema representation)
- **AI Engine**: Google Gemini 3.6 Flash API (`@google/genai` TypeScript SDK)
- **Document Parsing**: PDF & DOCX text extraction utilities
- **PWA**: Web App Manifest (`manifest.json`) and Service Worker (`sw.js`)

---

## 📁 Project Folder Structure

```text
.
├── public/
│   ├── icon.png               # Application Logo & Favicon
│   ├── icon-192.png           # PWA Icon (192x192)
│   ├── icon-512.png           # PWA Icon (512x512)
│   ├── manifest.json          # Progressive Web App Manifest
│   └── sw.js                  # PWA Offline Service Worker
├── src/
│   ├── components/            # Reusable UI Components
│   │   ├── Navbar.tsx         # Header Navigation Bar & Drawer
│   │   ├── Footer.tsx         # Page Footer
│   │   ├── Progress.tsx       # Custom SVG Circular Gauge
│   │   ├── AnalysisModal.tsx   # Step Progress Analyzer Modal
│   │   └── ProfileModal.tsx    # User Account Details Modal
│   ├── data/                  # Preset Job Templates & Data
│   ├── pages/                 # Full-Screen Page Views
│   │   ├── LoginPage.tsx      # Authentication Login
│   │   ├── RegisterPage.tsx   # User Registration
│   │   ├── DashboardPage.tsx  # User Metrics & Recent Activity
│   │   ├── ResumeUploadPage.tsx # Drag-and-Drop Resume Upload
│   │   ├── JobDescriptionPage.tsx # Job Role Input
│   │   ├── AnalysisResultPage.tsx # Score Breakdown & AI Recommendations
│   │   ├── AnalysisHistoryPage.tsx # Saved Evaluation Log
│   │   └── ProfilePage.tsx    # User Profile & Stats Summary
│   ├── utils/                 # API Service Helpers & Document Parsing Utilities
│   ├── App.tsx                # Main Application State & Router
│   ├── main.tsx               # React Entry Point
│   ├── types.ts               # Shared TypeScript Interfaces
│   └── index.css              # Tailwind CSS Directives & Custom Styles
├── .env.example               # Template for Environment Variables
├── metadata.json              # Platform Metadata
├── package.json               # NPM Dependencies & Build Scripts
├── server.ts                  # Express Backend Server & Vite Middleware
├── tsconfig.json              # TypeScript Compiler Configuration
└── vite.config.ts             # Vite Build Configuration
```

---

## ⚙️ Environment Variables (`.env`)

Copy `.env.example` to create `.env` in the root directory:

```env
# Client API Configuration
VITE_API_BASE_URL=/api

# Database Connection String (MongoDB Atlas or Local MongoDB)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/resumerank_db?retryWrites=true&w=majority

# Authentication Secret Key
JWT_SECRET_KEY=your_jwt_secret_key_here

# Google Gemini AI API Key (Server-Side Secret ONLY)
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Security Note**: Never commit actual passwords, API keys, or JWT secret keys to GitHub. Always keep `.env` in `.gitignore`.

---

## 🚀 Setup & Installation Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB Atlas Account or local MongoDB service

### 2. Frontend & Backend Installation
```bash
# Clone the repository
git clone https://github.com/your-username/ai-resume-ranker.git
cd ai-resume-ranker

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 3. Database & AI API Configuration
1. **MongoDB Setup**:
   - Create a free database cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Under Network Access, allow connection IP `0.0.0.0/0`.
   - Copy connection string to `MONGODB_URI` in `.env`.
2. **Gemini AI API Key**:
   - Get an API key from [Google AI Studio](https://aistudio.google.com/).
   - Copy key to `GEMINI_API_KEY` in `.env`.

### 4. Running the Project Locally
```bash
# Start development server (Runs Express backend & Vite frontend on port 3000)
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 📦 Production Build & Deployment Instructions

### Production Build Command
```bash
# Compile TypeScript frontend assets and bundle backend server
npm run build

# Start production Node.js server
npm start
```

### Recommended Deployment Platforms
- **Full-Stack Application**: Deploy on **Render.com** or **Google Cloud Run** using Node.js runtime. Set environment variables (`MONGODB_URI`, `JWT_SECRET_KEY`, `GEMINI_API_KEY`).
- **Database**: Host on **MongoDB Atlas (M0 Free Tier)**.

---

## 🖼️ Application Screenshots & UI Previews

| View | Description |
| :--- | :--- |
| **Login / Register** | High-contrast dark theme authentication forms with client validation and password visibility toggle. |
| **Dashboard** | Candidate overview showing overall match averages, evaluation counts, score badges, and recent records. |
| **Resume Upload** | Drag-and-drop document uploader supporting PDF, DOCX, DOC, and TXT with instant text extraction preview. |
| **Analysis Results** | Interactive circular gauges for match scores, matched/missing skill chips, AI suggestions, and PDF report generator. |
| **Analysis History** | Filterable log of past resume evaluations with instant view and delete capabilities. |

---

## 📱 Progressive Web App (PWA) Setup

- Supports installation on Android, iOS, and Desktop browsers.
- Includes Web App Manifest (`/manifest.json`) and Service Worker (`/sw.js`).
- Displays standalone full-screen window with custom app icon.

---

## 🔮 Future Improvements

- Multi-resume side-by-side comparison matrix.
- Cover letter generation powered by target job description.
- Real-time job board integration (LinkedIn/Indeed API imports).
- Automated email alerts for match score threshold achievements.
