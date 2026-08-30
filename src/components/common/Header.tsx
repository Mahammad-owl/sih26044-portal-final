import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  Award,
  Layers
} from 'lucide-react';
import { Badge } from './Badge';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenAIParser?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenAIParser }) => {
  const { currentRole, currentStudent, selectedCompanyId, jobs } = useApp();

  const company = jobs.find((j) => j.companyId === selectedCompanyId)?.companyName || 'Bosch Engineering';

  return (
    <header className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-12 z-40">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
          {currentRole === 'student' && (
            <Badge variant="purple" size="sm">
              <span className="font-mono">{currentStudent.branch} Dept</span>
            </Badge>
          )}
          {currentRole === 'industry' && (
            <Badge variant="info" size="sm">
              <span>{company}</span>
            </Badge>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* AI Assisted Assistant trigger */}
        {onOpenAIParser && (
          <button
            onClick={onOpenAIParser}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-500/60 text-xs font-semibold transition-all shadow-sm group"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span>AI Skill Extractor</span>
          </button>
        )}

        {/* User Pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          {currentRole === 'student' ? (
            <div className="flex items-center gap-2.5">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">{currentStudent.name}</p>
                <p className="text-[10px] text-slate-400">{currentStudent.careerGoal}</p>
              </div>
            </div>
          ) : currentRole === 'industry' ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs">
                BE
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">Bosch Talent Gateway</p>
                <p className="text-[10px] text-slate-400">Technical Recruiter</p>
              </div>
            </div>
          ) : currentRole === 'faculty' ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                FA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">Dr. K. S. Ramanathan</p>
                <p className="text-[10px] text-slate-400">Head of Dept, ECE</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">Dean - Industry Relations</p>
                <p className="text-[10px] text-slate-400">NIT Institution Admin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
