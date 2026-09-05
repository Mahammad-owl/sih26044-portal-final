import React from 'react';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

export default function SkillBadge({ name, level, status = 'NOT_VERIFIED', confidence = 'MEDIUM', showDetails = true }) {
  const isVerified = status === 'VERIFIED';
  const isInReview = status === 'IN_REVIEW';
  const isRejected = status === 'REJECTED';

  const levelStars = Array.from({ length: 5 }, (_, i) => i < level);

  return (
    <div className={`inline-flex flex-col p-2.5 rounded-lg border transition-all ${
      isVerified
        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-sm'
        : isInReview
        ? 'bg-amber-50/80 border-amber-300 text-amber-950'
        : isRejected
        ? 'bg-rose-50/80 border-rose-300 text-rose-950'
        : 'bg-slate-100/90 border-slate-200 text-slate-800'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-xs text-slate-900 truncate max-w-[140px]">{name}</span>
        {isVerified ? (
          <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-600" />
            Verified
          </span>
        ) : isInReview ? (
          <span className="inline-flex items-center text-[10px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
            <Clock className="w-3 h-3 mr-0.5 text-amber-600" />
            In Review
          </span>
        ) : isRejected ? (
          <span className="inline-flex items-center text-[10px] font-medium text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
            <XCircle className="w-3 h-3 mr-0.5 text-rose-600" />
            Rejected
          </span>
        ) : (
          <span className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
            <AlertCircle className="w-3 h-3 mr-0.5 text-slate-500" />
            Claimed
          </span>
        )}
      </div>

      {showDetails && (
        <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-black/5">
          <div className="flex items-center gap-0.5">
            {levelStars.map((filled, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  filled
                    ? isVerified ? 'bg-emerald-600' : 'bg-brand-600'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            L{level}/5
          </span>
        </div>
      )}
    </div>
  );
}
