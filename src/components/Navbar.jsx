import React from 'react';
import { 
  Headphones, 
  Plus, 
  RotateCcw, 
  Info, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

export default function Navbar({ onOpenNewTicket, onResetDemo, onOpenSystemInfo, isResetting }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Support<span className="text-indigo-600">Flow</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Capstone Project
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-500 font-medium">
                Customer Support Ticketing System
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* System Info & Limitations */}
            <button
              onClick={onOpenSystemInfo}
              className="inline-flex items-center px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
              title="View Architecture, Storage Limits & Notes"
            >
              <Info className="w-4 h-4 sm:mr-1.5 text-slate-500" />
              <span className="hidden sm:inline">System & Limitations</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetDemo}
              disabled={isResetting}
              className="inline-flex items-center px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 transition-colors disabled:opacity-50 shadow-2xs"
              title="Reset sample tickets to default capstone state"
            >
              <RotateCcw className={`w-4 h-4 sm:mr-1.5 text-slate-500 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Create New Ticket */}
            <button
              onClick={onOpenNewTicket}
              className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm shadow-indigo-200"
            >
              <Plus className="w-4 h-4 sm:mr-1.5" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
