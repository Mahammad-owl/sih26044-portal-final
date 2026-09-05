import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import {
  Layers,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotifications();

  const loadApplications = async () => {
    try {
      const res = await api.getMyApplications();
      setApplications(res.applications || []);
    } catch (err) {
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const stages = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];

  const getStageIndex = (status) => {
    if (status === 'REJECTED') return -1;
    return stages.indexOf(status);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Layers className="w-6 h-6 text-brand-600" />
          My Internship & Job Applications
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time tracking of applications submitted with your verified technical credentials.
        </p>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            You have not submitted any applications yet. Browse the Opportunities tab to apply.
          </div>
        ) : (
          applications.map(app => {
            const stageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'REJECTED';

            return (
              <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {app.opportunity_type} • {app.branch}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Match: {app.match_score}%
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{app.opportunity_title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{app.company_name}</strong>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.location} ({app.mode})</span>
                      <span>•</span>
                      <span>{app.stipend}</span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-500 shrink-0">
                    <span className="block font-mono text-[11px]">Applied on: {new Date(app.applied_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Visual Pipeline Status Stepper */}
                <div className="pt-2">
                  <div className="grid grid-cols-5 gap-1 text-center text-xs">
                    {stages.map((st, idx) => {
                      const isCompleted = stageIdx >= idx;
                      const isCurrent = app.status === st;

                      return (
                        <div key={st} className="space-y-1.5">
                          <div className={`h-2 rounded-full transition-all ${
                            isRejected
                              ? 'bg-rose-200'
                              : isCurrent
                              ? 'bg-brand-600 ring-2 ring-brand-300 ring-offset-1'
                              : isCompleted
                              ? 'bg-emerald-500'
                              : 'bg-slate-200'
                          }`} />
                          <span className={`text-[10px] font-bold block truncate ${
                            isCurrent ? 'text-brand-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                          }`}>
                            {st.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recruiter Notes / Status message */}
                {app.notes && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Recruiter Feedback:</strong> {app.notes}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
