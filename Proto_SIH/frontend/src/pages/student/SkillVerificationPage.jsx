import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import CameraDemonstration from '../../components/common/CameraDemonstration';
import {
  ShieldCheck,
  Award,
  Video,
  FileText,
  Code2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';

export default function SkillVerificationPage() {
  const [skills, setSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifications, setVerifications] = useState([]);
  const { showToast } = useNotifications();

  // Multi-factor Form State
  const [taskTitle, setTaskTitle] = useState('FreeRTOS Priority Inversion & Mutex Demonstration');
  const [taskDesc, setTaskDesc] = useState('Demonstrate two concurrent tasks on ARM Cortex MCU sharing a peripheral bus where a high-priority task preempts safely under mutex priority inheritance.');
  const [explanationText, setExplanationText] = useState('I implemented binary semaphores versus mutexes. Mutexes prevent priority inversion by elevating the task priority holding the lock until release.');
  const [modificationResponse, setModificationResponse] = useState('Added a 50ms watchdog timeout to the take-mutex call to prevent catastrophic deadlocks if an ISR hangs.');
  const [snapshotData, setSnapshotData] = useState(null);
  const [demoMediaUrl, setDemoMediaUrl] = useState('');

  const loadData = async () => {
    try {
      const resSkills = await api.getStudentSkills();
      const resVer = await api.getVerifications();
      setSkills(resSkills.studentSkills || []);
      setVerifications(resVer.verifications || []);
      if (resSkills.studentSkills?.length > 0 && !selectedSkillId) {
        setSelectedSkillId(resSkills.studentSkills[0].skill_id);
      }
    } catch (err) {
      showToast('Failed to load verification data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    if (!selectedSkillId || !taskTitle) {
      showToast('Please select a skill and provide a task title', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitVerification({
        skillId: selectedSkillId,
        practicalTaskTitle: taskTitle,
        practicalTaskDesc: taskDesc,
        explanationText,
        modificationTaskResponse: modificationResponse,
        snapshotData,
        demoMediaUrl
      });

      showToast('Evidence submitted! Multi-factor analysis completed and queued for faculty review. 🏅', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Verification submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedSkill = skills.find(s => s.skill_id === selectedSkillId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Principle Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          Evidence-Based Competence Engine
        </div>
        <h1 className="text-xl sm:text-2xl font-black">
          "We Do Not Claim To Detect ChatGPT. We Verify Competence."
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
          AI-assisted tools may be used during learning. However, unverified claims do not qualify for verified credentials.
          We require multi-factor consistency across: <strong>Assessment + Hands-on Demonstration + Code Modification + Explanation</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Submission Workflow */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmitVerification} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-brand-600" />
              Submit Skill Competence Evidence
            </h3>

            {/* Step 1: Select Skill */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                1. Select Skill To Verify
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {skills.map(s => (
                  <option key={s.id} value={s.skill_id}>
                    {s.skill_name} ({s.discipline}) — Current: {s.verification_status} (L{s.claimed_level})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Practical Task Definition */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                2. Practical Demonstration Task
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Bare-Metal UART Ring Buffer with DMA"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
              <textarea
                rows={2}
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Describe the practical hardware/software task performed..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>

            {/* Step 3: Camera / Live Demonstration Module */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                3. Camera Recording / Demonstration Observation
              </label>
              <CameraDemonstration
                taskTitle={taskTitle}
                onSnapshotCaptured={(img) => setSnapshotData(img)}
                onEvidenceUploaded={(url) => setDemoMediaUrl(url)}
              />
            </div>

            {/* Step 4: Technical Explanation & Modification Task */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  4. Concept Explanation (Demonstrating Internal Reasoning)
                </label>
                <textarea
                  rows={3}
                  value={explanationText}
                  onChange={(e) => setExplanationText(e.target.value)}
                  placeholder="Explain why this architecture was chosen and how critical edge cases are resolved..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  5. Dynamic Modification Task Response
                </label>
                <textarea
                  rows={2}
                  value={modificationResponse}
                  onChange={(e) => setModificationResponse(e.target.value)}
                  placeholder="Describe the live parameter modification made to the code/circuit to prove understanding..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Consistency analysis runs automatically upon submission.
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Analyzing & Submitting...' : 'Submit For Faculty Verification'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Past Verifications & Badges */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verification History & Endorsements
            </h3>

            <div className="space-y-3">
              {verifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No verification records found</p>
              ) : (
                verifications.map(v => (
                  <div
                    key={v.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      v.final_verdict === 'VERIFIED'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : v.final_verdict === 'NEEDS_REVIEW'
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900">{v.skill_name}</h4>
                        <p className="text-[11px] text-slate-600 truncate max-w-[180px]">{v.practical_task_title}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.final_verdict === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {v.final_verdict}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-600 bg-white/70 p-2 rounded-lg border border-black/5 text-center">
                      <div>
                        <span className="text-slate-400 block">Assessment</span>
                        <strong>{Math.round(v.assessment_score)}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Consistency</span>
                        <strong className="text-emerald-700">{v.consistency_rating}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Level</span>
                        <strong>L{v.recommended_level}/5</strong>
                      </div>
                    </div>

                    {v.reviewer_comments && (
                      <p className="text-[10px] text-slate-600 italic">
                        💬 Reviewer: "{v.reviewer_comments}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
