import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Send,
  X,
  ExternalLink,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Discipline, Student, MatchBreakdown } from '../../types';

export const CandidateMatching: React.FC = () => {
  const { students, jobs, calculateMatch, selectedJobId, setSelectedJobId, selectedCandidateStudentId, setSelectedCandidateStudentId } = useApp();

  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidateData, setSelectedCandidateData] = useState<{ student: Student; match: MatchBreakdown } | null>(null);
  const [interviewInvited, setInterviewInvited] = useState<string | null>(null);

  const activeJob = jobs.find((j) => j.id === (selectedJobId || jobs[0].id)) || jobs[0];

  // Filter candidates
  const filteredCandidates = students
    .filter((stud) => {
      const matchBranch = selectedDiscipline === 'ALL' || stud.branch === selectedDiscipline;
      const matchSearch =
        stud.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stud.careerGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stud.verifiedSkills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchBranch && matchSearch;
    })
    .map((stud) => ({
      student: stud,
      match: calculateMatch(activeJob, stud)
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);

  const handleScheduleInterview = (studentName: string) => {
    setInterviewInvited(`Technical Interview invite sent to ${studentName}!`);
    setTimeout(() => setInterviewInvited(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Verified Candidate Matching Engine</h2>
            <Badge variant="purple" size="sm">
              Role: {activeJob.role}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Candidates ranked by verified skills, practical code assessments, and faculty-signed project evidence.
          </p>
        </div>

        {/* Job selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Evaluating For:</label>
          <select
            value={activeJob.id}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.role} ({j.companyName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {interviewInvited && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{interviewInvited}</span>
          </div>
          <button onClick={() => setInterviewInvited(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        {/* Branch Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'ECE', 'CSE', 'EEE', 'Mechanical', 'Civil'].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDiscipline(d)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDiscipline === d
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {d === 'ALL' ? 'All Disciplines' : `${d} Dept`}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate or skill..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {filteredCandidates.map(({ student, match }, idx) => (
          <div
            key={student.id}
            onClick={() => setSelectedCandidateData({ student, match })}
            className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-400">
                #{idx + 1}
              </span>
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                    {student.name}
                  </h3>
                  <Badge variant="purple" size="sm">
                    {student.branch} • Year {student.year}
                  </Badge>
                  <Badge variant="success" size="sm" dot>
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {student.college} • Target: <strong className="text-slate-300">{student.careerGoal}</strong>
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {student.verifiedSkills.slice(0, 4).map((s) => (
                    <span
                      key={s.id}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                    >
                      {s.name} (L{s.verifiedLevel})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Match Score & Action */}
            <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-900">
              <div className="text-right">
                <span className="text-xl font-black text-emerald-400 font-mono block leading-none">
                  {match.overallScore}%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Match Index</span>
              </div>

              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20">
                <span>View Breakdown</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Deep Audit Modal ("WHY 89% MATCH?") */}
      {selectedCandidateData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCandidateData.student.avatar}
                  alt={selectedCandidateData.student.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{selectedCandidateData.student.name}</h3>
                    <Badge variant="purple" size="sm">
                      {selectedCandidateData.student.branch} Engineering
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Candidate for: <strong className="text-white">{activeJob.role}</strong> ({activeJob.companyName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateData(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Top Match Card */}
              <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-300">Automated Match Score</span>
                  <p className="text-2xl font-black text-white font-mono mt-0.5">
                    {selectedCandidateData.match.overallScore}% MATCH
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="success" size="md" dot>
                    Pre-Qualified Candidate
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1">Verified with 7-Layer Evidence Engine</p>
                </div>
              </div>

              {/* WHY MATCH Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  WHY {selectedCandidateData.match.overallScore}% MATCH? (Transparent Competency Audit)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Verified Matched Competencies */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified Required Skills</span>
                    </span>
                    <div className="space-y-1.5">
                      {selectedCandidateData.match.matchedSkills.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                          <span>{s.name}</span>
                          <span className="font-mono text-emerald-400 font-semibold">
                            Level {s.level} / {s.requiredLevel} ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing or In-Progress */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>In-Progress / Missing Skills</span>
                    </span>
                    {selectedCandidateData.match.missingSkills.length > 0 ? (
                      <div className="space-y-1.5">
                        {selectedCandidateData.match.missingSkills.map((s, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>{s.name}</span>
                            <Badge variant={s.gapSeverity === 'HIGH' ? 'danger' : 'warning'} size="sm">
                              {s.gapSeverity} Gap
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">No missing skills detected.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Verified Hardware & Project Evidence Preview */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified Project & Hardware Evidence
                </h4>
                {selectedCandidateData.student.projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{proj.title}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Faculty Signed: {proj.facultyMentor}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{proj.description}</p>
                  </div>
                ))}
              </div>

              {/* Privacy & Anti-Fraud Notice */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>
                  Candidate data is privacy-protected under institutional data governance. No unverified claims are displayed.
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <button
                onClick={() => setSelectedCandidateData(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleScheduleInterview(selectedCandidateData.student.name);
                    setSelectedCandidateData(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Technical Interview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
