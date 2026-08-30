import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  TrendingUp,
  Target,
  Briefcase,
  Map,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  Clock,
  ChevronRight,
  FileCode,
  CheckSquare
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { StatCard } from '../common/StatCard';
import { EvidenceVerificationModal } from '../common/EvidenceVerificationModal';
import { VerifiedSkill } from '../../types';

export const StudentDashboard: React.FC = () => {
  const { currentStudent, setStudentTab, jobs, calculateMatch, setSelectedJobId } = useApp();
  const [selectedAuditSkill, setSelectedAuditSkill] = useState<VerifiedSkill | null>(null);

  const verifiedCount = currentStudent.verifiedSkills.filter((s) => s.status === 'VERIFIED').length;
  const inReviewCount = currentStudent.verifiedSkills.filter((s) => s.status === 'NEEDS REVIEW').length;

  // Find top matching jobs for current student
  const topMatches = jobs
    .map((job) => ({
      job,
      match: calculateMatch(job, currentStudent)
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Student Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 rounded-2xl border-2 border-indigo-500/40 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-bold text-white tracking-tight">{currentStudent.name}</h2>
                <Badge variant="purple" size="sm">
                  {currentStudent.branch} • Year {currentStudent.year}
                </Badge>
                <Badge variant="success" size="sm" dot>
                  Verified Student
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{currentStudent.college}</span>
                <span className="text-slate-600">•</span>
                <span className="text-indigo-300 font-medium">CGPA: {currentStudent.cgpa}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-400">Target Career Goal:</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                  {currentStudent.careerGoal}
                </span>
              </div>
            </div>
          </div>

          {/* Readiness Score Box */}
          <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 flex items-center gap-4 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-indigo-500/80 flex flex-col items-center justify-center shadow-inner">
              <span className="text-lg font-black text-white">{currentStudent.readinessScore}%</span>
              <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-tighter">Ready</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Skill Readiness Score</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated weighted index</p>
              <span className="inline-block mt-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                Top 8% in ECE Cohort
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Verified Skills"
          value={`${verifiedCount} / ${currentStudent.verifiedSkills.length}`}
          subtitle={`${inReviewCount} skill under review`}
          icon={ShieldCheck}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          onClick={() => setStudentTab('verification')}
        />
        <StatCard
          title="Target Skill Gaps"
          value={currentStudent.skillGaps.length}
          subtitle="RTOS & Embedded Linux flagged"
          icon={TrendingUp}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10 border-rose-500/20"
          onClick={() => setStudentTab('skill-gap')}
        />
        <StatCard
          title="Top Match Score"
          value={`${topMatches[0]?.match.overallScore || 89}%`}
          subtitle="Bosch IoT Firmware Intern"
          icon={Briefcase}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10 border-indigo-500/20"
          onClick={() => setStudentTab('matching')}
        />
        <StatCard
          title="Active Roadmap"
          value="Week 2 of 4"
          subtitle="FreeRTOS Queues & Semaphores"
          icon={Map}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
          onClick={() => setStudentTab('roadmap')}
        />
      </div>

      {/* Connected Scenario Focus Alert */}
      {currentStudent.branch === 'ECE' && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                <span>Personalized Career Recommendation:</span>
                <span className="text-indigo-300 font-mono">RTOS Gap Bridge</span>
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Your target role <strong className="text-white">"Embedded Systems Engineer"</strong> requires{' '}
                <strong className="text-indigo-300">Level 4 in RTOS (FreeRTOS)</strong>. Completing Week 2 will increase your
                Bosch match score from <strong>89% to 96%</strong>!
              </p>
            </div>
          </div>
          <button
            onClick={() => setStudentTab('assessment')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 shadow-md shadow-indigo-600/20"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Take FreeRTOS Assessment</span>
          </button>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Verified Skills & Skill Gaps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verified Skills Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Evidence-Verified Competencies</h3>
              </div>
              <button
                onClick={() => setStudentTab('verification')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View Full Audit Log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {currentStudent.verifiedSkills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => setSelectedAuditSkill(skill)}
                  className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors">
                          {skill.name}
                        </span>
                        <Badge
                          variant={skill.status === 'VERIFIED' ? 'success' : skill.status === 'NEEDS REVIEW' ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {skill.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Evidence: {skill.projectEvidence.projectName} • Score: {skill.assessmentScore}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 block">Proficiency</span>
                      <span className="text-xs font-mono font-bold text-indigo-300">
                        {skill.verifiedLevel} / 5
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gap Matrix */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white text-sm">Target Role Skill Gaps ({currentStudent.careerGoal})</h3>
              </div>
              <button
                onClick={() => setStudentTab('skill-gap')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Deep Gap Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {currentStudent.skillGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{gap.skillName}</span>
                      <Badge variant={gap.gapSeverity === 'HIGH' ? 'danger' : 'warning'} size="sm">
                        {gap.gapSeverity} SEVERITY
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{gap.impactOnTargetRole}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right text-[10px] text-slate-400 font-mono">
                      Level {gap.currentLevel} → <span className="text-emerald-400 font-bold">Level {gap.targetLevel}</span>
                    </div>
                    <button
                      onClick={() => setStudentTab('roadmap')}
                      className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-medium transition-all"
                    >
                      View Roadmap
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Top Matched Opportunities & Recent Activity */}
        <div className="space-y-6">
          {/* Recommended Internships Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Top Matched Internships</h3>
              </div>
              <button
                onClick={() => setStudentTab('matching')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {topMatches.map(({ job, match }) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setStudentTab('matching');
                  }}
                  className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors block">
                        {job.role}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{job.companyName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 font-mono block">
                        {match.overallScore}%
                      </span>
                      <span className="text-[9px] uppercase tracking-tighter text-slate-500">Match</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{job.stipend}</span>
                    <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Explain Match <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Portfolio Quick Preview */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Award className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">Verified Digital Portfolio</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your public tamper-evident digital credential URL is live with faculty endorsement signatures.
            </p>
            <button
              onClick={() => setStudentTab('portfolio')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Preview Digital Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Audit Modal if clicked */}
      {selectedAuditSkill && (
        <EvidenceVerificationModal skill={selectedAuditSkill} onClose={() => setSelectedAuditSkill(null)} />
      )}
    </div>
  );
};
