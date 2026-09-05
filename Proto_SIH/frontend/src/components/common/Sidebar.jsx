import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Award,
  CheckCircle2,
  FileCheck2,
  GitPullRequest,
  MapPin,
  Briefcase,
  Layers,
  FolderGit2,
  FileText,
  Building2,
  GraduationCap,
  Users,
  Compass,
  BarChart3,
  TrendingUp,
  Handshake,
  BookOpenCheck
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Student Profile', icon: User },
    { to: '/skills', label: 'Skills & Proficiency', icon: Award },
    { to: '/assessments', label: 'Assessments', icon: BookOpenCheck },
    { to: '/verification', label: 'Competence Verification', icon: FileCheck2 },
    { to: '/skill-gap', label: 'Skill Gap Engine', icon: GitPullRequest },
    { to: '/roadmap', label: 'Learning Roadmap', icon: Compass },
    { to: '/opportunities', label: 'Internships & Jobs', icon: Briefcase },
    { to: '/applications', label: 'My Applications', icon: Layers },
    { to: '/projects', label: 'Projects & Evidence', icon: FolderGit2 },
    { to: '/resume-parser', label: 'Resume Parser (AI)', icon: FileText },
    { to: '/portfolio', label: 'Verified Portfolio', icon: CheckCircle2 }
  ];

  const industryLinks = [
    { to: '/industry/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/industry/candidates', label: 'Candidate Matching', icon: Users },
    { to: '/industry/applications', label: 'Applicant Pipeline', icon: Layers },
    { to: '/industry/opportunities', label: 'Manage Opportunities', icon: Briefcase },
    { to: '/industry/collaborations', label: 'Academia Collaboration', icon: Handshake }
  ];

  const facultyLinks = [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/faculty/students', label: 'Student Roster & Gaps', icon: GraduationCap },
    { to: '/faculty/verifications', label: 'Verification Queue', icon: FileCheck2 },
    { to: '/faculty/projects', label: 'Project Reviews', icon: FolderGit2 },
    { to: '/faculty/assessments', label: 'Manage Assessments', icon: BookOpenCheck },
    { to: '/faculty/collaborations', label: 'Industry Initiatives', icon: Handshake }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Institution Dashboard', icon: LayoutDashboard },
    { to: '/admin/multi-branch', label: 'Multi-Branch Analytics', icon: BarChart3 },
    { to: '/admin/skill-demand', label: 'Skill Demand vs Supply', icon: TrendingUp },
    { to: '/admin/collaborations', label: 'MoUs & Collaborations', icon: Handshake },
    { to: '/faculty/students', label: 'Student Directory', icon: GraduationCap }
  ];

  const links = role === 'STUDENT' ? studentLinks
    : role === 'INDUSTRY' ? industryLinks
    : role === 'FACULTY' ? facultyLinks
    : adminLinks;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-3 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {role === 'STUDENT' ? 'Student Workspace'
            : role === 'INDUSTRY' ? 'Industry Recruiter Portal'
            : role === 'FACULTY' ? 'Academic Faculty Panel'
            : 'Institutional Administration'}
        </div>

        <nav className="space-y-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Institution / Platform Footer */}
      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] mt-6">
        <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1">
          <Building2 className="w-3.5 h-3.5 text-brand-400" />
          <span>Apex Institute of Tech</span>
        </div>
        <p className="text-slate-400 text-[10px]">
          SIH26044 Production MVP • Multi-Discipline
        </p>
      </div>
    </aside>
  );
}
