import React, { useState } from 'react';
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
  Clock,
  ExternalLink,
  Award,
  Layers,
  CheckSquare,
  HelpCircle
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

interface CuratedResource {
  title: string;
  provider: string;
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Online Course' | 'Official Documentation' | 'Interactive Sandbox' | 'Hands-on Lab';
  freeLearningStatus: '100% Free Access' | 'Free Audit Available' | 'Open Source Community';
  certFeeInfo: string;
  duration: string;
  prerequisites: string;
  url: string;
}

export const SkillGapAnalysis: React.FC = () => {
  const { currentStudent, setStudentTab } = useApp();
  const [selectedSkillGapId, setSelectedSkillGapId] = useState<string | null>(null);

  // Reputable free learning resource directory mapped by skill keyword
  const curatedFreeResources: Record<string, CuratedResource[]> = {
    rtos: [
      {
        title: 'FreeRTOS Real-Time Kernel - Official Mastering Guide & API Documentation',
        provider: 'FreeRTOS.org / AWS Documentation',
        skill: 'RTOS (FreeRTOS)',
        level: 'Intermediate',
        type: 'Official Documentation',
        freeLearningStatus: '100% Free Access',
        certFeeInfo: 'Open Source MIT License (Zero Exam Fee)',
        duration: '15 Hours Self-Paced',
        prerequisites: 'C Programming, Pointers, Microcontroller Architecture',
        url: 'https://www.freertos.org/Documentation/RTOS_book.html'
      },
      {
        title: 'NPTEL: Embedded System Design with ARM & Real-Time Operating Systems',
        provider: 'NPTEL / IIT Kharagpur (Govt of India)',
        skill: 'RTOS (FreeRTOS)',
        level: 'Intermediate',
        type: 'Online Course',
        freeLearningStatus: 'Free Audit Available',
        certFeeInfo: 'Free Courseware Access. Optional Proctored Exam: ₹1,000',
        duration: '8 Weeks (3 hrs/week)',
        prerequisites: 'Basic Digital Electronics, Embedded C',
        url: 'https://nptel.ac.in/courses/106105193'
      },
      {
        title: 'ARM Education: RTOS Kernel Scheduling & IPC Telemetry',
        provider: 'ARM University Program & GitHub Learning Lab',
        skill: 'RTOS (FreeRTOS)',
        level: 'Intermediate',
        type: 'Hands-on Lab',
        freeLearningStatus: '100% Free Access',
        certFeeInfo: 'Free Open Education Resource',
        duration: '10 Hours',
        prerequisites: 'STM32 / Cortex-M Keil or STM32CubeIDE',
        url: 'https://github.com/arm-university'
      }
    ],
    linux: [
      {
        title: 'Embedded Linux Kernel & Device Drivers Foundation',
        provider: 'Bootlin Embedded Linux Training / Linux Foundation',
        skill: 'Embedded Linux',
        level: 'Advanced',
        type: 'Hands-on Lab',
        freeLearningStatus: '100% Free Access',
        certFeeInfo: 'Creative Commons CC-BY-SA (Free Labs & Slides)',
        duration: '20 Hours',
        prerequisites: 'C Programming, POSIX basics, Shell scripting',
        url: 'https://bootlin.com/training/embedded-linux/'
      },
      {
        title: 'SWAYAM: Linux Operating System & System Calls',
        provider: 'SWAYAM / IIT Bombay',
        skill: 'Embedded Linux',
        level: 'Intermediate',
        type: 'Online Course',
        freeLearningStatus: '100% Free Access',
        certFeeInfo: 'Free learning access; optional certificate evaluation fee',
        duration: '6 Weeks',
        prerequisites: 'Basic Operating Systems',
        url: 'https://swayam.gov.in'
      }
    ],
    default: [
      {
        title: 'NPTEL: Core Technical Competency Module for Engineering Students',
        provider: 'NPTEL / IIT Madras (Govt of India Initiative)',
        skill: 'Engineering Fundamentals',
        level: 'Intermediate',
        type: 'Online Course',
        freeLearningStatus: 'Free Audit Available',
        certFeeInfo: 'Free Course Videos & Assignments. Optional Exam: ₹1,000',
        duration: '6 Weeks',
        prerequisites: 'Standard Undergraduate Curriculum',
        url: 'https://nptel.ac.in'
      },
      {
        title: 'Microsoft Learn: Cloud, Embedded Edge & Developer Fundamentals',
        provider: 'Microsoft Learn',
        skill: 'Technical Toolchain',
        level: 'Beginner',
        type: 'Interactive Sandbox',
        freeLearningStatus: '100% Free Access',
        certFeeInfo: 'Free Sandbox & Self-Assessments (No Credit Card)',
        duration: '8 Hours',
        prerequisites: 'None',
        url: 'https://learn.microsoft.com'
      },
      {
        title: 'MDN Web Docs & Open Systems Architecture Documentation',
        provider: 'MDN / Mozilla Foundation',
        skill: 'System Protocols & Architecture',
        level: 'Beginner',
        type: 'Official Documentation',
        freeLearningStatus: '100% Free Access',
        certFeeInfo: 'Open Community Standard (100% Free)',
        duration: 'Self-Paced Reference',
        prerequisites: 'None',
        url: 'https://developer.mozilla.org'
      }
    ]
  };

  const getResourcesForSkill = (skillName: string): CuratedResource[] => {
    const lower = skillName.toLowerCase();
    if (lower.includes('rtos') || lower.includes('freertos')) return curatedFreeResources.rtos;
    if (lower.includes('linux')) return curatedFreeResources.linux;
    return curatedFreeResources.default;
  };

  const verifiedSkillsList = currentStudent.verifiedSkills || [];
  const skillGapsList = currentStudent.skillGaps || [];

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
            <span>View 4-Week Learning Roadmap</span>
          </button>
        </div>
      </div>

      {/* The Central SIH Workflow Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>The Closed-Loop Skill Progression Pathway (SIH26044 Core Workflow)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px] text-center">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Step 1</span>
            <span className="font-semibold text-rose-300">Identify Gap</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Step 2</span>
            <span className="font-semibold text-sky-300">Free Resources</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Step 3</span>
            <span className="font-semibold text-indigo-300">Hands-On Task</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Step 4</span>
            <span className="font-semibold text-amber-300">Evidence Project</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Step 5</span>
            <span className="font-semibold text-purple-300">Assessment Viva</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Step 6</span>
            <span className="font-semibold text-emerald-300">Verified Upgrade</span>
          </div>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Ready Verified Skills</p>
            <p className="text-xl font-bold text-white mt-0.5">{verifiedSkillsList.length} Verified</p>
            <p className="text-[10px] text-emerald-400 font-medium">
              {verifiedSkillsList.slice(0, 2).map((s) => s.name).join(', ') || 'Diagnostics Initialized'}
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-rose-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Critical Skill Gaps</p>
            <p className="text-xl font-bold text-white mt-0.5">{skillGapsList.length} Gaps Flagged</p>
            <p className="text-[10px] text-rose-400 font-medium">Target Role Disconnect</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Estimated Closure Sprint</p>
            <p className="text-xl font-bold text-white mt-0.5">3-4 Weeks</p>
            <p className="text-[10px] text-indigo-300 font-medium">Curated Free Education Modules</p>
          </div>
        </div>
      </div>

      {/* Target Role Competency Comparison */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-base">Benchmark Comparison: {currentStudent.careerGoal}</h3>
            <p className="text-xs text-slate-400">
              Evaluated against real industry requirements across {currentStudent.branch} recruiting partners.
            </p>
          </div>
          <Badge variant="info" size="sm">
            Hiring Benchmark v2.6 • {currentStudent.branch}
          </Badge>
        </div>

        {/* 1. Verified Skills (Ready) */}
        {verifiedSkillsList.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Ready Competencies ({verifiedSkillsList.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {verifiedSkillsList.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{skill.name}</span>
                    <Badge variant="success" size="sm">
                      Level {skill.verifiedLevel}/5 • Verified
                    </Badge>
                  </div>
                  <ProgressBar value={(skill.verifiedLevel / 5) * 100} showValue={false} size="sm" color="emerald" />
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Score: {skill.assessmentScore}% • Task: {skill.practicalTaskScore}% • Evidence: {skill.projectEvidence.projectName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Critical Skill Gaps & Free Learning Pathway */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Skill Gaps & Curated Learning Recommendations</span>
          </h4>

          {skillGapsList.map((gap) => {
            const resources = getResourcesForSkill(gap.skillName);
            const isExpanded = selectedSkillGapId === gap.id;

            return (
              <div
                key={gap.id}
                className="p-5 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-sm text-white block">{gap.skillName}</span>
                      <span className="text-[11px] text-slate-400">{gap.category} Competency</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={gap.gapSeverity === 'HIGH' ? 'danger' : 'warning'} size="sm">
                      {gap.gapSeverity} SEVERITY GAP
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">
                      Current: <strong className="text-rose-400">Level {gap.currentLevel}/5</strong> • Target: <strong className="text-white">Level {gap.targetLevel}/5</strong>
                    </span>
                  </div>
                </div>

                <ProgressBar
                  value={(gap.currentLevel / gap.targetLevel) * 100}
                  showValue={false}
                  size="sm"
                  color="rose"
                />

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-rose-300">Why Critical: </strong>
                    {gap.impactOnTargetRole}
                  </p>
                  <p className="text-indigo-300 font-medium pt-1">
                    Recommended Action: {gap.recommendedAction} ({gap.learningTimeEstWeeks} Weeks Sprint)
                  </p>
                </div>

                {/* Free Reputable Learning Resources Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Connected Free Learning Providers (NPTEL, SWAYAM, Docs & Lab Sprints)</span>
                    </span>
                    <button
                      onClick={() => setStudentTab('roadmap')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <span>Jump to Roadmap</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {resources.map((res, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-2.5"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">
                              {res.provider}
                            </span>
                            <Badge variant="purple" size="sm">
                              {res.level}
                            </Badge>
                          </div>
                          <h5 className="font-bold text-xs text-white line-clamp-2 leading-tight">
                            {res.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Type: <strong className="text-slate-300">{res.type}</strong> • Est: {res.duration}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[10px]">
                          <div className="flex items-center justify-between text-emerald-400 font-medium">
                            <span>Status:</span>
                            <span>{res.freeLearningStatus}</span>
                          </div>
                          <div className="text-slate-400 bg-slate-950/60 p-2 rounded-lg leading-tight">
                            <strong className="text-slate-300">Certification Note: </strong>
                            {res.certFeeInfo}
                          </div>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-center font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>Open Official Course</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
