import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-5">
        <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-red-600">403 FORBIDDEN</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Access Denied</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          You do not have administrative privileges to view this section. Please sign in with an authorized administrator account.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/" className="btn btn-outline text-xs py-2 px-4 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> Return Home
          </Link>
          <Link to="/login" className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
};
