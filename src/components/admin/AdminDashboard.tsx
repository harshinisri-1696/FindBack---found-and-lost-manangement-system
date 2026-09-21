import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Package, 
  Users, 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  BarChart3, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Check, 
  X, 
  UserCheck, 
  UserX, 
  MapPin, 
  Calendar,
  Building2,
  Lock,
  ArrowUpDown,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';
import { Item, ItemStatus, RecoveryRequest, User as UserType } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    items, 
    users, 
    recoveryRequests, 
    stats, 
    categories,
    updateItemStatus, 
    deleteItem, 
    verifyRecoveryRequest,
    toggleUserStatus, 
    setSelectedItemId,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'recovery' | 'users' | 'analytics'>('overview');
  const [reportSearch, setReportSearch] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [userSearch, setUserSearch] = useState('');
  const [proctorNote, setProctorNote] = useState<Record<string, string>>({});

  // Filtered reports
  const filteredReports = items.filter(item => {
    if (reportTypeFilter !== 'all' && item.report_type !== reportTypeFilter) return false;
    if (reportSearch.trim()) {
      const q = reportSearch.toLowerCase();
      return item.item_name.toLowerCase().includes(q) ||
             item.report_code.toLowerCase().includes(q) ||
             (item.reporter_name || '').toLowerCase().includes(q) ||
             item.location.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered users
  const filteredUsers = users.filter(u => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) ||
           u.college_id.toLowerCase().includes(q) ||
           u.email.toLowerCase().includes(q) ||
           u.role.toLowerCase().includes(q);
  });

  const handleVerifyReport = (item: Item) => {
    updateItemStatus(item.item_id, 'Active');
    showToast(`Report ${item.report_code} has been approved and published.`, 'success');
  };

  const handleRejectReport = (item: Item) => {
    updateItemStatus(item.item_id, 'Closed');
    showToast(`Report ${item.report_code} marked as closed / rejected.`, 'info');
  };

  const handleApproveRecovery = (req: RecoveryRequest) => {
    const note = proctorNote[req.request_id] || 'Verified with student physical ID card and matching serial details.';
    verifyRecoveryRequest(req.request_id, 'Approved', note);
    showToast(`Recovery request #${req.request_id.slice(-5)} approved for collection.`, 'success');
  };

  const handleRejectRecovery = (req: RecoveryRequest) => {
    const note = proctorNote[req.request_id] || 'Insufficient identifying proof provided.';
    verifyRecoveryRequest(req.request_id, 'Rejected', note);
    showToast(`Recovery request rejected.`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Administrative Control Console
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            College Campus Lost &amp; Found Proctorship, Report Verification, Custody Handover &amp; User Moderation
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Reports</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-900">
              {items.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'recovery' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Recovery Claims</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900">
              {recoveryRequests.filter(r => r.status === 'Pending Verification').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'users' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'analytics' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 6 Metric Stat Cards (Section 13) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Reports</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalReports}</div>
              <span className="text-[10px] text-slate-400">All submissions</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-rose-600 uppercase">Active Lost</span>
              <div className="text-2xl font-extrabold text-rose-600 mt-1">{stats.activeLost}</div>
              <span className="text-[10px] text-slate-400">Awaiting match</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">Active Found</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.activeFound}</div>
              <span className="text-[10px] text-slate-400">In campus custody</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-[#4169E1] uppercase">Recovered Items</span>
              <div className="text-2xl font-extrabold text-[#4169E1] mt-1">{stats.recovered}</div>
              <span className="text-[10px] text-slate-400">{stats.recoveryRate}% resolved</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-700 uppercase">Total Users</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalUsers}</div>
              <span className="text-[10px] text-slate-400">Students &amp; Faculty</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-amber-200 bg-amber-50/40 shadow-2xs">
              <span className="text-[11px] font-bold text-amber-700 uppercase">Pending Review</span>
              <div className="text-2xl font-extrabold text-amber-800 mt-1">{stats.pendingVerification}</div>
              <span className="text-[10px] text-amber-700">Requires proctor</span>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Administrative Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('reports')}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#4169E1] hover:bg-blue-50/30 text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4169E1]" />
                  <span>Verify Reports</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Inspect incoming student submissions and toggle status.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('recovery')}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  <span>Review Recovery Claims</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Validate proof and approve security gate collection.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Manage Users</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Search campus rosters and moderate account standing.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Campus Analytics</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  View category breakdowns, hotspot zones &amp; trends.
                </p>
              </button>
            </div>
          </div>

          {/* Pending Verifications Queue */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Pending Verification &amp; Inspection Queue
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs font-semibold text-[#4169E1] hover:underline"
              >
                View Full Table
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold">Report ID</th>
                    <th className="px-4 py-3 font-bold">Item Details</th>
                    <th className="px-4 py-3 font-bold">Type</th>
                    <th className="px-4 py-3 font-bold">Reporter</th>
                    <th className="px-4 py-3 font-bold">Location</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.slice(0, 5).map(item => (
                    <tr key={item.item_id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {item.report_code}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{item.item_name}</div>
                            <div className="text-[11px] text-slate-400">{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.report_type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.report_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.reporter_name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {item.location}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {item.report_date}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleVerifyReport(item)}
                            className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                            title="Verify and Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRejectReport(item)}
                            className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                            title="Reject Report"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedItemId(item.item_id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REPORTS MANAGEMENT (Section 15) */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={reportSearch}
                onChange={e => setReportSearch(e.target.value)}
                placeholder="Search report ID, item, location or student..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4169E1]"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="grid grid-cols-3 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setReportTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition ${reportTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  All ({items.length})
                </button>
                <button
                  onClick={() => setReportTypeFilter('lost')}
                  className={`px-3 py-1.5 rounded-lg transition ${reportTypeFilter === 'lost' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'}`}
                >
                  Lost
                </button>
                <button
                  onClick={() => setReportTypeFilter('found')}
                  className={`px-3 py-1.5 rounded-lg transition ${reportTypeFilter === 'found' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}
                >
                  Found
                </button>
              </div>
            </div>
          </div>

          {/* Full Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold">Report ID</th>
                    <th className="px-4 py-3 font-bold">Item Name</th>
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold">Type</th>
                    <th className="px-4 py-3 font-bold">Reported By</th>
                    <th className="px-4 py-3 font-bold">Location</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map(item => (
                    <tr key={item.item_id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {item.report_code}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-bold text-slate-900">{item.item_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.category}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.report_type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.report_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{item.reporter_name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.location}</td>
                      <td className="px-4 py-3 text-slate-500">{item.report_date}</td>
                      <td className="px-4 py-3">
                        <select
                          value={item.status}
                          onChange={e => updateItemStatus(item.item_id, e.target.value as ItemStatus)}
                          className="text-[11px] py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                        >
                          <option value="Active">Active</option>
                          <option value="Pending Verification">Pending Verification</option>
                          <option value="Possible Match">Possible Match</option>
                          <option value="Recovery Requested">Recovery Requested</option>
                          <option value="Recovered">Recovered</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedItemId(item.item_id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#4169E1] hover:bg-blue-50"
                            title="View Report Card"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete report ${item.report_code}?`)) {
                                deleteItem(item.item_id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            title="Delete Report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECOVERY REQUESTS (Section 16) */}
      {activeTab === 'recovery' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Campus Property Handover &amp; Recovery Claims
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review claimant credentials, compare secret identification marks, and issue gate-pass clearance.
            </p>
          </div>

          <div className="space-y-4">
            {recoveryRequests.map(req => {
              const matchedItem = items.find(i => i.item_id === req.item_id);
              return (
                <div
                  key={req.request_id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4 hover:border-blue-200 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-800">
                        Claim #{req.request_id.slice(-6)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'Approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : req.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Logged: {req.request_date || req.created_at}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Item Reference */}
                    <div className="lg:col-span-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Claimed Found Article
                      </div>
                      {matchedItem ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={matchedItem.image}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{matchedItem.item_name}</div>
                            <div className="text-slate-500">{matchedItem.report_code}</div>
                            <div className="text-[#1E3A8A] font-medium truncate mt-0.5">
                              Held at: {matchedItem.current_custody || 'Central Security'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-400">Item record no longer active</div>
                      )}
                    </div>

                    {/* Claimant Evidence Details */}
                    <div className="lg:col-span-8 space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                        <div>
                          <span className="text-slate-500">Claimant:</span>{' '}
                          <strong className="text-slate-900">{req.requester_name}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">College ID:</span>{' '}
                          <strong className="font-mono text-[#1E3A8A]">{req.requester_college_id}</strong>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="font-bold text-slate-700">Reason / Incident Details:</div>
                        <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                          "{req.message}"
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-bold text-slate-700">Private Identifying Proof:</div>
                        <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 leading-relaxed font-mono">
                          "{req.identifying_details}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Proctor Verification Section */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Add official proctor verification note or pickup token..."
                      value={proctorNote[req.request_id] || ''}
                      onChange={e => setProctorNote({ ...proctorNote, [req.request_id]: e.target.value })}
                      className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white flex-1 focus:outline-hidden focus:ring-2 focus:ring-[#4169E1]"
                    />

                    {req.status === 'Pending Verification' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveRecovery(req)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Claim</span>
                        </button>
                        <button
                          onClick={() => handleRejectRecovery(req)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-xs transition"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-slate-500">
                        Resolution logged by proctor.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: USERS MANAGEMENT (Section 14) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search student name, roll number, email..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4169E1]"
              />
            </div>
            <div className="text-xs text-slate-500">
              Total registered campus profiles: <strong>{users.length}</strong>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold">College ID</th>
                    <th className="px-4 py-3 font-bold">User Name</th>
                    <th className="px-4 py-3 font-bold">Email</th>
                    <th className="px-4 py-3 font-bold">Department</th>
                    <th className="px-4 py-3 font-bold">Role</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <tr key={u.user_id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-[#1E3A8A]">
                        {u.college_id}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {u.department || 'General Campus'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          u.role === 'admin' 
                            ? 'bg-amber-100 text-amber-800' 
                            : u.role === 'faculty'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleUserStatus(u.user_id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            u.status === 'active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS & VISUAL CHARTS (Section 17) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Campus Lost &amp; Found Performance Metrics
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Statistical breakdown of incident distribution across campus zones, item categories, and resolution velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chart 1: Lost vs Found Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Lost vs Found Ratio
              </h4>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-rose-500 h-full" 
                  style={{ width: `${(stats.activeLost / (stats.totalReports || 1)) * 100}%` }}
                />
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${(stats.activeFound / (stats.totalReports || 1)) * 100}%` }}
                />
                <div 
                  className="bg-[#4169E1] h-full" 
                  style={{ width: `${(stats.recovered / (stats.totalReports || 1)) * 100}%` }}
                />
              </div>

              <div className="space-y-2 text-xs pt-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span>Lost Reports</span>
                  </span>
                  <strong className="text-slate-800">{stats.activeLost}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Found Reports</span>
                  </span>
                  <strong className="text-slate-800">{stats.activeFound}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4169E1]"></span>
                    <span>Recovered Articles</span>
                  </span>
                  <strong className="text-slate-800">{stats.recovered}</strong>
                </div>
              </div>
            </div>

            {/* Chart 2: Category Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Top Item Categories
              </h4>
              <div className="space-y-3">
                {categories.slice(0, 5).map(cat => {
                  const count = items.filter(i => i.category === cat.category_name).length;
                  const pct = Math.round((count / (items.length || 1)) * 100);
                  return (
                    <div key={cat.category_id} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>{cat.category_name}</span>
                        <span>{count} items ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#4169E1] rounded-full" 
                          style={{ width: `${Math.max(pct, 12)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 3: Campus Hotspots */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Campus Hotspot Zones
              </h4>
              <div className="space-y-2.5 text-xs">
                {[
                  { name: 'Central Library', count: 4, pct: 45 },
                  { name: 'College Canteen', count: 3, pct: 35 },
                  { name: 'Seminar Hall A', count: 2, pct: 25 },
                  { name: 'Sports Complex', count: 1, pct: 15 },
                ].map((loc, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#4169E1]" />
                      <span className="font-semibold text-slate-800">{loc.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[#1E3A8A]">{loc.count} reports</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
