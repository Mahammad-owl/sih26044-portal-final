import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  TrendingUp,
  Map,
  Briefcase,
  CheckSquare,
  FileBadge,
  Sparkles,
  Users,
  PlusCircle,
  Handshake,
  BarChart3,
  BookOpen,
  PieChart,
  Layers,
  ArrowRightLeft,
  Flame,
  Award
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentRole,
    studentTab,
    setStudentTab,
    industryTab,
    setIndustryTab,
    facultyTab,
    setFacultyTab,
    adminTab,
    setAdminTab,
    currentStudent
  } = useApp();

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'profile', label: 'Student Profile', icon: User, badge: null },
    { id: 'verification', label: 'Evidence Verification', icon: ShieldCheck, badge: 'Anti-Fraud' },
    { id: 'skill-gap', label: 'Skill Gap Analysis', icon: TrendingUp, badge: `${currentStudent.skillGaps.length} Gaps` },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Map, badge: 'Week 2' },
    { id: 'matching', label: 'Internship Matching', icon: Briefcase, badge: '89% Top' },
    { id: 'assessment', label: 'Skill Assessment', icon: CheckSquare, badge: 'Live MCQ' },
    { id: 'portfolio', label: 'Digital Portfolio', icon: FileBadge, badge: 'Verified' },
    { id: 'ai-resume', label: 'AI Resume Parser', icon: Sparkles, badge: 'AI Tool' }
  ];

  const industryNavItems = [
    { id: 'dashboard', label: 'Industry Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'candidates', label: 'Ranked Candidates', icon: Users, badge: '8 Matched' },
    { id: 'create-job', label: 'Post Job / Internship', icon: PlusCircle, badge: null },
    { id: 'collaborations', label: 'Academia Collaboration', icon: Handshake, badge: '4 Active' }
  ];

  const facultyNavItems = [
    { id: 'dashboard', label: 'Faculty Overview', icon: LayoutDashboard, badge: null },
    { id: 'skill-gaps', label: 'Cohort Skill Gaps', icon: TrendingUp, badge: 'ECE Dept' },
    { id: 'assessments', label: 'Assessment Manager', icon: CheckSquare, badge: '2 Active' },
    { id: 'industry-programs', label: 'Industry MoUs & Labs', icon: Handshake, badge: '3 Offers' }
  ];

  const adminNavItems = [
    { id: 'analytics', label: 'Institutional Demand', icon: BarChart3, badge: 'YoY Trends' },
    { id: 'skill-gaps', label: 'Branch Gap Heatmap', icon: PieChart, badge: '5 Branches' },
    { id: 'collaborations', label: 'Collaboration Hub', icon: Handshake, badge: 'MoUs' }
  ];

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800/80 flex flex-col flex-shrink-0 min-h-[calc(100vh-3rem)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-lg">
          SK
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-white block">
            SKILL<span className="text-indigo-400">SETU</span>
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            {currentRole === 'student'
              ? 'Student Portal'
              : currentRole === 'industry'
              ? 'Industry Portal'
              : currentRole === 'faculty'
              ? 'Academia Portal'
              : 'Admin Dashboard'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-3.5 flex-1 space-y-1">
        {currentRole === 'student' &&
          studentNavItems.map((item) => {
            const Icon = item.icon;
            const active = studentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setStudentTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      active ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

        {currentRole === 'industry' &&
          industryNavItems.map((item) => {
            const Icon = item.icon;
            const active = industryTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setIndustryTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      active ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

        {currentRole === 'faculty' &&
          facultyNavItems.map((item) => {
            const Icon = item.icon;
            const active = facultyTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFacultyTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      active ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

        {currentRole === 'admin' &&
          adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      active ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* Connected Scenario Badge in sidebar footer */}
      <div className="p-4 m-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
          <Award className="w-3.5 h-3.5" />
          <span>Evidence-Verified</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Tamper-evident verification engine linking lab projects, tests & viva checks.
        </p>
      </div>
    </aside>
  );
};
