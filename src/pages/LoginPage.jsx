import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState(null);

  const validate = () => {
    const errs = {};
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setServerError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const user = await login(formData.email.trim(), formData.password);
      if (user.role === 'admin' && redirectPath === '/dashboard') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setServerError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await authApi.forgotPassword({ email: forgotEmail });
      setForgotStatus('A simulated password reset link has been dispatched to your email.');
    } catch (err) {
      setForgotStatus('Unable to process password reset.');
    }
  };

  const fillQuickDemo = (type) => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@careernest.test',
        password: 'AdminPass123!',
        rememberMe: true
      });
    } else {
      setFormData({
        email: 'candidate@example.com',
        password: 'CandidatePass123!',
        rememberMe: true
      });
    }
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-extrabold text-2xl mx-auto mb-3">
            C
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your applied jobs, profile, or admin controls.
          </p>
        </div>

        {/* Quick Demo Fill helper for QA testers */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-5 text-xs text-slate-600">
          <p className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
            Quick Test Accounts:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('candidate')}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-400 rounded-md text-[11px] font-medium text-slate-700 transition-colors"
            >
              Applicant: candidate@example.com
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 hover:border-indigo-400 rounded-md text-[11px] font-medium text-indigo-700 transition-colors"
            >
              Admin: admin@careernest.test
            </button>
          </div>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs mb-5 flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="loginEmail" className="block text-xs font-semibold text-slate-700 mb-1">
              Email address
            </label>
            <input
              id="loginEmail"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
            />
            {errors.email && (
              <small className="field-error" data-error="email">{errors.email}</small>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="loginPassword" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-indigo-600 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="loginPassword"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && (
              <small className="field-error" data-error="password">{errors.password}</small>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                id="loginRemember"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="text-xs text-slate-600">Remember this device</span>
            </label>
          </div>

          <button
            id="loginSubmitBtn"
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full text-xs py-2.5 shadow-sm mt-2 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      </div>

      {/* Mock Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop">
          <div className="modal max-w-sm" role="dialog" aria-modal="true">
            <button
              className="modal-close"
              onClick={() => {
                setShowForgotModal(false);
                setForgotStatus(null);
              }}
            >
              ×
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-2">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your email to receive simulated password recovery instructions.
            </p>
            {forgotStatus ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-xs mb-4">
                {forgotStatus}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
                <button type="submit" className="btn btn-primary w-full text-xs py-2">
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
