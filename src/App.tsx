import React, { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { DemoSwitcherBar } from './components/common/DemoSwitcherBar';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AIResumeParserModal } from './components/common/AIResumeParserModal';
import { AuthModal } from './components/common/AuthModal';
import { StudentOnboardingModal } from './components/student/StudentOnboardingModal';
import { LandingPage } from './components/landing/LandingPage';

// Student Portal views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfile } from './components/student/StudentProfile';
import { SkillAssessment } from './components/student/SkillAssessment';
import { SkillVerificationEngine } from './components/student/SkillVerificationEngine';
import { SkillGapAnalysis } from './components/student/SkillGapAnalysis';
import { LearningRoadmap } from './components/student/LearningRoadmap';
import { InternshipMatching } from './components/student/InternshipMatching';
import { DigitalPortfolio } from './components/student/DigitalPortfolio';

// Industry Portal views
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { CandidateMatching } from './components/industry/CandidateMatching';
import { CreateJobModal } from './components/industry/CreateJobModal';
import { IndustryCollaborationOffers } from './components/industry/IndustryCollaborationOffers';

// Academia / Faculty views
import { AcademiaDashboard } from './components/academia/AcademiaDashboard';
import { AssessmentManager } from './components/academia/AssessmentManager';
import { StudentGapTracker } from './components/academia/StudentGapTracker';

// Admin views
import { InstitutionAdminDashboard } from './components/admin/InstitutionAdminDashboard';
import { CollaborationHub } from './components/admin/CollaborationHub';

const MainLayout: React.FC = () => {
  const {
    currentRole,
    studentTab,
    industryTab,
    setIndustryTab,
    facultyTab,
    adminTab,
    authModalOpen,
    closeAuthModal,
    authModalMode,
    isOnboardingActive
  } = useApp();
  const [showAIParser, setShowAIParser] = useState(false);

  if (currentRole === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-[#090d16]">
        <DemoSwitcherBar />
        <LandingPage />
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={closeAuthModal}
            initialMode={authModalMode}
          />
        )}
      </div>
    );
  }

  // Determine Title & Subtitle based on active role & tab
  let headerTitle = 'Student Portal';
  let headerSubtitle = 'Skill verification, roadmap & job matching';

  if (currentRole === 'student') {
    switch (studentTab) {
      case 'dashboard':
        headerTitle = 'Student Dashboard';
        headerSubtitle = 'Real-time readiness index & career goal progress';
        break;
      case 'profile':
        headerTitle = 'Verified Academic Profile';
        headerSubtitle = 'Comprehensive technical background & credentials';
        break;
      case 'verification':
        headerTitle = 'Evidence-Based Skill Verification';
        headerSubtitle = 'Anti-fraud multi-layer empirical evaluation engine';
        break;
      case 'skill-gap':
        headerTitle = 'Target Role Skill Gap Analysis';
        headerSubtitle = 'Benchmark against active campus hiring requirements';
        break;
      case 'roadmap':
        headerTitle = 'Personalized Learning Roadmap';
        headerSubtitle = 'Sprint curriculum to close identified competency gaps';
        break;
      case 'matching':
        headerTitle = 'Explainable Internship & Job Matching';
        headerSubtitle = 'Transparent 60-20-10-10 match score breakdown';
        break;
      case 'assessment':
        headerTitle = 'Adaptive Technical Assessment';
        headerSubtitle = 'Deterministic MCQs, code modification & explanation viva';
        break;
      case 'portfolio':
        headerTitle = 'Public Digital Portfolio';
        headerSubtitle = 'Tamper-evident cryptographically signed portfolio';
        break;
      case 'ai-resume':
        headerTitle = 'AI Resume Skill Extractor';
        headerSubtitle = 'Simulated NLP extraction & competency tagging';
        break;
    }
  } else if (currentRole === 'industry') {
    headerTitle = 'Industry Partner Portal';
    headerSubtitle = 'Bosch Talent Gateway • Evidence-verified talent acquisition';
    if (industryTab === 'candidates') headerTitle = 'Ranked Candidate Matching';
    if (industryTab === 'collaborations') headerTitle = 'Industry Collaboration Offers';
  } else if (currentRole === 'faculty') {
    headerTitle = 'Faculty & Department Portal';
    headerSubtitle = 'Department of Electronics & Communication Engineering • NIT Trichy';
    if (facultyTab === 'assessments') headerTitle = 'Department Assessment Manager';
    if (facultyTab === 'skill-gaps') headerTitle = 'Cohort Skill Gap Monitor';
    if (facultyTab === 'industry-programs') headerTitle = 'Industry MoUs & Lab Programs';
  } else if (currentRole === 'admin') {
    headerTitle = 'Institutional Admin Dashboard';
    headerSubtitle = 'Macro skill demand analytics & placement conversion trends';
    if (adminTab === 'collaborations') headerTitle = 'Academia-Industry Collaboration Hub';
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Demo Bar for Judges */}
      <DemoSwitcherBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header
            title={headerTitle}
            subtitle={headerSubtitle}
            onOpenAIParser={() => setShowAIParser(true)}
          />

          <main className="p-6 max-w-7xl mx-auto w-full flex-1">
            {/* Student Portal Views */}
            {currentRole === 'student' && (
              <>
                {studentTab === 'dashboard' && <StudentDashboard />}
                {studentTab === 'profile' && <StudentProfile />}
                {studentTab === 'verification' && <SkillVerificationEngine />}
                {studentTab === 'skill-gap' && <SkillGapAnalysis />}
                {studentTab === 'roadmap' && <LearningRoadmap />}
                {studentTab === 'matching' && <InternshipMatching />}
                {studentTab === 'assessment' && <SkillAssessment />}
                {studentTab === 'portfolio' && <DigitalPortfolio />}
                {studentTab === 'ai-resume' && (
                  <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-4">
                      <h3 className="font-bold text-white text-base">Simulated AI Resume Skill Extraction</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Extract and classify competencies across ECE, CSE, EEE, Mechanical & Civil resumes using local NLP heuristics.
                      </p>
                      <button
                        onClick={() => setShowAIParser(true)}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
                      >
                        Launch AI Resume Parser Tool
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Industry Portal Views */}
            {currentRole === 'industry' && (
              <>
                {industryTab === 'dashboard' && <IndustryDashboard />}
                {industryTab === 'candidates' && <CandidateMatching />}
                {industryTab === 'create-job' && <CreateJobModal onClose={() => setIndustryTab('dashboard')} />}
                {industryTab === 'collaborations' && <IndustryCollaborationOffers />}
              </>
            )}

            {/* Academia / Faculty Views */}
            {currentRole === 'faculty' && (
              <>
                {facultyTab === 'dashboard' && <AcademiaDashboard />}
                {facultyTab === 'assessments' && <AssessmentManager />}
                {facultyTab === 'skill-gaps' && <StudentGapTracker />}
                {facultyTab === 'industry-programs' && <CollaborationHub />}
              </>
            )}

            {/* Admin Views */}
            {currentRole === 'admin' && (
              <>
                {adminTab === 'analytics' && <InstitutionAdminDashboard />}
                {adminTab === 'skill-demand' && <InstitutionAdminDashboard />}
                {adminTab === 'skill-gaps' && <InstitutionAdminDashboard />}
                {adminTab === 'collaborations' && <CollaborationHub />}
              </>
            )}
          </main>
        </div>
      </div>

      {showAIParser && <AIResumeParserModal onClose={() => setShowAIParser(false)} />}
      {authModalOpen && <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />}
      {isOnboardingActive && <StudentOnboardingModal />}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
