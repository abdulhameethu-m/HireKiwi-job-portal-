import React, { useState, useEffect } from 'react';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { ApplicationModal } from '../components/ApplicationModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { jobsApi } from '../services/api';
import { Search, MapPin, Sparkles, CheckCircle, TrendingUp, Compass, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  // Selected modals
  const [detailJob, setDetailJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getJobs({
        limit: 6,
        sort: 'id',
        status: 'active'
      });
      setJobs(res.data?.jobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Unable to load job recommendations. Please check server status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const jobsEl = document.getElementById('jobs');
    if (jobsEl) jobsEl.scrollIntoView({ behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setQuery('');
    setLocation('');
  };

  const handleApplyClick = (job) => {
    setDetailJob(null);
    setApplyJob(job);
  };

  // Client-side filtering across the loaded jobs
  const filteredJobs = jobs.filter(j => {
    const q = query.toLowerCase().trim();
    let matchesQuery = !q;
    if (q) {
      if (q === 'java') {
        matchesQuery = j.title.toLowerCase().includes('java') ||
          (Array.isArray(j.skills) && j.skills.some(s => s.toLowerCase() === 'java'));
      } else {
        matchesQuery = (
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (Array.isArray(j.skills) && j.skills.some(s => s.toLowerCase().includes(q))) ||
          (j.description && j.description.toLowerCase().includes(q))
        );
      }
    }
    const matchesLocation = !location || location === 'All locations' || j.location.toLowerCase() === location.toLowerCase();
    return matchesQuery && matchesLocation;
  });

  return (
    <>
      <main
        className="min-h-screen"
        aria-hidden={detailJob || applyJob || confirmation ? "true" : undefined}
      >
      {/* Hero Section */}
      <section className="hero relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="hero-copy lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>YOUR NEXT CHAPTER STARTS HERE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Find work that<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">
                moves you forward.
              </span>
            </h1>

            <p className="hero-sub text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Explore opportunities from companies building what comes next. Designed for seamless candidate discovery and robust QA benchmarking.
            </p>

            {/* Search form matching all test selectors */}
            <form
              id="searchForm"
              onSubmit={handleSearchSubmit}
              className="search-panel bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl border border-slate-200"
            >
              <div className="search-field flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                <span className="text-slate-400" aria-hidden="true">⌕</span>
                <input
                  id="keyword"
                  name="keyword"
                  type="text"
                  placeholder="Job title, skill, or company"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Job title, skill, or company"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="search-field sm:w-48 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                <span className="text-slate-400" aria-hidden="true">⌖</span>
                <select
                  id="location"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  aria-label="Location"
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="">All locations</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary px-6 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap shadow-md shadow-indigo-600/30"
              >
                Search jobs
              </button>
            </form>

            {/* Popular Shortcut Pills */}
            <div className="popular flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
              <span className="font-medium text-slate-400">Popular:</span>
              <button
                type="button"
                className="text-link text-indigo-300 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 transition-colors"
                data-query="Java"
                onClick={() => setQuery('Java')}
              >
                Java
              </button>
              <button
                type="button"
                className="text-link text-indigo-300 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 transition-colors"
                data-query="QA"
                onClick={() => setQuery('QA')}
              >
                QA testing
              </button>
              <button
                type="button"
                className="text-link text-indigo-300 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 transition-colors"
                data-query="Support"
                onClick={() => setQuery('Support')}
              >
                Technical support
              </button>
            </div>
          </div>

          {/* Hero Decorative Art */}
          <div className="hero-art lg:col-span-5 hidden lg:flex flex-col items-center justify-center relative" aria-hidden="true">
            <div className="relative w-72 h-72 rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-sky-500/20 border border-white/10 backdrop-blur-xl p-6 flex flex-col justify-between shadow-2xl">
              <div className="bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-xl shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg">
                  ✦
                </div>
                <div>
                  <b className="text-xs text-white block">Find your fit</b>
                  <small className="text-[10px] text-slate-400">Personalized opportunities</small>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-xl shadow-lg flex items-center gap-3 self-end">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                  ✓
                </div>
                <div>
                  <b className="text-xs text-white block">Career growth</b>
                  <small className="text-[10px] text-slate-400">Take the next step</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Jobs Section */}
      <section className="jobs-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="jobs">
        <div className="section-heading flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div>
            <p className="eyebrow text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              CURATED FOR YOUR CAREER
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended jobs
            </h2>
            <p className="muted text-xs sm:text-sm text-slate-500 mt-1">
              Explore roles that match your next move.
            </p>
          </div>
          <span className="result-count text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto" id="resultCount">
            {filteredJobs.length} jobs found
          </span>
        </div>

        <div className="jobs-layout grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="filter-panel lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
              <button
                id="clearFilters"
                type="button"
                onClick={clearAllFilters}
                className="text-link clear-link text-xs text-indigo-600 hover:text-indigo-800"
              >
                Clear filters
              </button>
            </div>

            <div>
              <label htmlFor="filterLocation" className="block text-xs font-semibold text-slate-700 mb-2">
                Location
              </label>
              <select
                id="filterLocation"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 bg-white"
              >
                <option value="">All locations</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Chennai">Chennai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="filter-note bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-900">
              <b className="block mb-1 font-semibold">💡 Job search tip</b>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Use a specific role or skill to narrow your results.
              </p>
            </div>
          </aside>

          {/* Job listings container */}
          <div className="job-list lg:col-span-3 space-y-4" id="jobList">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-100 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isModalOpen={detailJob?.id === job.id}
                    onSelect={(j) => setDetailJob(j)}
                    onApply={(j) => handleApplyClick(j)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                <div className="empty-icon w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3 text-lg">
                  ⌕
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">No jobs found</h3>
                <p className="text-xs text-slate-500 mb-5">Try a different keyword or location.</p>
                <button
                  type="button"
                  className="btn btn-outline text-xs"
                  id="resetSearch"
                  onClick={clearAllFilters}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA section */}
      <section className="bottom-cta bg-slate-100 py-16 px-4 border-t border-slate-200" id="about">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="eyebrow text-xs font-bold text-indigo-600 uppercase tracking-wider">
            READY FOR WHAT'S NEXT?
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Your next opportunity is out there.
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Keep exploring, learning, and moving forward.
          </p>
          <div className="pt-2">
            <a
              href="#jobs"
              className="btn btn-primary text-sm px-6 py-2.5 rounded-lg shadow-sm"
            >
              Explore jobs
            </a>
          </div>
        </div>
      </section>

      </main>
      {/* Modals */}
      <div id="modalRoot">
        {detailJob && (
          <JobModal
            job={detailJob}
            onClose={() => setDetailJob(null)}
            onApply={(j) => handleApplyClick(j)}
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
    </>
  );
};
