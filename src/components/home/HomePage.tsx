import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Package, 
  CheckCircle2, 
  ArrowRight, 
  Tag, 
  Building2, 
  FileCheck, 
  Clock, 
  HelpCircle,
  Eye,
  SlidersHorizontal,
  Lock,
  Compass
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    items, 
    stats, 
    setCurrentView, 
    setSelectedItemId, 
    setSelectedItemForRecovery,
    setSearchQuery, 
    setSelectedReportType 
  } = useApp();

  const [heroSearchInput, setHeroSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchInput.trim()) {
      setSearchQuery(heroSearchInput.trim());
      setCurrentView('browse');
    }
  };

  // Recent 4 items
  const recentItems = items.slice(0, 4);

  return (
    <div className="space-y-16 py-6 animate-in fade-in duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-white border border-blue-100/80 p-8 sm:p-12 lg:p-16 text-center space-y-8 shadow-xs overflow-hidden">
          {/* Subtle decorative background ring */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Campus badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-[#1E3A8A] text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#4169E1] animate-pulse"></span>
            <span>Campus Lost &amp; Found</span>
          </div>

          {/* Headline */}
          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172033] tracking-tight leading-tight">
              Lost Something on Campus? <br className="hidden sm:inline" />
              <span className="text-[#4169E1]">We'll Help You Find It Back.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A centralized smart platform for students, faculty, and staff to report, cross-match, and safely recover misplaced belongings across college grounds.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('report_lost')}
              className="px-6 py-3 rounded-xl bg-[#4169E1] hover:bg-[#1E3A8A] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition flex items-center gap-2"
            >
              <span>Report Lost Item</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('report_found')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs hover:border-emerald-400 transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Report Found Item</span>
            </button>

            <button
              onClick={() => {
                setSelectedReportType('all');
                setCurrentView('browse');
              }}
              className="px-6 py-3 rounded-xl bg-[#E8F0FF] hover:bg-blue-100 text-[#1E3A8A] border border-blue-200 text-xs sm:text-sm font-bold transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#4169E1]" />
              <span>Browse Items</span>
            </button>
          </div>

          {/* Large Floating Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <form onSubmit={handleSearchSubmit} className="relative shadow-lg rounded-2xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={heroSearchInput}
                onChange={e => setHeroSearchInput(e.target.value)}
                placeholder="Search for lost keys, student ID card, backpack, water bottle, earbuds..."
                className="w-full text-xs sm:text-sm pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4169E1] focus:border-transparent text-slate-800"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#4169E1] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-xl transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. CAMPUS STATISTICS CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4169E1] flex items-center justify-center mb-3">
              <Package className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalReports}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Total Reported Items
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Across all college departments</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
              {stats.activeLost}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Active Lost Items
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting candidate match</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              {stats.activeFound}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Active Found Items
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Safely in campus security custody</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#4169E1] tracking-tight">
              {stats.recovered}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Successfully Recovered
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {stats.recoveryRate}% Resolution Rate
            </p>
          </div>
        </div>
      </section>

      {/* 3. RECENT LOST & FOUND REPORTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recent Campus Reports
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live submissions from students and faculty across lecture halls, library, and canteen.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedReportType('all');
              setCurrentView('browse');
            }}
            className="self-start sm:self-auto text-xs font-semibold text-[#4169E1] hover:text-[#1E3A8A] flex items-center gap-1 transition"
          >
            <span>View All Registry Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentItems.map(item => (
            <div
              key={item.item_id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-150 flex flex-col overflow-hidden group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.item_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide shadow-xs ${
                  item.report_type === 'lost' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {item.report_type}
                </span>

                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs border border-slate-200">
                  {item.status}
                </span>

                <span className="absolute bottom-2.5 left-3 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-400">
                    {item.report_code}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-[#4169E1] transition">
                    {item.item_name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 truncate pr-1">
                      <MapPin className="w-3.5 h-3.5 text-[#4169E1] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="text-[11px] shrink-0">{item.report_date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedItemId(item.item_id)}
                      className="w-full py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#4169E1] border border-slate-200 transition flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                    {item.report_type === 'found' && (
                      <button
                        onClick={() => setSelectedItemForRecovery(item)}
                        className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-[#4169E1] hover:bg-[#1E3A8A] text-white transition shadow-2xs"
                        title="Submit Claim"
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
      </section>

      {/* 4. HOW FINDBACK WORKS (4-Step Workflow - Section 1 requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/90 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#4169E1] uppercase tracking-wider bg-blue-100/60 px-2.5 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How FindBack Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              An organized 4-step framework connecting misplaced belongings with their rightful campus owners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4169E1] font-bold text-base flex items-center justify-center border border-blue-100">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Report Item</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fill in item name, category, campus location, date, color, brand, and upload a reference photo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold text-base flex items-center justify-center border border-amber-100">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Smart Match</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The algorithm calculates similarity weights (40% name, 20% category, 20% location, 10% date, 10% description).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-base flex items-center justify-center border border-emerald-100">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">Verify Ownership</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit a recovery claim detailing private unpublicized identifiers (e.g. serial codes, keychain tags, lock pattern).
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-bold text-base flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900">Recover Item</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Collect physical custody at the designated Security Office, Library Helpdesk, or Department with valid College ID.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY FINDBACK? FEATURE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Why Campus Uses FindBack
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Engineered specifically to solve the chaotic WhatsApp and noticeboard lost item problem in colleges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4169E1] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">College ID Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Restricted to verified students and faculty. Eliminates spam, anonymous claims, and unverified external postings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Smart Item Matching</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated multi-factor similarity scanning alerts you whenever a matching belonging is registered anywhere on campus.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Centralized Custody</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Know exactly where found items are held — Central Security Cabin, Library Desk, or Department Offices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Safe Audit Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete status timeline from submission to proctor verification, handover clearance, and permanent resolution logs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
