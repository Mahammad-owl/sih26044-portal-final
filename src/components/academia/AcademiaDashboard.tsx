import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  CheckSquare,
  Handshake,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  FileCheck
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { StatCard } from '../common/StatCard';

export const AcademiaDashboard: React.FC = () => {
  const { students, assessments, collaborations, setFacultyTab, setSelectedStudentId } = useApp();

  const eceStudents = students.filter((s) => s.branch === 'ECE');
  const avgReadiness = Math.round(eceStudents.reduce((sum, s) => sum + s.readinessScore, 0) / (eceStudents.length || 1));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Faculty & Department Portal (ECE)</h2>
            <Badge variant="purple" size="sm">
              NIT Trichy
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dr. K. S. Ramanathan • Head of Department • Real-time student skill verification, assessment management & industry alignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFacultyTab('assessments')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Create Department Assessment</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Department Enrolled"
          value="320 Students"
          subtitle="94% assessment participation"
          icon={Users}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10 border-indigo-500/20"
        />
        <StatCard
          title="Avg Skill Readiness"
          value={`${avgReadiness}%`}
          subtitle="Top tier engineering benchmark"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Department Skill Gap"
          value="38% RTOS"
          subtitle="Critical industry gap flagged"
          icon={AlertTriangle}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10 border-rose-500/20"
          onClick={() => setFacultyTab('skill-gaps')}
        />
        <StatCard
          title="Active Industry MoUs"
          value={collaborations.length}
          subtitle="Bosch, Ather, Qualcomm labs"
          icon={Handshake}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
          onClick={() => setFacultyTab('industry-programs')}
        />
      </div>

      {/* Critical ECE Skill Gap Intervention Alert */}
      <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AICTE / Industry Alignment Recommendation: RTOS Bootcamp</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Analytics detect that <strong>38% of ECE 3rd-Year students</strong> have a gap in <strong>FreeRTOS / Embedded Linux</strong>,
              while <strong>88% of core recruitment partners</strong> require it.
            </p>
          </div>
        </div>

        <button
          onClick={() => setFacultyTab('industry-programs')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0"
        >
          <span>Request Bosch Lab Workshop</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Column Section: Student Verification Roster & Active Department Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ECE Student Verification Roster */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">ECE Cohort Evidence Roster</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Roster</span>
          </div>

          <div className="space-y-3">
            {eceStudents.map((stud) => (
              <div
                key={stud.id}
                onClick={() => setSelectedStudentId(stud.id)}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={stud.avatar} alt={stud.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{stud.name}</span>
                      <Badge variant="purple" size="sm">
                        CGPA: {stud.cgpa}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Goal: {stud.careerGoal}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">{stud.readinessScore}% Ready</span>
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Assessments & Passing Stats */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Department Technical Assessments</h3>
            </div>
            <button
              onClick={() => setFacultyTab('assessments')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-3">
            {assessments.map((a) => (
              <div key={a.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{a.title}</span>
                  <Badge variant="info" size="sm">
                    {a.branch} Dept
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>
                    <strong className="text-white">{a.attemptsCount}</strong> Total Attempts
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">Avg Score: {a.avgScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
