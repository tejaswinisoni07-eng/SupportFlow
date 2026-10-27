import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Clock, 
  User, 
  Mail, 
  Calendar, 
  Tag, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Trash2,
  Bot,
  Info
} from 'lucide-react';
import { getPriorityBadge, getStatusBadge, getCategoryBadge } from './TicketCard';
import { fetchAiSuggestions } from '../services/api';

export default function TicketDetailModal({ 
  ticket, 
  onClose, 
  onUpdateTicket, 
  onAddReply, 
  onDeleteTicket,
  showToast 
}) {
  const [replyMessage, setReplyMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isAiAssistedReply, setIsAiAssistedReply] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [resolveOnReply, setResolveOnReply] = useState(false);

  if (!ticket) return null;

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    try {
      await onUpdateTicket(ticket.id, { status: newStatus });
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  // Handle priority update
  const handlePriorityChange = async (newPriority) => {
    try {
      await onUpdateTicket(ticket.id, { priority: newPriority });
      showToast(`Priority updated to ${newPriority}`, 'success');
    } catch {
      showToast('Failed to update priority', 'error');
    }
  };

  // Trigger AI Suggestion
  const handleGenerateAiSuggestions = async () => {
    setIsAiLoading(true);
    setAiResult(null);
    try {
      const data = await fetchAiSuggestions({
        ticketId: ticket.id,
        customerName: ticket.customerName,
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
      });
      setAiResult(data);
      showToast('AI response suggestions generated!', 'success');
    } catch {
      showToast('Could not generate AI suggestions', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Use AI draft in reply textarea
  const handleUseDraft = (draftText) => {
    setReplyMessage(draftText);
    setIsAiAssistedReply(true);
    showToast('AI draft applied to reply box', 'info');
  };

  // Send reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmittingReply(true);
    try {
      await onAddReply(ticket.id, {
        message: replyMessage,
        sender: 'agent',
        authorName: 'Support Agent',
        isAiAssisted: isAiAssistedReply,
      });

      if (resolveOnReply && ticket.status !== 'Resolved') {
        await onUpdateTicket(ticket.id, { status: 'Resolved' });
      }

      setReplyMessage('');
      setIsAiAssistedReply(false);
      setResolveOnReply(false);
      showToast('Response successfully added to ticket history', 'success');
    } catch {
      showToast('Failed to send reply', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              {ticket.id}
            </span>
            {getCategoryBadge(ticket.category)}
            {ticket.isSample && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                Sample Demonstration Ticket
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Controls: Status & Priority Switchers */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Status Selector */}
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Ticket Status
                </label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="Open">🔵 Open</option>
                  <option value="In Progress">🟡 In Progress</option>
                  <option value="Resolved">🟢 Resolved</option>
                  <option value="Closed">⚪ Closed</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Priority Level
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="Urgent">🔥 Urgent</option>
                  <option value="High">⚠️ High</option>
                  <option value="Medium">🔷 Medium</option>
                  <option value="Low">⚪ Low</option>
                </select>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Assigned Agent
                </label>
                <span className="text-xs sm:text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 inline-block shadow-2xs">
                  {ticket.assignedTo || 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Created Timestamp */}
            <div className="text-right text-xs text-slate-500">
              <div>Created: <span className="font-medium text-slate-700">{formatDate(ticket.createdAt)}</span></div>
              {ticket.updatedAt && (
                <div>Updated: <span className="font-medium text-slate-700">{formatDate(ticket.updatedAt)}</span></div>
              )}
            </div>
          </div>

          {/* Ticket Title & Customer Info */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
              {ticket.subject}
            </h2>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base">
                  {ticket.customerName ? ticket.customerName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{ticket.customerName}</h4>
                  <p className="text-xs text-slate-500 flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {ticket.customerEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getPriorityBadge(ticket.priority)}
                {getStatusBadge(ticket.status)}
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Original Issue Description
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {ticket.description}
            </p>
          </div>

          {/* AI-ASSISTED RESPONSE SUGGESTION PANEL */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 rounded-2xl border border-indigo-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span>AI-Assisted Response Generator</span>
                    <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                      Smart Assistant
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    Generates tailored draft replies based on ticket category, severity, and customer context.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateAiSuggestions}
                disabled={isAiLoading}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                <span>{isAiLoading ? 'Analyzing Context...' : 'Generate AI Suggestions'}</span>
              </button>
            </div>

            {/* AI Transparency Disclaimer Banner */}
            <div className="bg-white/80 p-3 rounded-xl border border-indigo-100 text-xs text-slate-600 flex items-start space-x-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-indigo-900">Transparent AI Status: </span>
                {aiResult ? (
                  <span>
                    <strong>Mode:</strong> {aiResult.mode}. {aiResult.disclaimer}
                  </span>
                ) : (
                  <span>
                    Simulated Demo Engine active (heuristic contextual reasoning). If a <code>GEMINI_API_KEY</code> is provided in <code>.env</code>, live generative AI will be used.
                  </span>
                )}
              </div>
            </div>

            {/* Render AI Suggestions */}
            {aiResult && aiResult.suggestions && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select a suggested draft to apply:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiResult.suggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-900">{sug.title}</span>
                          <span className="text-3xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {sug.tone}
                          </span>
                        </div>
                        <p className="text-2xs text-slate-500 mb-2">{sug.description}</p>
                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg whitespace-pre-line line-clamp-5 border border-slate-100 leading-relaxed font-mono">
                          {sug.text}
                        </p>
                      </div>

                      <button
                        onClick={() => handleUseDraft(sug.text)}
                        className="mt-3 w-full py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        <span>Insert Draft into Reply</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conversation & History Timeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Conversation & Audit Timeline</span>
              <span className="text-xs font-normal text-slate-500">
                ({ticket.replies?.length || 0} entries)
              </span>
            </h3>

            <div className="space-y-3">
              {ticket.replies && ticket.replies.map((rep, idx) => {
                const isAgent = rep.sender === 'agent';
                const isSystem = rep.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={rep.id || idx} className="flex items-center justify-center my-2">
                      <span className="text-2xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 flex items-center space-x-1">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        <span>System Audit: {rep.message}</span>
                        <span className="text-slate-400">· {formatDate(rep.createdAt)}</span>
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={rep.id || idx}
                    className={`p-4 rounded-2xl border ${
                      isAgent
                        ? 'bg-indigo-50/50 border-indigo-200 ml-4 sm:ml-8'
                        : 'bg-white border-slate-200 mr-4 sm:mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">
                          {rep.authorName || (isAgent ? 'Support Agent' : ticket.customerName)}
                        </span>
                        <span
                          className={`text-3xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                            isAgent
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isAgent ? 'Support Agent' : 'Customer'}
                        </span>
                        {rep.isAiAssisted && (
                          <span className="inline-flex items-center text-3xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                            <Sparkles className="w-2.5 h-2.5 mr-1" />
                            AI Assisted
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{formatDate(rep.createdAt)}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                      {rep.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Post Agent Reply to Customer
              </label>
              {isAiAssistedReply && (
                <span className="text-2xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Contains AI Draft Content
                </span>
              )}
            </div>

            <textarea
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your response to the customer here, or select an AI suggestion above..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="inline-flex items-center text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resolveOnReply}
                  onChange={(e) => setResolveOnReply(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                />
                <span>Automatically mark ticket as <strong>Resolved</strong> upon reply</span>
              </label>

              <button
                type="button"
                onClick={handleSendReply}
                disabled={isSubmittingReply || !replyMessage.trim()}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>{isSubmittingReply ? 'Posting...' : 'Send Response'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ticket ${ticket.id}?`)) {
                onDeleteTicket(ticket.id);
                onClose();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete Ticket
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
