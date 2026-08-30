import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Briefcase,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';
import { Discipline, JobRequiredSkill } from '../../types';

interface CreateJobModalProps {
  onClose: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ onClose }) => {
  const { addNewJob, selectedCompanyId, jobs } = useApp();

  const company = jobs.find((j) => j.companyId === selectedCompanyId)?.companyName || 'Bosch Engineering';
  const companyLogo = jobs.find((j) => j.companyId === selectedCompanyId)?.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';

  const [role, setRole] = useState('Edge AI Firmware & RTOS Engineer');
  const [selectedBranches, setSelectedBranches] = useState<Discipline[]>(['ECE', 'CSE']);
  const [type, setType] = useState<'Internship' | 'Full-Time' | 'Co-Op'>('Internship');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [mode, setMode] = useState<'Hybrid' | 'On-site' | 'Remote'>('Hybrid');
  const [duration, setDuration] = useState('6 Months');
  const [stipend, setStipend] = useState('₹45,000 / month');
  const [openings, setOpenings] = useState(6);
  const [deadline, setDeadline] = useState('2026-04-30');
  const [description, setDescription] = useState(
    'Develop real-time sensor processing firmware, FreeRTOS task coordination, and low-power edge neural network inference on ARM Cortex-M55/M85 microcontrollers.'
  );

  const [requiredSkills, setRequiredSkills] = useState<JobRequiredSkill[]>([
    { name: 'Embedded C', minLevel: 4, weight: 35, isMustHave: true },
    { name: 'RTOS (FreeRTOS)', minLevel: 3, weight: 35, isMustHave: true },
    { name: 'Microcontrollers (ARM Cortex-M & AVR)', minLevel: 3, weight: 30, isMustHave: false }
  ]);

  const [newSkillName, setNewSkillName] = useState('');

  const toggleBranch = (b: Discipline) => {
    if (selectedBranches.includes(b)) {
      if (selectedBranches.length > 1) setSelectedBranches(selectedBranches.filter((x) => x !== b));
    } else {
      setSelectedBranches([...selectedBranches, b]);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setRequiredSkills([
      ...requiredSkills,
      { name: newSkillName.trim(), minLevel: 3, weight: 20, isMustHave: false }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (idx: number) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewJob({
      companyId: selectedCompanyId,
      companyName: company,
      companyLogo: companyLogo,
      role,
      discipline: selectedBranches,
      type,
      location,
      mode,
      duration,
      stipend,
      deadline,
      openings,
      description,
      responsibilities: [
        'Write bare-metal and RTOS firmware drivers.',
        'Implement automated test benches on hardware development kits.',
        'Collaborate with hardware verification engineers.'
      ],
      requiredSkills
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Post Industry Opportunity</h3>
              <p className="text-xs text-slate-400">{company} • Define Competency Requirements</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Role & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Role Title:</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Opportunity Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Internship">Internship (Paid)</option>
                <option value="Full-Time">Full-Time Campus Hire</option>
                <option value="Co-Op">Co-Op Fellowship</option>
              </select>
            </div>
          </div>

          {/* Discipline selection */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">Target Disciplines:</label>
            <div className="flex flex-wrap gap-2">
              {(['ECE', 'CSE', 'EEE', 'Mechanical', 'Civil'] as Discipline[]).map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => toggleBranch(b)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    selectedBranches.includes(b)
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Location, Duration & Stipend */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Location & Mode:</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Duration:</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Stipend / CTC:</label>
              <input
                type="text"
                required
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Job Description & Responsibilities:</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Required Skills Builder */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">Required Skills & Benchmark Weights:</label>
              <span className="text-[10px] text-slate-400 font-mono">Used for automated candidate ranking</span>
            </div>

            <div className="space-y-2">
              {requiredSkills.map((req, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-xs">{req.name}</span>
                    <span className="text-[10px] text-indigo-300 font-mono">Min Level: {req.minLevel}/5</span>
                    <span className="text-[10px] text-slate-400 font-mono">Weight: {req.weight}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={req.isMustHave}
                        onChange={(e) => {
                          const updated = [...requiredSkills];
                          updated[idx].isMustHave = e.target.checked;
                          setRequiredSkills(updated);
                        }}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span>Must-Have</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add skill input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Add required skill (e.g. FreeRTOS, SystemVerilog, Revit)..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Opening</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
