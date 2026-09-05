# SKILLSETU (SIH-2026 Problem Statement SIH26044)

> **National Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement**
> 
> *A unified, lightweight, offline-ready, evidence-based platform connecting **Students ↔ Academia ↔ Industry** across all engineering disciplines.*

---

## 🌟 Executive Summary

**SKILLSETU** resolves the fundamental disconnect between academic curricula and rapidly evolving industry competencies. Unlike superficial job boards or legacy placement portals, SKILLSETU provides:

1. **Evidence-Based Skill Verification**: A 7-stage empirical verification engine (practical tasks, code modifications, explanation vivas, and hardware evidence) that eliminates unverified resume inflation without false AI detector claims.
2. **Transparent 60-20-10-10 Match Engine**: Fully explainable matching index based on verified competencies (60%), assessment consistency (20%), project evidence (10%), and academic coursework (10%).
3. **Automated Skill Gap Analysis & Roadmaps**: Real-time comparison of student capabilities against hiring benchmarks, generating actionable 4-week learning sprints.
4. **Institutional Macro Analytics**: Department-level gap heatmaps enabling colleges to identify cohort deficiencies and trigger targeted industry collaborations.
5. **Multi-Discipline Support**: Native support across **ECE**, **CSE**, **EEE**, **Mechanical**, and **Civil** engineering disciplines.

---

## 🚀 3-Minute Judge Demo Presentation Flow

Follow this exact walkthrough during the demonstration:

| Step | Portal View | Presentation Action & Key Highlight |
|---|---|---|
| **1** | **Landing Page** | Overview of the 3-way bridge (Students ↔ Industry ↔ Academia). Multi-branch coverage (ECE, CSE, EEE, Mech, Civil). |
| **2** | **Student Portal (Hero)** | Log in as **Ananya Sharma (ECE, 3rd Year)**. Review 84% Skill Readiness Score and target goal: *Embedded Systems Engineer*. |
| **3** | **Evidence Verification** | Open **Evidence-Based Verification Engine**. Inspect the 7-step audit trail (Claim → MCQ → Project Evidence → Practical Demonstration → Viva Explanation → Code Modification → Consistency Check). |
| **4** | **Skill Gap Analysis** | View target role gap: *Embedded C* & *Microcontrollers* are verified, but *RTOS (FreeRTOS)* is flagged as a **HIGH SEVERITY GAP**. |
| **5** | **Learning Roadmap** | Open the personalized 4-week roadmap bridging FreeRTOS task scheduling, inter-task IPC queues, and automotive telemetry. |
| **6** | **Skill Assessment** | Take the interactive **FreeRTOS Real-Time Kernel** assessment. Answer MCQs, submit code modification & viva explanation, and observe real-time verified badge upgrade with celebration! |
| **7** | **Internship Matching** | View ranked opportunities. Click **Bosch Embedded IoT Firmware Intern** to see the transparent **WHY 89% MATCH?** breakdown. Click *Instant Apply*. |
| **8** | **Industry Portal (Bosch)** | Switch to Industry Recruiter view. Inspect the candidate pipeline where Ananya is ranked #1 with verified hardware evidence. |
| **9** | **Institute Analytics** | Switch to Admin Dashboard. Observe that **38% of ECE students** exhibit this exact RTOS gap despite **88% industry demand**. |
| **10** | **Collaboration Hub** | Finish in the Academia-Industry Marketplace. Discover Bosch's sponsored STM32 CAN-FD lab kits and approve institutional request. |

---

## 🔑 Demo Accounts (Instant 1-Click Access or Manual Sign-In)

Use the top demo switcher bar or log in with credentials (password for all demo accounts: `demo123`):

* **Student Role**: `student.demo@demo.sih` / `student@demo.com` *(Ananya Sharma - ECE Embedded Firmware Hero)*
* **Industry Role**: `industry.demo@demo.sih` / `industry@demo.com` *(Bosch Engineering & Mobility Solutions)*
* **Faculty / Academia**: `academia.demo@demo.sih` / `faculty@demo.com` *(Dr. K. S. Ramanathan - Head of Dept, ECE)*
* **Institution Admin**: `admin.demo@demo.sih` / `admin@demo.com` *(NIT Dean of Industry Relations & Placements)*

> **New Account Registration**: The portal also features a real registration flow (`POST /api/auth/register`) for Students, Industry partners, and Academia, with data stored persistently in the SQLite database.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Canvas Confetti.
* **Backend**: Node.js, Express.js REST API with JWT authentication and bcrypt password hashing.
* **Database**: SQLite 3 (`better-sqlite3`) with 22 normalized relational tables at `database/sih_portal.sqlite`.
* **Build System**: Vite 6 (ultra-fast HMR, sub-460KB production bundle) with `/api` reverse proxy.
* **Zero Paid Dependencies**: 100% self-contained, requiring zero external API keys or cloud subscriptions.

---

## 💻 How to Run Locally

### 1. Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### 2. Quick Launch (Two Terminals)

**Terminal 1 — Backend Server (Port 5000):**
```bash
npm run server
```

**Terminal 2 — Frontend Development Server (Port 5173):**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Reset / Seed Database (Optional)
```bash
npm run seed
```

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 📚 Complete Project Documentation Index

For exhaustive technical handovers, refer to the documentation files in the repository:

1. **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**: High-level overview, problem solved, stakeholder breakdown, technology stack, and folder structure.
2. **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)**: System architecture, RBAC matrix, 60-20-10-10 matching algorithm formula, 7-stage verification engine, and sequence diagrams.
3. **[DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)**: Detailed SQLite schema for all 22 tables, ER diagram, foreign key relationships, and query flows.
4. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**: Complete REST API specification for all auth, student, assessment, verification, opportunity, and collaboration endpoints.
5. **[FEATURE_GUIDE.md](./FEATURE_GUIDE.md)**: Comprehensive feature-by-feature audit with honest implementation statuses (`[IMPLEMENTED]`, `[SIMULATED]`).
6. **[DEMO_GUIDE.md](./DEMO_GUIDE.md)**: 5–10 minute step-by-step judge demonstration script and technical deep-dive defense.
7. **[JUDGE_QA.md](./JUDGE_QA.md)**: 37 critical technical and problem statement questions answered with complete fidelity.
8. **[SETUP_AND_RUN.md](./SETUP_AND_RUN.md)**: Beginner-friendly zero-to-hero local installation, execution, and troubleshooting guide.
9. **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)**: Itemized readiness checklist of all features and architectural layers.
10. **[JUDGE_EXPLANATION.md](./JUDGE_EXPLANATION.md)**: Conversational 3-minute verbal presentation speech for hackathon judges.
