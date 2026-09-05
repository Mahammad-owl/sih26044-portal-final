import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function MatchScoreCard({ match, compact = false }) {
  const [expanded, setExpanded] = useState(!compact);

  if (!match) return null;

  const score = match.finalScore || 0;
  const pillars = match.pillars || {};
  const breakdown = match.breakdown || [];

  const getScoreColor = (s) => {
    if (s >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (s >= 70) return 'text-brand-600 bg-brand-50 border-brand-300';
    if (s >= 50) return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-rose-600 bg-rose-50 border-rose-300';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-slate-800">
      {/* Header with Match % and Transparency Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border font-bold ${getScoreColor(score)}`}>
            <span className="text-xl leading-none">{score}%</span>
            <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5">Match</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-900">Transparent Competence Match</h4>
              <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" />
                4-Pillar Algorithmic
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Skill (60%) + Assessment (20%) + Projects (10%) + Standing (10%)
            </p>
          </div>
        </div>

        {compact && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 p-1"
          >
            {expanded ? 'Hide Details' : 'Why this match?'}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* 4-Pillars Horizontal Mini Progress */}
      {pillars.skillMatchScore !== undefined && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium">Skill Fit (60%)</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">{pillars.skillMatchScore}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-brand-500 h-full rounded-full" style={{ width: `${pillars.skillMatchScore}%` }} />
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium">Assessment (20%)</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">{pillars.assessmentScore}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pillars.assessmentScore}%` }} />
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium">Project Evid. (10%)</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">{pillars.projectEvidenceScore}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pillars.projectEvidenceScore}%` }} />
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium">Standing (10%)</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">{pillars.experienceScore}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pillars.experienceScore}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Expanded Skill-by-Skill Breakdown */}
      {expanded && breakdown.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
            <span>Skill Requirements Alignment:</span>
            <span className="text-[10px] text-slate-400 font-normal">Based on verified portfolio evidence</span>
          </div>

          <div className="space-y-1.5">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  {item.icon === 'star' ? (
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  ) : item.icon === 'check' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : item.icon === 'alert' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span className="font-medium text-slate-800">{item.skillName}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-500">
                    Req: <strong className="text-slate-700">L{item.requiredLevel}</strong> | Actual: <strong className="text-slate-700">L{item.actualLevel}</strong>
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                    item.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.statusText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
