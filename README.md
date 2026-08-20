# ⚡ Influzo — AI Creator Marketplace & Smart Escrow Platform

> **Influzo** is a modern full-stack creator monetization and brand collaboration platform with automated milestone-locked escrow, AI-powered matchmaking, and a dedicated Super Admin control center.

---

## 🌟 Key Features

- **Public Marketplace & Landing Page**: Dynamic ROI calculator, influencer earnings estimator, and creator discovery engine.
- **Brand Portal**: Multi-parameter creator filtering (niche, platform, verified status), AI Campaign Studio brief builder, and real-time Deal Kanban Pipeline.
- **Creator OS & Media Kit**: Live rate card editor, public media kit links, inbound deal inbox, and 1-click Stripe escrow payout simulator.
- **Milestone-Locked Escrow**: Bank-grade escrow holding brand deposits until deliverable review and verified post publication.
- **Dual-Mode Authentication (SQLite + JWT)**:
  - **Password Signup/Login**: Secure password hashing with `bcryptjs` and 30-day JWT sessions.
  - **Instant 6-Digit OTP**: Passwordless mobile/email verification with live countdown timer.
- **Hidden Super Admin Control Center**: Passkey-protected operator gateway for creator KYC verification, escrow dispute arbitration, and platform fee configurations.
- **SQLite Database Engine**: High-performance WAL-mode persistent database with zero-setup automatic seed migrations.

---

## 🏗️ Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript, better-sqlite3, bcryptjs, jsonwebtoken.
- **Database**: SQLite (`server/src/data/influzo.db`).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd influzo

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Running Locally (Frontend + Backend Together)
```bash
# From the root directory:
npm run dev:all
```

- **Frontend App**: `http://localhost:5173/`
- **Backend REST API**: `http://localhost:5001/api/health`

---

## 🔐 Default Demo Accounts

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Creator** | `elena@techreviews.com` | `password123` | Pre-configured media kit, packages, and wallet balance |
| **Brand** | `growth@taskflow.ai` | `password123` | Active campaigns, creator deals, and escrow pipeline |
| **Super Admin** | *Staff Gateway Link in Footer* | Passkey: `admin123` | KYC approvals, escrow dispute arbitrator, system settings |

---

## 📜 License
MIT License © 2026 Influzo Technologies Inc.
