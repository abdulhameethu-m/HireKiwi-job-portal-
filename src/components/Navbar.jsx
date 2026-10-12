import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, Shield, Menu, X, PlusCircle, CheckSquare } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group" data-home>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                C
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">CareerNest</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-600">QA Lab</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/jobs" className="hover:text-indigo-600 transition-colors" data-jobs-link>
                Find jobs
              </Link>
              <a href="#about" className="hover:text-indigo-600 transition-colors">
                Career advice
              </a>
              {user && (
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                  My Applications
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Admin Portal
                </Link>
              )}
            </nav>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>{user.fullName}</span>
                  {isAdmin && (
                    <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                      Admin
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-slate-600 hover:text-red-600 hover:border-red-200 flex items-center gap-1.5 text-xs py-1.5"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  id="profileBtn"
                  onClick={() => navigate('/login')}
                  className="btn btn-outline text-sm"
                >
                  Sign in
                </button>
                <Link to="/register" className="btn btn-primary text-sm shadow-sm">
                  Create account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Find jobs
          </Link>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Career advice
          </a>
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                My Applications ({user.fullName})
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-semibold text-indigo-600 bg-indigo-50"
                >
                  Admin Portal
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline text-center w-full"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary text-center w-full"
              >
                Create account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
