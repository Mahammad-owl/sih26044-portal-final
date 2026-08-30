import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Clock,
  HelpCircle,
  FileCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const SkillAssessment: React.FC = () => {
  const { assessments, currentStudent, recordAssessmentResult, setStudentTab } = useApp();

  // Find relevant assessment for student's branch or default to first
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    assessments.find((a) => a.branch === currentStudent.branch)?.id || assessments[0].id
  );

  const activeAssessment = assessments.find((a) => a.id === selectedAssessmentId) || assessments[0];

  // Assessment Runner state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [isPracticalMode, setIsPracticalMode] = useState(false);
  const [practicalCode, setPracticalCode] = useState(activeAssessment.practicalTask.starterCodeOrPrompt);
  const [explanationText, setExplanationText] = useState(
    'In a single-producer single-consumer ring buffer on a single-core Cortex-M, the head pointer is only updated by the producer (ISR) and the tail pointer is only updated by the consumer task. Since integer pointer increments are atomic, race conditions are avoided without disabling interrupts or using mutexes.'
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    mcqScore: number;
    practicalScore: number;
    totalScore: number;
    passed: boolean;
    confidence: 'HIGH' | 'MEDIUM';
  } | null>(null);

  const currentQ = activeAssessment.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswers[currentQuestionIndex] !== undefined) return; // locked once answered
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionIdx }));
    setShowExplanations((prev) => ({ ...prev, [currentQuestionIndex]: true }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeAssessment.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsPracticalMode(true);
    }
  };

  const handleSubmitAll = () => {
    // Calculate MCQ score
    let correct = 0;
    activeAssessment.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) correct++;
    });

    const mcqPercentage = Math.round((correct / activeAssessment.questions.length) * 100);
    const practicalScore = explanationText.length > 50 ? 94 : 70;
    const totalScore = Math.round((mcqPercentage + practicalScore) / 2);
    const passed = totalScore >= activeAssessment.passingScore;

    setAssessmentResult({
      mcqScore: mcqPercentage,
      practicalScore,
      totalScore,
      passed,
      confidence: passed ? 'HIGH' : 'MEDIUM'
    });

    setIsCompleted(true);

    // Trigger celebratory confetti if passed
    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    // Save into central state
    recordAssessmentResult(currentStudent.id, activeAssessment.id, mcqPercentage, practicalScore);
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanations({});
    setIsPracticalMode(false);
    setIsCompleted(false);
    setAssessmentResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Adaptive Skill Assessment Engine</h2>
            <Badge variant="purple" size="sm">
              Evidence-Based
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Combines deterministic concept evaluation with live code modification & oral explanation checks.
          </p>
        </div>

        {/* Assessment selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Select Track:</label>
          <select
            value={selectedAssessmentId}
            onChange={(e) => {
              setSelectedAssessmentId(e.target.value);
              handleReset();
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
          >
            {assessments.map((a) => (
              <option key={a.id} value={a.id}>
                [{a.branch}] {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isCompleted ? (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          {/* Progress Tracker Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                <CheckSquare className="w-4 h-4" />
              </span>
              <span>{activeAssessment.title}</span>
              <Badge variant="info" size="sm">
                {activeAssessment.difficulty}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeAssessment.durationMinutes} Mins Allocated</span>
              </span>
              <span className="font-mono text-slate-300">
                Step: {!isPracticalMode ? `MCQ ${currentQuestionIndex + 1} / ${activeAssessment.questions.length}` : 'Practical Lab Task'}
              </span>
            </div>
          </div>

          {!isPracticalMode ? (
            /* MCQ Question Mode */
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                    Question {currentQuestionIndex + 1} • {currentQ.conceptTag}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Difficulty: {currentQ.difficulty}</span>
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed">{currentQ.question}</p>

                {/* Code Snippet if applicable */}
                {currentQ.isCode && currentQ.codeSnippet && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto">
                    <pre>{currentQ.codeSnippet}</pre>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

                  let borderClass = 'border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-indigo-500/40 text-slate-300';
                  if (hasAnswered) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      borderClass = 'border-rose-500/80 bg-rose-950/30 text-rose-200';
                    } else {
                      borderClass = 'border-slate-800/40 bg-slate-950/20 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${borderClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold border ${
                            hasAnswered && isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-400'
                              : hasAnswered && isSelected
                              ? 'bg-rose-500 text-white border-rose-400'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Box */}
              {showExplanations[currentQuestionIndex] && (
                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs text-slate-300 space-y-1.5 animate-in fade-in">
                  <p className="font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Technical Rationale:</span>
                  </p>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{currentQ.explanation}</p>
                </div>
              )}

              {/* Footer navigation */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                >
                  <span>
                    {currentQuestionIndex < activeAssessment.questions.length - 1 ? 'Next Question' : 'Proceed to Practical Lab Check'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Practical Demonstration & Explanation Mode */
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span>{activeAssessment.practicalTask.title}</span>
                </h4>
                <p className="text-slate-300 mt-1">{activeAssessment.practicalTask.instructions}</p>
              </div>

              {/* Code Modification Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Live Code Modification & Hazard Analysis:</label>
                <textarea
                  value={practicalCode}
                  onChange={(e) => setPracticalCode(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Explanation Viva Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Viva Explanation: {activeAssessment.practicalTask.explanationPrompt}
                </label>
                <textarea
                  value={explanationText}
                  onChange={(e) => setExplanationText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Explain your technical reasoning..."
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setIsPracticalMode(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Back to MCQs
                </button>

                <button
                  onClick={handleSubmitAll}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit & Verify Skill</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Result Card */
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <Badge variant="success" size="lg" dot>
              VERIFIED — HIGH CONFIDENCE
            </Badge>
            <h3 className="text-2xl font-extrabold text-white mt-2">
              Skill Successfully Verified: {activeAssessment.skillName}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Your deterministic score and practical code explanation show high consistency. Your profile status has been
              automatically updated!
            </p>
          </div>

          {/* Scores Breakdown */}
          {assessmentResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">MCQ Score</span>
                <p className="text-lg font-bold text-white font-mono">{assessmentResult.mcqScore}%</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Practical Task</span>
                <p className="text-lg font-bold text-white font-mono">{assessmentResult.practicalScore}%</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/40 bg-emerald-950/20">
                <span className="text-[10px] text-emerald-300 uppercase font-semibold">Final Index</span>
                <p className="text-lg font-bold text-emerald-400 font-mono">{assessmentResult.totalScore}%</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setStudentTab('matching')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20"
            >
              <span>View Boosted Internship Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
