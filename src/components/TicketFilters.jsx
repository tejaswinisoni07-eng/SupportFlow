import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function TicketFilters({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  category,
  setCategory,
  sortBy,
  setSortBy,
  totalResults,
  onResetFilters,
}) {
  const hasActiveFilters =
    search.trim() !== '' ||
    status !== 'All' ||
    priority !== 'All' ||
    category !== 'All' ||
    sortBy !== 'createdAt';

  const statusOptions = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
  const priorityOptions = ['All', 'Urgent', 'High', 'Medium', 'Low'];
  const categoryOptions = [
    'All',
    'Billing',
    'Technical',
    'Account Access',
    'Feature Request',
    'General Inquiry',
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 space-y-3">
      {/* Top row: Search input + Sort By */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by ID, customer name, email, subject, or description..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="relative min-w-[170px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="createdAt">Newest First</option>
              <option value="priority">Priority (High to Low)</option>
              <option value="updatedAt">Recently Updated</option>
              <option value="subject">Subject (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Row: Status pills, Priority & Category Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-slate-400" /> Status:
          </span>
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatus(opt)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                status === opt
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Select */}
          <div className="flex items-center space-x-1">
            <label className="text-xs font-medium text-slate-500">Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="py-1 px-2.5 bg-slate-100 border-none rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {priorityOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Priorities' : opt}
                </option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div className="flex items-center space-x-1">
            <label className="text-xs font-medium text-slate-500">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="py-1 px-2.5 bg-slate-100 border-none rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Categories' : opt}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count bar */}
      <div className="text-xs text-slate-500 pt-1 flex items-center justify-between">
        <span>
          Showing <span className="font-semibold text-slate-800">{totalResults}</span> {totalResults === 1 ? 'ticket' : 'tickets'} matching criteria
        </span>
        {hasActiveFilters && (
          <span className="text-amber-600 font-medium">Filtered View Active</span>
        )}
      </div>
    </div>
  );
}
