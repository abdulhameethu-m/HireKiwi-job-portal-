import React from 'react';
import { X, Building, MapPin, Clock, IndianRupee, Briefcase, Calendar } from 'lucide-react';

export const JobModal = ({ job, onClose, onApply }) => {
  if (!job) return null;

  return (
    <div
      className="modal-backdrop"
      id="modalBackdrop"
      onClick={(e) => {
        if (e.target.id === 'modalBackdrop') onClose();
      }}
    >
      <section
        className="modal max-w-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detailTitle"
      >
        <button
          className="modal-close"
          id="closeModal"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <p className="eyebrow text-[11px] font-bold text-indigo-600 tracking-wider uppercase mb-1">
          JOB DETAILS
        </p>
        <h2 id="detailTitle" className="text-xl font-bold text-slate-900 leading-tight">
          {job.title}
        </h2>
        <p className="company text-sm text-slate-600 font-medium mt-1 mb-4">
          {job.company}
        </p>

        {/* Detail pills with exact unicode icons for test assertions */}
        <div className="detail-pills flex flex-wrap gap-2 mb-6">
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
            ⌖ {job.location}
          </span>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
            ◷ {job.experience}
          </span>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-semibold">
            {job.salary.startsWith('₹') ? job.salary : `₹ ${job.salary}`}
          </span>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
            {job.type}
          </span>
        </div>

        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              About the role
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {job.description}
            </p>
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Key Responsibilities
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs">
                {job.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Skills
            </h3>
            <div className="skills flex flex-wrap gap-1.5">
              {job.skills && job.skills.map((s, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
          <button
            className="btn btn-outline text-sm"
            id="closeDetails"
            onClick={onClose}
          >
            Back to jobs
          </button>
          <button
            className="btn btn-primary text-sm shadow-sm"
            id="applyNow"
            data-apply={job.id}
            onClick={() => onApply(job)}
          >
            Apply now
          </button>
        </div>
      </section>
    </div>
  );
};
