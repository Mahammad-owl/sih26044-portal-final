import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  Award,
  Layers,
  LogOut,
  UserPlus,
  LogIn,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';
import { Badge } from './Badge';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenAIParser?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenAIParser }) => {
  const {
    currentRole,
    currentUser,
    currentStudent,
    selectedCompanyId,
    jobs,
    openAuthModal,
    logout,
    notifications,
    markNotificationRead,
    clearAllNotifications
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const company = jobs.find((j) => j.companyId === selectedCompanyId)?.companyName || 'Bosch Engineering';
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="bg-slate-900/70 border-b border-slate-800/80 px-6 py-3.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-12 z-40">
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
          {currentRole === 'faculty' && (
            <Badge variant="success" size="sm">
              <span>Academia Portal</span>
            </Badge>
          )}
          {currentRole === 'admin' && (
            <Badge variant="warning" size="sm">
              <span>NIT Administration</span>
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-500/60 text-xs font-semibold transition-all shadow-sm group"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span>AI Skill Extractor</span>
          </button>
        )}

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-slate-200 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">System Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="danger" size="sm">
                      {unreadCount} Unread
                    </Badge>
                  )}
                </div>
                <button
                  onClick={clearAllNotifications}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        notif.isRead
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                          : 'bg-indigo-950/30 border-indigo-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">{notif.title}</span>
                        <span className="text-[10px] text-slate-500">{notif.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill & Account Actions */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
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

          {/* Quick Register / Switch / Sign Out buttons */}
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => openAuthModal('register')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
              title="Register New Account"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Sign Up</span>
            </button>

            <button
              onClick={() => openAuthModal('login')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
              title="Sign In / Switch"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Sign In</span>
            </button>

            <button
              onClick={logout}
              className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/60 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out to Landing"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
