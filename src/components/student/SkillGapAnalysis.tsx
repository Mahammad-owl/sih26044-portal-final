import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Map,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Sparkles,
  Clock
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const SkillGapAnalysis: React.FC = () => {
  const { currentStudent, setStudentTab } = useApp();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Real-Time Skill Gap Analysis</h2>
            <Badge variant="purple" size="sm">
              Target: {currentStudent.careerGoal}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated benchmark matching student verified competencies against current industry job role specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStudentTab('roadmap')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <Map className="w-4 h-4" />
            <span>Generate Action Roadmap</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Ready Competencies</p>
            <p className="text-xl font-bold text-white mt-0.5">3 Core Skills</p>
            <p className="text-[10px] text-emerald-400 font-medium">Embedded C, ARM, Sensors</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-rose-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Critical Skill Gaps</p>
            <p className="text-xl font-bold text-white mt-0.5">{currentStudent.skillGaps.length} Gaps Flagged</p>
            <p className="text-[10px] text-rose-400 font-medium">RTOS & Embedded Linux</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Estimated Closure Time</p>
            <p className="text-xl font-bold text-white mt-0.5">4-5 Weeks</p>
            <p className="text-[10px] text-indigo-300 font-medium">With structured mini-projects</p>
          </div>
        </div>
      </div>

      {/* Target Role Competency Comparison Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Benchmark Comparison: {currentStudent.careerGoal}</h3>
            <p className="text-xs text-slate-400">Target Level benchmarked against Tier-1 hardware & embedded employers</p>
          </div>
          <Badge variant="info" size="sm">
            Industry Benchmark Model v2.4
          </Badge>
        </div>

        <div className="space-y-4">
          {/* 1. Embedded C (Ready) */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-white">Embedded C & Register Manipulation</span>
                <Badge variant="success" size="sm">
                  READY (MATCHED)
                </Badge>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Current: <strong className="text-emerald-400">Level 4/5</strong> • Target: <strong>Level 4/5</strong>
              </div>
            </div>
            <ProgressBar value={100} showValue={false} size="sm" color="emerald" />
            <p className="text-[11px] text-slate-400">
              Verified with STM32 CAN-Bus Telemetry project. Candidate meets high-reliability automotive firmware baseline.
            </p>
          </div>

          {/* 2. Microcontrollers (Ready) */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-white">Microcontrollers (ARM Cortex-M & Timers)</span>
                <Badge variant="success" size="sm">
                  READY (MATCHED)
                </Badge>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Current: <strong className="text-emerald-400">Level 4/5</strong> • Target: <strong>Level 4/5</strong>
              </div>
            </div>
            <ProgressBar value={100} showValue={false} size="sm" color="emerald" />
            <p className="text-[11px] text-slate-400">
              Verified through interrupt-driven RPM meter demonstration and nested vector interrupt handling.
            </p>
          </div>

          {/* 3. RTOS FreeRTOS (HIGH GAP) */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-xs text-white">RTOS (FreeRTOS / Zephyr Task Scheduling & IPC)</span>
                <Badge variant="danger" size="sm">
                  HIGH SEVERITY GAP
                </Badge>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Current: <strong className="text-rose-400">Level 1/5</strong> • Target: <strong className="text-white">Level 4/5</strong>
              </div>
            </div>
            <ProgressBar value={25} showValue={false} size="sm" color="rose" />
            <p className="text-[11px] text-slate-300">
              <strong className="text-rose-300">Why Critical:</strong> Demanded in 88% of campus core embedded placements (Bosch, Ather, Qualcomm). Candidate lacks verified implementation of thread-safe message queues and mutex priority inversion handling.
            </p>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-indigo-300 font-medium">Recommended Action: FreeRTOS 2-Week Hands-On Sprint</span>
              <button
                onClick={() => setStudentTab('roadmap')}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1"
              >
                <span>Jump to Week 2 Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Embedded Linux (HIGH GAP) */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-xs text-white">Embedded Linux & Kernel Device Drivers</span>
                <Badge variant="danger" size="sm">
                  HIGH SEVERITY GAP
                </Badge>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Current: <strong className="text-rose-400">Level 0/5</strong> • Target: <strong className="text-white">Level 3/5</strong>
              </div>
            </div>
            <ProgressBar value={0} showValue={false} size="sm" color="rose" />
            <p className="text-[11px] text-slate-300">
              <strong className="text-rose-300">Why Critical:</strong> Modern smart edge gateway firmware relies on custom Yocto Linux distributions and character device drivers.
            </p>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-indigo-300 font-medium">Recommended Action: Week 3 Embedded Linux Kernel Module Workshop</span>
              <button
                onClick={() => setStudentTab('roadmap')}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1"
              >
                <span>View Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
