import React from 'react';
import { MapPin, Clock, IndianRupee, ArrowRight, Building } from 'lucide-react';

export const JobCard = ({ job, onSelect, onApply, isModalOpen = false }) => {
  const companyInitials = job.company
    ? job.company.split(' ').map(n => n[0]).slice(0, 2).join('')
    : 'CN';

  return (
    <article
      className="job-card bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
      data-job-card={job.id}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm tracking-tight flex-shrink-0">
              {companyInitials}
            </div>
            <div>
              <button
                type="button"
                onClick={() => onSelect(job)}
                className="job-title text-left font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base line-clamp-1 cursor-pointer"
                data-details={job.id}
              >
                {job.title}
              </button>
              <p className="company text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <Building className="w-3 h-3 text-slate-400" />
                <span>{isModalOpen ? '' : job.company}</span>
              </p>
            </div>
          </div>

          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            job.type === 'Full-time' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            job.type === 'Internship' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            job.type === 'Hybrid' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {job.type}
          </span>
        </div>

        {/* Job Meta with exact symbols for legacy and modern test locators */}
        <div className="job-meta flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600">
          <span className="flex items-center gap-1 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            <span aria-hidden="true">⌖</span> {job.location}
          </span>
          <span className="flex items-center gap-1 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            <span aria-hidden="true">◷</span> {job.experience}
          </span>
          <span className="flex items-center gap-1 font-medium bg-indigo-50/70 text-indigo-800 px-2 py-0.5 rounded border border-indigo-100">
            {isModalOpen ? '' : (job.salary.startsWith('₹') ? job.salary : `₹ ${job.salary}`)}
          </span>
        </div>

        <p className="job-description text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        <div className="skills flex flex-wrap gap-1.5 mt-3.5">
          {job.skills && job.skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onSelect(job)}
          className="btn btn-outline text-xs py-1.5 px-3 view-btn text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50"
          data-details={job.id}
        >
          View details
        </button>
      </div>
    </article>
  );
};
