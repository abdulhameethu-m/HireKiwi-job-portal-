import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsApi } from '../services/api';
import { AlertCircle, Upload, Check, Loader2 } from 'lucide-react';

export const ApplicationModal = ({ job, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    experience: '',
    resume: '',
    coverLetter: '',
    terms: true
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    const nameTrimmed = (formData.fullName || '').trim();
    if (!nameTrimmed) {
      errs.fullName = 'Full name is required.';
    } else if (nameTrimmed.length < 2) {
      errs.fullName = 'Enter at least 2 characters.';
    } else if (nameTrimmed.length > 80) {
      errs.fullName = 'Name must be 80 characters or fewer.';
    }

    const emailTrimmed = (formData.email || '').trim();
    if (!emailTrimmed) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = 'Enter a valid email address.';
    }

    const phoneTrimmed = (formData.phone || '').trim();
    if (!phoneTrimmed) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phoneTrimmed)) {
      errs.phone = 'Enter exactly 10 digits.';
    }

    if (!formData.experience) {
      errs.experience = 'Select your experience.';
    }

    if (selectedFile) {
      const allowedExts = ['.pdf', '.doc', '.docx', '.txt'];
      const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(fileExt)) {
        errs.resume = 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are accepted.';
      } else if (selectedFile.size > 5 * 1024 * 1024) {
        errs.resume = 'Resume file size cannot exceed 5MB.';
      }
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, resume: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setServerError('Please correct the highlighted fields and try again.');
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append('jobId', job.id);
        payload.append('fullName', formData.fullName.trim());
        payload.append('email', formData.email.trim());
        payload.append('phone', formData.phone.trim());
        payload.append('experience', formData.experience);
        payload.append('coverLetter', formData.coverLetter.trim());
        payload.append('resume', selectedFile);
      } else {
        payload = {
          jobId: job.id,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          experience: formData.experience,
          coverLetter: formData.coverLetter.trim(),
          resumeFileName: formData.resume.trim() || undefined
        };
      }

      const res = await applicationsApi.submitApplication(payload);
      onSuccess({
        fullName: formData.fullName.trim(),
        jobTitle: job.title,
        referenceId: res.data.referenceId || `CN-${Date.now().toString().slice(-7)}`
      });
    } catch (err) {
      const msg = err.details
        ? Object.values(err.details)[0]
        : (err.message || 'Failed to submit application. Please try again.');
      setServerError(msg);
      if (err.details) {
        setErrors(err.details);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      id="modalBackdrop"
      onClick={(e) => {
        if (e.target.id === 'modalBackdrop') onClose();
      }}
    >
      <section
        className="modal application-modal max-w-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="applicationTitle"
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
          TAKE THE NEXT STEP
        </p>
        <h2 id="applicationTitle" className="text-xl font-bold text-slate-900 leading-tight">
          Apply for {job.title}
        </h2>
        <p className="muted text-xs text-slate-500 mt-1 mb-5">
          All fields marked * are required. This is a simulated application for testing.
        </p>

        <form id="applicationForm" onSubmit={handleSubmit} noValidate data-job-id={job.id}>
          <div className="form-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="form-field flex flex-col">
              <label htmlFor="fullName" className="text-xs font-semibold text-slate-700 mb-1">
                Full name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                maxLength={80}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
              <small className="field-error" data-error="fullName">
                {errors.fullName}
              </small>
            </div>

            {/* Email */}
            <div className="form-field flex flex-col">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700 mb-1">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={120}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
              <small className="field-error" data-error="email">
                {errors.email}
              </small>
            </div>

            {/* Phone */}
            <div className="form-field flex flex-col">
              <label htmlFor="phone" className="text-xs font-semibold text-slate-700 mb-1">
                Phone number *
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                inputMode="numeric"
                required
                maxLength={10}
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
              <small className="field-error" data-error="phone">
                {errors.phone}
              </small>
            </div>

            {/* Experience */}
            <div className="form-field flex flex-col">
              <label htmlFor="experience" className="text-xs font-semibold text-slate-700 mb-1">
                Experience *
              </label>
              <select
                id="experience"
                name="experience"
                required
                value={formData.experience}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 bg-white"
              >
                <option value="">Select experience</option>
                <option value="Fresher">Fresher</option>
                <option value="0–1 years">0–1 years</option>
                <option value="1–2 years">1–2 years</option>
                <option value="2+ years">2+ years</option>
              </select>
              <small className="field-error" data-error="experience">
                {errors.experience}
              </small>
            </div>

            {/* Resume Upload / Filename */}
            <div className="form-field sm:col-span-2 flex flex-col">
              <label htmlFor="resume" className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Resume file name (optional)</span>
                <span className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 5MB</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="resume"
                  name="resume"
                  type="text"
                  placeholder="e.g. resume.pdf"
                  value={formData.resume}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
                <label className="btn btn-outline text-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Choose</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <small className="hint text-[11px] text-slate-400 mt-1">
                Demo upload; file is validated safely on the server.
              </small>
              {errors.resume && (
                <small className="field-error" data-error="resume">
                  {errors.resume}
                </small>
              )}
            </div>

            {/* Cover letter with character counter */}
            <div className="form-field sm:col-span-2 flex flex-col">
              <label htmlFor="coverLetter" className="text-xs font-semibold text-slate-700 mb-1">
                Why are you a good fit? (optional)
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={3}
                maxLength={500}
                placeholder="Briefly describe your skills"
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
              <small className="hint text-[11px] text-slate-400 flex justify-end mt-1">
                <span id="charCount">{formData.coverLetter.length}</span>/500 characters
              </small>
            </div>
          </div>

          {/* Alert banner */}
          {serverError && (
            <div
              className="form-alert bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg text-xs mt-4 flex items-center gap-2"
              id="formAlert"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="modal-actions flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              className="btn btn-outline text-xs py-2 px-4"
              id="cancelApplication"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 shadow-sm"
              id="submitApplication"
              disabled={submitting}
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Submitting...' : 'Submit application'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
