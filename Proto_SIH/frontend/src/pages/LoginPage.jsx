import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Sparkles, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('student@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoSwitch } = useAuth();
  const navigate = useNavigate();

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'STUDENT') navigate('/dashboard');
      else if (user.role === 'INDUSTRY') navigate('/industry/dashboard');
      else if (user.role === 'FACULTY') navigate('/faculty/dashboard');
      else if (user.role === 'INSTITUTION_ADMIN') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      await demoSwitch(role);
      if (role === 'STUDENT') navigate('/dashboard');
      else if (role === 'INDUSTRY') navigate('/industry/dashboard');
      else if (role === 'FACULTY') navigate('/faculty/dashboard');
      else if (role === 'INSTITUTION_ADMIN') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Demo switch failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-black text-2xl shadow-xl mx-auto mb-3">
          S
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          Sign In to SIH26044 Portal
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Academia–Industry Collaboration Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        {/* Quick Demo Access Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>1-Click Hackathon Demo Access:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('STUDENT')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-sky-950/60 border border-slate-700 hover:border-sky-500 text-left transition-all group"
            >
              <div className="text-[10px] font-bold text-sky-400 uppercase">Student</div>
              <div className="text-xs font-semibold text-white group-hover:text-sky-300 truncate">Ananya Sharma (ECE)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('INDUSTRY')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500 text-left transition-all group"
            >
              <div className="text-[10px] font-bold text-purple-400 uppercase">Industry</div>
              <div className="text-xs font-semibold text-white group-hover:text-purple-300 truncate">Nexa Embedded Labs</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('FACULTY')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500 text-left transition-all group"
            >
              <div className="text-[10px] font-bold text-emerald-400 uppercase">Faculty</div>
              <div className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate">Dr. Ramesh Kumar</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('INSTITUTION_ADMIN')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500 text-left transition-all group"
            >
              <div className="text-[10px] font-bold text-amber-400 uppercase">Admin</div>
              <div className="text-xs font-semibold text-white group-hover:text-amber-300 truncate">Dr. S. K. Mehra</div>
            </button>
          </div>
        </div>

        {/* Standard Login Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-800">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Email Address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@demo.com"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="demo123"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Default demo password for all accounts is: <strong className="text-slate-600 font-mono">demo123</strong></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:ring-4 focus:ring-brand-500/20 transition-all shadow-md"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
