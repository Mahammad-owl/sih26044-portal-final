import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  X,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { JobOpening, MatchBreakdown } from '../../types';

export const InternshipMatching: React.FC = () => {
  const { jobs, currentStudent, calculateMatch, applyToJob, selectedJobId, setSelectedJobId } = useApp();
  const [explainJob, setExplainJob] = useState<{ job: JobOpening; match: MatchBreakdown } | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const studentApplicationsMap = new Map(
    currentStudent.applications.map((app) => [app.internshipId, app.status])
  );

  const handleApply = (jobId: string, roleTitle: string) => {
    applyToJob(jobId);
    setAppliedNotification(`Application successfully submitted for ${roleTitle}!`);
    setTimeout(() => setAppliedNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Explainable Internship & Job Matching</h2>
            <Badge variant="purple" size="sm">
              60-20-10-10 Transparent Scoring
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculates match rankings by verifying practical skills (60%), assessment consistency (20%), project evidence (10%), and academic coursework (10%).
          </p>
        </div>

        <Badge variant="success" size="md" dot>
          {jobs.length} Active Industry Openings
        </Badge>
      </div>

      {appliedNotification && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{appliedNotification}</span>
          </div>
          <button onClick={() => setAppliedNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {jobs.map((job) => {
          const match = calculateMatch(job, currentStudent);
          const applicationStatus = studentApplicationsMap.get(job.id);
          const isSelected = selectedJobId === job.id;

          return (
            <div
              key={job.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                match.overallScore >= 85
                  ? 'glass-panel border-indigo-500/40 hover:border-indigo-500/70 shadow-lg shadow-indigo-500/5'
                  : 'glass-panel border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{job.role}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{job.companyName}</p>
                    </div>
                  </div>

                  {/* Match score badge */}
                  <div className="text-right flex-shrink-0">
                    <div className="px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-sm">
                      {match.overallScore}%
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">
                      Match Index
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {job.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    {job.stipend}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-2">{job.description}</p>

                {/* Required Skills */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Evaluated Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map((req, i) => {
                      const isMatched = match.matchedSkills.some((m) => m.name === req.name && m.isMatch);
                      return (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1 border ${
                            isMatched
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {isMatched ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>{req.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setExplainJob({ job, match })}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Why {match.overallScore}% Match?</span>
                </button>

                {applicationStatus ? (
                  <Badge variant="success" size="md">
                    Status: {applicationStatus}
                  </Badge>
                ) : (
                  <button
                    onClick={() => handleApply(job.id, job.role)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <span>Instant Apply</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparent Explainable Match Modal ("WHY 89% MATCH?") */}
      {explainJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Match Score Transparency Breakdown</h3>
                  <p className="text-xs text-slate-400">{explainJob.job.role} • {explainJob.job.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setExplainJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Total Score Banner */}
              <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-300">Composite Match Index</span>
                  <p className="text-2xl font-black text-white font-mono mt-0.5">{explainJob.match.overallScore}% Match</p>
                </div>
                <Badge variant="success" size="md" dot>
                  High Recommendation Confidence
                </Badge>
              </div>

              {/* 4 Weighted Scoring Pillars */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Transparent 60-20-10-10 Scoring Model
                </h4>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">1. Verified Skill Alignment (60% Weight)</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {explainJob.match.skillMatchScore} / 60 Pts
                    </span>
                  </div>
                  <ProgressBar value={(explainJob.match.skillMatchScore / 60) * 100} showValue={false} size="sm" color="emerald" />
                  <p className="text-[11px] text-slate-400">
                    Matches verified proficiency levels against {explainJob.job.requiredSkills.length} job-required skills.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">2. Assessment & Practical Task Performance (20% Weight)</span>
                    <span className="font-mono font-bold text-indigo-300">
                      {explainJob.match.assessmentScore} / 20 Pts
                    </span>
                  </div>
                  <ProgressBar value={(explainJob.match.assessmentScore / 20) * 100} showValue={false} size="sm" color="indigo" />
                  <p className="text-[11px] text-slate-400">
                    Weighted average on deterministic tests, code modifications, and explanation vivas.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">3. Verified Capstone & Hardware Project Evidence (10% Weight)</span>
                    <span className="font-mono font-bold text-indigo-300">
                      {explainJob.match.projectEvidenceScore} / 10 Pts
                    </span>
                  </div>
                  <ProgressBar value={(explainJob.match.projectEvidenceScore / 10) * 100} showValue={false} size="sm" color="indigo" />
                  <p className="text-[11px] text-slate-400">
                    Faculty-endorsed hardware project repos and measured laboratory performance metrics.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">4. Core Coursework & Professional Certifications (10% Weight)</span>
                    <span className="font-mono font-bold text-indigo-300">
                      {explainJob.match.experienceScore} / 10 Pts
                    </span>
                  </div>
                  <ProgressBar value={(explainJob.match.experienceScore / 10) * 100} showValue={false} size="sm" color="indigo" />
                  <p className="text-[11px] text-slate-400">
                    Verified industry certifications (e.g. ARM University Program) and high academic standing.
                  </p>
                </div>
              </div>

              {/* Qualitative Explanation */}
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-slate-300 space-y-1">
                <span className="font-semibold text-indigo-300">Detailed Match Summary:</span>
                <p className="text-[11px] leading-relaxed text-slate-300">{explainJob.match.explanation}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <button
                onClick={() => setExplainJob(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApply(explainJob.job.id, explainJob.job.role);
                  setExplainJob(null);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <span>Submit Application</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
