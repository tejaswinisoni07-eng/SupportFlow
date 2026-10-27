import React, { useState } from 'react';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';

export default function NewTicketModal({ onClose, onCreateTicket, showToast }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    category: 'Technical',
    priority: 'Medium',
    subject: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Customer name is required';
    if (!formData.customerEmail.trim()) {
      errs.customerEmail = 'Customer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errs.customerEmail = 'Please provide a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onCreateTicket(formData);
      showToast('Support ticket created successfully!', 'success');
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to create ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create New Support Ticket</h2>
            <p className="text-xs text-slate-500">Record a customer issue or service request</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Jordan Hayes"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                  errors.customerName ? 'border-rose-300 ring-rose-200' : 'border-slate-300'
                }`}
              />
              {errors.customerName && (
                <p className="text-xs text-rose-500 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {errors.customerName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="jordan@company.com"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                  errors.customerEmail ? 'border-rose-300 ring-rose-200' : 'border-slate-300'
                }`}
              />
              {errors.customerEmail && (
                <p className="text-xs text-rose-500 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {errors.customerEmail}
                </p>
              )}
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Technical">Technical</option>
                <option value="Billing">Billing</option>
                <option value="Account Access">Account Access</option>
                <option value="Feature Request">Feature Request</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Low">⚪ Low</option>
                <option value="Medium">🔷 Medium</option>
                <option value="High">⚠️ High</option>
                <option value="Urgent">🔥 Urgent</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief summary of the inquiry or problem"
              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                errors.subject ? 'border-rose-300 ring-rose-200' : 'border-slate-300'
              }`}
            />
            {errors.subject && (
              <p className="text-xs text-rose-500 mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> {errors.subject}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide exact error messages, steps to reproduce, or requested outcome..."
              className={`w-full p-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? 'border-rose-300 ring-rose-200' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> {errors.description}
              </p>
            )}
          </div>

          <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Once created, you can open this ticket to generate AI response suggestions and update status/priority.
            </span>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-indigo-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
