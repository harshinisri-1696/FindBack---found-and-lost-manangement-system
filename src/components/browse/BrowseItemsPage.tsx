import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_LOCATIONS } from '../../data/sampleData';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  Eye, 
  ShieldCheck, 
  ArrowUpDown, 
  SlidersHorizontal,
  FileQuestion,
  Sparkles
} from 'lucide-react';
import { Item } from '../../types';

export const BrowseItemsPage: React.FC = () => {
  const { 
    items, 
    categories, 
    setSelectedItemId, 
    setSelectedItemForRecovery,
    searchQuery, 
    setSearchQuery,
    selectedCategory, 
    setSelectedCategory,
    selectedReportType, 
    setSelectedReportType,
    selectedLocation, 
    setSelectedLocation,
    selectedStatus, 
    setSelectedStatus,
    sortBy, 
    setSortBy,
    clearFilters,
    setCurrentView
  } = useApp();

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Search query (name, description, brand, color, report code)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.item_name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesBrand = (item.brand || '').toLowerCase().includes(query);
        const matchesColor = (item.color || '').toLowerCase().includes(query);
        const matchesCode = item.report_code.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesColor && !matchesCode && !matchesLoc) {
          return false;
        }
      }

      // 2. Report Type (Lost / Found)
      if (selectedReportType !== 'all' && item.report_type !== selectedReportType) {
        return false;
      }

      // 3. Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // 4. Location
      if (selectedLocation !== 'All' && item.location !== selectedLocation) {
        return false;
      }

      // 5. Status
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.report_date).getTime() - new Date(a.report_date).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.report_date).getTime() - new Date(b.report_date).getTime();
      } else {
        return a.item_name.localeCompare(b.item_name);
      }
    });
  }, [items, searchQuery, selectedReportType, selectedCategory, selectedLocation, selectedStatus, sortBy]);

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedReportType !== 'all' || selectedLocation !== 'All' || selectedStatus !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Browse Campus Lost &amp; Found Registry
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Search live verified lost belongings and found articles across all college premises.
        </p>
      </div>

      {/* Search & Filter Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search item name, brand, color, location or description..."
            className="w-full text-xs pl-12 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Type Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1">
          {/* Lost / Found toggle */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Report Type</label>
            <div className="grid grid-cols-3 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSelectedReportType('all')}
                className={`py-1.5 rounded-lg transition ${selectedReportType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedReportType('lost')}
                className={`py-1.5 rounded-lg transition ${selectedReportType === 'lost' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Lost
              </button>
              <button
                onClick={() => setSelectedReportType('found')}
                className={`py-1.5 rounded-lg transition ${selectedReportType === 'found' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Found
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_name}>{c.category_name}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Campus Location</label>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
            >
              <option value="All">All Campus Locations</option>
              {CAMPUS_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Possible Match">Possible Match</option>
              <option value="Recovery Requested">Recovery Requested</option>
              <option value="Recovered">Recovered</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
            >
              <option value="newest">Newest Date First</option>
              <option value="oldest">Oldest Date First</option>
              <option value="name">Item Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter bar actions / counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="font-semibold text-slate-700">
            Showing <span className="font-bold text-[#4169E1]">{filteredItems.length}</span> results found
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Item Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching items found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing filters to view other campus reports.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-xs font-semibold bg-[#4169E1] text-white rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.item_id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-150 flex flex-col overflow-hidden group"
            >
              {/* Image & Type Badge */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.item_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Lost / Found badge */}
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide shadow-xs ${
                  item.report_type === 'lost'
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {item.report_type === 'lost' ? 'Lost' : 'Found'}
                </span>

                {/* Category tag */}
                <span className="absolute bottom-2.5 left-3 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  {item.category}
                </span>

                {/* Status badge */}
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs border border-slate-200">
                  {item.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{item.report_code}</span>
                    <span>{item.report_date}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-[#4169E1] transition">
                    {item.item_name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-[#4169E1] shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedItemId(item.item_id)}
                      className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 hover:text-[#4169E1] bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    {item.report_type === 'found' && item.status !== 'Recovered' && (
                      <button
                        onClick={() => setSelectedItemForRecovery(item)}
                        className="py-2 px-3 text-center text-xs font-semibold text-white bg-[#4169E1] hover:bg-[#1E3A8A] rounded-xl shadow-xs transition"
                        title="Submit Claim / Recovery Request"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
