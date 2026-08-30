import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Download,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Sparkles,
  GitBranch,
  FileBadge
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const DigitalPortfolio: React.FC = () => {
  const { currentStudent } = useApp();
  const [copied, setCopied] = useState(false);

  const portfolioUrl = `https://skillsetu.gov.in/verify/p/${currentStudent.id}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Public Verified Portfolio • Tamper-Evident Digital ID</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Verified PDF</span>
          </button>
        </div>
      </div>

      {/* Portfolio Card Container */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-[#090d16] space-y-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Watermark Stamp */}
        <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-indigo-400" />
        </div>

        {/* Portfolio Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-20 h-20 rounded-2xl border-2 border-emerald-500/50 object-cover shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-white">{currentStudent.name}</h1>
                <Badge variant="success" size="sm" dot>
                  Verified Credential
                </Badge>
              </div>
              <p className="text-xs text-indigo-300 font-semibold mt-0.5">
                B.Tech in {currentStudent.branch} Engineering • CGPA: {currentStudent.cgpa} / 10
              </p>
              <p className="text-xs text-slate-400 mt-1">{currentStudent.college}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-right flex-shrink-0">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
              Digital Passport ID
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              SKILLSETU-2026-{currentStudent.branch}-9921
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">Status: Authenticated by AICTE / NIT</span>
          </div>
        </div>

        {/* Verified Skills Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence-Verified Competencies</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Passing Standard: &gt;75% + Practical Check</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentStudent.verifiedSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{skill.name}</span>
                    <Badge variant={skill.status === 'VERIFIED' ? 'success' : 'warning'} size="sm">
                      {skill.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Level {skill.verifiedLevel}/5 • Assessment Score: {skill.assessmentScore}%
                  </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Endorsed Technical Projects */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileBadge className="w-4 h-4 text-indigo-400" />
            <span>Faculty-Endorsed Capstone Projects</span>
          </h3>

          <div className="space-y-3">
            {currentStudent.projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Mentor: {proj.facultyMentor || 'Prof. Faculty Lead'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                {proj.metrics && (
                  <p className="text-[11px] text-indigo-300 font-mono bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/20">
                    Validated Metric: {proj.metrics}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Verification Guarantee Seal */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">Cryptographically Verified by SKILLSETU Platform</p>
              <p className="text-[11px] text-slate-400">
                Skills guaranteed through deterministic code tests, hardware submissions, and viva checks.
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right font-mono text-[10px] text-slate-400">
            SHA-256: 8f4a9b2c...31e7
          </div>
        </div>
      </div>
    </div>
  );
};
