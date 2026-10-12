import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsApi, profileApi } from '../services/api';
import { User, Mail, Phone, Briefcase, Calendar, CheckCircle2, Clock, XCircle, Edit3, Loader2, ArrowRight } from 'lucide-react';

export const DashboardPage = () => {
  const { user, updateProfile } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    headline: user?.headline || ''
  });
  const [saveStatus, setSaveStatus] = useState('');

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsApi.getMyApplications();
      setApplications(res.data?.applications || []);
    } catch (err) {
      setError('Unable to fetch your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    try {
      await updateProfile(editForm);
      setSaveStatus('Profile updated successfully!');
      setTimeout(() => {
        setIsEditing(false);
        setSaveStatus('');
      }, 1000);
    } catch (err) {
      setSaveStatus(err.message || 'Failed to save profile.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> Submitted
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Shortlisted
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh]">
      {/* Profile Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-indigo-100">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.fullName}</h1>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {user?.headline || 'Candidate profile · Assessment test account'}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user?.phone}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditForm({
              fullName: user?.fullName || '',
              phone: user?.phone || '',
              headline: user?.headline || ''
            });
            setIsEditing(true);
          }}
          className="btn btn-outline text-xs py-2 px-4 flex items-center gap-1.5 self-start md:self-center"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit Profile
        </button>
      </div>

      {/* Applied Jobs Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Applications</h2>
            <p className="text-xs text-slate-500">Track and manage mock applications submitted to local database.</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {applications.length} submitted
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse space-y-3">
                <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map(app => (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold text-base text-slate-900">{app.jobTitle}</h3>
                    {getStatusBadge(app.status)}
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {app.company} · {app.jobLocation}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-mono">
                    <span>Reference ID: <b className="text-indigo-600">{app.referenceId}</b></span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-sans">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Submitted: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    {app.resumeFileName && (
                      <>
                        <span>·</span>
                        <span className="font-sans text-slate-600">Resume: {app.resumeFileName}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="btn btn-outline text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    View Job Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No applications yet</h3>
            <p className="text-xs text-slate-500 mb-5">
              Explore available opportunities and submit your mock applications to start tracking.
            </p>
            <Link to="/jobs" className="btn btn-primary text-xs py-2 px-5">
              Explore Jobs
            </Link>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-backdrop">
          <div className="modal max-w-md" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setIsEditing(false)}>×</button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Edit Candidate Profile</h3>
            <p className="text-xs text-slate-500 mb-4">Update your profile summary displayed on applications.</p>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (10 digits)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Software Test Engineer / Playwright Specialist"
                  value={editForm.headline}
                  onChange={(e) => setEditForm(prev => ({ ...prev, headline: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
              </div>

              {saveStatus && (
                <p className="text-xs font-medium text-indigo-600">{saveStatus}</p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
