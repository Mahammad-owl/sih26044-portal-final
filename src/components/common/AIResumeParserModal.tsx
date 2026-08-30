import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Cpu,
  ArrowRight,
  X,
  Upload,
  RefreshCw
} from 'lucide-react';
import { Badge } from './Badge';

interface AIResumeParserModalProps {
  onClose: () => void;
}

export const AIResumeParserModal: React.FC<AIResumeParserModalProps> = ({ onClose }) => {
  const { parseResumeText, verifyStudentSkill, currentStudent } = useApp();

  const [resumeText, setResumeText] = useState(
    `ANANYA SHARMA - B.Tech Electronics & Communication Engineering (ECE)
Skills: Embedded C, ARM Cortex-M, STM32, Arduino, FreeRTOS, CAN Bus 2.0B, I2C/SPI Protocols, Digital Electronics, KiCad.
Projects: CAN-Bus Vehicle Telemetry Node using STM32 bare-metal registers. Soil moisture LoRaWAN wireless sensor node.
Experience: Hardware Lab Team Lead - NIT Trichy.`
  );

  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<{
    extractedSkills: string[];
    suggestedRole: string;
    confidence: number;
    branch: string;
  } | null>(null);

  const sampleResumes = [
    {
      label: 'ECE - Embedded Firmware (Ananya)',
      text: `ANANYA SHARMA - B.Tech ECE
Skills: Embedded C, ARM Cortex-M, STM32, Arduino, FreeRTOS, CAN Bus 2.0B, I2C/SPI Protocols, Digital Electronics, KiCad.
Projects: CAN-Bus Vehicle Telemetry Node using STM32 bare-metal registers. Soil moisture LoRaWAN wireless sensor node.`
    },
    {
      label: 'CSE - Cloud & AI Systems',
      text: `ARJUN MEHTA - B.Tech Computer Science
Skills: Python, FastAPI, Docker, Kubernetes, Distributed Systems, Redis, Qdrant Vector DB, SQL, Go.
Projects: Zero-Downtime Microservices Cluster with Helm and Prometheus. High-Throughput Vector Search API.`
    },
    {
      label: 'EEE - EV Powertrain & BMS',
      text: `SNEHA PATEL - B.Tech Electrical & Electronics
Skills: MATLAB, Simulink, Battery Management Systems (BMS), Power Electronics, Inverters, PMSM FOC Motor Control.
Projects: Active Cell Balancing Circuit using LTC6811 for 48V Li-Ion battery pack.`
    },
    {
      label: 'Mechanical - Robotics & CAD',
      text: `VIKRAMADITYA VERMA - B.Tech Mechanical Engineering
Skills: SolidWorks 3D CAD, GD&T, ANSYS FEA, Topology Optimization, ROS 2, Mechatronics, Cobots.
Projects: 6-DOF Robotic Arm Planetary Gearbox with FEA torsional stiffness optimization.`
    },
    {
      label: 'Civil - BIM & Structural',
      text: `KAVYA RAO - B.Tech Civil Engineering
Skills: Autodesk Revit, 4D BIM Modeling, ETABS, STAAD.Pro, Navisworks Clash Detection, GIS, Drone Topography.
Projects: G+12 High-Rise Seismic Response Spectrum Model under IS 1893:2016.`
    }
  ];

  const handleParse = () => {
    setParsing(true);
    setTimeout(() => {
      const parsed = parseResumeText(resumeText);
      setResult(parsed);
      setParsing(false);
    }, 600);
  };

  const handleApplyToProfile = () => {
    if (!result) return;
    result.extractedSkills.forEach((skill) => {
      verifyStudentSkill(currentStudent.id, {
        name: skill,
        branch: currentStudent.branch,
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 90
      });
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">AI Resume Skill Extraction Engine</h3>
                <Badge variant="purple" size="sm">
                  Simulated Local NLP
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically classifies competencies, detects branch discipline, and flags skills for evidence verification.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick presets */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Load Sample Resume Preset:</label>
            <div className="flex flex-wrap gap-2">
              {sampleResumes.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setResumeText(sample.text);
                    setResult(null);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium transition-all"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              Paste Resume Content or Academic Project Summary:
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={5}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Paste raw resume text or portfolio description here..."
            />
          </div>

          <button
            onClick={handleParse}
            disabled={parsing || !resumeText.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            {parsing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Simulated AI Extraction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract & Classify Skills with AI</span>
              </>
            )}
          </button>

          {/* Parsed Result Preview */}
          {result && (
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-slate-950/70 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Detected Discipline</span>
                  <p className="text-sm font-bold text-indigo-300">{result.branch} Engineering</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Suggested Role</span>
                  <p className="text-sm font-bold text-emerald-400">{result.suggestedRole}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Extraction Confidence</span>
                  <p className="text-sm font-bold text-white">{result.confidence}%</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Extracted Competencies ({result.extractedSkills.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.extractedSkills.map((skill, idx) => (
                    <Badge key={idx} variant="success" size="md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{skill}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Directly route extracted skills into Evidence-Based Verification Pipeline.</span>
                <button
                  onClick={handleApplyToProfile}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Sync to Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
