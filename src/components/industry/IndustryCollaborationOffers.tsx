import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Handshake,
  PlusCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { CollaborationOffer } from '../../types';

export const IndustryCollaborationOffers: React.FC = () => {
  const { collaborations, selectedCompanyId, jobs, addNewCollaboration } = useApp();
  const [showPostModal, setShowPostModal] = useState(false);

  const company = jobs.find((j) => j.companyId === selectedCompanyId)?.companyName || 'Bosch Engineering';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Academia-Industry Collaboration Hub</h2>
            <Badge variant="purple" size="sm">
              Industry Portal
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Offer college lab sponsorships, workshops, live challenge data, and faculty enablement programs to partner institutions.
          </p>
        </div>

        <Badge variant="success" size="md" dot>
          {collaborations.length} Active Industry Programs
        </Badge>
      </div>

      {/* Program Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {collaborations.map((collab) => (
          <div
            key={collab.id}
            className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={collab.companyLogo}
                    alt={collab.companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{collab.title}</h3>
                    <p className="text-xs text-indigo-300 font-semibold mt-0.5">{collab.companyName}</p>
                  </div>
                </div>
                <Badge variant="purple" size="sm">
                  {collab.type}
                </Badge>
              </div>

              {/* Target branches & Duration */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
                <span className="font-mono text-slate-300">Branches: {collab.branch.join(', ')}</span>
                <span>•</span>
                <span>{collab.duration}</span>
                <span>•</span>
                <span className="text-emerald-400">{collab.mode}</span>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">{collab.description}</p>

              {/* Deliverables */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Program Deliverables:</span>
                {collab.deliverables.map((del, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requested Institutions */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Partner Institutions Enrolled ({collab.requestedInstitutions.length}):
              </span>
              {collab.requestedInstitutions.length > 0 ? (
                collab.requestedInstitutions.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white">{req.institutionName}</span>
                      <p className="text-[10px] text-slate-400">Lead: {req.contactFaculty}</p>
                    </div>
                    <Badge variant="success" size="sm">
                      {req.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-500 italic">Open for institution requests.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
