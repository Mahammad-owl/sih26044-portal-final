import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Handshake,
  Building2,
  Calendar,
  CheckCircle2,
  Plus,
  Send,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  Layers,
  Award
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { CollaborationOffer } from '../../types';

export const CollaborationHub: React.FC = () => {
  const { collaborations, requestCollaborationOffer } = useApp();
  const [selectedCollab, setSelectedCollab] = useState<CollaborationOffer | null>(null);
  const [requestedSuccess, setRequestedSuccess] = useState<string | null>(null);
  const [facultyContact, setFacultyContact] = useState('Dr. K. S. Ramanathan (HOD ECE)');

  const handleRequest = (collabId: string, title: string) => {
    requestCollaborationOffer(collabId, 'National Institute of Technology, Trichy', facultyContact);
    setRequestedSuccess(`Collaboration request for "${title}" sent to industry lead!`);
    setSelectedCollab(null);
    setTimeout(() => setRequestedSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Academia–Industry Collaboration Marketplace</h2>
            <Badge variant="purple" size="sm">
              National MoU Network
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Discover and request industry-sponsored hardware labs, student live challenge projects, guest masterclasses, and faculty development programs.
          </p>
        </div>

        <Badge variant="success" size="md" dot>
          {collaborations.length} Active Industry Offers
        </Badge>
      </div>

      {requestedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{requestedSuccess}</span>
          </div>
          <button onClick={() => setRequestedSuccess(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Collaboration Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {collaborations.map((collab) => {
          const isRequestedByNIT = collab.requestedInstitutions.some((r) =>
            r.institutionName.includes('National Institute of Technology')
          );

          return (
            <div
              key={collab.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all"
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

                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
                  <span className="font-mono text-slate-300">Disciplines: {collab.branch.join(', ')}</span>
                  <span>•</span>
                  <span>{collab.duration}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">{collab.mode}</span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">{collab.description}</p>

                {/* Deliverables */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Offer Deliverables:</span>
                  {collab.deliverables.map((del, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button & Status */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Lead: {collab.industryLeads.split(',')[0]}</span>

                {isRequestedByNIT ? (
                  <Badge variant="success" size="md">
                    Request Approved / Scheduled
                  </Badge>
                ) : (
                  <button
                    onClick={() => setSelectedCollab(collab)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <span>Request for Institution</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Request Modal */}
      {selectedCollab && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Request Industry Collaboration</h3>
              <button onClick={() => setSelectedCollab(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm">{selectedCollab.title}</h4>
                <p className="text-indigo-300 text-xs mt-0.5">{selectedCollab.companyName}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Requesting Institution:</label>
                <input
                  type="text"
                  disabled
                  value="National Institute of Technology, Trichy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Coordinating Faculty / Department:</label>
                <input
                  type="text"
                  value={facultyContact}
                  onChange={(e) => setFacultyContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCollab(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequest(selectedCollab.id, selectedCollab.title)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Request to Industry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
