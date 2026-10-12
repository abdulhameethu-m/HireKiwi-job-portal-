import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Code, BookOpen } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" data-home>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
              <span className="font-bold text-white text-lg tracking-tight">CareerNest</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              CareerNest QA Lab is an assessment mock recruitment web application and automated testing benchmark.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Job Seekers</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Explore Jobs</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Candidate Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">QA & Testing</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-indigo-400 font-mono">Playwright E2E Suite</span></li>
              <li><span className="text-indigo-400 font-mono">Supertest API Tests</span></li>
              <li><span className="text-indigo-400 font-mono">Vitest Unit Validation</span></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Governance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Disclaimer & Safety</h4>
            <div className="bg-slate-800/60 rounded-lg p-3 text-xs text-slate-400 border border-slate-700/60">
              <p className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
                <ShieldCheck className="w-4 h-4" /> Mock Portal Notice
              </p>
              <span>No applications are sent to real employers. All interactions run on an isolated mock test database.</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CareerNest QA Lab · Designed for QA Engineer Assessment</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Deterministic Seed Ready</span>
            <span>·</span>
            <span className="text-slate-400">Playwright 1.64</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
