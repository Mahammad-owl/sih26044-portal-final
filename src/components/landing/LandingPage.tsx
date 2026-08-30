import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Building2,
  BookOpen,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Layers,
  ChevronRight,
  Handshake,
  Activity,
  Zap,
  Target,
  FileBadge
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const LandingPage: React.FC = () => {
  const { loginAs, setStudentTab } = useApp();

  const disciplines = [
    { name: 'ECE', skills: 'Embedded Systems, VLSI, IoT Telemetry, PCB Design', icon: Cpu, color: 'text-indigo-400 border-indigo-500/30' },
    { name: 'CSE', skills: 'Cloud Native, AI/ML, Microservices, Cybersecurity', icon: Zap, color: 'text-sky-400 border-sky-500/30' },
    { name: 'EEE', skills: 'EV Powertrain, BMS, MATLAB Simulink, Power Systems', icon: Activity, color: 'text-amber-400 border-amber-500/30' },
    { name: 'Mechanical', skills: 'SolidWorks 3D CAD, ANSYS FEA, Robotics, ROS 2', icon: Target, color: 'text-rose-400 border-rose-500/30' },
    { name: 'Civil', skills: 'Autodesk Revit 4D BIM, ETABS Seismic, GIS Drone Topography', icon: Layers, color: 'text-emerald-400 border-emerald-500/30' }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-[#090d16] pt-12 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Smart India Hackathon 2026 • Problem Statement SIH26044</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Bridging the Gap Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Academic Skills</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Industry Requirements</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A unified national platform connecting <strong className="text-white">Students ↔ Academia ↔ Industry</strong> for evidence-based skill verification, real-time gap analysis, personalized roadmaps, and explainable internship matching across all engineering disciplines.
          </p>

          {/* Quick Demo Launch Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                loginAs('student');
                setStudentTab('dashboard');
              }}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Launch Student Portal (Hero Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => loginAs('industry')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm flex items-center gap-2.5 transition-all"
            >
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>Industry Recruiter View</span>
            </button>

            <button
              onClick={() => loginAs('admin')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm flex items-center gap-2.5 transition-all"
            >
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>Institution Analytics</span>
            </button>
          </div>

          {/* Quick Demo Accounts Banner */}
          <div className="pt-6 max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2.5">
              1-Click Demo Accounts (No Setup Required)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                onClick={() => loginAs('student')}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
              >
                <span className="text-[10px] text-slate-500 block">Student Role</span>
                <span className="font-semibold text-slate-200 group-hover:text-indigo-400">student@demo.com</span>
              </button>
              <button
                onClick={() => loginAs('industry')}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
              >
                <span className="text-[10px] text-slate-500 block">Industry Recruiter</span>
                <span className="font-semibold text-slate-200 group-hover:text-indigo-400">industry@demo.com</span>
              </button>
              <button
                onClick={() => loginAs('faculty')}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
              >
                <span className="text-[10px] text-slate-500 block">Faculty Mentor</span>
                <span className="font-semibold text-slate-200 group-hover:text-indigo-400">faculty@demo.com</span>
              </button>
              <button
                onClick={() => loginAs('admin')}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
              >
                <span className="text-[10px] text-slate-500 block">Institution Admin</span>
                <span className="font-semibold text-slate-200 group-hover:text-indigo-400">admin@demo.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connected 3-Way Ecosystem Pillars */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="purple" size="md">Unified Ecosystem</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            The Three Pillars of Collaboration
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
            Dynamic data loop aligning student learning with real industry hiring demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Students */}
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">For Students</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Self-assess, verify skills with hardware/code evidence, identify exact gaps against target roles, and follow personalized learning roadmaps.
              </p>
              <div className="space-y-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Evidence-Based Skill Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Automated Skill Gap Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Explainable 60-20-10-10 Match Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Tamper-Evident Digital Portfolio</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => loginAs('student')}
              className="mt-6 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: Industry */}
          <div className="glass-panel p-6 rounded-2xl border border-sky-500/20 hover:border-sky-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">For Industry</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Post job requirements with required skill levels, discover ranked verified talent, and sponsor campus labs, workshops, and hackathons.
              </p>
              <div className="space-y-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>Ranked Candidate Pipeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>"Why Match?" Transparent Breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>Direct Lab & Hackathon Sponsorship</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>Zero Unverified Resume Spam</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => loginAs('industry')}
              className="mt-6 w-full py-2 bg-sky-600/20 hover:bg-sky-600/40 border border-sky-500/30 text-sky-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Industry Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3: Academia */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">For Academia & Admin</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Track cohort-wide skill gaps against real industry demand, align curriculum, and manage institutional MoUs and faculty enablement programs.
              </p>
              <div className="space-y-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Department Skill Gap Heatmaps</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Industry Skill Demand Forecasting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Placement & Internship Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Collaboration Program Request Hub</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => loginAs('admin')}
              className="mt-6 w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Branch Engineering Coverage Section */}
      <div className="py-14 px-6 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="warning" size="md">Multi-Discipline Engineering</Badge>
            <h2 className="text-2xl font-bold text-white mt-2">
              Beyond CSE: Supporting All Engineering Branches
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dynamic skill taxonomy tailored for core and interdisciplinary engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {disciplines.map((d, i) => {
              const Icon = d.icon;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border bg-slate-900/60 ${d.color} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-sm text-white">{d.name} Dept</span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{d.skills}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Connected Demo Scenario Highlight */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/30 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connected Demo Scenario</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              See How Ananya (ECE) Connects to Bosch & Institution Analytics
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. Ananya (ECE) targets <strong>Embedded Systems Engineer</strong>.<br />
              2. Platform verifies her <strong>Embedded C & Microcontrollers</strong> skills, but highlights an <strong>RTOS (FreeRTOS)</strong> gap.<br />
              3. Platform generates an interactive 4-week roadmap and matches her at <strong>89% with Bosch IoT Firmware Intern</strong>.<br />
              4. Institution Dashboard reveals that <strong>38% of ECE students</strong> share this exact RTOS gap, prompting a sponsored lab workshop with Bosch!
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-auto flex-shrink-0">
            <button
              onClick={() => {
                loginAs('student');
                setStudentTab('dashboard');
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30"
            >
              <span>Step 1: Open Ananya's Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                loginAs('industry');
              }}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <span>Step 2: See Bosch Recruiter View</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                loginAs('admin');
              }}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <span>Step 3: View ECE RTOS Gap in Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-500">
        <p>Smart India Hackathon (SIH-2026) Prototype • Problem Statement SIH26044</p>
        <p className="mt-1 text-[11px] text-slate-600">Built completely offline-ready with local storage & transparent explainable verification models.</p>
      </footer>
    </div>
  );
};
