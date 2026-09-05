import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Student,
  JobOpening,
  Assessment,
  CollaborationOffer,
  InstitutionAnalytics,
  MatchBreakdown,
  VerifiedSkill,
  Discipline
} from '../types';
import {
  DEMO_STUDENTS,
  DEMO_JOBS,
  DEMO_ASSESSMENTS,
  DEMO_COLLABORATIONS,
  DEMO_INSTITUTION_ANALYTICS
} from '../data/mockData';
import { api } from '../services/api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'ASSESSMENT' | 'VERIFICATION' | 'APPLICATION' | 'OPPORTUNITY' | 'COLLABORATION' | 'SYSTEM';
  date: string;
  isRead: boolean;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  profile?: any;
}

interface AppContextType {
  currentRole: UserRole | 'landing';
  setCurrentRole: (role: UserRole | 'landing') => void;
  currentUser: CurrentUser | null;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;

  // Data
  students: Student[];
  currentStudent: Student;
  jobs: JobOpening[];
  assessments: Assessment[];
  collaborations: CollaborationOffer[];
  analytics: InstitutionAnalytics;
  notifications: AppNotification[];

  // Active navigation within portals
  studentTab: 'dashboard' | 'profile' | 'assessment' | 'verification' | 'skill-gap' | 'roadmap' | 'matching' | 'portfolio' | 'ai-resume';
  setStudentTab: (tab: 'dashboard' | 'profile' | 'assessment' | 'verification' | 'skill-gap' | 'roadmap' | 'matching' | 'portfolio' | 'ai-resume') => void;
  industryTab: 'dashboard' | 'candidates' | 'create-job' | 'collaborations';
  setIndustryTab: (tab: 'dashboard' | 'candidates' | 'create-job' | 'collaborations') => void;
  facultyTab: 'dashboard' | 'assessments' | 'skill-gaps' | 'industry-programs';
  setFacultyTab: (tab: 'dashboard' | 'assessments' | 'skill-gaps' | 'industry-programs') => void;
  adminTab: 'analytics' | 'skill-demand' | 'skill-gaps' | 'collaborations';
  setAdminTab: (tab: 'analytics' | 'skill-demand' | 'skill-gaps' | 'collaborations') => void;

  // Selected sub-items for deep inspection
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  selectedCandidateStudentId: string | null;
  setSelectedCandidateStudentId: (id: string | null) => void;

  // Auth Modal Controls
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  // Onboarding
  isOnboardingActive: boolean;
  setIsOnboardingActive: (active: boolean) => void;
  completeOnboarding: (skills: string[], goal: string) => void;

  // Core Actions
  loginAs: (role: UserRole, email?: string) => void;
  loginWithCredentials: (email: string, password?: string) => Promise<void>;
  registerAccount: (payload: any) => Promise<void>;
  logout: () => void;
  calculateMatch: (job: JobOpening, student: Student) => MatchBreakdown;
  applyToJob: (jobId: string) => void;
  updateApplicationStatus: (studentId: string, jobId: string, newStatus: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Under Review') => void;
  verifyStudentSkill: (studentId: string, skill: Partial<VerifiedSkill>) => void;
  recordAssessmentResult: (studentId: string, assessmentId: string, score: number, practicalScore: number) => void;
  addNewJob: (newJob: Omit<JobOpening, 'id' | 'applicantsCount' | 'shortlistedCount' | 'postedDate' | 'status'>) => void;
  requestCollaborationOffer: (collabId: string, institutionName: string, contactFaculty: string) => void;
  addNewCollaboration: (offer: Omit<CollaborationOffer, 'id' | 'requestedInstitutions' | 'status'>) => void;
  advanceRoadmapWeek: (studentId: string, weekNumber: number) => void;
  parseResumeText: (text: string) => { extractedSkills: string[]; suggestedRole: string; confidence: number; branch: Discipline };
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | 'landing'>('landing');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stud-1'); // Default to Ananya Sharma (ECE Hero)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('comp-1'); // Bosch

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Onboarding State
  const [isOnboardingActive, setIsOnboardingActive] = useState<boolean>(false);

  // Loaded Data with localStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sih_students');
    return saved ? JSON.parse(saved) : DEMO_STUDENTS;
  });

  const [jobs, setJobs] = useState<JobOpening[]>(() => {
    const saved = localStorage.getItem('sih_jobs');
    return saved ? JSON.parse(saved) : DEMO_JOBS;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('sih_assessments');
    return saved ? JSON.parse(saved) : DEMO_ASSESSMENTS;
  });

  const [collaborations, setCollaborations] = useState<CollaborationOffer[]>(() => {
    const saved = localStorage.getItem('sih_collaborations');
    return saved ? JSON.parse(saved) : DEMO_COLLABORATIONS;
  });

  const [analytics] = useState<InstitutionAnalytics>(DEMO_INSTITUTION_ANALYTICS);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'FreeRTOS Assessment Verified',
      message: 'Practical task & code viva verified. Readiness score updated to 84%.',
      type: 'VERIFICATION',
      date: 'Just now',
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'Opportunity Match Alert',
      message: '89% match with Bosch Embedded IoT Firmware Intern position.',
      type: 'OPPORTUNITY',
      date: '10m ago',
      isRead: false
    },
    {
      id: 'notif-3',
      title: 'Industry Demand Increase',
      message: 'Campus hiring demand for STM32 & RTOS increased by +34% this cycle.',
      type: 'SYSTEM',
      date: '1h ago',
      isRead: false
    }
  ]);

  // Portal tabs
  const [studentTab, setStudentTab] = useState<'dashboard' | 'profile' | 'assessment' | 'verification' | 'skill-gap' | 'roadmap' | 'matching' | 'portfolio' | 'ai-resume'>('dashboard');
  const [industryTab, setIndustryTab] = useState<'dashboard' | 'candidates' | 'create-job' | 'collaborations'>('dashboard');
  const [facultyTab, setFacultyTab] = useState<'dashboard' | 'assessments' | 'skill-gaps' | 'industry-programs'>('dashboard');
  const [adminTab, setAdminTab] = useState<'analytics' | 'skill-demand' | 'skill-gaps' | 'collaborations'>('analytics');

  const [selectedJobId, setSelectedJobId] = useState<string | null>('job-1');
  const [selectedCandidateStudentId, setSelectedCandidateStudentId] = useState<string | null>('stud-1');

  useEffect(() => {
    localStorage.setItem('sih_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sih_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('sih_collaborations', JSON.stringify(collaborations));
  }, [collaborations]);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const loginAs = (role: UserRole, email?: string) => {
    setCurrentRole(role);
    if (role === 'student') {
      if (email) {
        const found = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
        if (found) setSelectedStudentId(found.id);
      } else {
        setSelectedStudentId('stud-1'); // Default Ananya
      }
      setStudentTab('dashboard');
      setCurrentUser({
        id: 'usr-stu-01',
        email: email || 'student@demo.com',
        name: 'Ananya Sharma',
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    } else if (role === 'industry') {
      setSelectedCompanyId('comp-1');
      setIndustryTab('dashboard');
      setCurrentUser({
        id: 'usr-ind-01',
        email: 'industry@demo.com',
        name: 'Bosch Engineering & Mobility',
        role: 'INDUSTRY'
      });
    } else if (role === 'faculty') {
      setFacultyTab('dashboard');
      setCurrentUser({
        id: 'usr-fac-01',
        email: 'faculty@demo.com',
        name: 'Dr. K. S. Ramanathan',
        role: 'FACULTY'
      });
    } else if (role === 'admin') {
      setAdminTab('analytics');
      setCurrentUser({
        id: 'usr-adm-01',
        email: 'admin@demo.com',
        name: 'Dr. S. K. Mehra',
        role: 'INSTITUTION_ADMIN'
      });
    }
  };

  const loginWithCredentials = async (email: string, password = 'demo123') => {
    try {
      const res = await api.login({ email, password });
      if (res.token) {
        localStorage.setItem('sih_token', res.token);
      }

      const user = res.user;
      setCurrentUser(user);

      const normalizedRole = user.role.toLowerCase();
      if (normalizedRole === 'student') {
        setCurrentRole('student');
        setStudentTab('dashboard');
        // Match existing student or create a student entry
        let existing = students.find((s) => s.email.toLowerCase() === user.email.toLowerCase());
        if (!existing) {
          const newStudent: Student = {
            id: `stud-${Date.now()}`,
            name: user.name,
            email: user.email,
            avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            branch: (user.profile?.branch as Discipline) || 'ECE',
            year: user.profile?.year ? parseInt(user.profile.year) || 3 : 3,
            college: user.profile?.institution_name || 'National Institute of Technology',
            cgpa: user.profile?.cgpa || 8.2,
            careerGoal: user.profile?.career_goal || 'Engineering Specialist',
            bio: user.profile?.about || 'Student enrolled in technical program.',
            phone: user.profile?.phone || '+91 98000 00000',
            readinessScore: user.profile?.readiness_score || 45,
            fraudRiskFlag: false,
            verifiedSkills: [],
            skillGaps: [
              {
                id: `gap-init-${Date.now()}`,
                skillName: 'Core Foundations & Diagnostic',
                branch: (user.profile?.branch as Discipline) || 'ECE',
                category: 'Diagnostic',
                targetLevel: 4,
                currentLevel: 1,
                gapSeverity: 'HIGH',
                impactOnTargetRole: 'Initial benchmark needed to map career trajectory.',
                recommendedAction: 'Take diagnostic skill assessment.',
                learningTimeEstWeeks: 2,
                resources: [
                  {
                    title: 'NPTEL National Certification Core Module',
                    type: 'Course',
                    provider: 'NPTEL / IIT Madras',
                    duration: '4 Weeks',
                    url: 'https://nptel.ac.in'
                  }
                ]
              }
            ],
            projects: [],
            certifications: [],
            achievements: [],
            roadmap: [
              {
                week: 1,
                phaseTitle: 'Baseline Foundations & Toolchain',
                focusSkill: 'Core Engineering Basics',
                status: 'In-Progress',
                learningObjective: 'Establish foundational proficiency with version control and development environment.',
                keyTopics: ['Core Fundamentals', 'Git & CI/CD', 'Development Toolchain'],
                practicalTask: 'Set up local toolchain and submit initial build project.',
                milestoneProject: 'Initial Laboratory Module Verification',
                verificationCheck: 'Faculty Viva & Automated Code Build'
              }
            ],
            applications: []
          };
          setStudents((prev) => [newStudent, ...prev]);
          setSelectedStudentId(newStudent.id);
        } else {
          setSelectedStudentId(existing.id);
        }
      } else if (normalizedRole === 'industry') {
        setCurrentRole('industry');
        setIndustryTab('dashboard');
      } else if (normalizedRole === 'faculty') {
        setCurrentRole('faculty');
        setFacultyTab('dashboard');
      } else if (normalizedRole === 'institution_admin' || normalizedRole === 'admin') {
        setCurrentRole('admin');
        setAdminTab('analytics');
      }
    } catch (err: any) {
      // If backend offline, support offline demo accounts
      const lower = email.toLowerCase().trim();
      if (lower.includes('student')) {
        loginAs('student', email);
      } else if (lower.includes('industry')) {
        loginAs('industry');
      } else if (lower.includes('faculty') || lower.includes('academia')) {
        loginAs('faculty');
      } else if (lower.includes('admin')) {
        loginAs('admin');
      } else {
        throw new Error(err.message || 'Login failed.');
      }
    }
  };

  const registerAccount = async (payload: any) => {
    try {
      const res = await api.register(payload);
      if (res.token) {
        localStorage.setItem('sih_token', res.token);
      }

      const user = res.user;
      setCurrentUser(user);

      if (payload.role === 'STUDENT') {
        const newStudent: Student = {
          id: `stud-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          branch: (payload.branch as Discipline) || 'ECE',
          year: parseInt(payload.year) || 3,
          college: payload.institution_name || 'National Institute of Technology',
          cgpa: parseFloat(payload.cgpa) || 8.0,
          careerGoal: payload.career_goal || `${payload.branch || 'ECE'} Systems Engineer`,
          bio: `Newly registered student eager to verify technical skills and match with tier-1 industry internships.`,
          phone: payload.phone || '+91 98000 00000',
          readinessScore: 40,
          fraudRiskFlag: false,
          verifiedSkills: [],
          skillGaps: [
            {
              id: `gap-${Date.now()}`,
              skillName: `${payload.branch || 'ECE'} Core Competencies`,
              branch: (payload.branch as Discipline) || 'ECE',
              category: 'Core',
              targetLevel: 4,
              currentLevel: 1,
              gapSeverity: 'HIGH',
              impactOnTargetRole: `Required for verified ${payload.career_goal || 'Engineering'} positions.`,
              recommendedAction: 'Complete diagnostic assessment and submit lab evidence.',
              learningTimeEstWeeks: 3,
              resources: [
                {
                  title: 'Free NPTEL / SWAYAM Technical Foundations',
                  type: 'Course',
                  provider: 'NPTEL (Free Learning Access)',
                  duration: '4 Weeks',
                  url: 'https://swayam.gov.in'
                }
              ]
            }
          ],
          projects: [],
          certifications: [],
          achievements: [],
          roadmap: [
            {
              week: 1,
              phaseTitle: 'Foundational Diagnostics & Skill Mapping',
              focusSkill: 'Core Fundamentals',
              status: 'In-Progress',
              learningObjective: 'Complete diagnostic MCQ and practical task for automated baseline mapping.',
              keyTopics: ['Core Theory', 'Syntax & Registers', 'Toolchain Setup'],
              practicalTask: 'Run code modification task in assessment module.',
              milestoneProject: 'Hello World Lab Demonstration',
              verificationCheck: 'Autonomous Syntax & Logic Test'
            },
            {
              week: 2,
              phaseTitle: 'Intermediate Practical Application',
              focusSkill: 'Systems Programming',
              status: 'Upcoming',
              learningObjective: 'Build and verify mini-project evidence.',
              keyTopics: ['Algorithms', 'Hardware/Software Interfaces'],
              practicalTask: 'Implement structured queue or state machine.',
              milestoneProject: 'Practical Demo Submission',
              verificationCheck: 'Faculty Evaluation Viva'
            }
          ],
          applications: []
        };

        setStudents((prev) => [newStudent, ...prev]);
        setSelectedStudentId(newStudent.id);
        setCurrentRole('student');
        setStudentTab('dashboard');
        setIsOnboardingActive(true);
      } else if (payload.role === 'INDUSTRY') {
        setCurrentRole('industry');
        setIndustryTab('dashboard');
      } else if (payload.role === 'FACULTY') {
        setCurrentRole('faculty');
        setFacultyTab('dashboard');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed.');
    }
  };

  const logout = () => {
    localStorage.removeItem('sih_token');
    setCurrentUser(null);
    setCurrentRole('landing');
    setAuthModalOpen(false);
  };

  const completeOnboarding = (skillsToAdd: string[], goal: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== currentStudent.id) return s;
        const newVerified = skillsToAdd.map((skName, i) => ({
          id: `vs-new-${Date.now()}-${i}`,
          name: skName,
          category: 'Core Competency',
          branch: s.branch,
          selfDeclaredLevel: 3,
          verifiedLevel: 3,
          status: 'VERIFIED' as const,
          confidence: 'HIGH' as const,
          assessmentScore: 82,
          projectEvidence: {
            projectName: 'Diagnostic Baseline Demonstration',
            description: 'Verified via initial onboarding practical task.',
            verified: true
          },
          practicalTaskScore: 85,
          explanationScore: 80,
          consistencyScore: 90,
          lastVerifiedDate: new Date().toISOString().split('T')[0]
        }));

        return {
          ...s,
          careerGoal: goal || s.careerGoal,
          readinessScore: 68,
          verifiedSkills: [...s.verifiedSkills, ...newVerified]
        };
      })
    );
    setIsOnboardingActive(false);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Onboarding Completed!',
        message: 'Your profile has been initialized with verified baseline competencies.',
        type: 'SYSTEM',
        date: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  /**
   * Transparent Explainable Matching Algorithm
   * Skill Match: 60% weight
   * Assessment Performance: 20% weight
   * Project Evidence: 10% weight
   * Experience & Coursework: 10% weight
   */
  const calculateMatch = (job: JobOpening, student: Student): MatchBreakdown => {
    const studentVerifiedSkillMap = new Map<string, { level: number; status: string; score: number }>();
    student.verifiedSkills.forEach((vs) => {
      studentVerifiedSkillMap.set(vs.name.toLowerCase(), {
        level: vs.verifiedLevel,
        status: vs.status,
        score: vs.assessmentScore
      });
    });

    let totalWeight = 0;
    let earnedWeight = 0;
    const matchedSkills: { name: string; level: number; requiredLevel: number; isMatch: boolean }[] = [];
    const missingSkills: { name: string; gapSeverity: 'HIGH' | 'MEDIUM' | 'LOW'; requiredLevel: number }[] = [];

    job.requiredSkills.forEach((req) => {
      totalWeight += req.weight;
      const matched = studentVerifiedSkillMap.get(req.name.toLowerCase());
      if (matched && matched.level >= req.minLevel && matched.status === 'VERIFIED') {
        earnedWeight += req.weight;
        matchedSkills.push({
          name: req.name,
          level: matched.level,
          requiredLevel: req.minLevel,
          isMatch: true
        });
      } else if (matched && matched.level > 0) {
        const partialRatio = Math.min(1, matched.level / req.minLevel);
        earnedWeight += req.weight * partialRatio * (matched.status === 'VERIFIED' ? 0.9 : 0.6);
        matchedSkills.push({
          name: req.name,
          level: matched.level,
          requiredLevel: req.minLevel,
          isMatch: false
        });
        missingSkills.push({
          name: req.name,
          gapSeverity: req.isMustHave ? 'HIGH' : 'MEDIUM',
          requiredLevel: req.minLevel
        });
      } else {
        missingSkills.push({
          name: req.name,
          gapSeverity: req.isMustHave ? 'HIGH' : 'MEDIUM',
          requiredLevel: req.minLevel
        });
      }
    });

    // 1. Skill Match Score (out of 60)
    const skillRatio = totalWeight > 0 ? earnedWeight / totalWeight : 0;
    const skillMatchScore = Math.round(skillRatio * 60);

    // 2. Assessment Score (out of 20)
    const avgAssessScore =
      student.verifiedSkills.length > 0
        ? student.verifiedSkills.reduce((acc, curr) => acc + curr.assessmentScore, 0) / student.verifiedSkills.length
        : 75;
    const assessmentScore = Math.round((avgAssessScore / 100) * 20);

    // 3. Project Evidence Score (out of 10)
    const verifiedProjects = student.projects.filter((p) => p.verifiedByFaculty).length;
    const projectEvidenceScore = Math.min(10, Math.round((verifiedProjects / 2) * 10));

    // 4. Experience & Coursework (out of 10)
    const experienceScore = student.certifications.length > 0 ? 9 : 8;

    const overallScore = Math.min(100, Math.max(0, skillMatchScore + assessmentScore + projectEvidenceScore + experienceScore));

    const explanation =
      missingSkills.length === 0
        ? `Exceptional match! Candidate satisfies 100% of required competencies with verified practical evidence.`
        : `Strong candidate profile. Verified high proficiency in ${matchedSkills.filter((m) => m.isMatch).map((m) => m.name).join(', ') || 'core fundamentals'}. Minor gap in ${missingSkills.map((m) => m.name).join(', ')}, with active learning roadmap in progress.`;

    return {
      overallScore,
      skillMatchScore,
      assessmentScore,
      projectEvidenceScore,
      experienceScore,
      matchedSkills,
      missingSkills,
      explanation
    };
  };

  const applyToJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const match = calculateMatch(job, currentStudent);

    // Update backend asynchronously
    api.applyOpportunity(jobId, { coverLetter: 'Applied via SKILLSETU Verified Portal' }).catch(() => {});

    setStudents((prev) =>
      prev.map((stud) => {
        if (stud.id !== currentStudent.id) return stud;
        const exists = stud.applications.find((a) => a.internshipId === jobId);
        if (exists) return stud;

        return {
          ...stud,
          applications: [
            {
              id: `app-${Date.now()}`,
              internshipId: jobId,
              roleTitle: job.role,
              companyName: job.companyName,
              appliedDate: new Date().toISOString().split('T')[0],
              matchScore: match.overallScore,
              status: match.overallScore >= 80 ? 'Shortlisted' : 'Applied',
              feedback:
                match.overallScore >= 80
                  ? 'Strong automated match score based on verified competencies.'
                  : 'Application received and under initial review.'
            },
            ...stud.applications
          ]
        };
      })
    );

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        return {
          ...j,
          applicantsCount: j.applicantsCount + 1,
          shortlistedCount: match.overallScore >= 80 ? j.shortlistedCount + 1 : j.shortlistedCount
        };
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Application Submitted',
        message: `Your verified profile was submitted to ${job.companyName} for ${job.role} (${match.overallScore}% match).`,
        type: 'APPLICATION',
        date: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const updateApplicationStatus = (
    studentId: string,
    jobId: string,
    newStatus: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Under Review'
  ) => {
    // Call backend API
    api.updateApplicationStatus(jobId, { status: newStatus.toUpperCase() }).catch(() => {});

    setStudents((prev) =>
      prev.map((stud) => {
        if (stud.id !== studentId) return stud;
        return {
          ...stud,
          applications: stud.applications.map((app) => {
            if (app.internshipId !== jobId) return app;
            return {
              ...app,
              status: newStatus,
              feedback: `Application status updated to ${newStatus} by recruiting team.`
            };
          })
        };
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Application Status: ${newStatus}`,
        message: `Your application status for opportunity has been updated to ${newStatus}.`,
        type: 'APPLICATION',
        date: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const verifyStudentSkill = (studentId: string, skillUpdate: Partial<VerifiedSkill>) => {
    // Send to backend API
    api.submitVerification({
      skill_id: skillUpdate.id || 'skill-default',
      practical_task_title: skillUpdate.name || 'Verified Practical Task',
      score: skillUpdate.assessmentScore || 85
    }).catch(() => {});

    setStudents((prev) =>
      prev.map((stud) => {
        if (stud.id !== studentId) return stud;
        const existingSkillIndex = stud.verifiedSkills.findIndex((s) => s.name.toLowerCase() === skillUpdate.name?.toLowerCase());

        let newSkills = [...stud.verifiedSkills];
        if (existingSkillIndex >= 0) {
          newSkills[existingSkillIndex] = {
            ...newSkills[existingSkillIndex],
            ...skillUpdate,
            lastVerifiedDate: new Date().toISOString().split('T')[0]
          } as VerifiedSkill;
        } else if (skillUpdate.name) {
          newSkills.push({
            id: `vs-${Date.now()}`,
            name: skillUpdate.name,
            category: skillUpdate.category || 'Core Skill',
            branch: skillUpdate.branch || stud.branch,
            selfDeclaredLevel: skillUpdate.selfDeclaredLevel || 3,
            verifiedLevel: skillUpdate.verifiedLevel || 3,
            status: skillUpdate.status || 'VERIFIED',
            confidence: skillUpdate.confidence || 'HIGH',
            assessmentScore: skillUpdate.assessmentScore || 85,
            projectEvidence: skillUpdate.projectEvidence || {
              projectName: 'Lab Demonstration & Code Review',
              description: 'Verified by autonomous evidence engine.',
              verified: true
            },
            practicalTaskScore: skillUpdate.practicalTaskScore || 88,
            explanationScore: skillUpdate.explanationScore || 85,
            consistencyScore: skillUpdate.consistencyScore || 90,
            lastVerifiedDate: new Date().toISOString().split('T')[0]
          });
        }

        // Remove from skill gaps if verified now
        const updatedGaps = stud.skillGaps.filter(
          (g) => g.skillName.toLowerCase() !== skillUpdate.name?.toLowerCase() || (skillUpdate.verifiedLevel || 0) < g.targetLevel
        );

        // Recalculate readiness
        const avgScores = newSkills.reduce((sum, s) => sum + s.assessmentScore, 0) / (newSkills.length || 1);
        const readiness = Math.min(98, Math.round(avgScores * 0.9 + 5));

        return {
          ...stud,
          verifiedSkills: newSkills,
          skillGaps: updatedGaps,
          readinessScore: readiness
        };
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Skill Verified',
        message: `${skillUpdate.name} verified at Level ${skillUpdate.verifiedLevel || 3} with empirical evidence.`,
        type: 'VERIFICATION',
        date: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const recordAssessmentResult = (studentId: string, assessmentId: string, score: number, practicalScore: number) => {
    const assess = assessments.find((a) => a.id === assessmentId);
    if (!assess) return;

    // Send assessment submission to backend
    api.submitAssessment(assessmentId, { score, practicalScore }).catch(() => {});

    const consistency = Math.abs(score - practicalScore) <= 15 ? 'HIGH' : 'MEDIUM';
    const isVerified = score >= assess.passingScore && practicalScore >= 60;

    verifyStudentSkill(studentId, {
      name: assess.skillName,
      branch: assess.branch,
      assessmentScore: score,
      practicalTaskScore: practicalScore,
      explanationScore: Math.round((score + practicalScore) / 2),
      consistencyScore: consistency === 'HIGH' ? 95 : 70,
      status: isVerified ? 'VERIFIED' : score >= 50 ? 'NEEDS REVIEW' : 'NOT VERIFIED',
      confidence: consistency === 'HIGH' && isVerified ? 'HIGH' : 'MEDIUM',
      verifiedLevel: isVerified ? 4 : 2
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Assessment Completed',
        message: `${assess.title}: Scored ${score}% in MCQ and ${practicalScore}% in practical demonstration.`,
        type: 'ASSESSMENT',
        date: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const addNewJob = (newJobData: Omit<JobOpening, 'id' | 'applicantsCount' | 'shortlistedCount' | 'postedDate' | 'status'>) => {
    const newJob: JobOpening = {
      ...newJobData,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      shortlistedCount: 0,
      status: 'Active'
    };

    // Send to backend API
    api.createOpportunity({
      title: newJob.role,
      opportunity_type: newJob.type.toUpperCase().replace('-', '_'),
      branch: newJob.discipline[0] || 'ECE',
      description: newJob.description,
      location: newJob.location,
      mode: newJob.mode.toUpperCase().replace('-', '_'),
      duration: newJob.duration,
      stipend: newJob.stipend,
      required_skills: newJob.requiredSkills
    }).catch(() => {});

    setJobs((prev) => [newJob, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Opening Published',
        message: `${newJob.role} opening posted for ${newJob.discipline.join(', ')} students.`,
        type: 'OPPORTUNITY',
        date: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const requestCollaborationOffer = (collabId: string, institutionName: string, contactFaculty: string) => {
    // Send to backend API
    api.updateCollaborationStatus(collabId, {
      status: 'ACCEPTED',
      facultyName: contactFaculty
    }).catch(() => {});

    setCollaborations((prev) =>
      prev.map((c) => {
        if (c.id !== collabId) return c;
        return {
          ...c,
          requestedInstitutions: [
            ...c.requestedInstitutions,
            {
              institutionName,
              contactFaculty,
              dateRequested: new Date().toISOString().split('T')[0],
              status: 'Approved'
            }
          ]
        };
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Collaboration MoU Request Submitted',
        message: `Institutional request forwarded to industry partner with faculty contact ${contactFaculty}.`,
        type: 'COLLABORATION',
        date: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const addNewCollaboration = (offerData: Omit<CollaborationOffer, 'id' | 'requestedInstitutions' | 'status'>) => {
    const newCollab: CollaborationOffer = {
      ...offerData,
      id: `collab-${Date.now()}`,
      requestedInstitutions: [],
      status: 'Open'
    };

    api.createCollaboration({
      title: offerData.title,
      type: offerData.type.toUpperCase().replace(/\s+/g, '_'),
      discipline: offerData.branch[0] || 'ECE',
      description: offerData.description,
      duration: offerData.duration,
      expected_outcomes: offerData.deliverables.join(', ')
    }).catch(() => {});

    setCollaborations((prev) => [newCollab, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Industry Collaboration Posted',
        message: `${offerData.companyName} created new MoU opportunity: ${offerData.title}`,
        type: 'COLLABORATION',
        date: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const advanceRoadmapWeek = (studentId: string, weekNumber: number) => {
    setStudents((prev) =>
      prev.map((stud) => {
        if (stud.id !== studentId) return stud;
        const newRoadmap = stud.roadmap.map((w) => {
          if (w.week === weekNumber) {
            return { ...w, status: 'Completed' as const };
          }
          if (w.week === weekNumber + 1 && w.status === 'Upcoming') {
            return { ...w, status: 'In-Progress' as const };
          }
          return w;
        });
        return {
          ...stud,
          roadmap: newRoadmap,
          readinessScore: Math.min(99, stud.readinessScore + 4)
        };
      })
    );
  };

  const parseResumeText = (text: string): { extractedSkills: string[]; suggestedRole: string; confidence: number; branch: Discipline } => {
    const lower = text.toLowerCase();
    const skills: string[] = [];
    let detectedBranch: Discipline = 'ECE';
    let suggestedRole = 'Embedded Systems Firmware Engineer';

    if (lower.includes('embedded') || lower.includes('stm32') || lower.includes('arm') || lower.includes('c programming') || lower.includes('microcontroller') || lower.includes('can bus') || lower.includes('freertos')) {
      detectedBranch = 'ECE';
      suggestedRole = 'Embedded Systems Engineer';
      if (lower.includes('embedded c') || lower.includes('c')) skills.push('Embedded C');
      if (lower.includes('stm32') || lower.includes('microcontroller') || lower.includes('arm')) skills.push('Microcontrollers (ARM Cortex-M & AVR)');
      if (lower.includes('freertos') || lower.includes('rtos')) skills.push('RTOS (FreeRTOS)');
      if (lower.includes('arduino') || lower.includes('sensor')) skills.push('Arduino & Sensor Interfacing');
      if (lower.includes('pcb') || lower.includes('kicad')) skills.push('PCB Design & KiCad');
    } else if (lower.includes('python') || lower.includes('react') || lower.includes('docker') || lower.includes('kubernetes') || lower.includes('cloud') || lower.includes('ai') || lower.includes('fastapi')) {
      detectedBranch = 'CSE';
      suggestedRole = 'Cloud & AI Platform Engineer';
      skills.push('Python & FastAPI', 'Docker & Kubernetes', 'Distributed Systems & SQL/NoSQL');
    } else if (lower.includes('bms') || lower.includes('matlab') || lower.includes('simulink') || lower.includes('inverter') || lower.includes('ev')) {
      detectedBranch = 'EEE';
      suggestedRole = 'EV Powertrain & BMS Engineer';
      skills.push('MATLAB / Simulink', 'Battery Management Systems (BMS)', 'Power Electronics');
    } else if (lower.includes('solidworks') || lower.includes('cad') || lower.includes('ansys') || lower.includes('robotics')) {
      detectedBranch = 'Mechanical';
      suggestedRole = 'Robotics & CAD Design Engineer';
      skills.push('SolidWorks 3D CAD & GD&T', 'ANSYS FEA & Topology Optimization');
    } else if (lower.includes('revit') || lower.includes('bim') || lower.includes('etabs') || lower.includes('staad')) {
      detectedBranch = 'Civil';
      suggestedRole = 'BIM & Structural Modeling Specialist';
      skills.push('Autodesk Revit & BIM Modeling', 'ETABS & STAAD.Pro Structural Analysis');
    } else {
      skills.push('Embedded C', 'Microcontrollers (ARM Cortex-M & AVR)', 'C Programming', 'Arduino & Sensors');
    }

    return {
      extractedSkills: skills,
      suggestedRole,
      confidence: 94,
      branch: detectedBranch
    };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        selectedStudentId,
        setSelectedStudentId,
        selectedCompanyId,
        setSelectedCompanyId,
        students,
        currentStudent,
        jobs,
        assessments,
        collaborations,
        analytics,
        notifications,
        studentTab,
        setStudentTab,
        industryTab,
        setIndustryTab,
        facultyTab,
        setFacultyTab,
        adminTab,
        setAdminTab,
        selectedJobId,
        setSelectedJobId,
        selectedCandidateStudentId,
        setSelectedCandidateStudentId,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        isOnboardingActive,
        setIsOnboardingActive,
        completeOnboarding,
        loginAs,
        loginWithCredentials,
        registerAccount,
        logout,
        calculateMatch,
        applyToJob,
        updateApplicationStatus,
        verifyStudentSkill,
        recordAssessmentResult,
        addNewJob,
        requestCollaborationOffer,
        addNewCollaboration,
        advanceRoadmapWeek,
        parseResumeText,
        markNotificationRead,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
