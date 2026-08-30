import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Send,
  X
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const StudentGapTracker: React.FC = () => {
  const { analytics, setFacultyTab } = useApp();
  const [remedialDeployed, setRemedialDeployed] = useState<string | null>(null);

  const eceGaps = analytics.branchSkillGaps.find((b) => b.branch === 'ECE')?.gaps || [];

  const handleDeployRemedial = (skillName: string) => {
    setRemedialDeployed(`Remedial sprint module for "${skillName}" deployed to all 121 affected ECE students!`);
    setTimeout(() => setRemedialDeployed(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Department Cohort Skill Gap Monitor</h2>
            <Badge variant="purple" size="sm">
              ECE Cohort Analysis
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry of student competency deficits compared against active campus recruiter hiring requirements.
          </p>
        </div>

        <Badge variant="danger" size="md" dot>
          Critical Gap: FreeRTOS & Kernel (38% Cohort)
        </Badge>
      </div>

      {remedialDeployed && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{remedialDeployed}</span>
          </div>
          <button onClick={() => setRemedialDeployed(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cohort Gap Cards */}
      <div className="space-y-4">
        {eceGaps.map((gap, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-sm text-white">{gap.skillName}</h3>
                <Badge variant={gap.gapSeverity === 'HIGH' ? 'danger' : 'warning'} size="sm">
                  {gap.gapSeverity} SEVERITY
                </Badge>
              </div>

              <p className="text-xs text-slate-300 font-medium">{gap.industryUrgency}</p>

              <div className="pt-2 max-w-md">
                <ProgressBar
                  value={gap.studentsWithGapPercent}
                  label={`Students with Gap: ${gap.studentsWithGapPercent}% of ECE Department (${Math.round(
                    320 * (gap.studentsWithGapPercent / 100)
                  )} Students)`}
                  size="sm"
                  color={gap.gapSeverity === 'HIGH' ? 'rose' : 'amber'}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <button
                onClick={() => handleDeployRemedial(gap.skillName)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deploy Remedial Module</span>
              </button>

              <button
                onClick={() => setFacultyTab('industry-programs')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Request Industry Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
