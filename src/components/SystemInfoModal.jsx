import React from 'react';
import { X, Server, Database, Sparkles, Shield, Cpu, ExternalLink, CheckCircle } from 'lucide-react';

export default function SystemInfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">System Architecture & Project Scope</h2>
              <p className="text-xs text-slate-500">Capstone Technical Reference & Transparent Limitations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Section 1: Storage Architecture & Limitations */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Storage Architecture & Demo Limitations</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Persistence Implementation:</strong> SupportFlow utilizes a file-based JSON storage engine located at <code>server/data/tickets.json</code>. Ticket creations, status updates, priority adjustments, and audit trails are persisted directly to disk using atomic temporary-file swapping.
            </p>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p className="font-semibold text-slate-800">Demo Limitations Explained:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li><strong>Concurrency:</strong> Optimized for single-server demonstration and testing. Does not support multi-instance distributed file locking.</li>
                <li><strong>Scalability:</strong> Best suited for datasets under 10,000 records. Enterprise deployments would substitute this with PostgreSQL, MySQL, or MongoDB.</li>
                <li><strong>Backup:</strong> Includes a 1-click &ldquo;Reset Demo Data&rdquo; button to instantly restore pristine sample data during evaluations.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: AI Assistance Transparency */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI Response Suggestion Architecture</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Transparent Demo Mode:</strong> The default installation operates completely offline without external API dependencies. It utilizes an intelligent heuristic contextual engine that inspects ticket category, priority, customer name, and problem keywords to generate three tailored support draft responses.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Live Gemini Option:</strong> If a valid <code>GEMINI_API_KEY</code> is placed in the server environment, the backend automatically connects to Google&apos;s Gemini 1.5 Flash API. No mock claim is made if an API key is absent.
            </p>
          </div>

          {/* Section 3: Notice regarding Salesforce Work */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2 text-amber-900">
            <h3 className="text-sm font-bold flex items-center space-x-2 text-amber-900">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Notice Regarding Separate Salesforce Work</span>
            </h3>
            <p className="text-xs leading-relaxed text-amber-800">
              <strong>Independent Project Scope:</strong> This web application is a standalone full-stack customer support portal developed independently.
            </p>
            <p className="text-xs leading-relaxed text-amber-800">
              The student&apos;s coursework in Salesforce (including custom Case fields, activated priority-assignment Flow, Case reports, and Service Cloud dashboards) represents a distinct CRM configuration. This web portal is <strong>not connected to Salesforce</strong> and operates with its own independent REST API and data store.
            </p>
          </div>

          {/* Section 4: Technology Stack Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 block mb-1">Frontend Stack</span>
              <p className="text-slate-600">React 18 · Vite · Tailwind CSS · Lucide Icons</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 block mb-1">Backend Stack</span>
              <p className="text-slate-600">Node.js · Express.js · RESTful API · JSON Store</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
