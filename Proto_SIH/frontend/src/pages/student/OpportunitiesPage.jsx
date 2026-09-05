import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import MatchScoreCard from '../../components/common/MatchScoreCard';
import Modal from '../../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Application Modal state
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [applying, setApplying] = useState(false);
  const { showToast } = useNotifications();

  const loadOpportunities = async () => {
    try {
      const res = await api.getOpportunities({
        branch: selectedBranch,
        type: selectedType,
        mode: selectedMode,
        search: searchQuery
      });
      setOpportunities(res.opportunities || []);
    } catch (err) {
      showToast('Failed to load opportunities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [selectedBranch, selectedType, selectedMode, searchQuery]);

  const handleOpenApplyModal = (opp) => {
    setSelectedOpp(opp);
    setCoverLetter(`I am very interested in the ${opp.title} opening at ${opp.company_name}. My verified technical coursework and lab projects align closely with your requirements.`);
    setResumeSummary(`Verified engineering student with demonstrated practical competence.`);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;
    setApplying(true);
    try {
      const res = await api.applyOpportunity(selectedOpp.id, {
        coverLetter,
        resumeSummary
      });

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      showToast(`Application submitted to ${selectedOpp.company_name}! 🚀 Match Score: ${res.matchScore}%`, 'success');
      setSelectedOpp(null);
      loadOpportunities();
    } catch (err) {
      showToast(err.message || 'Failed to submit application', 'error');
    } finally {
      setApplying(false);
    }
  };

  const branches = ['ALL', 'ECE', 'CSE', 'EEE', 'Mechanical', 'Civil'];
  const types = ['ALL', 'INTERNSHIP', 'FULL_TIME', 'APPRENTICESHIP'];

  if (loading && opportunities.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-brand-600" />
          Industry Internships & Career Opportunities
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Opportunities matched transparently against your verified skills, assessment results, and projects.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Branch Pill Filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Discipline:</span>
            {branches.map(b => (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedBranch === b
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, role, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
            />
          </div>
        </div>

        {/* Opportunity Type & Mode Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
            >
              <option value="ALL">All Types</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FULL_TIME">Full-time Job</option>
              <option value="APPRENTICESHIP">Apprenticeship</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Work Mode:</span>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
            >
              <option value="ALL">All Modes</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ON_SITE">On-Site</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            No opportunities matched your search criteria. Try adjusting your filters.
          </div>
        ) : (
          opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-brand-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {opp.opportunity_type} • {opp.branch}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {opp.mode}
                    </span>
                    {opp.isApplied && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Applied
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-1">{opp.title}</h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.company_name}</span>
                    <span className="text-slate-300">•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.location}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-extrabold text-slate-900">{opp.stipend}</div>
                  <span className="text-[11px] text-slate-500 font-medium">Duration: {opp.duration}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {opp.description}
              </p>

              {/* Transparent 4-Pillar Match Score Breakdown Card */}
              {opp.matchDetails && (
                <MatchScoreCard match={opp.matchDetails} compact={true} />
              )}

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Application Deadline: <strong>{new Date(opp.deadline).toLocaleDateString()}</strong>
                </span>

                <div>
                  {opp.isApplied ? (
                    <button
                      disabled
                      className="px-5 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold cursor-not-allowed flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Application Under Review
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(opp)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Apply With Verified Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply Modal */}
      <Modal isOpen={!!selectedOpp} onClose={() => setSelectedOpp(null)} title={`Apply for ${selectedOpp?.title}`}>
        {selectedOpp && (
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{selectedOpp.company_name} — {selectedOpp.location}</p>
              <p className="text-slate-600">Stipend / Package: <strong className="text-slate-800">{selectedOpp.stipend}</strong></p>
              <p className="text-brand-700 font-semibold">Your Verified Match Score: {selectedOpp.matchScore}%</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Resume Highlights Summary</label>
              <input
                type="text"
                value={resumeSummary}
                onChange={(e) => setResumeSummary(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Letter & Statement of Competence</label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Your verified skill badges and project evidence will be attached automatically.
              </p>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
