import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Building2,
  BookOpen,
  BarChart3,
  Globe,
  Sparkles,
  HelpCircle,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const DemoSwitcherBar: React.FC = () => {
  const { currentRole, loginAs, setCurrentRole, currentStudent, setStudentTab, setIndustryTab, setAdminTab } = useApp();
  const [showDemoGuide, setShowDemoGuide] = useState(false);

  const demoSteps = [
    {
      num: 1,
      title: 'Open Landing Page',
      desc: 'See the 3-way bridge: Students ↔ Academia ↔ Industry.',
      action: () => setCurrentRole('landing')
    },
    {
      num: 2,
      title: 'Student Portal: Verified Profile',
      desc: 'Inspect Ananya (ECE, 3rd Year) with verified Embedded C, Microcontrollers, and 84% readiness.',
      action: () => {
        loginAs('student');
        setStudentTab('dashboard');
      }
    },
    {
      num: 3,
      title: 'Evidence-Based Verification Engine',
      desc: 'Show anti-fraud transparent verification: practical tasks, project evidence, explanation viva, and consistency check.',
      action: () => {
        loginAs('student');
        setStudentTab('verification');
      }
    },
    {
      num: 4,
      title: 'Skill Gap Analysis',
      desc: 'Compare target role (Embedded Systems Engineer) vs verified skills: RTOS (FreeRTOS) & Embedded Linux flagged as HIGH gap.',
      action: () => {
        loginAs('student');
        setStudentTab('skill-gap');
      }
    },
    {
      num: 5,
      title: 'Personalized Learning Roadmap',
      desc: 'Step-by-step 4-week roadmap bridging FreeRTOS, IPC Queues, and automotive telemetry.',
      action: () => {
        loginAs('student');
        setStudentTab('roadmap');
      }
    },
    {
      num: 6,
      title: 'Internship Matching (Explainable 89%)',
      desc: 'Click Bosch IoT Firmware Intern to see transparent 60-20-10-10 score calculation.',
      action: () => {
        loginAs('student');
        setStudentTab('matching');
      }
    },
    {
      num: 7,
      title: 'Take Live Interactive Assessment',
      desc: 'Test knowledge in FreeRTOS kernel & watch real-time score verification update.',
      action: () => {
        loginAs('student');
        setStudentTab('assessment');
      }
    },
    {
      num: 8,
      title: 'Switch to Industry Portal (Bosch)',
      desc: 'View ranked candidate pipeline where Ananya is top-ranked at 89% match with verified evidence.',
      action: () => {
        loginAs('industry');
        setIndustryTab('candidates');
      }
    },
    {
      num: 9,
      title: 'Institution Admin Analytics',
      desc: 'See institute-wide analytics: 38% ECE students have RTOS gaps despite 88% industry demand.',
      action: () => {
        loginAs('admin');
        setAdminTab('analytics');
      }
    },
    {
      num: 10,
      title: 'Academia-Industry Collaboration Hub',
      desc: 'Explore Bosch hardware lab sponsorships, Ather BMS masterclasses, and college requests.',
      action: () => {
        loginAs('admin');
        setAdminTab('collaborations');
      }
    }
  ];

  return (
    <>
      {/* Top Demo Bar */}
      <div className="bg-slate-900/95 border-b border-indigo-500/20 backdrop-blur-md px-4 py-2 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Logo / Title & Connected Scenario Tag */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>SIH-2026</span>
              <span className="text-[10px] text-slate-400 font-mono">PS: SIH26044</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-slate-400">
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Live Hero Scenario:</span>
              <span className="text-emerald-400 font-medium">{currentStudent.name}</span>
              <span className="text-slate-400">({currentStudent.branch} → Embedded Systems)</span>
            </div>
          </div>

          {/* Quick Portal Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentRole('landing')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'landing'
                  ? 'bg-indigo-600 text-white shadow font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Landing</span>
            </button>

            <button
              onClick={() => loginAs('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'student'
                  ? 'bg-indigo-600 text-white shadow font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student (Ananya)</span>
            </button>

            <button
              onClick={() => loginAs('industry')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'industry'
                  ? 'bg-indigo-600 text-white shadow font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Industry (Bosch)</span>
            </button>

            <button
              onClick={() => loginAs('faculty')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'faculty'
                  ? 'bg-indigo-600 text-white shadow font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academia / Faculty</span>
            </button>

            <button
              onClick={() => loginAs('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Institute Admin</span>
            </button>
          </div>

          {/* Walkthrough Guide Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDemoGuide(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-medium transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>3-Min Judge Demo Flow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Presentation Guide Modal */}
      {showDemoGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">SIH-2026 3-Minute Judge Presentation Flow</h3>
                  <p className="text-xs text-slate-400">Click any step to jump immediately to that live screen</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-2.5">
              {demoSteps.map((step) => (
                <div
                  key={step.num}
                  onClick={() => {
                    step.action();
                    setShowDemoGuide(false);
                  }}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-indigo-950/30 hover:border-indigo-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-colors">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300">{step.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center text-xs text-slate-400">
              <span>Supports ECE, CSE, EEE, Mechanical & Civil disciplines.</span>
              <button
                onClick={() => setShowDemoGuide(false)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
