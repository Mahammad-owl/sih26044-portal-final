import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Github,
  Linkedin,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  PlusCircle,
  FileText,
  Clock,
  Download
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { EvidenceVerificationModal } from '../common/EvidenceVerificationModal';
import { VerifiedSkill } from '../../types';

export const StudentProfile: React.FC = () => {
  const { currentStudent, setStudentTab } = useApp();
  const [selectedAuditSkill, setSelectedAuditSkill] = useState<VerifiedSkill | null>(null);

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-20 h-20 rounded-2xl border-2 border-indigo-500/40 object-cover shadow-xl"
            />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white tracking-tight">{currentStudent.name}</h2>
                <Badge variant="success" size="sm" dot>
                  Verified Portfolio
                </Badge>
              </div>
              <p className="text-xs text-indigo-300 font-medium mt-0.5">
                {currentStudent.branch} Engineering • 3rd Year • CGPA: {currentStudent.cgpa} / 10.0
              </p>
              <p className="text-xs text-slate-400 mt-1">{currentStudent.college}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setStudentTab('portfolio')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Public Digital Portfolio</span>
            </button>
            <button
              onClick={() => setStudentTab('ai-resume')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Re-Parse Resume</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-5 pt-5 border-t border-slate-800/80">
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{currentStudent.bio}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {currentStudent.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              {currentStudent.phone}
            </span>
            {currentStudent.github && (
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Github className="w-3.5 h-3.5" />
                {currentStudent.github}
              </span>
            )}
            {currentStudent.linkedin && (
              <span className="flex items-center gap-1.5 text-sky-400">
                <Linkedin className="w-3.5 h-3.5" />
                {currentStudent.linkedin}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verified Skills Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-base">Verified Technical Competencies</h3>
            <p className="text-xs text-slate-400">Verified via MCQs, Hardware Lab Demos, and Oral Viva Checks</p>
          </div>
          <button
            onClick={() => setStudentTab('verification')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Evidence Audit Log</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentStudent.verifiedSkills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => setSelectedAuditSkill(skill)}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {skill.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">{skill.category}</span>
                </div>
                <Badge
                  variant={skill.status === 'VERIFIED' ? 'success' : skill.status === 'NEEDS REVIEW' ? 'warning' : 'danger'}
                  size="sm"
                >
                  {skill.status}
                </Badge>
              </div>

              <ProgressBar
                value={(skill.verifiedLevel / 5) * 100}
                label={`Verified Level: ${skill.verifiedLevel} / 5`}
                showValue={false}
                size="sm"
                color={skill.status === 'VERIFIED' ? 'emerald' : 'amber'}
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                <span>Assessment: {skill.assessmentScore}%</span>
                <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  View Evidence Audit →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects with Verified Evidence */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <h3 className="font-bold text-white text-base">Verified Technical Projects & Capstones</h3>
          <p className="text-xs text-slate-400">Backed by faculty sign-off, live repo inspection, and simulation metrics</p>
        </div>

        <div className="space-y-4">
          {currentStudent.projects.map((proj) => (
            <div key={proj.id} className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                    {proj.verifiedByFaculty && (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Faculty Verified</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-indigo-300 mt-0.5">
                    {proj.category} • {proj.role} • {proj.date}
                  </p>
                </div>
                {proj.evidenceUrl && (
                  <a
                    href={proj.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 flex-shrink-0"
                  >
                    <span>{proj.evidenceType}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

              {proj.metrics && (
                <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
                  <strong>Measured Performance Metric:</strong> {proj.metrics}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {proj.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certifications */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Verified Certifications</span>
          </h3>
          <div className="space-y-3">
            {currentStudent.certifications.map((cert) => (
              <div key={cert.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">{cert.name}</span>
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{cert.issuer} • {cert.date}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">ID: {cert.credentialId}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Honors & Hackathon Awards</span>
          </h3>
          <div className="space-y-3">
            {currentStudent.achievements.map((ach) => (
              <div key={ach.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="font-semibold text-xs text-white block">{ach.title}</span>
                <p className="text-[11px] text-indigo-300 mt-0.5">{ach.event} • {ach.date}</p>
                <p className="text-[11px] text-slate-400 mt-1">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedAuditSkill && (
        <EvidenceVerificationModal skill={selectedAuditSkill} onClose={() => setSelectedAuditSkill(null)} />
      )}
    </div>
  );
};
