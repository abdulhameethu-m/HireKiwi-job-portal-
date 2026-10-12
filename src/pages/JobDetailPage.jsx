import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsApi } from '../services/api';
import { ApplicationModal } from '../components/ApplicationModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ArrowLeft, Building, MapPin, Clock, IndianRupee, Briefcase, Calendar, AlertCircle, Share2, CheckCircle } from 'lucide-react';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply modal
  const [isApplying, setIsApplying] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await jobsApi.getJobById(id);
        setJob(res.data.job);
        setRelatedJobs(res.data.relatedJobs || []);
      } catch (err) {
        setError(err.message || 'Job listing could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded w-1/4"></div>
          <div className="h-24 bg-slate-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Job Not Found</h1>
        <p className="text-xs text-slate-500 mb-6">
          {error || 'The job listing you requested may have been unlisted, closed, or does not exist.'}
        </p>
        <Link to="/jobs" className="btn btn-primary text-xs py-2 px-5">
          Back to all jobs
        </Link>
      </div>
    );
  }

  const isClosed = job.status === 'closed';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh]">
      {/* Back navigation */}
      <div className="mb-6">
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to job search
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  {job.category || 'RECRUITMENT'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {job.title}
                </h1>
                <p className="text-sm font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  {job.company}
                </p>
              </div>

              {isClosed ? (
                <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full">
                  Listing Closed
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                  Actively Hiring
                </span>
              )}
            </div>

            {/* Meta highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Location
                </span>
                <b className="text-slate-800">{job.location}</b>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Experience
                </span>
                <b className="text-slate-800">{job.experience}</b>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> Compensation
                </span>
                <b className="text-indigo-700">{job.salary}</b>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Job Type
                </span>
                <b className="text-slate-800">{job.type}</b>
              </div>
            </div>

            {/* Description */}
            <div className="py-6 border-b border-slate-100 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                About the role
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="py-6 border-b border-slate-100 space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Key Responsibilities
                </h2>
                <ul className="space-y-2 text-xs text-slate-600">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            <div className="pt-6 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills && job.skills.map((s, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Action Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Application Status</h3>
              <p className="text-xs text-slate-500 mt-1">
                {isClosed
                  ? 'This listing is closed and no longer accepting candidate applications.'
                  : 'Applications are being processed locally for this assessment.'}
              </p>
            </div>

            <button
              onClick={() => setIsApplying(true)}
              disabled={isClosed}
              className="btn btn-primary w-full py-2.5 text-xs font-semibold shadow-sm disabled:opacity-40"
              id="applyNow"
            >
              {isClosed ? 'Listing Closed' : 'Apply Now'}
            </button>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
              <p>Posted: {job.postedDate || 'Recent'}</p>
              {job.deadline && <p>Deadline: {job.deadline}</p>}
            </div>
          </div>

          {/* Related Jobs */}
          {relatedJobs.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Similar Positions</h3>
              <div className="space-y-3">
                {relatedJobs.map(rj => (
                  <Link
                    key={rj.id}
                    to={`/jobs/${rj.id}`}
                    className="block p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-slate-50/50 transition-all"
                  >
                    <h4 className="font-bold text-xs text-slate-900">{rj.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{rj.company} · {rj.location}</p>
                    <span className="text-[11px] text-indigo-600 font-semibold block mt-1">₹ {rj.salary}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application and Confirmation Modals */}
      <div id="modalRoot">
        {isApplying && (
          <ApplicationModal
            job={job}
            onClose={() => setIsApplying(false)}
            onSuccess={(details) => {
              setIsApplying(false);
              setConfirmation(details);
            }}
          />
        )}

        {confirmation && (
          <ConfirmationModal
            details={confirmation}
            onClose={() => setConfirmation(null)}
          />
        )}
      </div>
    </div>
  );
};
