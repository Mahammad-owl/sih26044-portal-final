import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import confetti from 'canvas-confetti';
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  BookOpen,
  FolderGit2,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function LearningRoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useNotifications();

  const loadRoadmap = async () => {
    try {
      const res = await api.getRoadmap();
      setRoadmap(res);
    } catch (err) {
      showToast('Failed to load learning roadmap', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleToggleActivity = async (actId, currentlyCompleted) => {
    setUpdatingId(actId);
    try {
      const res = await api.toggleRoadmapActivity(actId);
      if (!currentlyCompleted) {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
        showToast('Milestone completed! Readiness score updated. 🎯', 'success');
      }
      loadRoadmap();
    } catch (err) {
      showToast(err.message || 'Failed to update milestone', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!roadmap) return null;

  const { learningPath, activities = [], gapAnalysis } = roadmap;
  const progressPct = activities.length > 0
    ? Math.round((learningPath.completed_modules / activities.length) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Personalized Gap-Closure Track
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
              <Compass className="w-6 h-6 text-brand-600" />
              {learningPath.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Target Career Role: <strong>{gapAnalysis?.careerRole?.title || 'Embedded Systems Engineer'}</strong> • Target Readiness: <strong>95%</strong>
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-2xl font-black text-brand-600">{progressPct}%</span>
            <span className="text-xs font-semibold text-slate-500">
              {learningPath.completed_modules} of {activities.length} Completed
            </span>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-brand-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Week-by-Week Milestones List */}
      <div className="space-y-4">
        {activities.map((act) => {
          const isDone = !!act.is_completed;
          const isBusy = updatingId === act.id;

          const typeStyles = {
            THEORY: 'bg-sky-50 text-sky-700 border-sky-200',
            PRACTICAL: 'bg-purple-50 text-purple-700 border-purple-200',
            PROJECT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            ASSESSMENT: 'bg-amber-50 text-amber-700 border-amber-200'
          };

          return (
            <div
              key={act.id}
              className={`p-6 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-slate-50/80 border-slate-200 text-slate-600'
                  : 'bg-white border-slate-200 shadow-sm hover:border-brand-300'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleActivity(act.id, isDone)}
                  disabled={isBusy}
                  className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 border border-slate-300 text-transparent hover:border-brand-500 hover:text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Milestone Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Week {act.week_number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${typeStyles[act.activity_type] || 'bg-slate-100 text-slate-700'}`}>
                        {act.activity_type}
                      </span>
                      {act.skill_name && (
                        <span className="text-[10px] font-medium text-slate-500">
                          Focus: <strong className="text-slate-700">{act.skill_name}</strong>
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      ~{act.estimated_hours} Hours
                    </span>
                  </div>

                  <h3 className={`text-base font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {act.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {act.description}
                  </p>

                  {/* Resource & Action Links */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                    {act.resource_url && (
                      <a
                        href={act.resource_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Open Lab Guide & Resources <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}

                    {act.activity_type === 'ASSESSMENT' && (
                      <Link
                        to="/assessments"
                        className="inline-flex items-center gap-1 font-bold text-purple-600 hover:text-purple-700"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Take Reassessment Test →
                      </Link>
                    )}

                    {act.activity_type === 'PRACTICAL' && (
                      <Link
                        to="/verification"
                        className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Record Live Verification Demo →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
