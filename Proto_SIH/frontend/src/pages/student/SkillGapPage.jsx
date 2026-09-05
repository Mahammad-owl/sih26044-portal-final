import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import {
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Target,
  Compass,
  TrendingUp,
  ShieldAlert,
  Flame
} from 'lucide-react';

export default function SkillGapPage() {
  const [analysis, setAnalysis] = useState(null);
  const [careerRoles, setCareerRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('cr-01');
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotifications();

  const loadGapAnalysis = async (roleId) => {
    setLoading(true);
    try {
      const res = await api.getGapAnalysis(roleId);
      setAnalysis(res.analysis);
      setCareerRoles(res.availableCareerRoles || []);
    } catch (err) {
      showToast('Failed to calculate skill gap analysis', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGapAnalysis(selectedRoleId);
  }, [selectedRoleId]);

  if (loading && !analysis) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { careerRole, readinessScore, readySkills = [], gapSkills = [] } = analysis || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Target Role Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <GitPullRequest className="w-6 h-6 text-brand-600" />
            Skill Gap Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify exact competency deficits between industry benchmarks and verified abilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Target Role:</label>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
          >
            {careerRoles.map(cr => (
              <option key={cr.id} value={cr.id}>
                [{cr.discipline}] {cr.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Role Readiness Score Card */}
      {careerRole && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {careerRole.discipline} • Career Benchmark
            </span>
            <h2 className="text-2xl font-black text-white">{careerRole.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{careerRole.description}</p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span>Avg Salary: <strong className="text-white">{careerRole.average_salary_range}</strong></span>
              <span>•</span>
              <span>Ready Skills: <strong className="text-emerald-400">{readySkills.length}</strong></span>
              <span>•</span>
              <span>Actionable Gaps: <strong className="text-rose-400">{gapSkills.length}</strong></span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur border border-white/15 min-w-[140px] text-center">
            <span className="text-3xl font-black text-white">{readinessScore}%</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300 mt-1">
              Readiness Fit
            </span>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${readinessScore}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Gap Analysis Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Gaps Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              Identified Skill Gaps ({gapSkills.length})
            </h3>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Priority Order</span>
          </div>

          {gapSkills.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-600 bg-emerald-50 rounded-xl">
              🎉 No skill gaps! You meet or exceed all requirements for this career role.
            </div>
          ) : (
            <div className="space-y-3">
              {gapSkills.map((gap, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 ${
                    gap.priority === 'HIGH'
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{gap.skillName}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      gap.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {gap.priority} PRIORITY
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      Required: <strong className="text-slate-900 font-bold">L{gap.requiredLevel}</strong>
                    </span>
                    <span>
                      Current: <strong className="text-slate-700 font-medium">L{gap.currentLevel}</strong> ({gap.verificationStatus})
                    </span>
                    <span className="text-rose-600 font-bold">
                      Deficit: -{gap.gap} {gap.gap === 1 ? 'level' : 'levels'}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-brand-500 h-full"
                      style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                    />
                    <div
                      className="bg-rose-400/80 h-full"
                      style={{ width: `${(gap.gap / gap.requiredLevel) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ready / Verified Skills Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified & Ready Skills ({readySkills.length})
            </h3>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Meets Benchmark</span>
          </div>

          {readySkills.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
              No ready skills yet. Complete assessments and project verifications.
            </div>
          ) : (
            <div className="space-y-3">
              {readySkills.map((ready, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{ready.skillName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Ready (L{ready.currentLevel}/5)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Required: Level {ready.requiredLevel}</span>
                    <span className="text-emerald-700 font-semibold">
                      {ready.currentLevel > ready.requiredLevel ? '🌟 Exceeds by +1 level' : '✓ Exact Match'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer: Connect to Roadmap */}
      <div className="p-6 rounded-2xl bg-brand-50 border border-brand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-brand-950">Ready to close these skill gaps?</h4>
          <p className="text-xs text-brand-800 mt-0.5">
            Our dynamic learning roadmap creates step-by-step weekly milestones targeting your highest priority gaps.
          </p>
        </div>

        <Link
          to="/roadmap"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white transition-all shadow-sm shrink-0"
        >
          <Compass className="w-4 h-4" />
          View Target Learning Roadmap →
        </Link>
      </div>
    </div>
  );
}
