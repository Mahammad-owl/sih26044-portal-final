import React from 'react';

export default function RoleBadge({ role, size = 'md' }) {
  const styles = {
    STUDENT: 'bg-sky-100 text-sky-800 border-sky-300',
    INDUSTRY: 'bg-purple-100 text-purple-800 border-purple-300',
    FACULTY: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    INSTITUTION_ADMIN: 'bg-amber-100 text-amber-800 border-amber-300'
  };

  const labels = {
    STUDENT: 'Student',
    INDUSTRY: 'Industry Partner',
    FACULTY: 'Academic Faculty',
    INSTITUTION_ADMIN: 'Institution Admin'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center rounded-full border ${styles[role] || 'bg-slate-100 text-slate-800 border-slate-300'} ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {labels[role] || role}
    </span>
  );
}
