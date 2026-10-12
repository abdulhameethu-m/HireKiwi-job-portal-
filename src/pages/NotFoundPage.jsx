import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-5">
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">404 ERROR</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested URL does not exist or has been moved. You can return to our homepage or explore current job listings.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/" className="btn btn-outline text-xs py-2 px-4 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> Return Home
          </Link>
          <Link to="/jobs" className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" /> Explore Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};
