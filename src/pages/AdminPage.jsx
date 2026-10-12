import React, { useState, useEffect } from 'react';
import { jobsApi, applicationsApi, systemApi } from '../services/api';
import { Briefcase, Users, FileText, Plus, Edit2, Trash2, CheckCircle, XCircle, RefreshCw, AlertCircle, Loader2, Search } from 'lucide-react';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'applications'

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Job Modal (Create / Edit)
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    experience: '',
    salary: '',
    type: 'Full-time',
    category: 'Software Development',
    description: '',
    skills: '',
    status: 'active'
  });

  // Delete Confirmation Modal
  const [deleteJobId, setDeleteJobId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobsApi.getJobs({ limit: 100, status: 'all' }),
        applicationsApi.getAdminApplications()
      ]);
      setJobs(jobsRes.data?.jobs || []);
      setApplications(appsRes.data?.applications || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    setJobForm({
      title: '',
      company: '',
      location: '',
      experience: '0–2 years',
      salary: '₹4–6 LPA',
      type: 'Full-time',
      category: 'Software Development',
      description: '',
      skills: '',
      status: 'active'
    });
    setJobModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      experience: job.experience,
      salary: job.salary,
      type: job.type,
      category: job.category || 'Software Development',
      description: job.description,
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills,
      status: job.status
    });
    setJobModalOpen(true);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArr = jobForm.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        ...jobForm,
        skills: skillsArr
      };

      if (editingJob) {
        await jobsApi.updateJob(editingJob.id, payload);
        setMessage('Job updated successfully.');
      } else {
        await jobsApi.createJob(payload);
        setMessage('Job published successfully.');
      }

      setJobModalOpen(false);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save job listing.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const toggleJobStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      await jobsApi.updateJob(job.id, { status: newStatus });
      setMessage(`Job marked as ${newStatus}.`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update job status.');
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteJobId) return;
    try {
      await jobsApi.deleteJob(deleteJobId);
      setMessage('Job listing permanently removed.');
      setDeleteJobId(null);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete job.');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationsApi.updateStatus(appId, { status: newStatus });
      setMessage(`Application status changed to ${newStatus}.`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update application status.');
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Reset database to clean deterministic seed state? All test jobs and applications will be restored.')) return;
    try {
      await systemApi.reseed();
      setMessage('Database successfully reseeded with test records!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Reseed operation failed.');
    }
  };

  const activeJobsCount = jobs.filter(j => j.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            ADMINISTRATIVE PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recruitment Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage test vacancies, candidate applications, and QA test state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReseed}
            className="btn btn-outline text-xs py-2 px-3 flex items-center gap-1.5 text-amber-700 border-amber-300 hover:bg-amber-50"
            title="Reset to deterministic seed data"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reseed Test Data
          </button>
          <button
            onClick={openCreateModal}
            className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
            id="createJobBtn"
          >
            <Plus className="w-4 h-4" /> Create New Job
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs mb-6 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Job Listings</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{jobs.length}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Active Vacancies</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{activeJobsCount}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Applications</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{applications.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 flex gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'jobs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Job Postings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Applicant Submissions ({applications.length})
        </button>
      </div>

      {/* Tab 1: Jobs Table */}
      {activeTab === 'jobs' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Title & Company</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <b className="text-slate-900 font-bold block">{job.title}</b>
                      <span className="text-slate-500">{job.company}</span>
                    </td>
                    <td className="py-3 px-4">{job.location}</td>
                    <td className="py-3 px-4">{job.experience}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{job.salary}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleJobStatus(job)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          job.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {job.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(job)}
                        className="btn btn-outline text-[11px] py-1 px-2.5 text-indigo-600 hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteJobId(job.id)}
                        className="btn btn-outline text-[11px] py-1 px-2.5 text-red-600 hover:bg-red-50 border-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Applications Table */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Job Position</th>
                  <th className="py-3 px-4">Reference ID</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4">Status & Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <b className="text-slate-900 block font-bold">{app.fullName}</b>
                      <span className="text-slate-500">{app.email} · {app.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{app.jobTitle}</span>
                      <span className="text-slate-500 text-[11px]">{app.company}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                      {app.referenceId}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Job Modal */}
      {jobModalOpen && (
        <div className="modal-backdrop">
          <div className="modal max-w-xl" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setJobModalOpen(false)}>×</button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingJob ? 'Edit Job Listing' : 'Post New Vacancy'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Fill in the job details. The vacancy will appear immediately in search.
            </p>

            <form onSubmit={handleJobSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adminJobTitle" className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
                  <input
                    id="adminJobTitle"
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                  />
                </div>

                <div>
                  <label htmlFor="adminJobCompany" className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    id="adminJobCompany"
                    type="text"
                    required
                    value={jobForm.company}
                    onChange={(e) => setJobForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                  />
                </div>

                <div>
                  <label htmlFor="adminJobLocation" className="block text-xs font-semibold text-slate-700 mb-1">Location *</label>
                  <input
                    id="adminJobLocation"
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                  />
                </div>

                <div>
                  <label htmlFor="adminJobExperience" className="block text-xs font-semibold text-slate-700 mb-1">Experience *</label>
                  <input
                    id="adminJobExperience"
                    type="text"
                    required
                    value={jobForm.experience}
                    onChange={(e) => setJobForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                  />
                </div>

                <div>
                  <label htmlFor="adminJobSalary" className="block text-xs font-semibold text-slate-700 mb-1">Salary *</label>
                  <input
                    id="adminJobSalary"
                    type="text"
                    required
                    value={jobForm.salary}
                    onChange={(e) => setJobForm(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                  />
                </div>

                <div>
                  <label htmlFor="adminJobType" className="block text-xs font-semibold text-slate-700 mb-1">Type *</label>
                  <select
                    id="adminJobType"
                    value={jobForm.type}
                    onChange={(e) => setJobForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="adminJobSkills" className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (comma separated) *</label>
                <input
                  id="adminJobSkills"
                  type="text"
                  required
                  placeholder="e.g. React, TypeScript, Jest, Tailwind"
                  value={jobForm.skills}
                  onChange={(e) => setJobForm(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
              </div>

              <div>
                <label htmlFor="adminJobDescription" className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  id="adminJobDescription"
                  rows={3}
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="btn btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  id="adminJobSubmitBtn"
                  type="submit"
                  className="btn btn-primary text-xs"
                >
                  {editingJob ? 'Update Job' : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Job Confirmation Modal */}
      {deleteJobId && (
        <div className="modal-backdrop">
          <div className="modal max-w-sm text-center p-6" role="dialog" aria-modal="true">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 mb-5">
              Are you sure you want to remove this job listing from the test database? This cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteJobId(null)}
                className="btn btn-outline text-xs px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="btn btn-primary bg-red-600 hover:bg-red-700 text-xs px-4"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
