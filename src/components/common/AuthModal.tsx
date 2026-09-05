import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  Building2,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Badge } from './Badge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { loginWithCredentials, registerAccount } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'INDUSTRY' | 'FACULTY'>('STUDENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Student Fields
  const [institutionName, setInstitutionName] = useState('National Institute of Technology');
  const [branch, setBranch] = useState<'ECE' | 'CSE' | 'EEE' | 'Mechanical' | 'Civil'>('ECE');
  const [year, setYear] = useState('3rd Year');
  const [careerGoal, setCareerGoal] = useState('Embedded Systems Engineer');
  const [cgpa, setCgpa] = useState('8.5');

  // Industry Fields
  const [companyName, setCompanyName] = useState('');
  const [industrySector, setIndustrySector] = useState('Semiconductor & Embedded IoT');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('Bangalore, India');
  const [description, setDescription] = useState('');

  // Faculty Fields
  const [department, setDepartment] = useState('Electronics & Communication Engineering');
  const [designation, setDesignation] = useState('Associate Professor & Skill Incharge');

  if (!isOpen) return null;

  const handleDemoFill = (role: 'student' | 'industry' | 'faculty' | 'admin') => {
    setErrorMsg(null);
    if (role === 'student') {
      setEmail('student.demo@demo.sih');
      setPassword('demo123');
    } else if (role === 'industry') {
      setEmail('industry.demo@demo.sih');
      setPassword('demo123');
    } else if (role === 'faculty') {
      setEmail('academia.demo@demo.sih');
      setPassword('demo123');
    } else if (role === 'admin') {
      setEmail('admin.demo@demo.sih');
      setPassword('demo123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Please enter your email and password');
        }
        await loginWithCredentials(email, password);
        onClose();
      } else {
        // Registration
        if (!name.trim() || !email.trim() || !password) {
          throw new Error('Please fill in all required registration fields');
        }

        const payload: any = {
          role: selectedRole,
          name: name.trim(),
          email: email.trim(),
          password,
          phone
        };

        if (selectedRole === 'STUDENT') {
          payload.institution_name = institutionName;
          payload.branch = branch;
          payload.year = year;
          payload.career_goal = careerGoal;
          payload.cgpa = cgpa;
        } else if (selectedRole === 'INDUSTRY') {
          payload.company_name = companyName || `${name}'s Systems`;
          payload.industry_sector = industrySector;
          payload.website = website;
          payload.location = location;
          payload.description = description;
        } else if (selectedRole === 'FACULTY') {
          payload.institution_name = institutionName;
          payload.department = department;
          payload.designation = designation;
        }

        await registerAccount(payload);
        setSuccessMsg('Account registered successfully! Redirecting to your portal...');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 bg-slate-900/95 text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>SIH26044 • Unified Portal Access</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {mode === 'login' ? 'Sign In to SKILLSETU' : 'Create New Portal Account'}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {mode === 'login'
              ? 'Enter with your real registered account or select a pre-loaded judge demo identity.'
              : 'Register a real database-backed account for Student, Industry, or Academia.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Demo Quick Fills */}
        {mode === 'login' && (
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Fill (Judge Fast Demo)
              </span>
              <span className="text-[10px] text-indigo-400 font-mono">Password: demo123</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('student')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-left transition-all"
              >
                <span className="text-[10px] text-slate-500 block">Student</span>
                <span className="text-xs font-bold text-slate-200">Ananya (ECE)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('industry')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-left transition-all"
              >
                <span className="text-[10px] text-slate-500 block">Industry</span>
                <span className="text-xs font-bold text-slate-200">Bosch Talent</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('faculty')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-left transition-all"
              >
                <span className="text-[10px] text-slate-500 block">Academia</span>
                <span className="text-xs font-bold text-slate-200">Dr. Ramesh</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-left transition-all"
              >
                <span className="text-[10px] text-slate-500 block">Admin</span>
                <span className="text-xs font-bold text-slate-200">Dean NIT</span>
              </button>
            </div>
          </div>
        )}

        {/* Role Selector for Registration */}
        {mode === 'register' && (
          <div className="mb-5 space-y-2">
            <label className="text-xs font-semibold text-slate-300">Select Your User Role:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('STUDENT')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'STUDENT'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('INDUSTRY')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'INDUSTRY'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold">Industry</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('FACULTY')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'FACULTY'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold">Academia</span>
              </button>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name / Official Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma / Tech Hiring Lead"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {mode === 'register' && selectedRole === 'FACULTY' ? 'Institutional Email *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder={mode === 'login' ? 'email@example.com / demo email' : 'you@institute.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Student-specific registration fields */}
          {mode === 'register' && selectedRole === 'STUDENT' && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Engineering Discipline *</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ECE">Electronics & Communication (ECE)</option>
                    <option value="CSE">Computer Science & Eng (CSE)</option>
                    <option value="EEE">Electrical & Electronics (EEE)</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Academic Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="1st Year">1st Year (Foundations)</option>
                    <option value="2nd Year">2nd Year (Core Skills)</option>
                    <option value="3rd Year">3rd Year (Internship Ready)</option>
                    <option value="4th Year">4th Year (Placement Ready)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">College / Institution Name</label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Career Goal</label>
                  <input
                    type="text"
                    value={careerGoal}
                    placeholder="e.g. Embedded Firmware Engineer"
                    onChange={(e) => setCareerGoal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Industry-specific registration fields */}
          {mode === 'register' && selectedRole === 'INDUSTRY' && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bosch Global / Ather Energy"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={industrySector}
                    onChange={(e) => setIndustrySector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Work Location / City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Faculty-specific registration fields */}
          {mode === 'register' && selectedRole === 'FACULTY' && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Academic Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setShowForgotNotice(!showForgotNotice)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Forgot Password?
              </button>
              <span className="text-[11px] text-slate-500">Secure SQLite Session</span>
            </div>
          )}

          {showForgotNotice && (
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300">
              Prototype Note: All demo accounts use password <strong className="text-white">demo123</strong>. For newly
              registered accounts, please sign in with the password you specified during registration.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : mode === 'login' ? (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Complete Registration & Launch Portal</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
