export type UserRole = 'student' | 'industry' | 'faculty' | 'admin';

export type Discipline = 'ECE' | 'CSE' | 'EEE' | 'Mechanical' | 'Civil';

export type VerificationStatus = 'VERIFIED' | 'NEEDS REVIEW' | 'NOT VERIFIED';

export type VerificationConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface VerifiedSkill {
  id: string;
  name: string;
  category: string;
  branch: Discipline;
  selfDeclaredLevel: number; // 1-5
  verifiedLevel: number; // 1-5
  status: VerificationStatus;
  confidence: VerificationConfidence;
  assessmentScore: number; // 0-100
  projectEvidence: {
    projectName: string;
    description: string;
    verified: boolean;
    repoUrl?: string;
  };
  practicalTaskScore: number; // 0-100
  explanationScore: number; // 0-100
  consistencyScore: number; // 0-100
  lastVerifiedDate: string;
  badgeId?: string;
}

export interface SkillGap {
  id: string;
  skillName: string;
  branch: Discipline;
  category: string;
  targetLevel: number; // 1-5
  currentLevel: number; // 1-5
  gapSeverity: 'HIGH' | 'MEDIUM' | 'LOW';
  impactOnTargetRole: string;
  recommendedAction: string;
  learningTimeEstWeeks: number;
  resources: {
    title: string;
    type: 'Course' | 'Project' | 'Documentation' | 'Workshop';
    provider: string;
    duration: string;
    url?: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  branch: Discipline;
  category: string;
  description: string;
  techStack: string[];
  role: string;
  evidenceType: 'GitHub Code' | 'Hardware Demo Video' | 'Simulation Model' | 'Cad Schematic' | 'Live Deployment';
  evidenceUrl?: string;
  verifiedByFaculty: boolean;
  facultyMentor?: string;
  verificationConfidence: VerificationConfidence;
  skillsDemonstrated: string[];
  date: string;
  metrics?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  skills: string[];
  verified: boolean;
  credentialId: string;
}

export interface Achievement {
  id: string;
  title: string;
  event: string;
  date: string;
  description: string;
  badgeType: 'Hackathon' | 'Paper Publication' | 'Patent' | 'Design Challenge';
}

export interface Application {
  id: string;
  internshipId: string;
  roleTitle: string;
  companyName: string;
  appliedDate: string;
  matchScore: number;
  status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Under Review';
  feedback?: string;
}

export interface RoadmapWeek {
  week: number;
  phaseTitle: string;
  focusSkill: string;
  status: 'Completed' | 'In-Progress' | 'Upcoming';
  learningObjective: string;
  keyTopics: string[];
  practicalTask: string;
  milestoneProject: string;
  verificationCheck: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  branch: Discipline;
  year: number; // 1-4
  college: string;
  cgpa: number;
  careerGoal: string;
  bio: string;
  phone: string;
  github?: string;
  linkedin?: string;
  readinessScore: number; // 0-100
  verifiedSkills: VerifiedSkill[];
  skillGaps: SkillGap[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  roadmap: RoadmapWeek[];
  applications: Application[];
  resumeText?: string;
  fraudRiskFlag: boolean;
  consistencyNotes?: string;
}

export interface JobRequiredSkill {
  name: string;
  minLevel: number; // 1-5
  weight: number; // percentage, sum = 100
  isMustHave: boolean;
}

export interface JobOpening {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  role: string;
  discipline: Discipline[];
  type: 'Internship' | 'Full-Time' | 'Co-Op' | 'Apprenticeship';
  location: string;
  mode: 'On-site' | 'Hybrid' | 'Remote';
  duration: string;
  stipend: string;
  postedDate: string;
  deadline: string;
  openings: number;
  applicantsCount: number;
  shortlistedCount: number;
  description: string;
  responsibilities: string[];
  requiredSkills: JobRequiredSkill[];
  status: 'Active' | 'Closing Soon' | 'Closed';
}

export interface MatchBreakdown {
  overallScore: number; // 0-100
  skillMatchScore: number; // 60% weight
  assessmentScore: number; // 20% weight
  projectEvidenceScore: number; // 10% weight
  experienceScore: number; // 10% weight
  matchedSkills: { name: string; level: number; requiredLevel: number; isMatch: boolean }[];
  missingSkills: { name: string; gapSeverity: 'HIGH' | 'MEDIUM' | 'LOW'; requiredLevel: number }[];
  explanation: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  isCode?: boolean;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AssessmentPracticalTask {
  id: string;
  title: string;
  instructions: string;
  starterCodeOrPrompt: string;
  expectedOutputCriteria: string[];
  explanationPrompt: string;
  modificationTask: string;
}

export interface Assessment {
  id: string;
  title: string;
  branch: Discipline;
  skillName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  description: string;
  questions: AssessmentQuestion[];
  practicalTask: AssessmentPracticalTask;
  attemptsCount: number;
  avgScore: number;
}

export interface CollaborationOffer {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  type: 'Workshop' | 'Guest Lecture' | 'Live Project' | 'Mentorship' | 'Faculty Development' | 'R&D Sponsorship';
  branch: Discipline[];
  duration: string;
  mode: 'Virtual' | 'In-Campus' | 'Hybrid';
  targetAudience: string;
  description: string;
  deliverables: string[];
  industryLeads: string;
  availableSlots: number;
  requestedInstitutions: { institutionName: string; contactFaculty: string; dateRequested: string; status: 'Pending' | 'Approved' | 'Scheduled' }[];
  status: 'Open' | 'In-Progress' | 'Completed';
}

export interface InstitutionAnalytics {
  totalStudents: number;
  verifiedProfilesCount: number;
  activeIndustryPartners: number;
  totalInternshipOffers: number;
  avgReadinessScore: number;
  branchSkillDemand: {
    branch: Discipline;
    skills: { name: string; demandPercentage: number; growthRate: string }[];
  }[];
  branchSkillGaps: {
    branch: Discipline;
    gaps: { skillName: string; gapSeverity: 'HIGH' | 'MEDIUM' | 'LOW'; studentsWithGapPercent: number; industryUrgency: string }[];
  }[];
  departmentReadiness: {
    department: Discipline;
    avgReadiness: number;
    totalEnrolled: number;
    assessmentParticipationRate: number;
    internshipPlacementRate: number;
  }[];
  placementTrends: {
    year: string;
    totalPlaced: number;
    avgStipend: string;
    coreBranchPercentage: number;
  }[];
}
