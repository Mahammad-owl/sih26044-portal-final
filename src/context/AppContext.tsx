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

interface AppContextType {
  currentRole: UserRole | 'landing';
  setCurrentRole: (role: UserRole | 'landing') => void;
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

  // Core Actions
  loginAs: (role: UserRole, email?: string) => void;
  calculateMatch: (job: JobOpening, student: Student) => MatchBreakdown;
  applyToJob: (jobId: string) => void;
  verifyStudentSkill: (studentId: string, skill: Partial<VerifiedSkill>) => void;
  recordAssessmentResult: (studentId: string, assessmentId: string, score: number, practicalScore: number) => void;
  addNewJob: (newJob: Omit<JobOpening, 'id' | 'applicantsCount' | 'shortlistedCount' | 'postedDate' | 'status'>) => void;
  requestCollaborationOffer: (collabId: string, institutionName: string, contactFaculty: string) => void;
  addNewCollaboration: (offer: Omit<CollaborationOffer, 'id' | 'requestedInstitutions' | 'status'>) => void;
  advanceRoadmapWeek: (studentId: string, weekNumber: number) => void;
  parseResumeText: (text: string) => { extractedSkills: string[]; suggestedRole: string; confidence: number; branch: Discipline };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | 'landing'>('landing');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stud-1'); // Default to Ananya Sharma (ECE Hero)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('comp-1'); // Bosch

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
    } else if (role === 'industry') {
      setSelectedCompanyId('comp-1');
      setIndustryTab('dashboard');
    } else if (role === 'faculty') {
      setFacultyTab('dashboard');
    } else if (role === 'admin') {
      setAdminTab('analytics');
    }
  };

  /**
   * Transparent Explainable Matching Algorithm
   * Skill Match: 60% weight
   * Assessment Performance: 20% weight
   * Project Evidence: 10% weight
   * Experience & Verified Coursework: 10% weight
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
  };

  const verifyStudentSkill = (studentId: string, skillUpdate: Partial<VerifiedSkill>) => {
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
  };

  const recordAssessmentResult = (studentId: string, assessmentId: string, score: number, practicalScore: number) => {
    const assess = assessments.find((a) => a.id === assessmentId);
    if (!assess) return;

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
    setJobs((prev) => [newJob, ...prev]);
  };

  const requestCollaborationOffer = (collabId: string, institutionName: string, contactFaculty: string) => {
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
  };

  const addNewCollaboration = (offerData: Omit<CollaborationOffer, 'id' | 'requestedInstitutions' | 'status'>) => {
    const newCollab: CollaborationOffer = {
      ...offerData,
      id: `collab-${Date.now()}`,
      requestedInstitutions: [],
      status: 'Open'
    };
    setCollaborations((prev) => [newCollab, ...prev]);
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

    // Simulated local AI extraction logic
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

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
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
        loginAs,
        calculateMatch,
        applyToJob,
        verifyStudentSkill,
        recordAssessmentResult,
        addNewJob,
        requestCollaborationOffer,
        addNewCollaboration,
        advanceRoadmapWeek,
        parseResumeText
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
