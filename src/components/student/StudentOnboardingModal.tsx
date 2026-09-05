import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Target,
  ShieldCheck,
  Zap,
  HelpCircle,
  X
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const StudentOnboardingModal: React.FC = () => {
  const { currentStudent, completeOnboarding, isOnboardingActive, setIsOnboardingActive } = useApp();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(currentStudent.careerGoal || 'Embedded Systems Engineer');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['C / C++ Basics', 'Microcontrollers']);

  if (!isOnboardingActive) return null;

  const branchSkillOptions: Record<string, string[]> = {
    ECE: ['Embedded C', 'Microcontrollers (ARM & AVR)', 'C / C++ Basics', 'Digital Electronics', 'PCB Design & KiCad', 'RTOS Basics'],
    CSE: ['Python & Data Structures', 'SQL & Databases', 'FastAPI / Node.js', 'Git & GitHub', 'Docker Basics', 'Linux Fundamentals'],
    EEE: ['MATLAB / Simulink', 'Power Electronics', 'Electrical Machines', 'Battery Management Systems', 'Circuit Simulation'],
    Mechanical: ['SolidWorks 3D CAD', 'Engineering Mechanics', 'Thermodynamics', 'ANSYS FEA Basics', 'Robotics & Kinematics'],
    Civil: ['Autodesk Revit & BIM', 'Structural Mechanics', 'AutoCAD 2D/3D', 'Surveying & GIS', 'Concrete Technology']
  };

  const availableSkills = branchSkillOptions[currentStudent.branch] || branchSkillOptions.ECE;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleFinish = () => {
    completeOnboarding(selectedSkills, selectedGoal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-indigo-500/40 p-6 sm:p-8 bg-slate-900/95 text-slate-100 shadow-2xl relative">
        <button
          onClick={() => setIsOnboardingActive(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Student Onboarding Wizard</span>
          </div>
          <h2 className="text-2xl font-black text-white">Welcome, {currentStudent.name}!</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Set up your academic profile in 3 quick steps to activate automated skill-gap analysis and verified internship matching.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 1 ? 'text-indigo-400' : 'text-slate-600'}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px]">1</span>
            <span>Career Goal</span>
          </div>
          <span className="text-slate-700">──</span>
          <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 2 ? 'text-indigo-400' : 'text-slate-600'}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px]">2</span>
            <span>Initial Skills</span>
          </div>
          <span className="text-slate-700">──</span>
          <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 3 ? 'text-indigo-400' : 'text-slate-600'}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px]">3</span>
            <span>Verification</span>
          </div>
        </div>

        {/* Step 1: Career Goal */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Engineering Role:</label>
              <input
                type="text"
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                placeholder="e.g. Embedded Firmware Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-200 block">Department Registered:</span>
              <span>{currentStudent.branch} Engineering • {currentStudent.college}</span>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
            >
              <span>Next: Select Existing Competencies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Initial Skills */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 font-semibold">
              Select competencies you have practiced or studied in your coursework:
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {availableSkills.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{sk}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
              >
                <span>Proceed to Baseline Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Diagnostic Verification */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Diagnostic Verification Baseline</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                We will record your initial {selectedSkills.length} declared skills. You can verify them with live code vivas & assessments at any time.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target Role:</span>
                <strong className="text-white">{selectedGoal}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Initial Skills Recorded:</span>
                <strong className="text-indigo-400">{selectedSkills.length} Competencies</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Baseline Readiness Index:</span>
                <strong className="text-emerald-400">68% Initial Score</strong>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Setup & Launch Dashboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
