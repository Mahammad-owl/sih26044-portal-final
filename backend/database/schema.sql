-- SQLite Schema for SIH26044: Academia-Industry Collaboration Portal

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INDUSTRY', 'FACULTY', 'INSTITUTION_ADMIN')),
    name TEXT NOT NULL,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS institutions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    type TEXT DEFAULT 'Engineering & Technology',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    branch TEXT NOT NULL, -- ECE, CSE, EEE, Mechanical, Civil
    year TEXT NOT NULL, -- 1st Year, 2nd Year, 3rd Year, 4th Year
    institution_id TEXT,
    institution_name TEXT NOT NULL,
    career_goal TEXT NOT NULL,
    location TEXT,
    about TEXT,
    cgpa REAL DEFAULT 8.4,
    roll_no TEXT,
    readiness_score INTEGER DEFAULT 0,
    verified_skills_count INTEGER DEFAULT 0,
    pending_skills_count INTEGER DEFAULT 0,
    portfolio_slug TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

CREATE TABLE IF NOT EXISTS industry_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    industry_sector TEXT NOT NULL,
    website TEXT,
    location TEXT,
    description TEXT,
    logo TEXT,
    verified_partner INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS faculty_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    institution_id TEXT,
    institution_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- Core Technical, Tools, Frameworks, Systems, Domain
    discipline TEXT NOT NULL, -- ECE, CSE, EEE, Mechanical, Civil, Cross-Discipline
    description TEXT,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS student_skills (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    claimed_level INTEGER DEFAULT 1 CHECK (claimed_level BETWEEN 1 AND 5),
    assessment_level INTEGER DEFAULT 0 CHECK (assessment_level BETWEEN 0 AND 5),
    evidence_level INTEGER DEFAULT 0 CHECK (evidence_level BETWEEN 0 AND 5),
    verified_level INTEGER DEFAULT 0 CHECK (verified_level BETWEEN 0 AND 5),
    verification_status TEXT DEFAULT 'NOT_VERIFIED' CHECK (verification_status IN ('NOT_VERIFIED', 'IN_REVIEW', 'VERIFIED', 'REJECTED')),
    confidence_level TEXT DEFAULT 'NONE' CHECK (confidence_level IN ('NONE', 'LOW', 'MEDIUM', 'HIGH')),
    last_assessed_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, skill_id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    skill_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_mins INTEGER DEFAULT 15,
    passing_score INTEGER DEFAULT 60,
    total_questions INTEGER DEFAULT 5,
    difficulty_level TEXT DEFAULT 'Intermediate',
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    assessment_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'MCQ' CHECK (question_type IN ('MCQ', 'CODE', 'PRACTICAL')),
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
    explanation TEXT,
    code_snippet TEXT,
    points INTEGER DEFAULT 20,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    assessment_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage REAL NOT NULL,
    passed INTEGER NOT NULL,
    calculated_level INTEGER NOT NULL DEFAULT 1,
    answers_json TEXT,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT NOT NULL,
    skills_used_ids TEXT, -- JSON array or comma separated
    repo_url TEXT,
    demo_url TEXT,
    evidence_files TEXT,
    status TEXT DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'VERIFIED', 'CHANGES_REQUESTED', 'REJECTED')),
    reviewer_feedback TEXT,
    reviewed_by TEXT,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verifications (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    practical_task_title TEXT NOT NULL,
    practical_task_desc TEXT NOT NULL,
    practical_task_status TEXT DEFAULT 'SUBMITTED' CHECK (practical_task_status IN ('ASSIGNED', 'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED')),
    submission_notes TEXT,
    explanation_text TEXT,
    modification_task_response TEXT,
    demo_media_url TEXT,
    snapshot_data TEXT,
    assessment_score REAL DEFAULT 0,
    project_evidence_score REAL DEFAULT 0,
    practical_score REAL DEFAULT 0,
    consistency_rating TEXT DEFAULT 'MEDIUM' CHECK (consistency_rating IN ('LOW', 'MEDIUM', 'HIGH')),
    final_verdict TEXT DEFAULT 'PENDING' CHECK (final_verdict IN ('PENDING', 'VERIFIED', 'NEEDS_REVIEW', 'REJECTED')),
    recommended_level INTEGER DEFAULT 3,
    reviewer_id TEXT,
    reviewer_name TEXT,
    reviewer_comments TEXT,
    verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS career_roles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    discipline TEXT NOT NULL,
    description TEXT,
    min_experience_months INTEGER DEFAULT 0,
    average_salary_range TEXT
);

CREATE TABLE IF NOT EXISTS career_skill_requirements (
    id TEXT PRIMARY KEY,
    career_role_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    required_level INTEGER NOT NULL CHECK (required_level BETWEEN 1 AND 5),
    importance_weight INTEGER DEFAULT 3 CHECK (importance_weight BETWEEN 1 AND 5),
    is_mandatory INTEGER DEFAULT 1,
    FOREIGN KEY (career_role_id) REFERENCES career_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS opportunities (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'PROJECT', 'APPRENTICESHIP')),
    branch TEXT NOT NULL, -- ECE, CSE, EEE, Mechanical, Civil, ALL
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('REMOTE', 'HYBRID', 'ON_SITE')),
    duration TEXT,
    stipend TEXT,
    deadline DATETIME,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES industry_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS opportunity_skills (
    id TEXT PRIMARY KEY,
    opportunity_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    min_level INTEGER NOT NULL DEFAULT 3 CHECK (min_level BETWEEN 1 AND 5),
    weight REAL DEFAULT 1.0,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    opportunity_id TEXT NOT NULL,
    resume_summary TEXT,
    cover_letter TEXT,
    match_score INTEGER NOT NULL DEFAULT 0,
    match_breakdown_json TEXT,
    status TEXT DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED')),
    notes TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, opportunity_id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_paths (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    career_role_id TEXT NOT NULL,
    title TEXT NOT NULL,
    target_readiness INTEGER DEFAULT 95,
    current_readiness INTEGER DEFAULT 65,
    total_modules INTEGER DEFAULT 5,
    completed_modules INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (career_role_id) REFERENCES career_roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_activities (
    id TEXT PRIMARY KEY,
    learning_path_id TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skill_id TEXT,
    skill_name TEXT NOT NULL,
    activity_type TEXT DEFAULT 'THEORY' CHECK (activity_type IN ('THEORY', 'PRACTICAL', 'PROJECT', 'ASSESSMENT')),
    resource_url TEXT,
    estimated_hours INTEGER DEFAULT 6,
    is_completed INTEGER DEFAULT 0,
    completed_at DATETIME,
    FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collaborations (
    id TEXT PRIMARY KEY,
    industry_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('WORKSHOP', 'GUEST_LECTURE', 'MENTORSHIP', 'LIVE_PROJECT', 'RESEARCH', 'FDP', 'INTERNSHIP_PROGRAM')),
    discipline TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT,
    expected_outcomes TEXT,
    status TEXT DEFAULT 'PROPOSED' CHECK (status IN ('PROPOSED', 'REQUESTED', 'ACCEPTED', 'ACTIVE', 'COMPLETED')),
    faculty_id TEXT,
    faculty_name TEXT,
    institution_id TEXT,
    institution_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (industry_id) REFERENCES industry_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certifications (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    verified INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'SYSTEM' CHECK (type IN ('ASSESSMENT', 'VERIFICATION', 'APPLICATION', 'OPPORTUNITY', 'COLLABORATION', 'SYSTEM')),
    link TEXT,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
