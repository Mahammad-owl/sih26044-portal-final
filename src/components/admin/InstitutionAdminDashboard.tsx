import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Building2,
  Users,
  Award,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Handshake,
  Download
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { StatCard } from '../common/StatCard';
import { ProgressBar } from '../common/ProgressBar';
import { Discipline } from '../../types';

export const InstitutionAdminDashboard: React.FC = () => {
  const { analytics, setAdminTab } = useApp();
  const [selectedBranch, setSelectedBranch] = useState<Discipline>('ECE');

  const branchDemand = analytics.branchSkillDemand.find((b) => b.branch === selectedBranch)?.skills || [];
  const branchGaps = analytics.branchSkillGaps.find((b) => b.branch === selectedBranch)?.gaps || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Institutional Demand & Skill-Gap Analytics</h2>
            <Badge variant="purple" size="sm">
              NIT Trichy • Academic Year 2025-26
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous macro intelligence analyzing 48+ hiring partners, 1,480 enrolled students, and placement conversion rates across all engineering disciplines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdminTab('collaborations')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <Handshake className="w-4 h-4" />
            <span>Manage Industry MoUs</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrolled Students"
          value={analytics.totalStudents.toLocaleString()}
          subtitle="Across 5 Core Disciplines"
          icon={Users}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10 border-indigo-500/20"
        />
        <StatCard
          title="Verified Profiles"
          value={analytics.verifiedProfilesCount.toLocaleString()}
          subtitle="77.3% Verification Rate"
          icon={ShieldCheck}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Core Placement Rate"
          value="89%"
          subtitle="+17% increase via Skill Mapping"
          icon={TrendingUp}
          iconColor="text-sky-400"
          iconBg="bg-sky-500/10 border-sky-500/20"
          trend={{ value: '+8% YoY', isPositive: true }}
        />
        <StatCard
          title="Active Industry MoUs"
          value={analytics.activeIndustryPartners}
          subtitle="Tier-1 Global & National Firms"
          icon={Building2}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />
      </div>

      {/* Interactive Branch Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Select Engineering Department:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['ECE', 'CSE', 'EEE', 'Mechanical', 'Civil'] as Discipline[]).map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedBranch === branch
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {branch} Department
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Analytics Grid: Industry Demand vs Cohort Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Skill Demand Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Hiring Market Skill Demand ({selectedBranch})</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated from active campus hiring mandates</p>
            </div>
            <Badge variant="purple" size="sm">
              Live Demand Index
            </Badge>
          </div>

          <div className="space-y-4">
            {branchDemand.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">{item.demandPercentage}%</span>
                    <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                      {item.growthRate}
                    </span>
                  </div>
                </div>
                <ProgressBar value={item.demandPercentage} showValue={false} size="md" color="indigo" />
              </div>
            ))}
          </div>
        </div>

        {/* Department Skill Gap Heatmap */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white text-base">Identified Cohort Skill Gaps ({selectedBranch})</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Deficits between student verified skills and industry benchmarks</p>
            </div>
            <Badge variant="danger" size="sm">
              Action Required
            </Badge>
          </div>

          <div className="space-y-4">
            {branchGaps.map((gap, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{gap.skillName}</span>
                  <Badge variant={gap.gapSeverity === 'HIGH' ? 'danger' : 'warning'} size="sm">
                    {gap.gapSeverity} GAP
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400">{gap.industryUrgency}</p>
                <div className="pt-1">
                  <ProgressBar
                    value={gap.studentsWithGapPercent}
                    label={`Deficit: ${gap.studentsWithGapPercent}% of Cohort`}
                    size="sm"
                    color={gap.gapSeverity === 'HIGH' ? 'rose' : 'amber'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Readiness & Placement Rate Comparison Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Department-Wise Skill Readiness & Placement Matrix</h3>
            <p className="text-xs text-slate-400">Benchmarked across all 5 engineering departments</p>
          </div>
          <Badge variant="info" size="sm">
            NIRF / AICTE Compliance
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-3">Department</th>
                <th className="pb-3">Enrolled Students</th>
                <th className="pb-3">Assessment Participation</th>
                <th className="pb-3">Avg Skill Readiness</th>
                <th className="pb-3 pr-3 text-right">Internship / Placement Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {analytics.departmentReadiness.map((dept, i) => (
                <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 pl-3 font-bold text-white">{dept.department} Engineering</td>
                  <td className="py-3.5 font-mono text-slate-300">{dept.totalEnrolled}</td>
                  <td className="py-3.5 font-mono text-indigo-300">{dept.assessmentParticipationRate}%</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">{dept.avgReadiness}%</span>
                      <div className="w-20 hidden sm:block">
                        <ProgressBar value={dept.avgReadiness} showValue={false} size="sm" color="emerald" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 text-right font-mono font-bold text-emerald-400">
                    {dept.internshipPlacementRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Placement Trends Historical Chart Cards */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">Placement Growth & Core Engineering Trajectory</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {analytics.placementTrends.map((trend, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-indigo-300">{trend.year}</span>
              <p className="text-xl font-bold text-white font-mono mt-1">{trend.totalPlaced} Placed</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                <span>Avg: {trend.avgStipend}</span>
                <span className="text-emerald-400 font-semibold">{trend.coreBranchPercentage}% Core</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
