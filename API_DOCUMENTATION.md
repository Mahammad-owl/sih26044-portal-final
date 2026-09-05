# SKILLSETU: REST API Documentation
## Problem Statement: SIH26044
**Backend Endpoints Reference & Protocol Specification**

Base URL: `http://localhost:5000/api` (In development, proxied via Vite dev server)

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 User Login
* **Method**: `POST`
* **Route**: `/api/auth/login`
* **Access**: Public
* **Purpose**: Authenticates a user (Student, Industry, Faculty, Admin) and returns a signed JWT token.
* **Input**:
  ```json
  {
    "email": "student.demo@demo.sih", // or student@demo.com
    "password": "demo123"
  }
  ```
* **Output (HTTP 200)**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr-stu-01",
      "email": "student@demo.com",
      "role": "STUDENT",
      "name": "Ananya Sharma",
      "profile": { ... }
    }
  }
  ```
* **Internal Process**: Resolves demo email aliases -> selects user from `users` table -> validates password using `bcrypt.compareSync` -> queries role-specific profile -> signs JWT with 7-day expiration.

---

### 1.2 User Registration
* **Method**: `POST`
* **Route**: `/api/auth/register`
* **Access**: Public (Students, Industry, Faculty. Admin self-registration is blocked with HTTP 403)
* **Purpose**: Registers a new real user account directly into SQLite and initializes their profile.
* **Input (Student Example)**:
  ```json
  {
    "role": "STUDENT",
    "name": "Kavita Reddy",
    "email": "kavita.reddy@nitk.edu",
    "password": "mySecurePassword123",
    "institution_name": "NIT Surathkal",
    "branch": "ECE",
    "year": "3rd Year",
    "career_goal": "VLSI Design Engineer",
    "cgpa": 8.7,
    "phone": "+91 98765 12345"
  }
  ```
* **Output (HTTP 201)**:
  ```json
  {
    "message": "Account successfully registered and profile initialized.",
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "usr-1788496894938",
      "email": "kavita.reddy@nitk.edu",
      "role": "STUDENT",
      "name": "Kavita Reddy",
      "profile": { "id": "stu-1788496894938", ... }
    }
  }
  ```
* **Internal Process**: Validates inputs -> checks email uniqueness -> hashes password with bcrypt -> executes SQLite transaction: inserts into `users`, inserts into `student_profiles`, inserts welcome notification -> signs JWT -> returns response.

---

### 1.3 Quick Demo Switcher
* **Method**: `POST`
* **Route**: `/api/auth/demo-switch`
* **Access**: Public (Judges fast evaluation)
* **Input**: `{ "role": "STUDENT" }` (or `"INDUSTRY"`, `"FACULTY"`, `"INSTITUTION_ADMIN"`)
* **Output (HTTP 200)**: Switched JWT token and active user profile.

---

### 1.4 Get Current User Profile
* **Method**: `GET`
* **Route**: `/api/auth/me`
* **Access**: Authenticated (`Bearer <token>`)
* **Output (HTTP 200)**: User identity and associated role profile.

---

### 1.5 Forgot Password (Prototype Simulation)
* **Method**: `POST`
* **Route**: `/api/auth/forgot-password`
* **Input**: `{ "email": "student@demo.com" }`
* **Output (HTTP 200)**: Prototype simulated reset confirmation with demo hint.

---

## 2. Student Endpoints (`/api/students`)

### 2.1 Student Dashboard Data
* **Method**: `GET`
* **Route**: `/api/students/dashboard`
* **Access**: Authenticated (`STUDENT` role)
* **Purpose**: Fetches real-time dashboard data including verified skills, skill-gap analysis, ranked opportunities, and applications.
* **Output (HTTP 200)**:
  ```json
  {
    "profile": { "name": "Ananya Sharma", "readiness_score": 84, "branch": "ECE", ... },
    "stats": { "readinessScore": 84, "verifiedSkillsCount": 4, "pendingSkillsCount": 1, ... },
    "skills": [ ... ],
    "verifiedSkills": [ ... ],
    "gapAnalysis": {
      "targetRole": "Embedded Systems Engineer",
      "readinessScore": 84,
      "skillGaps": [ { "skillName": "RTOS (FreeRTOS)", "gapSeverity": "HIGH", ... } ]
    },
    "recommendedOpportunities": [ ... ]
  }
  ```

---

### 2.2 Skill Gap Analysis
* **Method**: `GET`
* **Route**: `/api/students/gap-analysis?careerRoleId=...`
* **Access**: Authenticated (`STUDENT` role)
* **Purpose**: Compares student's verified skills against target industry role specifications and flags high/medium/low severity gaps.

---

### 2.3 Learning Roadmap
* **Method**: `GET`
* **Route**: `/api/students/roadmap`
* **Access**: Authenticated (`STUDENT` role)
* **Purpose**: Returns 4-week structured sprint modules designed to close flagged gaps.

---

### 2.4 Toggle Roadmap Activity
* **Method**: `PUT`
* **Route**: `/api/students/roadmap/activity/:activityId/toggle`
* **Access**: Authenticated (`STUDENT` role)
* **Purpose**: Marks a practical or theoretical roadmap milestone as completed.

---

### 2.5 Local NLP Resume Skill Extractor
* **Method**: `POST`
* **Route**: `/api/students/resume-parse`
* **Input**: `{ "text": "Embedded engineer experienced in STM32, FreeRTOS, and CAN bus..." }`
* **Output (HTTP 200)**: Extracted competencies, suggested role, and detected engineering discipline.

---

## 3. Assessments Endpoints (`/api/assessments`)

### 3.1 List Assessments
* **Method**: `GET`
* **Route**: `/api/assessments`
* **Access**: Authenticated

### 3.2 Submit Assessment & Viva Explanation
* **Method**: `POST`
* **Route**: `/api/assessments/:id/submit`
* **Access**: Authenticated (`STUDENT` role)
* **Input**:
  ```json
  {
    "answers": { "0": "B", "1": "C", "2": "A" },
    "practicalScore": 92,
    "explanationText": "Single producer single consumer queue ensures atomic pointers..."
  }
  ```
* **Output (HTTP 200)**: Computed MCQ score, practical score, verification verdict, and updated skill badge.

---

## 4. Evidence Verifications Endpoints (`/api/verifications`)

### 4.1 Submit Practical Demonstration Evidence
* **Method**: `POST`
* **Route**: `/api/verifications/submit`
* **Access**: Authenticated (`STUDENT` role)
* **Input**:
  ```json
  {
    "skill_id": "sk-rtos",
    "practical_task_title": "FreeRTOS Priority Inversion Mutex Demo",
    "submission_notes": "Implemented priority inheritance mutex in FreeRTOS on STM32",
    "explanation_text": "Task A inherits priority of Task C while holding shared SPI mutex",
    "demo_media_url": "https://github.com/ananya-sharma-ece/freertos-mutex-demo"
  }
  ```
* **Output (HTTP 200)**: Created verification audit record with status `IN_REVIEW`.

### 4.2 Faculty Review & Endorsement
* **Method**: `POST`
* **Route**: `/api/verifications/:id/review`
* **Access**: Authenticated (`FACULTY` or `ADMIN` role)
* **Input**: `{ "final_verdict": "VERIFIED", "reviewer_comments": "Code viva demonstrates clear understanding of task preemption." }`
* **Output (HTTP 200)**: Updates verification record and upgrades student's `student_skills` row to `VERIFIED`.

---

## 5. Opportunities & Matching Endpoints (`/api/opportunities`)

### 5.1 List Ranked Opportunities
* **Method**: `GET`
* **Route**: `/api/opportunities?branch=ECE&mode=HYBRID`
* **Access**: Authenticated
* **Output**: List of active opportunities enriched with transparent match score and 60-20-10-10 breakdown for the authenticated student.

### 5.2 Apply to Opportunity
* **Method**: `POST`
* **Route**: `/api/opportunities/:id/apply`
* **Access**: Authenticated (`STUDENT` role)
* **Output (HTTP 200)**:
  ```json
  {
    "message": "Application submitted successfully",
    "applicationId": "app-178849689",
    "matchScore": 89
  }
  ```

### 5.3 Create Opening (Industry Recruiter)
* **Method**: `POST`
* **Route**: `/api/opportunities`
* **Access**: Authenticated (`INDUSTRY` role)
* **Input**: Title, type, discipline, description, location, mode, duration, stipend, required skills with levels and weights.

---

## 6. Industry Portal Endpoints (`/api/industry`)

### 6.1 Industry Recruiter Dashboard
* **Method**: `GET`
* **Route**: `/api/industry/dashboard`
* **Access**: Authenticated (`INDUSTRY` role)

### 6.2 Ranked Candidates Search
* **Method**: `GET`
* **Route**: `/api/industry/candidates?opportunityId=job-1&branch=ECE`
* **Access**: Authenticated (`INDUSTRY` role)
* **Output**: Candidates ranked by calculated match score, complete with verified evidence audit trail and oral viva summaries.

### 6.3 Update Application Status
* **Method**: `PUT`
* **Route**: `/api/industry/applications/:id/status`
* **Access**: Authenticated (`INDUSTRY` role)
* **Input**: `{ "status": "SHORTLISTED", "notes": "Strong embedded C & RTOS evidence." }`

---

## 7. Academia & Faculty Endpoints (`/api/faculty`)

### 7.1 Faculty Overview Dashboard
* **Method**: `GET`
* **Route**: `/api/faculty/dashboard`
* **Access**: Authenticated (`FACULTY` role)

### 7.2 Student Cohort Roster & Gap Tracking
* **Method**: `GET`
* **Route**: `/api/faculty/students?branch=ECE`
* **Access**: Authenticated (`FACULTY` role)

### 7.3 Create Department Assessment
* **Method**: `POST`
* **Route**: `/api/faculty/assessments`
* **Access**: Authenticated (`FACULTY` role)

---

## 8. Collaboration Hub Endpoints (`/api/collaborations`)

### 8.1 List Collaboration Offers
* **Method**: `GET`
* **Route**: `/api/collaborations?discipline=ECE`
* **Access**: Authenticated

### 8.2 Create Collaboration Offer
* **Method**: `POST`
* **Route**: `/api/collaborations`
* **Access**: Authenticated (`INDUSTRY` role)

### 8.3 Update Collaboration Status / MoU Request
* **Method**: `PUT`
* **Route**: `/api/collaborations/:id/status`
* **Access**: Authenticated (`FACULTY` or `INDUSTRY` role)

---

## 9. System Health Check
* **Method**: `GET`
* **Route**: `/api/health`
* **Access**: Public
* **Output (HTTP 200)**:
  ```json
  {
    "status": "online",
    "platform": "SIH26044 Academia-Industry Collaboration Platform",
    "timestamp": "2026-09-04T05:00:00.000Z",
    "version": "1.0.0"
  }
  ```
