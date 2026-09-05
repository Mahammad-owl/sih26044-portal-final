import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import RoleBadge from './RoleBadge';
import {
  Bell,
  CheckCheck,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const { user, demoSwitch, logout } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();

  const handleDemoSwitch = async (role) => {
    setSwitching(true);
    try {
      await demoSwitch(role);
      if (role === 'STUDENT') navigate('/dashboard');
      else if (role === 'INDUSTRY') navigate('/industry/dashboard');
      else if (role === 'FACULTY') navigate('/faculty/dashboard');
      else if (role === 'INSTITUTION_ADMIN') navigate('/admin/dashboard');
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <Link to={user ? (user.role === 'STUDENT' ? '/dashboard' : user.role === 'INDUSTRY' ? '/industry/dashboard' : user.role === 'FACULTY' ? '/faculty/dashboard' : '/admin/dashboard') : '/'} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-black text-lg shadow-sm">
                S
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                  SIH26044
                  <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200">
                    PORTAL
                  </span>
                </span>
                <p className="text-[10px] font-medium text-slate-500 leading-none">Academia–Industry Collaboration</p>
              </div>
            </Link>
          </div>

          {/* Center Demo Role Switcher Toolbar */}
          {user && (
            <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 gap-1 text-xs">
              <span className="px-2 font-medium text-slate-500 flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Demo Switch:
              </span>
              <button
                type="button"
                onClick={() => handleDemoSwitch('STUDENT')}
                disabled={switching}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'STUDENT'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                Student (Ananya)
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitch('INDUSTRY')}
                disabled={switching}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'INDUSTRY'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                Industry (Nexa)
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitch('FACULTY')}
                disabled={switching}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'FACULTY'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                Faculty (Dr. Ramesh)
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitch('INSTITUTION_ADMIN')}
                disabled={switching}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'INSTITUTION_ADMIN'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                Admin (Apex Inst)
              </button>
            </div>
          )}

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
                    className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Popover */}
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[11px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">No notifications yet</div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => markRead(n.id)}
                              className={`p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                                !n.is_read ? 'bg-sky-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className={`font-semibold ${!n.is_read ? 'text-brand-900' : 'text-slate-800'}`}>
                                  {n.title}
                                </span>
                                {!n.is_read && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1" />}
                              </div>
                              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Pill */}
                <div className="relative">
                  <button
                    onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
                    />
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user.name}</div>
                      <RoleBadge role={user.role} size="sm" />
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1.5">
                          <RoleBadge role={user.role} size="sm" />
                        </div>
                      </div>

                      {user.role === 'STUDENT' && (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            Edit Profile
                          </Link>
                          <Link
                            to="/portfolio"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                            Public Verified Portfolio
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-brand-700 hover:text-brand-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
                >
                  Explore Demo
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
