import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Eye, 
  ShieldAlert, 
  Activity,
  FileCheck,
  Compass,
  AlertCircle
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { 
    currentUser, 
    items, 
    recoveryRequests, 
    getMatchesForUserItems, 
    setCurrentView, 
    setSelectedItemId,
    setSelectedItemForRecovery
  } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Login Required</h3>
        <p className="text-xs text-slate-500">Please sign in with your college credentials to view your personal dashboard.</p>
        <button
          onClick={() => setCurrentView('login')}
          className="px-4 py-2 bg-[#4169E1] text-white text-xs font-bold rounded-xl"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  // Calculate user specific stats
  const myLostReports = items.filter(i => i.user_id === currentUser.user_id && i.report_type === 'lost');
  const myFoundReports = items.filter(i => i.user_id === currentUser.user_id && i.report_type === 'found');
  const myRecoveredItems = items.filter(i => i.user_id === currentUser.user_id && i.status === 'Recovered');
  const userMatches = getMatchesForUserItems();
  const myClaims = recoveryRequests.filter(r => r.requester_id === currentUser.user_id);

  // Recent activity events
  const activityItems = [
    {
      title: 'Possible match identified for Samsung Earbuds',
      desc: 'Smart match engine found a 92% match with an item in Central Library.',
      time: '15 mins ago',
      type: 'match',
      actionView: 'smart_match'
    },
    {
      title: 'Report FB-2026-00126 Verified',
      desc: 'Your Blue Student ID Card report was validated and published to the public board.',
      time: '2 hours ago',
      type: 'verified',
      actionView: 'my_reports'
    },
    {
      title: 'Recovery Request Under Proctor Review',
      desc: 'Claim submitted for Honda Bike Keys is being inspected by Security Main Gate.',
      time: 'Yesterday',
      type: 'recovery',
      actionView: 'my_reports'
    },
    {
      title: 'Found Report Active in Registry',
      desc: 'Report FB-2026-00127 (Black Leather Wallet) is currently displayed to students.',
      time: '2 days ago',
      type: 'active',
      actionView: 'my_reports'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#4169E1] text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-blue-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Welcome back, {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Lost &amp; Found Portal
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            College ID: <span className="font-mono font-bold text-white">{currentUser.college_id}</span> • Department: <span className="text-white">{currentUser.department || 'Information Technology'}</span>
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setCurrentView('report_lost')}
              className="px-4 py-2 bg-white text-[#1E3A8A] hover:bg-blue-50 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-[#4169E1]" />
              <span>Report Lost Item</span>
            </button>
            <button
              onClick={() => setCurrentView('report_found')}
              className="px-4 py-2 bg-blue-900/50 hover:bg-blue-900/80 text-white text-xs font-bold rounded-xl border border-blue-400/30 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Report Found Item</span>
            </button>
            <button
              onClick={() => setCurrentView('browse')}
              className="px-4 py-2 bg-blue-900/30 hover:bg-blue-900/60 text-white text-xs font-bold rounded-xl border border-blue-400/20 transition flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-blue-200" />
              <span>Browse All Items</span>
            </button>
          </div>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none hidden md:block">
          <Package className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Lost Reports */}
        <div 
          onClick={() => setCurrentView('my_reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-rose-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Lost Reports</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{myLostReports.length}</span>
            <span className="text-xs text-slate-400">active reports</span>
          </div>
          <div className="mt-2 text-[11px] text-[#4169E1] font-semibold flex items-center gap-1">
            <span>Manage lost reports</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 2: Found Reports */}
        <div 
          onClick={() => setCurrentView('my_reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Found Reports</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{myFoundReports.length}</span>
            <span className="text-xs text-slate-400">submitted articles</span>
          </div>
          <div className="mt-2 text-[11px] text-[#16A34A] font-semibold flex items-center gap-1">
            <span>View deposited items</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 3: Possible Matches */}
        <div 
          onClick={() => setCurrentView('smart_match')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Possible Matches</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{userMatches.length}</span>
            <span className="text-xs text-amber-600 font-semibold">potential matches</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <span>Inspect match scores</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 4: Recovered Items */}
        <div 
          onClick={() => setCurrentView('my_reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recovered Items</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#4169E1] flex items-center justify-center group-hover:scale-105 transition">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{myRecoveredItems.length}</span>
            <span className="text-xs text-slate-400">resolved cases</span>
          </div>
          <div className="mt-2 text-[11px] text-[#4169E1] font-semibold flex items-center gap-1">
            <span>View historical records</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Active Reports & Matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Reports List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#4169E1]" />
                <h3 className="text-sm font-bold text-slate-900">
                  My Active Campus Reports
                </h3>
              </div>
              <button
                onClick={() => setCurrentView('my_reports')}
                className="text-xs font-semibold text-[#4169E1] hover:underline"
              >
                View All ({myLostReports.length + myFoundReports.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {myLostReports.concat(myFoundReports).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  You have not submitted any lost or found reports yet.
                </div>
              ) : (
                myLostReports.concat(myFoundReports).slice(0, 4).map(item => (
                  <div key={item.item_id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.item_name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            item.report_type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.report_type}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">{item.report_code}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                          {item.item_name}
                        </h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{item.location}</span>
                          <span>•</span>
                          <span>{item.report_date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#4169E1] border border-blue-100">
                        {item.status}
                      </span>
                      <button
                        onClick={() => setSelectedItemId(item.item_id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Smart Match Teaser Card */}
          {userMatches.length > 0 && (
            <div className="bg-gradient-to-br from-amber-500/10 via-blue-500/5 to-white border border-amber-300/70 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Possible Match Found
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {userMatches[0].overallScore}% Confidence
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Potential match for "{userMatches[0].lostItem.item_name}"
                </h4>
                <p className="text-xs text-slate-600 max-w-lg">
                  A found item registered in {userMatches[0].foundItem.location} strongly matches your description. Inspect match factors to verify.
                </p>
              </div>

              <button
                onClick={() => setCurrentView('smart_match')}
                className="px-4 py-2 bg-[#4169E1] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shrink-0 shadow-xs transition"
              >
                View Match Breakdown
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Activity Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#4169E1]" />
              <span>Recent Activity Feed</span>
            </h3>

            <div className="space-y-4">
              {activityItems.map((act, i) => (
                <div 
                  key={i} 
                  onClick={() => setCurrentView(act.actionView as any)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition cursor-pointer space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate pr-2">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{act.time}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('notifications')}
              className="w-full mt-4 py-2 text-center text-xs font-semibold text-[#4169E1] hover:bg-blue-50 rounded-xl transition"
            >
              Go to Notification Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
