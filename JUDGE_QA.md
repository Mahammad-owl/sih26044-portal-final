# SKILLSETU: Judge Q&A Technical Defense Handbook
## Problem Statement: SIH26044
**37 Exhaustive Questions & Verified Technical Answers for Hackathon Judges**

---

### 1. What is unique about your solution?
**Answer**: Unlike job boards that act merely as passive resume repositories, SKILLSETU establishes an active, closed-loop feedback ecosystem:
$$\text{Industry Demand} \longrightarrow \text{Evidence Verification} \longrightarrow \text{Skill Gap} \longrightarrow \text{Free Sprints} \longrightarrow \text{Re-Assessment} \longrightarrow \text{Matching}$$
We provide **deterministic evidence verification** (practical code modifications + oral viva explanations) and a **transparent 60-20-10-10 explainable match index**.

### 2. What problem are you solving?
**Answer**: The severe gap between academic curricula and industry engineering requirements in India. Resumes are filled with unverified self-declarations, college placement cells are blind to cohort-wide skill gaps until interviews fail, and students lack structured, free pathways to close those gaps early.

### 3. Why is this better than a normal job portal?
**Answer**: Standard portals (Naukri, LinkedIn) bypass academia completely, provide zero verification of claimed technical skills, use opaque "black-box" match scores, and push expensive commercial courses when candidates are rejected. SKILLSETU engages faculty mentors, audits practical code evidence, provides fully explainable match scores, and curates free national learning resources (NPTEL/SWAYAM).

### 4. How do you prevent fake or self-declared skills?
**Answer**: By treating self-declaration as merely the first step of a 7-stage verification engine. A skill is only upgraded to `VERIFIED` when the student passes a timed MCQ assessment, completes a practical code modification task, and submits an architectural explanation viva. A consistency check verifies that the MCQ score and code explanation score align within a 15% variance threshold.

### 5. How does skill verification work internally?
**Answer**: When an assessment is submitted, `backend/routes/assessments.js` scores the MCQs, evaluates the practical code response, and records an attempt in `assessment_attempts`. If the score exceeds the passing threshold ($\ge 60\%$), `backend/routes/verifications.js` creates a verification record, calculates a consistency rating, and sets `student_skills.verification_status = 'VERIFIED'` and `verified_level = 4`.

### 6. How does skill-gap analysis work?
**Answer**: The engine compares the student's verified skills against the required competencies of a target industry role (e.g. *Embedded Systems Engineer*). For each required skill, if the student's level is below the required level:
* If the skill is mandatory ($\text{isMustHave} = 1$), it is flagged as a **HIGH SEVERITY GAP**.
* If optional, it is flagged as a **MEDIUM SEVERITY GAP**.
The gap engine then calculates the estimated closure time and attaches a 4-week learning sprint.

### 7. How does the matching engine work?
**Answer**: It uses a transparent formula with 4 auditable components:
* **60% Verified Skills**: Weighted ratio of verified competencies against job requirements.
* **20% Assessment Performance**: Average percentage scored across deterministic technical tests.
* **10% Project Evidence**: Verified practical repositories or hardware demonstrations signed by faculty.
* **10% Coursework & Certifications**: Validated university modules and accredited NPTEL certifications.

### 8. Why do you use this matching approach instead of machine learning embeddings?
**Answer**: For high-stakes hiring, recruiters and universities require **explainability and auditability**. If a student is rejected or ranked lower, they must see the exact mathematical deficit (e.g., missing RTOS priority inversion knowledge). Black-box embeddings cannot be audited for fairness or bias.

### 9. How does the database work?
**Answer**: It uses SQLite 3 with the high-performance native `better-sqlite3` driver. It features 22 relational tables with foreign key cascades, unique constraints, and atomic transactions for data integrity.

### 10. Why SQLite for this prototype?
**Answer**: SQLite requires zero cloud configuration, zero external service installation, and runs with sub-millisecond query latency on a student laptop. It guarantees that the prototype works immediately without dependency on internet connectivity or cloud database credentials.

### 11. How would you scale the database to production?
**Answer**: Because the database schema is strictly ANSI SQL-compliant with standard foreign keys, migrating to PostgreSQL or AWS Aurora requires only switching the database connection client from `better-sqlite3` to `pg` or an ORM like Prisma/Drizzle. Zero table restructuring is needed.

### 12. How does authentication work?
**Answer**: Stateless JSON Web Tokens (JWT) signed with a secret key and set to expire in 7 days. Passwords are salted and hashed using `bcryptjs` with 10 salt rounds. On login, the backend verifies the hash and returns the token and role profile.

### 13. How does role-based access control (RBAC) work?
**Answer**: Express middleware (`requireRole(['STUDENT', ...])`) verifies the JWT payload and confirms that the user's role matches the requested route. Frontend navigation guards render only role-appropriate tabs.

### 14. How does student registration work?
**Answer**: In the AuthModal, the student fills in name, email, password, institution, branch, academic year, and career goal. The endpoint `POST /api/auth/register` hashes the password, inserts into `users`, inserts into `student_profiles`, and creates a welcome notification in an atomic transaction.

### 15. What happens after registration?
**Answer**: The user is immediately authenticated, their JWT is stored in `localStorage`, and the Student Onboarding Wizard launches, guiding them through confirming their career goal, declaring baseline skills, and taking a diagnostic check.

### 16. How does industry create an opportunity?
**Answer**: A recruiter in the Industry Portal opens the "Post Job / Internship" modal, enters title, branch, location, mode (remote/hybrid/on-site), duration, stipend, and specifies required skills with weights and minimum levels. This is saved to `opportunities` and `opportunity_skills` via `POST /api/opportunities`.

### 17. How does academia participate?
**Answer**: Faculty mentors log in to monitor department-wide readiness, track cohort skill gaps before campus placements, assign department assessments, review submitted practical evidence, and approve industry MoUs.

### 18. How does industry communicate skill requirements?
**Answer**: Through two channels:
1. Formally in job postings with weighted skill requirements.
2. Direct institutional collaboration offers (e.g. sponsored lab kits, guest lectures) posted in the Collaboration Hub.

### 19. How are learning resources recommended?
**Answer**: The Skill-Gap Engine maps flagged skill gaps directly to curated high-quality courses from reputable providers (NPTEL, SWAYAM, MDN, Microsoft Learn, Cisco) based on the skill taxonomy and engineering discipline.

### 20. Why NPTEL and SWAYAM?
**Answer**: NPTEL and SWAYAM are official Ministry of Education / IIT initiatives providing rigorous, university-accredited courses designed specifically for Indian engineering curricula. They eliminate financial barriers for students.

### 21. Are the learning resources free?
**Answer**: Yes. Course video access, reading materials, and practice assignments on NPTEL and SWAYAM are **100% free of charge**. Official documentation (MDN, FreeRTOS) and Microsoft Learn sandboxes are also completely free.

### 22. How do you distinguish free learning from paid certification?
**Answer**: We clearly state on each resource card:
* Learning Content: **100% Free Access**.
* Examination Note: Taking the optional proctored national examination for official university credit transfer costs a nominal government fee ($\approx ₹1,000$). We never claim that all certificates are free.

### 23. Is AI used in this platform?
**Answer**: We use deterministic local NLP heuristics for resume skill parsing and structured rule-based engines for skill-gap and matching calculations. We deliberately avoid cloud AI APIs for core functions.

### 24. Why did you avoid unnecessary generative AI?
**Answer**: Generative AI models hallucinate, incur per-token API costs, suffer from network downtime, and cannot provide legally auditable hiring justifications. Hiring decisions must be based on proven empirical evidence, not probabilistic text prediction.

### 25. What happens if a student has a skill gap?
**Answer**: The student is not rejected. Their dashboard flags the gap with a severity level, explains why it matters to employers, recommends free NPTEL/SWAYAM modules, and generates a structured 4-week sprint roadmap.

### 26. How does the platform help close the gap?
**Answer**: By structuring learning into 4 phases: Theory & Documentation $\to$ Practical Sandbox Task $\to$ Hardware/Code Demonstration $\to$ Timed Re-Assessment.

### 27. How do you verify that the student actually improved?
**Answer**: The student retakes the technical assessment and submits a new practical code task. When the passing score is achieved, the skill status transitions to `VERIFIED` and the readiness score automatically recalculates.

### 28. How does application tracking work?
**Answer**: Applications are stored in the `applications` table with states: `APPLIED` $\to$ `UNDER_REVIEW` $\to$ `SHORTLISTED` $\to$ `INTERVIEW` $\to$ `SELECTED` (or `REJECTED`). Students see live status badges, and recruiters can update statuses with interview notes.

### 29. How would this integrate with real colleges?
**Answer**: Colleges can integrate via standard LTI (Learning Tools Interoperability) or REST APIs with existing ERP systems (e.g. ERPNext, Koha, or custom campus portals) to sync student roll numbers and verified coursework.

### 30. How would this integrate with real companies?
**Answer**: Companies can integrate through ATS (Applicant Tracking System) webhooks (e.g. Workday, Greenhouse) to automatically export ranked candidate profiles and import hiring requirements.

### 31. What is genuinely implemented in this prototype?
**Answer**:
* SQLite database with 22 relational tables.
* Express REST API backend with JWT auth and bcrypt hashing.
* Real user registration for Students, Industry, and Faculty.
* Preloaded demo accounts with 1-click access.
* 60-20-10-10 explainable matching engine.
* Interactive skill assessments with scoring and confetti.
* Anti-fraud verification engine with viva explanation.
* Skill-gap engine connecting gaps to free NPTEL/SWAYAM resources.
* Opportunity creation, application submission, and status updates.
* Multi-discipline support across ECE, CSE, EEE, Mechanical, and Civil.

### 32. What is currently simulated?
**Answer**:
* Email OTP delivery is simulated locally for offline evaluation.
* Video demonstration uploads are represented via repository URLs and static demo media rather than streaming cloud video infrastructure.

### 33. What would you change for production?
**Answer**:
* Migrate SQLite to PostgreSQL with read replicas.
* Connect AWS S3 for media storage.
* Integrate National Academic Depository (NAD) / Digilocker APIs for automated academic record verification.
* Add WebRTC for live browser-based faculty viva interviews.

### 34. How is user data protected?
**Answer**: Passwords are never stored in plaintext (salted bcrypt with 10 rounds). API endpoints require valid JWT headers. Roles are strictly enforced at the database query layer.

### 35. How would you prevent fake certificates or repository links?
**Answer**: The platform requires a **code modification task** where the student must modify their submitted code in real time and explain the change in an oral/written viva. Even if a certificate is fake, the student cannot pass the live verification check without genuine comprehension.

### 36. How would you scale to hundreds of thousands of users?
**Answer**:
* Stateless Express backend deployed as containerized microservices behind a load balancer (NGINX/AWS ALB).
* Redis caching for frequent skill catalog queries.
* PostgreSQL with connection pooling.
* Static assets served via CDN (Cloudflare).

### 37. What are the key limitations of the current prototype?
**Answer**:
* Single-server deployment without distributed caching.
* The assessment question bank has a curated sample of 5-10 questions per discipline rather than an exhaustive bank of thousands.
* Hardware demonstrations rely on uploaded video/photos and faculty review rather than direct automated hardware-in-the-loop testing.
