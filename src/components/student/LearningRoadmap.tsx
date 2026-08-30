import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Map,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  FileCode,
  CheckSquare,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const LearningRoadmap: React.FC = () => {
  const { currentStudent, advanceRoadmapWeek, setStudentTab } = useApp();

  const completedWeeks = currentStudent.roadmap.filter((w) => w.status === 'Completed').length;
  const progressPercent = Math.round((completedWeeks / currentStudent.roadmap.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Personalized Learning Roadmap</h2>
            <Badge variant="purple" size="sm">
              AI-Curated 4-Week Sprint
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tailored specifically for <strong className="text-white">{currentStudent.name}</strong> to close RTOS & Embedded
            Linux gaps for <strong className="text-indigo-300">"Embedded Systems Engineer"</strong> roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Roadmap Completion</span>
            <p className="text-sm font-bold text-white font-mono">{progressPercent}%</p>
          </div>
          <div className="w-24">
            <ProgressBar value={progressPercent} showValue={false} size="md" color="emerald" />
          </div>
        </div>
      </div>

      {/* Connected Scenario Impact Highlight */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <p className="font-semibold text-indigo-200">Outcome-Driven Roadmap Engine</p>
          <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
            Every week includes a theoretical milestone, practical bare-metal implementation, and automated code
            verification check. Completing this roadmap unlocks top 1% matching with Bosch, Ather & Qualcomm openings.
          </p>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-4">
        {currentStudent.roadmap.map((week) => (
          <div
            key={week.week}
            className={`p-6 rounded-2xl border transition-all ${
              week.status === 'Completed'
                ? 'bg-slate-950/60 border-emerald-500/30'
                : week.status === 'In-Progress'
                ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-950/30 border-slate-800/60 opacity-80'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono border ${
                    week.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : week.status === 'In-Progress'
                      ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  W{week.week}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{week.phaseTitle}</h3>
                    <Badge
                      variant={week.status === 'Completed' ? 'success' : week.status === 'In-Progress' ? 'purple' : 'neutral'}
                      size="sm"
                    >
                      {week.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-indigo-300 font-medium mt-0.5">Focus Skill: {week.focusSkill}</p>
                </div>
              </div>

              {week.status === 'In-Progress' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStudentTab('assessment')}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Take Week 2 Quiz</span>
                  </button>
                  <button
                    onClick={() => advanceRoadmapWeek(currentStudent.id, week.week)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete & Advance</span>
                  </button>
                </div>
              )}
            </div>

            {/* Week Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 text-xs">
              {/* Learning Objectives & Topics */}
              <div className="space-y-2 lg:col-span-2">
                <p className="text-slate-300 leading-relaxed font-medium">{week.learningObjective}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {week.keyTopics.map((topic, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestone & Practical Output */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Milestone Lab Project:</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{week.milestoneProject}</p>
                </div>
                <div className="pt-2 border-t border-slate-900">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Verification Criterion:</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{week.verificationCheck}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
