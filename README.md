# CyberShield NGO

> **Practical Cybersecurity Risk Assessment & Improvement Platform for Resource-Constrained Non-Profit Organizations**

**EY GDS Training Project** — A comprehensive cybersecurity assessment platform designed to help small NGOs with limited budgets and IT resources assess their security posture, identify gaps, and implement prioritized improvements.

---

## 📸 Dashboard Preview

![CyberShield NGO Dashboard](dashboard-screenshot.png)

*The main NGO Dashboard showing security score, risk level, maturity assessment, and category breakdown with interactive charts.*

---

## 🎯 Project Overview

CyberShield NGO is a web-based cybersecurity risk assessment and improvement platform built as part of the EY GDS training program. It demonstrates a practical cybersecurity improvement strategy specifically designed for resource-constrained non-profit organizations.

### Why This Matters

NGOs handle sensitive donor data, beneficiary information, and financial records, making them attractive targets for cyber attacks. Yet most NGOs:

- Have minimal IT budgets (often <₹5 lakh/year)
- Have 0-1 dedicated IT staff
- Lack formal cybersecurity policies
- Have never conducted a security assessment

This platform provides an accessible, practical way for such organizations to:
- Assess their current security posture
- Understand their risk level with transparent scoring
- Get prioritized, cost-effective recommendations
- Follow a phased implementation roadmap
- Track improvement over time

---

## ⚠️ Problem Statement

**NGOs face a cybersecurity paradox**: they hold valuable data but lack the resources to protect it properly.

| Challenge | Impact |
|-----------|--------|
| No dedicated IT security staff | Security gaps go unnoticed |
| Limited IT budget | Cannot afford enterprise security solutions |
| No formal policies | Inconsistent security practices |
| No incident response plan | Poor response to breaches |
| Volunteers with data access | Untrained users handling sensitive data |
| Cloud service usage without MFA | Easy account compromise |

---

## 🎯 Objectives

1. **Democratize cybersecurity assessment** for NGOs with zero/limited budget
2. **Provide transparent, explainable scoring** (no black-box algorithms)
3. **Generate actionable recommendations** prioritized by risk and cost-effectiveness
4. **Create a practical implementation roadmap** from quick wins to strategic improvements
5. **Track security improvement** over time with KPIs
6. **Generate professional assessment reports** for stakeholders and donors
7. **Emphasize cost-effective controls** that provide maximum security improvement per rupee spent

---

## ✨ Features

### Core Assessment
- **10-Category Assessment** covering Identity & Access, Endpoint, Network, Data Protection, Backup, Email, Awareness, Incident Response, Policies, and Vulnerability Management
- **55 Assessment Questions** with practical, NGO-relevant scenarios
- **4-Level Answer Scale**: Fully Implemented, Partially Implemented, Not Implemented, Not Applicable

### Scoring & Analysis
- **Transparent Risk Scoring Engine**: Risk = Likelihood × Impact (1-5 scale each)
- **0-100 Security Score** with risk level classification
- **5-Level Maturity Model**: Initial → Basic → Managed → Advanced → Optimized
- **Gap Analysis**: Current vs. Expected state with prioritized actions
- **Risk Distribution**: Critical/High/Medium/Low classification

### Recommendations
- **Rule-Based Recommendation Engine** with 35+ practical recommendations
- **Intelligent Prioritization**: Priority = (Risk × Business Impact) / Implementation Effort
- **Cost Estimates** for each recommendation (clearly labeled as illustrative)
- **Implementation Timeline** for each recommendation

### Implementation Support
- **Phased Roadmap**: First 30 days, 30-90 days, 3-6 months, 6-12 months
- **Roadmap Progress Tracking**: Not Started → In Progress → Completed
- **Cost Budget Planner** with 9 security investment categories
- **Cost-Effectiveness Analysis**: Security improvement per ₹ spent

### Incident Response
- **Incident Recording** with 8 incident types
- **6-Stage Lifecycle**: Identify → Contain → Eradicate → Recover → Review → Improve
- **Incident Tracking** with severity classification

### Policy Library
- **8 Security Policy Templates**: Password, MFA, Acceptable Use, Data Protection, Backup, Incident Reporting, Offboarding, Remote Work
- **Downloadable Policy Documents** ready for customization

### Dashboards & Reports
- **NGO Dashboard** with 7 tabs (Overview, Risks, Gap Analysis, Recommendations, Roadmap, KPIs, Cost)
- **Admin Dashboard** with cross-organization statistics
- **Chart.js Visualizations**: Radar, Doughnut, Bar charts
- **Security KPI Tracking** with current vs. target values
- **PDF Report Generation** with professional consulting-style layout
- **Presentation Mode** for project demonstrations

### User Roles
- **NGO Administrator**: Full assessment, dashboard, and management capabilities
- **System Administrator**: Cross-organization view and statistics

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend Framework | Next.js 16 (App Router) |
| UI Styling | Tailwind CSS 4 |
| Backend | Next.js API Routes (Server-Side) |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Charts | Chart.js 4 (CDN) |
| Icons | Font Awesome 6 (CDN) |
| PDF Generation | PDFKit |
| Authentication | JWT (jose) + bcryptjs |
| Language | TypeScript |

---

## 🏗️ Architecture

```
cybershield-ngo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── login/             # Authentication
│   │   ├── dashboard/         # Main dashboard (7 tabs)
│   │   ├── assessment/        # Multi-step assessment
│   │   ├── organization/      # Organization profile
│   │   ├── incidents/         # Incident response
│   │   ├── policies/          # Policy library
│   │   ├── admin/             # Admin dashboard
│   │   ├── presentation/      # Presentation mode
│   │   └── api/               # API Routes
│   │       ├── auth/          # Authentication API
│   │       ├── assessment/    # Assessment API
│   │       ├── data/          # Data CRUD API
│   │       ├── organization/  # Organization API
│   │       ├── report/        # PDF report API
│   │       ├── seed/          # Demo data API
│   │       └── health/        # Health check
│   ├── db/                    # Database
│   │   ├── index.ts          # Drizzle client
│   │   └── schema.ts         # All table definitions
│   ├── lib/                   # Business logic
│   │   ├── assessment-questions.ts  # 55 questions
│   │   ├── scoring.ts               # Risk scoring engine
│   │   ├── recommendations.ts       # Recommendation engine
│   │   ├── default-data.ts          # Roadmap, policies, KPIs, costs
│   │   └── auth.ts                  # Authentication utilities
│   └── types/                 # TypeScript declarations
├── .env                       # Environment variables
├── drizzle.config.ts          # Drizzle ORM config
├── tsconfig.json              # TypeScript config
└── README.md                  # This file
```

**Design Principles:**
- **Separation of Concerns**: Business logic in `/lib`, routes in `/api`, UI in `/app`
- **Server-Side Processing**: All scoring, recommendations, and report generation on server
- **Client-Side Rendering**: Dashboard and forms as React client components
- **Type Safety**: Full TypeScript with strict mode

---

## 🗄️ Database Structure

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | id, username, email, password_hash, role, organization_id |
| `organizations` | NGO profiles | id, name, type, num_employees, annual_it_budget, ... |
| `assessments` | Assessment records | id, organization_id, overall_score, risk_level, maturity_level |
| `assessment_answers` | Individual answers | id, assessment_id, question_id, answer, risk_score, risk_level |
| `risk_results` | Category-level scores | id, assessment_id, category, category_score, risk_level |
| `recommendations` | Generated recommendations | id, organization_id, title, priority, cost_estimate, status |
| `roadmap_items` | Implementation items | id, organization_id, phase, status, title |
| `incidents` | Security incidents | id, organization_id, type, severity, status, lessons_learned |
| `security_policies` | Policy templates | id, organization_id, title, content, category |
| `kpis` | Security metrics | id, organization_id, name, current_value, target_value |
| `audit_log` | Audit trail | id, user_id, action, resource, timestamp |

---

## 📊 Risk Scoring Methodology

### Question-Level Risk

For each assessment question, risk is calculated as:

```
Risk = Likelihood × Impact
```

Both **Likelihood** and **Impact** use a 1-5 scale:

| Score | Likelihood | Impact |
|-------|-----------|--------|
| 1 | Rare | Minimal |
| 2 | Unlikely | Minor |
| 3 | Possible | Moderate |
| 4 | Likely | Major |
| 5 | Almost Certain | Severe |

### Answer-Based Risk Adjustment

| Answer | Likelihood | Impact |
|--------|-----------|--------|
| Fully Implemented | 1 | max(1, baseImpact × 0.2) |
| Partially Implemented | max(2, baseLikelihood × 0.6) | max(2, baseImpact × 0.7) |
| Not Implemented | baseLikelihood | baseImpact |
| Not Applicable | 1 | 1 |

### Risk Level Classification

| Risk Score | Level | Color |
|-----------|-------|-------|
| 1-4 | Low | 🟢 Green |
| 5-9 | Medium | 🟡 Yellow |
| 10-15 | High | 🟠 Orange |
| 16-25 | Critical | 🔴 Red |

### Category Score

Each category's score is the average of all applicable question scores within that category, where:
- Fully Implemented = 100 points
- Partially Implemented = 50 points
- Not Implemented = 0 points
- Not Applicable = excluded from calculation

### Overall Security Score

The overall score is the average of all 10 category scores, resulting in a 0-100 scale.

---

## 📈 Cybersecurity Maturity Model

| Level | Name | Score Range | Description |
|-------|------|------------|-------------|
| 5 | Optimized | 80-100 | Mature, optimized security program with automation |
| 4 | Advanced | 60-79 | Proactive security with regular testing |
| 3 | Managed | 40-59 | Formal policies with consistent controls |
| 2 | Basic | 20-39 | Some basic controls, inconsistent |
| 1 | Initial | 0-19 | Ad-hoc, reactive approach |

The target maturity is always the next level above current. Each level has specific improvement steps documented.

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **npm** | 9+ | Package manager (comes with Node.js) |
| **PostgreSQL** | 14+ | Database server |
| **Git** | Latest | Version control |

**Verify installations:**
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
psql --version    # Should show 14.x or higher
```

---

### Step-by-Step Setup Guide

#### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/KingAtomic7/CyberShield-NGO.git

# Navigate to project directory
cd CyberShield-NGO
```

#### 2. Install Dependencies

```bash
# Install all npm packages
npm install
```

This installs all dependencies listed in `package.json` including:
- Next.js, React, TypeScript
- Drizzle ORM, PostgreSQL driver
- Chart.js, PDFKit, bcryptjs, jose (JWT)
- Tailwind CSS, Font Awesome

#### 3. Set Up PostgreSQL Database

**Option A: Local PostgreSQL Installation**

1. **Install PostgreSQL** (if not already installed):
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql@15 && brew services start postgresql@15`
   - **Linux (Ubuntu/Debian)**: `sudo apt install postgresql postgresql-contrib`

2. **Create the database:**
   ```bash
   # Connect to PostgreSQL as superuser
   psql -U postgres
   
   # Inside psql shell, create database and user
   CREATE DATABASE cybershield;
   CREATE USER cybershield_user WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE cybershield TO cybershield_user;
   \q
   ```

**Option B: Using Docker (Quick Setup)**

```bash
# Run PostgreSQL in Docker
docker run -d \
  --name cybershield-db \
  -e POSTGRES_DB=cybershield \
  -e POSTGRES_USER=cybershield_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  postgres:15
```

**Option C: Cloud Database (Supabase, Neon, Railway, etc.)**

Use the connection string provided by your cloud provider.

#### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# PostgreSQL connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://cybershield_user:your_secure_password@127.0.0.1:5432/cybershield

# Required for production - generate a secure random string
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secure-random-32-byte-secret-here

# Optional: Set to 'production' for production deployments
NODE_ENV=development
```

**Important Notes:**
- `JWT_SECRET` **must be set** when `NODE_ENV=production` (app will fail to start without it)
- For development, a fallback is used but you should still set a value
- Generate a secure secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### 5. Initialize Database Schema

```bash
# Push the Drizzle schema to your database
npx drizzle-kit push
```

This creates all tables:
- `users`, `organizations`, `assessments`, `assessment_answers`
- `risk_results`, `recommendations`, `roadmap_items`
- `incidents`, `security_policies`, `kpis`, `audit_log`

**Verify tables were created:**
```bash
psql -U cybershield_user -d cybershield -c "\dt"
```

#### 6. Start the Development Server

```bash
# Start Next.js in development mode
npm run dev
```

You should see:
```
▲ Next.js 16.x.x
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
✓ Ready in 2.3s
```

#### 7. Seed Demo Data

**Option A: Via Browser**
1. Open http://localhost:3000/api/seed in your browser
2. Or use the seed endpoint via the UI (if available)

**Option B: Via cURL (Recommended)**
```bash
# Seed demo organization and users
curl -X POST http://localhost:3000/api/seed
```

**Option C: Via PowerShell (Windows)**
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"
```

This creates:
- **Demo Organization**: "Helping Hands Foundation"
- **System Admin**: `admin` / `Admin@123`
- **NGO Admin**: `ngo_admin` / `Ngo@123`
- Pre-loaded assessment with realistic security gaps

#### 8. Access the Application

Open your browser and navigate to:
- **Main App**: http://localhost:3000
- **Login Page**: http://localhost:3000/login

**Login with demo credentials:**
| Role | Username | Password |
|------|----------|----------|
| NGO Administrator | `ngo_admin` | `Ngo@123` |
| System Administrator | `admin` | `Admin@123` |

---

### 🔧 Common Commands Reference

```bash
# Development
npm run dev              # Start dev server with hot reload

# Database
npx drizzle-kit push     # Push schema changes to DB
npx drizzle-kit studio   # Open Drizzle Studio (DB GUI)
npx drizzle-kit generate # Generate migration files
npx drizzle-kit migrate  # Run migrations

# Building
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Testing (if configured)
npm test                 # Run tests
```

---

### 🐳 Docker Deployment (Optional)

Create a `Dockerfile` for containerized deployment:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run:
```bash
docker build -t cybershield-ngo .
docker run -p 3000:3000 --env-file .env cybershield-ngo
```

---

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

For production deployment, ensure:
- `NODE_ENV=production` in `.env`
- Strong `JWT_SECRET` (32+ bytes)
- Secure `DATABASE_URL` (SSL enabled)
- Reverse proxy (nginx) for SSL termination
- Process manager (PM2) for auto-restart

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `psql: command not found` | Add PostgreSQL `bin` directory to PATH, or use full path to `psql.exe` |
| `DATABASE_URL` connection refused | Ensure PostgreSQL is running; check host/port; verify firewall |
| `JWT_SECRET` error in production | Set `JWT_SECRET` in `.env` with a 32+ byte random string |
| Port 3000 already in use | Kill existing process: `npx kill-port 3000` or change port in `package.json` |
| Module not found errors | Delete `node_modules` and `package-lock.json`, run `npm install` again |
| Database schema out of sync | Run `npx drizzle-kit push` again |
| Seed fails | Check database connection; ensure tables exist; check server logs |

---

### Quick Start Summary

For experienced developers who want the minimal steps:

```bash
git clone https://github.com/KingAtomic7/CyberShield-NGO.git
cd CyberShield-NGO
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npx drizzle-kit push
npm run dev
# In another terminal: curl -X POST http://localhost:3000/api/seed
# Open http://localhost:3000 and login with ngo_admin / Ngo@123
```

---

## 🔑 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| NGO Administrator | `ngo_admin` | `Ngo@123` |
| System Administrator | `admin` | `Admin@123` |

**Demo Organization**: Helping Hands Foundation
- 35 employees, 80 volunteers, 1 IT staff
- Annual IT Budget: ₹5,00,000
- Pre-loaded assessment showing realistic weaknesses

---

## 🔒 Security Measures

This application implements the following security controls:

- **Organization tenant isolation**: all organization-scoped API reads/writes resolve the target through `resolveOrgId(session, requestedOrgId)`. NGO admins are restricted to their own organization; system admins may explicitly select another organization.
- **Registration role restriction**: public registration always creates `ngo_admin` users; client-supplied roles are ignored.
- **JWT secret handling**: development has a local-only fallback, while production fails fast if `JWT_SECRET` is not configured.

| Control | Implementation |
|---------|---------------|
| Password Hashing | bcryptjs with 12 salt rounds |
| Session Tokens | JWT (HS256) with 8-hour expiry |
| HTTP-Only Cookies | Session tokens not accessible via JavaScript |
| CSRF Protection | SameSite=Lax cookie policy |
| Input Validation | Server-side validation for all inputs |
| SQL Injection Prevention | Parameterized queries via Drizzle ORM |
| XSS Prevention | Input sanitization, React auto-escaping |
| Role-Based Authorization | ngo_admin vs sys_admin role checks |
| Secure Cookie Config | HTTP-only, Secure in production, SameSite |
| No Hardcoded Secrets | JWT secret from environment variable; production startup fails if JWT_SECRET is missing |
| Audit Logging | audit_log table for security events |
| Secure Error Handling | No internal details in error responses |

> **Note**: This is a defensive cybersecurity project. No offensive attack functionality, exploitation tools, or credential-stealing features are included.

---

## ⚠️ Limitations

1. **Not a replacement for professional security consulting** – This is an assessment tool, not a substitute for professional cybersecurity services
2. **Self-reported data** – Assessment accuracy depends on honest, knowledgeable responses
3. **Cost estimates are illustrative** – Actual costs vary by vendor, region, and organization size
4. **No automated scanning** – The assessment is questionnaire-based, not automated
5. **Single assessment at a time** – No support for multiple concurrent assessments per organization
6. **Limited compliance mapping** – Does not auto-map to specific regulatory frameworks (e.g., GDPR, IT Act)
7. **No real-time monitoring** – KPI values are manually updated, not auto-collected from systems

---

## 🔮 Future Enhancements

| Area | Enhancement |
|------|-------------|
| Microsoft 365 | Integration with M365 security score and settings |
| Google Workspace | Security configuration assessment |
| Cloud Security | AWS/Azure/GCP security posture integration |
| SIEM | Log aggregation and alerting |
| EDR | Endpoint detection and response integration |
| Vulnerability Scanners | Automated scan import (Nessus, OpenVAS) |
| Security Awareness | KnowBe4/Proofpoint integration for training metrics |
| Compliance Mapping | Auto-mapping to NIST, ISO 27001, CIS Controls |
| Multi-Language | Support for Hindi and other regional languages |
| Mobile App | Mobile-responsive PWA for field assessments |
| API Gateway | Rate limiting and API key management |
| Two-Factor Auth | TOTP-based 2FA for application login |

> **Note**: These are planned enhancements. No real credentials or API keys are used in the current implementation.

---

## 🎤 Presentation Guide (5-Minute EY GDS Demo)

### Minute 1: Problem Statement
- Open the **Landing Page** (/)
- Emphasize: NGOs handle sensitive data but lack security resources
- Statistics: 60% of small orgs close after a breach, 43% of attacks target small organizations

### Minute 2: Assessment & Scoring
- Log in as **ngo_admin** → Dashboard
- Show the **Security Score (16/100)** and **Risk Level (CRITICAL)**
- Explain the **Maturity Level 1 (Initial)**
- Navigate to the **Radar Chart** showing category breakdown

### Minute 3: Gap Analysis & Recommendations
- Switch to the **Gap Analysis** tab
- Show critical gaps (MFA, Backup, Training, Incident Response)
- Switch to **Recommendations** tab
- Show prioritized recommendations (MFA, Endpoint Protection, Backups first)
- Explain the prioritization formula: Risk × Impact / Effort

### Minute 4: Implementation Roadmap & Cost
- Switch to **Roadmap** tab
- Walk through the 4 phases (First 30 Days → 6-12 Months)
- Switch to **Cost** tab
- Emphasize: Most effective controls are free or very low cost (MFA, Updates, Password Managers)
- Show "Security Improvement per ₹ Spent"

### Minute 5: Presentation Mode & Report
- Open **Presentation Mode** (/presentation)
- Step through the 7 slides showing the complete flow
- Mention: Professional PDF report can be generated from the dashboard
- Conclude: "Practical, cost-effective cybersecurity improvement is achievable for any NGO"

---

## 📝 Project Information

- **Project**: CyberShield NGO
- **Purpose**: EY GDS Training Program
- **Type**: Defensive Cybersecurity Assessment Platform
- **Version**: 1.0.0
- **License**: Educational/Training Use

---

*This project is developed as part of the EY GDS training program to demonstrate practical cybersecurity improvement strategies for resource-constrained non-profit organizations. All security controls implemented are defensive in nature.*