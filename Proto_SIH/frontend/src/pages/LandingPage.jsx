import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Award,
  GitPullRequest,
  Briefcase,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Binary,
  Zap,
  Box,
  Building,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const { demoSwitch, user } = useAuth();
  const navigate = useNavigate();

  const handleLaunchDemo = async (role) => {
    await demoSwitch(role);
    if (role === 'STUDENT') navigate('/dashboard');
    else if (role === 'INDUSTRY') navigate('/industry/dashboard');
    else if (role === 'FACULTY') navigate('/faculty/dashboard');
    else if (role === 'INSTITUTION_ADMIN') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-black text-lg shadow-sm">
              S
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                SIH26044
                <span className="text-[10px] font-bold bg-brand-900/60 text-brand-300 px-1.5 py-0.5 rounded border border-brand-700">
                  NATIONAL PLATFORM
                </span>
              </span>
              <p className="text-[10px] font-medium text-slate-400">Academia–Industry Collaboration Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2"
            >
              Sign In
            </Link>
            <button
              onClick={() => handleLaunchDemo('STUDENT')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Demo (Ananya)
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-700 text-brand-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            Evidence-Based Competence Verification Architecture
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Bridging Academia, Skills & Industry
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Measure skills. Close gaps. Verify competence. Connect talent with opportunity.
            A unified multi-discipline ecosystem for engineering students, faculty, and industry recruiters.
          </p>

          {/* Quick 1-Click Role Access Grid */}
          <div className="mt-12 max-w-4xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Select a persona to test the live prototype:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {/* Student Card */}
              <button
                type="button"
                onClick={() => handleLaunchDemo('STUDENT')}
                className="group p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                      Student
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Ananya Sharma</h3>
                  <p className="text-xs text-slate-400 mt-1">ECE 2nd Year • Embedded Systems Goal • 74% Readiness</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-sky-300 font-medium">
                  Assessments, Gaps & Roadmap →
                </div>
              </button>

              {/* Industry Card */}
              <button
                type="button"
                onClick={() => handleLaunchDemo('INDUSTRY')}
                className="group p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
                      Industry
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Nexa Embedded Labs</h3>
                  <p className="text-xs text-slate-400 mt-1">Tier-1 Semiconductor & Firmware Recruiter</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-purple-300 font-medium">
                  Candidate Matching & Pipeline →
                </div>
              </button>

              {/* Faculty Card */}
              <button
                type="button"
                onClick={() => handleLaunchDemo('FACULTY')}
                className="group p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Faculty
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Dr. Ramesh Kumar</h3>
                  <p className="text-xs text-slate-400 mt-1">Professor & HOD, ECE Department</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-emerald-300 font-medium">
                  Verify Skills & Review Projects →
                </div>
              </button>

              {/* Admin Card */}
              <button
                type="button"
                onClick={() => handleLaunchDemo('INSTITUTION_ADMIN')}
                className="group p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                      Admin
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Apex Institute of Tech</h3>
                  <p className="text-xs text-slate-400 mt-1">Institutional Leadership & Placement Director</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-amber-300 font-medium">
                  Multi-Branch Analytics & MoUs →
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Branch Support Section */}
      <section className="py-14 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400">Multi-Discipline Engineering Support</h2>
            <p className="text-2xl font-bold text-white mt-1">Not Just CSE. Built For Every Major Discipline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">ECE</h4>
              <p className="text-xs text-slate-400 mt-1">Embedded C, ARM, Microcontrollers, RTOS, VLSI, Verilog, IoT, PCB</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center mb-3">
                <Binary className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">CSE</h4>
              <p className="text-xs text-slate-400 mt-1">Python, AI/ML, Cloud & DevOps, Cybersecurity, SQL, Web Dev</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">EEE</h4>
              <p className="text-xs text-slate-400 mt-1">Power Systems, Smart Grid, SCADA, Control Systems, Drives</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-950 text-rose-400 flex items-center justify-center mb-3">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Mechanical</h4>
              <p className="text-xs text-slate-400 mt-1">SolidWorks CAD, Robotics & ROS, FEA/ANSYS, CNC Manufacturing</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Civil</h4>
              <p className="text-xs text-slate-400 mt-1">STAAD.Pro, AutoCAD Civil 3D, Revit BIM, Seismic Analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Competence Verification Philosophy */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Core Verification Principle</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                "We Do Not Claim To Detect ChatGPT. We Verify Competence."
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                Self-declared skill claims are never treated as verified. Instead, our evidence engine combines:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Timed algorithmic & technical assessments</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified project repository & architecture review</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hands-on camera demonstration recording / lab tasks</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dynamic code modification & consistency analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>SIH26044 — Smart India Hackathon Prototype • Apex Institute of Technology</p>
        <p className="mt-1 text-[11px] text-slate-600">Completely Offline-Ready Local Architecture • Zero External Paid APIs</p>
      </footer>
    </div>
  );
}
