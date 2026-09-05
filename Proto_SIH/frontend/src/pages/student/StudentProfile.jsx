import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Target,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FolderGit2
} from 'lucide-react';

export default function StudentProfile() {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useNotifications();
  const [profile, setProfile] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: 'ECE',
    year: '2nd Year',
    institution_name: '',
    career_goal: '',
    location: '',
    about: '',
    cgpa: 8.5,
    roll_no: ''
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.getStudentProfile();
        setProfile(res.profile);
        setCertifications(res.certifications || []);
        setProjects(res.projects || []);
        setFormData({
          name: res.profile.name || '',
          phone: res.profile.phone || '',
          branch: res.profile.branch || 'ECE',
          year: res.profile.year || '2nd Year',
          institution_name: res.profile.institution_name || '',
          career_goal: res.profile.career_goal || '',
          location: res.profile.location || '',
          about: res.profile.about || '',
          cgpa: res.profile.cgpa || 8.5,
          roll_no: res.profile.roll_no || ''
        });
      } catch (err) {
        showToast('Failed to load profile details', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateStudentProfile(formData);
      setProfile(res.profile);
      updateUserProfile(res.profile);
      showToast('Profile updated and persisted successfully! ✅', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6 text-brand-600" />
            Student Profile Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep your academic background, career goal, and engineering profile up to date.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            Personal & Academic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={profile?.email || user?.email || ''}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Roll / Registration Number</label>
              <input
                type="text"
                name="roll_no"
                value={formData.roll_no}
                onChange={handleChange}
                placeholder="AIT-2024-ECE-042"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Engineering Discipline / Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="ECE">ECE (Electronics & Communication)</option>
                <option value="CSE">CSE (Computer Science & Engineering)</option>
                <option value="EEE">EEE (Electrical & Electronics)</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Civil">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Standing / Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cumulative CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institution Name</label>
              <input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                placeholder="Apex Institute of Technology"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Career & Aspirations */}
        <div className="pt-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-600" />
            Career Goals & Aspirations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Career Role</label>
              <input
                type="text"
                name="career_goal"
                value={formData.career_goal}
                onChange={handleChange}
                placeholder="e.g. Embedded Systems Engineer, VLSI RTL Designer"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
              <p className="text-[10px] text-slate-400 mt-1">This feeds the real-time Skill Gap Engine and Learning Roadmap.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location Preference</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New Delhi, Bangalore, Remote"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Professional Summary / About</label>
              <textarea
                rows={3}
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Write a brief technical summary of your hands-on interests and projects..."
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-bold text-white transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Attached Certifications & Projects Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Verified Certifications ({certifications.length})
          </h3>
          <div className="space-y-2">
            {certifications.map(c => (
              <div key={c.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <p className="font-bold text-slate-900">{c.title}</p>
                <p className="text-[11px] text-slate-500">{c.issuer} • Credential: {c.credential_id}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-purple-600" />
            Projects & Evidence ({projects.length})
          </h3>
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{p.title}</p>
                  <p className="text-[11px] text-slate-500">{p.technologies}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  p.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
