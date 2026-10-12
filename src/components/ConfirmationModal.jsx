import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ConfirmationModal = ({ details, onClose }) => {
  if (!details) return null;

  return (
    <div className="modal-backdrop" id="modalBackdrop">
      <section
        className="modal success-modal text-center max-w-md p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="successTitle"
      >
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="success-check text-2xl font-bold">✓</span>
        </div>

        <p className="eyebrow text-[11px] font-bold text-emerald-600 tracking-wider uppercase mb-1">
          APPLICATION RECEIVED
        </p>

        <h2 id="successTitle" className="text-xl font-bold text-slate-900 mb-2">
          You're all set, {details.fullName}!
        </h2>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Your demo application for <b>{details.jobTitle}</b> has been recorded locally.
        </p>

        <div className="confirmation-id bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 font-mono mb-5">
          Reference ID: <b className="text-indigo-600 text-sm font-bold">{details.referenceId}</b>
        </div>

        <p className="muted small text-[11px] text-slate-400 mb-6">
          This is a mock portal. No application was sent to a real employer.
        </p>

        <button
          className="btn btn-primary text-xs py-2.5 px-6 w-full shadow-sm"
          id="doneBtn"
          onClick={onClose}
        >
          Back to jobs
        </button>
      </section>
    </div>
  );
};
