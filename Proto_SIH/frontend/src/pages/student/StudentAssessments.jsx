import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import confetti from 'canvas-confetti';
import {
  BookOpenCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Check,
  Code
} from 'lucide-react';

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const { showToast } = useNotifications();

  const loadAssessments = async () => {
    try {
      const res = await api.getAssessments();
      setAssessments(res.assessments || []);
    } catch (err) {
      showToast('Failed to load assessments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeAssessment || result || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeAssessment, result, timeLeft]);

  const handleStartTest = async (assessment) => {
    setLoading(true);
    try {
      const res = await api.getAssessmentDetail(assessment.id);
      setActiveAssessment(res.assessment);
      setQuestions(res.questions || []);
      setCurrentQIndex(0);
      setAnswers({});
      setResult(null);
      setTimeLeft((res.assessment.time_limit_mins || 15) * 60);
    } catch (err) {
      showToast('Failed to launch assessment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    const qId = questions[currentQIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitTest = async () => {
    if (!activeAssessment) return;
    setSubmitting(true);
    try {
      const res = await api.submitAssessment(activeAssessment.id, answers);
      setResult(res);
      if (res.passed) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        showToast(`Congratulations! You passed with ${res.percentage}% score! 🎉`, 'success');
      } else {
        showToast(`Assessment completed. Scored ${res.percentage}%. Keep practicing!`, 'info');
      }
      loadAssessments();
    } catch (err) {
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading && !activeAssessment) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Active Assessment Test Environment
  if (activeAssessment) {
    const currentQ = questions[currentQIndex];
    const selectedOption = currentQ ? answers[currentQ.id] : null;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Test Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-900 text-brand-300 border border-brand-700">
              Live Verified Assessment • {activeAssessment.skill_name}
            </span>
            <h2 className="text-xl font-bold text-white mt-1">{activeAssessment.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-sm font-bold text-amber-400">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            {!result && (
              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={submitting}
                className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all shadow-sm"
              >
                {submitting ? 'Evaluating...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </div>

        {/* Test Content or Result Report */}
        {!result ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Progress Bar & Question Counter */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-3 border-b border-slate-100">
              <span>Question {currentQIndex + 1} of {questions.length}</span>
              <span>{answeredCount} of {questions.length} Answered</span>
            </div>

            {/* Question Card */}
            {currentQ && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {currentQ.question_text}
                </h3>

                {/* Code Snippet if applicable */}
                {currentQ.code_snippet && (
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                    <pre>{currentQ.code_snippet}</pre>
                  </div>
                )}

                {/* Multiple Choice Options */}
                <div className="space-y-2.5 pt-2">
                  {['A', 'B', 'C', 'D'].map(optKey => {
                    const optText = currentQ[`option_${optKey.toLowerCase()}`];
                    const isSelected = selectedOption === optKey;

                    return (
                      <button
                        key={optKey}
                        type="button"
                        onClick={() => handleSelectOption(optKey)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-brand-50/90 border-brand-500 text-brand-950 font-semibold shadow-xs ring-1 ring-brand-500'
                            : 'bg-slate-50/60 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                          isSelected ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {optKey}
                        </span>
                        <span className="mt-0.5 leading-relaxed">{optText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
              >
                Previous
              </button>

              <div className="flex items-center gap-1.5">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQIndex(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      currentQIndex === i
                        ? 'bg-brand-600 text-white'
                        : answers[questions[i].id]
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {currentQIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                >
                  Finish Test
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Assessment Result Report */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className={`p-6 rounded-2xl border text-center ${
              result.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="text-4xl mb-2">{result.passed ? '🏆' : '📚'}</div>
              <h3 className="text-2xl font-black">{result.message}</h3>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div>
                  <span className="text-xs text-slate-500 block">Score Earned</span>
                  <span className="text-2xl font-bold text-slate-900">{result.score} / {result.maxScore}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Percentage</span>
                  <span className="text-2xl font-bold text-brand-600">{result.percentage}%</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Demonstrated Level</span>
                  <span className="text-2xl font-bold text-purple-600">Level {result.calculatedLevel}/5</span>
                </div>
              </div>
            </div>

            {/* Question by Question Review */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">Assessment Detailed Review & Explanations:</h4>
              <div className="space-y-3">
                {result.review.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border text-xs space-y-2 ${
                    item.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                  }`}>
                    <div className="flex items-start justify-between gap-2 font-bold text-slate-900">
                      <span>Q{idx + 1}: {item.questionText}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.isCorrect ? '✓ Correct (+20)' : '✕ Incorrect'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-700">
                      <span>Your Answer: <strong className="font-mono">{item.studentAnswer}</strong></span>
                      <span>Correct Answer: <strong className="font-mono text-emerald-700 font-bold">{item.correctAnswer}</strong></span>
                    </div>

                    {item.explanation && (
                      <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200">
                        💡 <strong>Concept Explanation:</strong> {item.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveAssessment(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white"
              >
                Back to All Assessments
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Assessment Catalog List
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 text-brand-600" />
          Technical Skill Assessments
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Take timed, randomized technical tests to benchmark your engineering proficiency level.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-brand-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  {a.discipline} • {a.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {a.time_limit_mins} mins
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1">{a.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                {a.bestScore !== null ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Best: {a.bestScore}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Not yet attempted</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleStartTest(a)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white transition-all shadow-sm"
              >
                {a.bestScore !== null ? 'Retake Test' : 'Start Assessment'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
