import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Search,
  Workflow,
  Cpu,
  FileCode,
  HelpCircle,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { EvidenceVerificationModal } from '../common/EvidenceVerificationModal';
import { VerifiedSkill } from '../../types';

export const SkillVerificationEngine: React.FC = () => {
  const { currentStudent } = useApp();
  const [selectedSkill, setSelectedSkill] = useState<VerifiedSkill | null>(null);

  const verificationWorkflow = [
    { step: '1. Skill Claim', desc: 'Self-declared proficiency level & experience history', icon: Cpu },
    { step: '2. Assessment', desc: 'Deterministic concept testing & time-bounded problem solving', icon: CheckCircle2 },
    { step: '3. Project Evidence', desc: 'Hardware demo logs, GitHub repository inspection & lab mentor sign-off', icon: FileCode },
    { step: '4. Practical Task', desc: 'Live hands-on implementation & edge case handling', icon: Workflow },
    { step: '5. Oral / Text Viva', desc: 'Deep "Why and How" architectural explanation to confirm true understanding', icon: HelpCircle },
    { step: '6. Code Modification', desc: 'Live perturbation test to verify adaptability beyond rote copy-pasting', icon: Sparkles },
    { step: '7. Consistency Check', desc: 'Multi-source statistical correlation check across all 6 verification layers', icon: Fingerprint }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Evidence-Based Skill Verification Engine</h2>
            <Badge variant="purple" size="sm">
              SIH Core Innovation
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical multi-tier verification designed to evaluate genuine practical comprehension and skill ownership.
          </p>
        </div>

        <Badge variant="success" size="md" dot>
          Engine Status: Active & Tamper-Evident
        </Badge>
      </div>

      {/* Crucial SIH Anti-Fraud & AI-Assistance Philosophy Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/40 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">The Truth-First Verification Philosophy</h3>
            <p className="text-xs text-indigo-200">How the platform handles AI tools, ChatGPT, and student authenticity</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-emerald-400">
            "AI-assisted work is not automatically considered fraud. The platform verifies whether the student can
            understand, explain, modify and practically apply the claimed skill."
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Rather than relying on inaccurate statistical 'AI detectors' that produce false positives, SKILLSETU requires
            active code explanation viva, live modifications, hardware evidence, and cross-source consistency checks. If a
            student can explain the architectural trade-offs and modify the code live, the competency is verified with high
            confidence.
          </p>
        </div>
      </div>

      {/* 7-Step Verification Workflow Visualizer */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">7-Stage Verification Pipeline</h3>
          <span className="text-xs text-slate-400 font-mono">End-to-End Audit Trail</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {verificationWorkflow.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-2">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight">{item.step}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student's Verified Competencies Audit Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Audit Records: {currentStudent.name}</h3>
            <p className="text-xs text-slate-400">Click any row to inspect complete multi-layer verification logs</p>
          </div>
          <Badge variant="purple" size="sm">
            {currentStudent.verifiedSkills.length} Total Registered Skills
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-3">Skill & Category</th>
                <th className="pb-3">Self vs Verified</th>
                <th className="pb-3">MCQ Score</th>
                <th className="pb-3">Practical Task</th>
                <th className="pb-3">Viva & Consistency</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-3 text-right">Evidence Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentStudent.verifiedSkills.map((skill) => (
                <tr
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className="hover:bg-indigo-950/20 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 pl-3">
                    <span className="font-semibold text-white block">{skill.name}</span>
                    <span className="text-[10px] text-slate-400">{skill.category}</span>
                  </td>
                  <td className="py-3.5 font-mono">
                    Level {skill.selfDeclaredLevel} → <strong className="text-indigo-300">Level {skill.verifiedLevel}</strong>
                  </td>
                  <td className="py-3.5 font-mono">
                    <span className={skill.assessmentScore >= 75 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {skill.assessmentScore}%
                    </span>
                  </td>
                  <td className="py-3.5 font-mono">
                    <span className={skill.practicalTaskScore >= 75 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {skill.practicalTaskScore}%
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          skill.consistencyScore >= 85 ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span className="font-mono text-slate-300">{skill.consistencyScore}% Match</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <Badge
                      variant={skill.status === 'VERIFIED' ? 'success' : skill.status === 'NEEDS REVIEW' ? 'warning' : 'danger'}
                      size="sm"
                      dot
                    >
                      {skill.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 pr-3 text-right">
                    <button className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 rounded-lg text-xs font-semibold">
                      Inspect Audit →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSkill && (
        <EvidenceVerificationModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </div>
  );
};
