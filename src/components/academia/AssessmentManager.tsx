import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  PlusCircle,
  Clock,
  HelpCircle,
  FileCode,
  CheckCircle2,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Assessment, Discipline } from '../../types';

export const AssessmentManager: React.FC = () => {
  const { assessments } = useApp();
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment>(assessments[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Department Assessment Manager</h2>
            <Badge variant="purple" size="sm">
              Faculty Portal
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Author and assign branch-specific technical assessments with deterministic MCQs and practical coding viva tasks.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Assessment Track</span>
        </button>
      </div>

      {/* 2-Column Layout: Assessment List & Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Assessment List */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">Active Technical Assessments</h3>
          {assessments.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAssessment(a)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedAssessment.id === a.id
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md'
                  : 'glass-panel border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="purple" size="sm">
                  {a.branch} Dept
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">{a.difficulty}</span>
              </div>
              <h4 className="font-bold text-xs text-white mt-2">{a.title}</h4>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                <span>{a.questions.length} Questions</span>
                <span className="text-emerald-400 font-mono">Pass: {a.passingScore}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2 Cols: Question & Practical Task Inspector */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-base text-white">{selectedAssessment.title}</h3>
                <Badge variant="info" size="sm">
                  {selectedAssessment.skillName}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedAssessment.description}</p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{selectedAssessment.durationMinutes} Mins Allocated</span>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deterministic Questions ({selectedAssessment.questions.length}):
            </h4>

            {selectedAssessment.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 font-mono">
                    Q{idx + 1}. Concept: {q.conceptTag}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{q.difficulty}</span>
                </div>

                <p className="text-slate-200 font-medium">{q.question}</p>

                {q.isCode && q.codeSnippet && (
                  <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-200 overflow-x-auto">
                    {q.codeSnippet}
                  </pre>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-2 rounded-lg border text-[11px] flex items-center gap-2 ${
                        optIdx === q.correctIndex
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="font-mono font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                      <span>{opt}</span>
                      {optIdx === q.correctIndex && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Practical Viva Task */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>Practical Demonstration & Modification Task: {selectedAssessment.practicalTask.title}</span>
            </h4>
            <p className="text-slate-300 text-[11px]">{selectedAssessment.practicalTask.instructions}</p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
              Viva Prompt: "{selectedAssessment.practicalTask.explanationPrompt}"
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Create Department Assessment Track</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Department assessments automatically benchmark against current industry hiring requirements.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Assessment Title:</label>
                <input
                  type="text"
                  placeholder="e.g. VLSI SystemVerilog Verification Benchmark"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Branch Discipline:</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500">
                  <option>ECE</option>
                  <option>CSE</option>
                  <option>EEE</option>
                  <option>Mechanical</option>
                  <option>Civil</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Save Track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
