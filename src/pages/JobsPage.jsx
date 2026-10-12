import React, { useState, useEffect } from 'react';
import { jobsApi } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { ApplicationModal } from '../components/ApplicationModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  // Modals
  const [detailJob, setDetailJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobsApi.getJobs({
        keyword,
        location,
        experience,
        type,
        category,
        sort,
        page,
        limit: 8,
        status: 'active'
      });
      setJobs(res.data?.jobs || []);
      setTotal(res.data?.total || 0);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch job listings from API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [keyword, location, experience, type, category, sort, page]);

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setExperience('');
    setType('');
    setCategory('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Job Openings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Discover verified recruitment opportunities across development, QA, cloud, and analytics.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Panel */}
        <aside className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 h-fit sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-indigo-600" /> Filters
            </h2>
            <button
              onClick={clearFilters}
              id="clearFilters"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          {/* Search Keyword */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keywords</label>
            <div className="relative">
              <input
                id="keyword"
                type="text"
                placeholder="Title, skill, company"
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="filterLocation" className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
            <select
              id="filterLocation"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 bg-white"
            >
              <option value="">All locations</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Chennai">Chennai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Experience Level</label>
            <select
              value={experience}
              onChange={(e) => { setExperience(e.target.value); setPage(1); }}
              className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 bg-white"
            >
              <option value="">All experience levels</option>
              <option value="Fresher">Fresher</option>
              <option value="0–1 years">0–1 years</option>
              <option value="0–2 years">0–2 years</option>
              <option value="1–2 years">1–2 years</option>
              <option value="2+ years">2+ years</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Employment Type</label>
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 bg-white"
            >
              <option value="">All types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 bg-white"
            >
              <option value="">All categories</option>
              <option value="Software Development">Software Development</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Product & Analytics">Product & Analytics</option>
              <option value="IT & Infrastructure">IT & Infrastructure</option>
            </select>
          </div>
        </aside>

        {/* Listings Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <span id="resultCount" className="text-xs font-semibold text-slate-700">
              Showing <b>{jobs.length}</b> of <b>{total}</b> jobs
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          {/* API Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Content */}
          <div id="jobList" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-100 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelect={(j) => setDetailJob(j)}
                    onApply={(j) => setApplyJob(j)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                <div className="empty-icon w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3 text-lg">
                  ⌕
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">No jobs found</h3>
                <p className="text-xs text-slate-500 mb-5">
                  No matching jobs match your active filters. Try broadening your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  id="resetSearch"
                  className="btn btn-outline text-xs"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-outline text-xs flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <span className="text-xs font-medium text-slate-600">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-outline text-xs flex items-center gap-1 disabled:opacity-40"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <div id="modalRoot">
        {detailJob && (
          <JobModal
            job={detailJob}
            onClose={() => setDetailJob(null)}
            onApply={(j) => {
              setDetailJob(null);
              setApplyJob(j);
            }}
          />
        )}

        {applyJob && (
          <ApplicationModal
            job={applyJob}
            onClose={() => setApplyJob(null)}
            onSuccess={(details) => {
              setApplyJob(null);
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
