import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import SkillBadge from '../../components/common/SkillBadge';
import Modal from '../../components/common/Modal';
import {
  Award,
  Plus,
  ShieldCheck,
  BookOpenCheck,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';

export default function StudentSkills() {
  const [studentSkills, setStudentSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [claimedLevel, setClaimedLevel] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useNotifications();

  const loadSkills = async () => {
    try {
      const res = await api.getStudentSkills();
      setStudentSkills(res.studentSkills || []);
      setAvailableSkills(res.availableSkills || []);
      if (res.availableSkills?.length > 0 && !selectedSkillId) {
        setSelectedSkillId(res.availableSkills[0].id);
      }
    } catch (err) {
      showToast('Failed to load skills data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    setSubmitting(true);
    try {
      await api.addStudentSkill({ skillId: selectedSkillId, claimedLevel: Number(claimedLevel) });
      showToast('Skill added to profile! Take an assessment or submit practical evidence to verify it. 🎯', 'success');
      setIsAddModalOpen(false);
      loadSkills();
    } catch (err) {
      showToast(err.message || 'Failed to add skill', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const disciplines = ['ALL', 'ECE', 'CSE', 'EEE', 'Mechanical', 'Civil'];

  const filteredSkills = studentSkills.filter(s => {
    const matchesDiscipline = selectedDiscipline === 'ALL' || s.discipline === selectedDiscipline;
    const matchesSearch = s.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiscipline && matchesSearch;
  });

  const verifiedCount = studentSkills.filter(s => s.verification_status === 'VERIFIED').length;
  const inReviewCount = studentSkills.filter(s => s.verification_status === 'IN_REVIEW').length;
  const unverifiedCount = studentSkills.filter(s => s.verification_status === 'NOT_VERIFIED').length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-600" />
            Skills & Competence Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Self-declared skills require multi-factor assessment and practical evidence to earn verified badges.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/resume-parser"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Import from Resume (AI)
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Skill to Profile
          </button>
        </div>
      </div>

      {/* Verification Status Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Verified Skills</span>
            <h3 className="text-2xl font-bold text-emerald-950 mt-0.5">{verifiedCount}</h3>
            <p className="text-[11px] text-emerald-700 mt-0.5">Faculty & evidence endorsed</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">In Faculty Review</span>
            <h3 className="text-2xl font-bold text-amber-950 mt-0.5">{inReviewCount}</h3>
            <p className="text-[11px] text-amber-700 mt-0.5">Practical task submitted</p>
          </div>
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>

        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Self-Declared Claims</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{unverifiedCount}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Unverified proficiency</p>
          </div>
          <Award className="w-8 h-8 text-slate-400" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Discipline Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 mr-1 hidden sm:block" />
          {disciplines.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDiscipline(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDiscipline === d
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>
      </div>

      {/* Skills Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map(skill => (
          <div
            key={skill.id}
            className={`p-5 rounded-2xl border transition-all ${
              skill.verification_status === 'VERIFIED'
                ? 'bg-white border-emerald-200/80 shadow-sm hover:border-emerald-400'
                : skill.verification_status === 'IN_REVIEW'
                ? 'bg-white border-amber-200/80 shadow-sm hover:border-amber-400'
                : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {skill.discipline} • {skill.category}
                  </span>
                  {skill.verification_status === 'VERIFIED' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Level {skill.verified_level}/5
                    </span>
                  )}
                  {skill.verification_status === 'IN_REVIEW' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      In Faculty Review
                    </span>
                  )}
                  {skill.verification_status === 'NOT_VERIFIED' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Self-Declared Level {skill.claimed_level}/5
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{skill.skill_name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{skill.description}</p>
              </div>
            </div>

            {/* Proficiency Levels Progress */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Claimed</span>
                <span className="font-bold text-slate-800">L{skill.claimed_level}/5</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Assessment</span>
                <span className="font-bold text-slate-800">
                  {skill.assessment_level > 0 ? `L${skill.assessment_level}/5` : 'Not Taken'}
                </span>
              </div>
              <div className={`p-2 rounded-lg ${skill.verification_status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'bg-slate-50 text-slate-800'}`}>
                <span className="text-[10px] text-slate-500 block">Verified</span>
                <span className="font-bold">
                  {skill.verified_level > 0 ? `L${skill.verified_level}/5` : '—'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <Link
                to="/assessments"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <BookOpenCheck className="w-3.5 h-3.5" />
                Take Test
              </Link>
              <Link
                to="/verification"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white transition-all shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Submit Verification Evidence
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Technical Skill to Profile">
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Skill from Catalog</label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {availableSkills.map(s => (
                <option key={s.id} value={s.id}>
                  [{s.discipline}] {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Claimed Proficiency Level (1 - 5)</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setClaimedLevel(lvl)}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                    claimedLevel === lvl
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>L{lvl}</div>
                  <div className="text-[9px] font-normal opacity-80 mt-0.5">
                    {lvl === 1 ? 'Beginner' : lvl === 2 ? 'Basic' : lvl === 3 ? 'Intermediate' : lvl === 4 ? 'Advanced' : 'Expert'}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic">
              * Note: Self-declared skills remain unverified until supported by assessment scores and practical evidence.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
            >
              {submitting ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
