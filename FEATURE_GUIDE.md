# SKILLSETU: Comprehensive Feature Guide
## Problem Statement: SIH26044
**Detailed Functional Audit & Implementation Verification Manual**

Every major capability is documented below with its exact technical execution path across Frontend, Backend, and SQLite Database.

---

## 1. User Registration
* **Status**: `[IMPLEMENTED]` (Real Database Persistence)
* **What the User Sees**: Modal dialog with role switcher (Student, Industry, Faculty). For students, prompts for Name, Email, Password, Institution, Branch, Academic Year, and Career Goal. For industry, prompts for Company Name, Sector, Website, and Location.
* **What It Actually Does**: Creates an authenticated user in the database, generates an initial role-specific profile row, salts and hashes the password, and immediately logs the user into their fresh portal dashboard.
* **Frontend Action**: Submits form data via `api.register()`, sets JWT in `localStorage`, and triggers the new student onboarding wizard.
* **Backend Action**: `POST /api/auth/register` validates input, hashes password with `bcryptjs` (10 salt rounds), starts an atomic transaction, and executes inserts.
* **Database Tables**: `users`, `student_profiles` (or `industry_profiles` / `faculty_profiles`), `notifications`.
* **Data Used**: Real user-supplied input.
* **Limitations**: Email verification via SMTP OTP is simulated for prototype ease-of-demonstration; production will hook an institutional SMTP gateway.

---

## 2. User Login & Demo Switcher
* **Status**: `[IMPLEMENTED]` (Dual Mode: Real Credentials + 1-Click Demo)
* **What the User Sees**: Email and password input with 1-click quick-fill buttons for Student, Industry, Faculty, and Admin demo identities. Also available via the top demo switcher bar.
* **What It Actually Does**: Authenticates credentials against bcrypt hashes in SQLite, issues a signed JWT token, and loads role-appropriate navigation.
* **Frontend Action**: Calls `api.login()`, records session in `AppContext`, updates active tabs.
* **Backend Action**: `POST /api/auth/login` checks email aliases (supporting both `@demo.sih` and `@demo.com`) and verifies password.
* **Database Tables**: `users`, `student_profiles`, `industry_profiles`, `faculty_profiles`.
* **Data Used**: Stored bcrypt hashes and profile records.

---

## 3. Student Dashboard
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Overall Skill Readiness Index gauge (e.g. 84%), counts of verified vs partial skills, flagged critical skill gaps, active internship applications, and quick shortcuts.
* **What It Actually Does**: Aggregates verified competencies, computes career readiness, and highlights immediate action items (e.g., FreeRTOS sprint).
* **Frontend Action**: Computes metrics from `currentStudent` state and renders `StudentDashboard.tsx`.
* **Backend Action**: `GET /api/students/dashboard` computes live summaries from SQLite.
* **Database Tables**: `student_profiles`, `student_skills`, `skills`, `applications`, `verifications`.

---

## 4. Student Academic Profile & Verified Credentials
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Academic background (NIT Trichy, CGPA 8.85), contact info, GitHub/LinkedIn links, verified skills list with level badges (1-5), and faculty-signed projects.
* **What It Actually Does**: Displays the student's technical record, distinguishing claimed skills from verified competencies.
* **Frontend Action**: `StudentProfile.tsx` renders profile metadata and verified projects.
* **Backend Action**: `GET /api/students/profile`.
* **Database Tables**: `student_profiles`, `student_skills`, `projects`, `certifications`.

---

## 5. Evidence-Based Skill Verification Engine
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: A 7-stage anti-fraud verification audit trail (Claim -> MCQ -> Repository Evidence -> Practical Task -> Viva Explanation -> Consistency Rating -> Faculty Endorsement).
* **What It Actually Does**: Eliminates fake claims by verifying live code logic and comparing score consistency between theoretical MCQs and code explanations.
* **Frontend Action**: `SkillVerificationEngine.tsx` displays the multi-factor evidence cards and audit logs.
* **Backend Action**: `POST /api/verifications/submit` and `POST /api/verifications/:id/review`.
* **Database Tables**: `verifications`, `student_skills`, `assessment_attempts`.

---

## 6. Skill Assessment Module
* **Status**: `[IMPLEMENTED]` (Interactive MCQ, Code Modification & Viva)
* **What the User Sees**: Timed technical assessment (e.g., FreeRTOS Real-Time Kernel) with deterministic questions, code snippets, practical code tasks, and architectural explanation input.
* **What It Actually Does**: Scores the student's submission, evaluates consistency, triggers celebratory confetti on passing, and automatically upgrades the verified skill profile in the database.
* **Frontend Action**: `SkillAssessment.tsx` tracks answers, calculates percentages, and calls `recordAssessmentResult()`.
* **Backend Action**: `POST /api/assessments/:id/submit` saves the attempt into `assessment_attempts` and updates `student_skills`.
* **Database Tables**: `assessments`, `questions`, `assessment_attempts`, `student_skills`.

---

## 7. Skill-Gap Analysis Engine
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Benchmark comparison between student verified skills and target industry role requirements. Displays Ready Competencies (green) and High Severity Gaps (rose) with estimated closure times.
* **What It Actually Does**: Analyzes mandatory vs optional skills, computes level deficits, and attaches curated free learning resources.
* **Frontend Action**: `SkillGapAnalysis.tsx` renders benchmark progress bars and recommended sprints.
* **Backend Action**: `services/skillGapEngine.js` performs algorithmic comparison.
* **Database Tables**: `career_roles`, `career_skill_requirements`, `student_skills`.

---

## 8. Free Reputable Learning Resources & Roadmaps
* **Status**: `[IMPLEMENTED]` (Connected directly to Skill Gaps)
* **What the User Sees**: Curated learning cards from reputable national and open-source providers: **NPTEL**, **SWAYAM**, **Official Documentation (MDN, FreeRTOS)**, **Microsoft Learn**, and **Cisco**. Clearly specifies that learning access is **100% Free** while noting optional proctored exam fees ($\approx ₹1,000$).
* **What It Actually Does**: Provides actionable self-study links directly connected to flagged gaps, leading into practical mini-projects.
* **Frontend Action**: Displays provider badges, course durations, official URLs, and 4-week roadmaps.
* **Data Used**: Curated seed dataset aligned with IIT/NPTEL curricula.

---

## 9. Personalized 4-Week Learning Roadmap
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Interactive sprint timeline (Week 1: Fundamentals, Week 2: RTOS Tasks & Queues, Week 3: Telemetry, Week 4: Automotive Integration).
* **What It Actually Does**: Tracks weekly milestone tasks and code verification checks, advancing the student toward verified readiness.
* **Frontend Action**: `LearningRoadmap.tsx` lets users mark completed weeks and watch their readiness index climb.
* **Backend Action**: `PUT /api/students/roadmap/activity/:id/toggle`.
* **Database Tables**: `learning_paths`, `learning_activities`.

---

## 10. Explainable 60-20-10-10 Internship Matching
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Ranked industry openings (e.g. Bosch Embedded IoT Firmware Intern) with a transparent match badge (e.g., 89%) and a "Why 89% Match?" modal breaking down the exact points:
  * 60% Skill Match
  * 20% Assessment Consistency
  * 10% Verified Projects
  * 10% University Coursework
* **What It Actually Does**: Replaces black-box algorithms with an auditable mathematical calculation.
* **Frontend Action**: `calculateMatch()` in `AppContext.tsx` evaluates open jobs against verified competencies.
* **Backend Action**: `services/matchingEngine.js` computes matching index.
* **Database Tables**: `opportunities`, `opportunity_skills`, `student_skills`.

---

## 11. 1-Click Application Workflow
* **Status**: `[IMPLEMENTED]` (Full Persistence & Status History)
* **What the User Sees**: "Apply Now" button that instantly submits the verified profile, turns into "Applied / Shortlisted" badge, and generates a notification.
* **What It Actually Does**: Inserts an application record into SQLite and increments the recruiter's applicant counter.
* **Frontend Action**: `applyToJob(jobId)` triggers API call and updates student's active applications list.
* **Backend Action**: `POST /api/opportunities/:id/apply`.
* **Database Tables**: `applications`, `opportunities`, `notifications`.

---

## 12. Industry Recruiter Portal & Candidate Pipeline
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Recruiter dashboard for Bosch Talent Gateway with active job openings, applicant counts, and a ranked candidate pipeline where Ananya is top-ranked (89% match).
* **What It Actually Does**: Allows recruiters to inspect verified hardware evidence, audit applicant viva explanations, and update application status (Shortlisted, Interview Scheduled, Selected).
* **Frontend Action**: `CandidateMatching.tsx` and `IndustryDashboard.tsx`.
* **Backend Action**: `GET /api/industry/candidates` and `PUT /api/industry/applications/:id/status`.
* **Database Tables**: `industry_profiles`, `opportunities`, `applications`, `verifications`.

---

## 13. Create Job / Internship Opening
* **Status**: `[IMPLEMENTED]` (Database Backed)
* **What the User Sees**: Comprehensive modal form to create technical openings with title, discipline, location, mode (Remote/Hybrid/On-site), duration, stipend, and weighted skill requirements.
* **What It Actually Does**: Persists the new opening into `opportunities` and `opportunity_skills` in SQLite; immediately visible to students.
* **Frontend Action**: `CreateJobModal.tsx` calls `addNewJob()`.
* **Backend Action**: `POST /api/opportunities`.
* **Database Tables**: `opportunities`, `opportunity_skills`.

---

## 14. Faculty & Academia Portal
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Department overview for ECE (NIT Trichy) showing 320 enrolled students, 84% average readiness, and department-wide skill gap flags (38% RTOS deficiency).
* **What It Actually Does**: Gives academic leadership real-time visibility into student employability before campus placement season.
* **Frontend Action**: `AcademiaDashboard.tsx` and `StudentGapTracker.tsx`.
* **Backend Action**: `GET /api/faculty/dashboard` and `GET /api/faculty/students`.
* **Database Tables**: `faculty_profiles`, `student_profiles`, `student_skills`.

---

## 15. Academia-Industry Collaboration Hub & MoUs
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Active marketplace of industry collaboration offers (e.g. Bosch sponsored STM32 CAN-FD Lab Kits, Qualcomm 5G FDP, Ather BMS Workshop).
* **What It Actually Does**: Allows academic institutions to request sponsored lab equipment, and lets industry accept MoUs.
* **Frontend Action**: `CollaborationHub.tsx` and `IndustryCollaborationOffers.tsx`.
* **Backend Action**: `POST /api/collaborations` and `PUT /api/collaborations/:id/status`.
* **Database Tables**: `collaborations`, `notifications`.

---

## 16. Institutional Admin Analytics Dashboard
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Institute-wide analytics (NIT Trichy) tracking 1,480 students across 5 core engineering disciplines (ECE, CSE, EEE, Mechanical, Civil), branch-specific skill demand trends, and core placement conversion rates (+17%).
* **What It Actually Does**: Gives Deans and Directors data-driven evidence to adjust elective courses and lab investments.
* **Frontend Action**: `InstitutionAdminDashboard.tsx`.
* **Backend Action**: `GET /api/admin/analytics`.
* **Database Tables**: `institutions`, `student_profiles`, `applications`.

---

## 17. Digital Public Portfolio
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Clean, recruiter-friendly portfolio view with verified skill badges, practical project demonstrations, assessment scores, and readiness indices.
* **What It Actually Does**: Generates a shareable, tamper-evident profile view suitable for sending directly to recruiters.
* **Frontend Action**: `DigitalPortfolio.tsx`.
* **Database Tables**: `student_profiles`, `student_skills`, `projects`.

---

## 18. Local NLP Resume Skill Extractor
* **Status**: `[SIMULATED - LOCAL NLP HEURISTICS]`
* **What the User Sees**: Text area to paste resume text; instantly parses and tags technical skills across ECE, CSE, EEE, Mechanical, and Civil disciplines with confidence scores.
* **What It Actually Does**: Uses deterministic regular expressions and keyword taxonomies without calling external cloud AI services.
* **Frontend Action**: `AIResumeParserModal.tsx`.
* **Backend Action**: `services/resumeParser.js`.

---

## 19. In-App Notifications
* **Status**: `[IMPLEMENTED]`
* **What the User Sees**: Notification bell in the header with unread badge counter and dropdown showing real events (Assessments passed, applications submitted, MoUs approved).
* **What It Actually Does**: Tracks notifications in central state with mark-as-read and clear-all capabilities.
* **Database Tables**: `notifications`.
