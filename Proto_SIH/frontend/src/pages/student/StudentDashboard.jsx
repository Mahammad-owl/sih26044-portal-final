import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import SkillBadge from '../../components/common/SkillBadge';
import MatchScoreCard from '../../components/common/MatchScoreCard';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Compass,
  Sparkles,
  BookOpenCheck,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await api.getStudentDashboard();
        setData(res);
      } catch (err) {
        setError('Failed to load student dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading Student Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-800">{error || 'Dashboard unavailable'}</p>
      </div>
    );
  }

  const { profile, stats, skills, verifiedSkills, gapAnalysis, careerRole, recommendedOpportunities, applications, roadmap } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-3 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            {profile.branch} • {profile.year} • {profile.institution_name}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {profile.name}!
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Target Career Goal: <strong className="text-brand-300">{profile.career_goal}</strong>.
            Your current validated readiness is <strong className="text-white font-bold">{stats.readinessScore}%</strong>.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/verification"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Practical Competence
            </Link>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
            >
              <Compass className="w-4 h-4" />
              View Learning Roadmap
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Skill Readiness"
          value={`${stats.readinessScore}%`}
          subtitle={`Target: ${careerRole ? careerRole.title : 'Embedded Engineer'}`}
          icon={TrendingUp}
          color="brand"
          trend="+8% this month"
        />
        <StatCard
          title="Verified Skills"
          value={stats.verifiedSkillsCount}
          subtitle="Multi-factor faculty validated"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Verification"
          value={stats.pendingSkillsCount}
          subtitle="Awaiting practical demo review"
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          title="Active Applications"
          value={stats.activeApplicationsCount}
          subtitle="Internships & placements"
          icon={Briefcase}
          color="purple"
        />
      </div>

      {/* Main Grid: Skills Matrix & Gap Engine Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Verified Skills & Gap Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verified Skills Showcase */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-600" />
                  Your Skill Competence Matrix
                </h3>
                <p className="text-xs text-slate-500">Verified evidence vs self-declared claims</p>
              </div>
              <Link to="/skills" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View All ({skills.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {skills.slice(0, 6).map((skill) => (
                <SkillBadge
                  key={skill.id}
                  name={skill.skill_name}
                  level={skill.verified_level || skill.claimed_level}
                  status={skill.verification_status}
                  confidence={skill.confidence_level}
                />
              ))}
            </div>
          </div>

          {/* Skill Gap Engine Highlights */}
          {gapAnalysis && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Target Role Gap Analysis ({gapAnalysis.careerRole.title})
                  </h3>
                  <p className="text-xs text-slate-500">Requirements vs Verified Demonstrated Levels</p>
                </div>
                <Link to="/skill-gap" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  Full Gap Engine <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {gapAnalysis.gapSkills.map((gap, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{gap.skillName}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          gap.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {gap.priority} PRIORITY GAP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Current: <strong className="text-slate-700">L{gap.currentLevel}</strong> → Required: <strong className="text-brand-700 font-bold">L{gap.requiredLevel}</strong> (Deficit: {gap.gap} levels)
                      </p>
                    </div>

                    <Link
                      to="/verification"
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-slate-300 hover:border-brand-400 text-xs font-semibold text-brand-700 transition-all shadow-xs"
                    >
                      Verify / Learn
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Top Recommended Internships & Roadmap Progress */}
        <div className="space-y-6">
          {/* Learning Roadmap Mini Progress */}
          {roadmap && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-brand-600" />
                  Roadmap Milestone
                </h3>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  {roadmap.learningPath.completed_modules}/{roadmap.learningPath.total_modules} Done
                </span>
              </div>

              <p className="text-xs font-medium text-slate-700">{roadmap.learningPath.title}</p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all"
                  style={{ width: `${(roadmap.learningPath.completed_modules / roadmap.learningPath.total_modules) * 100}%` }}
                />
              </div>

              <div className="mt-4 space-y-2">
                {roadmap.activities.slice(0, 3).map((act, i) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                      act.is_completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {act.is_completed ? '✓' : i + 1}
                    </span>
                    <div>
                      <p className={`font-semibold ${act.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {act.title}
                      </p>
                      <span className="text-[10px] text-slate-500">{act.skill_name} • {act.activity_type}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/roadmap"
                className="mt-4 block w-full text-center py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                Open Interactive Roadmap →
              </Link>
            </div>
          )}

          {/* Recommended Internship with Transparent 87% Match */}
          {recommendedOpportunities.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  Top Match Opportunity
                </h3>
                <Link to="/opportunities" className="text-xs font-semibold text-brand-600">
                  Browse All
                </Link>
              </div>

              {recommendedOpportunities.slice(0, 1).map((opp) => (
                <div key={opp.id} className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {opp.opportunity_type} • {opp.branch}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{opp.title}</h4>
                    <p className="text-xs text-slate-600">{opp.company_name} • {opp.location}</p>
                    <p className="text-xs font-semibold text-slate-700 mt-1">{opp.stipend}</p>
                  </div>

                  {/* Match Card */}
                  <MatchScoreCard match={{ finalScore: opp.matchScore, breakdown: opp.matchBreakdown }} compact={true} />

                  <Link
                    to={`/opportunities`}
                    className="block w-full text-center py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white transition-all shadow-sm"
                  >
                    View & Apply Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
