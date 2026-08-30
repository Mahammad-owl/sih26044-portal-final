import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Users,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Building2,
  Search,
  Filter,
  Eye,
  FileCheck,
  Award
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { StatCard } from '../common/StatCard';
import { CreateJobModal } from './CreateJobModal';

export const IndustryDashboard: React.FC = () => {
  const { jobs, students, calculateMatch, setIndustryTab, setSelectedCandidateStudentId, setSelectedJobId } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Industry stats for Bosch
  const totalOpenings = jobs.length;
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantsCount, 0);
  const totalShortlisted = jobs.reduce((sum, j) => sum + j.shortlistedCount, 0);

  // Top candidate matches for the flagship job (job-1: Embedded IoT Firmware Intern)
  const flagshipJob = jobs[0];
  const rankedCandidates = students
    .map((stud) => ({
      student: stud,
      match: calculateMatch(flagshipJob, stud)
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={flagshipJob.companyLogo}
            alt="Bosch"
            className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-white tracking-tight">Bosch Engineering & Mobility Talent Hub</h2>
              <Badge variant="info" size="sm">
                Industry Partner
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Connected to 48 Accredited Engineering Institutions across India • Evidence-Verified Candidate Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Internship/Job</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Job Openings"
          value={totalOpenings}
          subtitle="6 Core & Interdisciplinary roles"
          icon={Briefcase}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10 border-indigo-500/20"
        />
        <StatCard
          title="Verified Applicants"
          value={totalApplicants}
          subtitle="Zero unverified spam resumes"
          icon={Users}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          onClick={() => setIndustryTab('candidates')}
        />
        <StatCard
          title="Pre-Qualified Talent"
          value={totalShortlisted}
          subtitle="Match score > 80% on evidence"
          icon={FileCheck}
          iconColor="text-sky-400"
          iconBg="bg-sky-500/10 border-sky-500/20"
          onClick={() => setIndustryTab('candidates')}
        />
        <StatCard
          title="Top Skill Demanded"
          value="Embedded C"
          subtitle="88% placement alignment"
          icon={TrendingUp}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />
      </div>

      {/* Flagship Opening: Top Ranked Candidates Pipeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-white text-base">Top Ranked Candidates: {flagshipJob.role}</h3>
              <Badge variant="purple" size="sm">
                Ranked by 60-20-10-10 Algorithm
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing candidates ranked by verified practical competencies, hardware test scores & lab projects.
            </p>
          </div>

          <button
            onClick={() => setIndustryTab('candidates')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>View Full Talent Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {rankedCandidates.slice(0, 4).map(({ student, match }, idx) => (
            <div
              key={student.id}
              onClick={() => {
                setSelectedCandidateStudentId(student.id);
                setIndustryTab('candidates');
              }}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-indigo-400">
                  #{idx + 1}
                </span>
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {student.name}
                    </h4>
                    <Badge variant="purple" size="sm">
                      {student.branch} • Year {student.year}
                    </Badge>
                    {student.fraudRiskFlag === false && (
                      <Badge variant="success" size="sm">
                        Verified Evidence
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {student.college} • Target: {student.careerGoal}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-400 font-mono block">
                    {match.overallScore}% Match
                  </span>
                  <span className="text-[10px] text-slate-400">Skill Alignment: {match.skillMatchScore}/60</span>
                </div>

                <button className="px-3.5 py-1.5 bg-slate-900 group-hover:bg-indigo-600 border border-slate-700 group-hover:border-indigo-500 text-slate-200 group-hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1">
                  <span>Inspect Candidate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Postings Overview */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Active Job & Internship Postings</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Role</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-white">{job.role}</h4>
                <Badge variant="success" size="sm">
                  {job.type}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.stipend}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                <span className="text-slate-400">
                  <strong className="text-white">{job.applicantsCount}</strong> Applicants ({job.shortlistedCount} Shortlisted)
                </span>
                <button
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setIndustryTab('candidates');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs"
                >
                  View Matches →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && <CreateJobModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};
