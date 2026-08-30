import React from 'react';
import { VerifiedSkill } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  FileCode,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Workflow,
  X,
  Sparkles,
  GitBranch,
  Search
} from 'lucide-react';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';

interface EvidenceVerificationModalProps {
  skill: VerifiedSkill;
  onClose: () => void;
}

export const EvidenceVerificationModal: React.FC<EvidenceVerificationModalProps> = ({ skill, onClose }) => {
  const steps = [
    {
      title: '1. Skill Declaration',
      status: 'Passed',
      desc: `Student declared Level ${skill.selfDeclaredLevel}/5 in ${skill.name}`,
      icon: Cpu,
      score: null
    },
    {
      title: '2. Branch Technical Assessment',
      status: skill.assessmentScore >= 75 ? 'Passed' : 'Review',
      desc: `Scored ${skill.assessmentScore}% on deterministic MCQs & code analysis`,
      icon: CheckCircle2,
      score: skill.assessmentScore
    },
    {
      title: '3. Project & Hardware Evidence',
      status: skill.projectEvidence.verified ? 'Verified' : 'Pending',
      desc: `${skill.projectEvidence.projectName}: ${skill.projectEvidence.description}`,
      icon: GitBranch,
      score: skill.projectEvidence.verified ? 92 : 50
    },
    {
      title: '4. Practical Demonstration Task',
      status: skill.practicalTaskScore >= 75 ? 'Passed' : 'Needs Review',
      desc: `Hands-on task execution score: ${skill.practicalTaskScore}%`,
      icon: FileCode,
      score: skill.practicalTaskScore
    },
    {
      title: '5. Understanding & Explanation Viva',
      status: skill.explanationScore >= 75 ? 'Passed' : 'Needs Review',
      desc: `Assessed depth of conceptual understanding: ${skill.explanationScore}%`,
      icon: HelpCircle,
      score: skill.explanationScore
    },
    {
      title: '6. Code Modification / Edge Case Test',
      status: skill.consistencyScore >= 80 ? 'Passed' : 'Needs Review',
      desc: `Live adaptation & modification response verified`,
      icon: Workflow,
      score: skill.consistencyScore
    },
    {
      title: '7. Multi-Source Consistency Cross-Check',
      status: skill.confidence === 'HIGH' ? 'High Alignment' : 'Variance Detected',
      desc: `Consistency rating: ${skill.consistencyScore}% across theory, code & viva`,
      icon: ShieldCheck,
      score: skill.consistencyScore
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">{skill.name}</h3>
                <Badge
                  variant={skill.status === 'VERIFIED' ? 'success' : skill.status === 'NEEDS REVIEW' ? 'warning' : 'danger'}
                  size="sm"
                  dot
                >
                  {skill.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evidence-Based Verification Audit • Last Verified: {skill.lastVerifiedDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIH Anti-Fraud Explanation Box */}
        <div className="p-4 mx-6 mt-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-200">Evidence-Based Verification vs. Naive AI Detectors</p>
            <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
              "AI-assisted work is not automatically considered fraud. The platform systematically verifies whether the
              student can understand, explain, modify and practically apply the claimed skill in real-world scenarios."
            </p>
          </div>
        </div>

        {/* Verification Pipeline Steps */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verification Pipeline Audit</h4>

          <div className="space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{step.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono">
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>

                  {step.score !== null && (
                    <div className="w-28 flex-shrink-0 text-right">
                      <span className="text-xs font-mono font-bold text-white">{step.score}%</span>
                      <ProgressBar value={step.score} showValue={false} size="sm" color={step.score >= 75 ? 'emerald' : 'amber'} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Summary Status */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Final Verification Confidence:</span>
            <Badge
              variant={skill.confidence === 'HIGH' ? 'success' : skill.confidence === 'MEDIUM' ? 'warning' : 'danger'}
              size="sm"
            >
              {skill.confidence} CONFIDENCE
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
