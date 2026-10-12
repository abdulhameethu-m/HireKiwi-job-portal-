import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const errs = {};
    const nameTrimmed = formData.fullName.trim();
    if (!nameTrimmed) {
      errs.fullName = 'Full name is required.';
    } else if (nameTrimmed.length < 2) {
      errs.fullName = 'Enter at least 2 characters.';
    } else if (nameTrimmed.length > 80) {
      errs.fullName = 'Name must be 80 characters or fewer.';
    }

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = 'Enter a valid email address.';
    }

    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phoneTrimmed)) {
      errs.phone = 'Enter exactly 10 digits.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      errs.password = 'Password must contain at least one letter and one number.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.terms) {
      errs.terms = 'You must accept the terms and conditions.';
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
      setServerError('Please correct the highlighted fields.');
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        terms: formData.terms
      });

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      if (err.details) {
        setErrors(err.details);
        setServerError(Object.values(err.details)[0]);
      } else {
        setServerError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-extrabold text-2xl mx-auto mb-3">
            C
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
          <p className="text-xs text-slate-500 mt-1">
            Join CareerNest to track applications and explore verified job opportunities.
          </p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs mb-5 flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-xs mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="regFullName" className="block text-xs font-semibold text-slate-700 mb-1">
              Full name *
            </label>
            <div className="relative">
              <input
                id="regFullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                placeholder="e.g. Aditi Sharma"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
            </div>
            {errors.fullName && (
              <small className="field-error" data-error="fullName">{errors.fullName}</small>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="regEmail" className="block text-xs font-semibold text-slate-700 mb-1">
              Email address *
            </label>
            <div className="relative">
              <input
                id="regEmail"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="aditi@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
            </div>
            {errors.email && (
              <small className="field-error" data-error="email">{errors.email}</small>
            )}
          </div>

          {/* Mobile phone */}
          <div>
            <label htmlFor="regPhone" className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile number *
            </label>
            <div className="relative">
              <input
                id="regPhone"
                name="phone"
                type="text"
                inputMode="numeric"
                maxLength={10}
                required
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
            </div>
            {errors.phone && (
              <small className="field-error" data-error="phone">{errors.phone}</small>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="regPassword" className="block text-xs font-semibold text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                id="regPassword"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 8 chars with letters & numbers"
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="regConfirmPassword" className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm password *
            </label>
            <div className="relative">
              <input
                id="regConfirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <small className="field-error" data-error="confirmPassword">{errors.confirmPassword}</small>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                id="regTerms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="text-xs text-slate-600">
                I agree to the <span className="text-indigo-600 underline">Terms and Conditions</span> and understand this is an assessment mock application.
              </span>
            </label>
            {errors.terms && (
              <small className="field-error" data-error="terms">{errors.terms}</small>
            )}
          </div>

          <button
            id="registerSubmitBtn"
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full text-xs py-2.5 shadow-sm mt-2 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
