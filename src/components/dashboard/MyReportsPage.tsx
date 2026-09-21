import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  Search,
  FileCheck,
  Building2,
  Tag
} from 'lucide-react';
import { Item, ItemStatus } from '../../types';

export const MyReportsPage: React.FC = () => {
  const { 
    currentUser, 
    items, 
    deleteItem, 
    updateItemStatus, 
    setSelectedItemId, 
    setCurrentView,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found' | 'recovered'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">Please Sign In</h3>
        <p className="text-xs text-slate-500">Sign in to manage your campus lost and found submissions.</p>
        <button
          onClick={() => setCurrentView('login')}
          className="px-4 py-2 bg-[#4169E1] text-white text-xs font-bold rounded-xl"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Filter items for current user
  const userItems = items.filter(item => {
    // Check ownership or if user has claims
    const isOwner = item.user_id === currentUser.user_id;
    if (!isOwner) return false;

    if (activeTab === 'lost') return item.report_type === 'lost' && item.status !== 'Recovered';
    if (activeTab === 'found') return item.report_type === 'found' && item.status !== 'Recovered';
    if (activeTab === 'recovered') return item.status === 'Recovered';

    return true;
  }).filter(item => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return item.item_name.toLowerCase().includes(q) ||
           item.report_code.toLowerCase().includes(q) ||
           item.location.toLowerCase().includes(q);
  });

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.item_id);
      setItemToDelete(null);
      showToast('Report deleted successfully.', 'info');
    }
  };

  const handleStatusChange = (itemId: string, status: ItemStatus) => {
    updateItemStatus(itemId, status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Campus Reports &amp; Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your active items, change tracking status, or mark items as safely recovered.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('report_lost')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={() => setCurrentView('report_found')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#4169E1] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Submissions
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'lost'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Lost Reports
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'found'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Found Reports
          </button>
          <button
            onClick={() => setActiveTab('recovered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'recovered'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Recovered / Resolved
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Filter by name or ID..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4169E1]"
          />
        </div>
      </div>

      {/* Reports Listing */}
      {userItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No reports found under this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have zero items matching this tab filter.
          </p>
          <button
            onClick={() => setCurrentView('report_lost')}
            className="px-4 py-2 bg-[#4169E1] text-white text-xs font-bold rounded-xl"
          >
            Submit a New Report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userItems.map(item => (
            <div
              key={item.item_id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-200 transition p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <img
                  src={item.image}
                  alt={item.item_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                      item.report_type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.report_type}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">{item.report_code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Recovered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : item.status === 'Possible Match'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                    {item.item_name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#4169E1]" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.report_date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Selector & Actions */}
              <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                {/* Status dropdown */}
                <select
                  value={item.status}
                  onChange={e => handleStatusChange(item.item_id, e.target.value as ItemStatus)}
                  className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#4169E1]"
                >
                  <option value="Active">Status: Active</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Possible Match">Possible Match</option>
                  <option value="Recovery Requested">Recovery Requested</option>
                  <option value="Recovered">Recovered</option>
                  <option value="Closed">Closed</option>
                </select>

                {item.status !== 'Recovered' && (
                  <button
                    onClick={() => handleStatusChange(item.item_id, 'Recovered')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-2xs transition"
                    title="Mark item as recovered and close claim"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Recovered</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedItemId(item.item_id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>

                <button
                  onClick={() => setItemToDelete(item)}
                  className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition"
                  title="Delete Report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Deletion (Section 11 requirement) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Report?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete report <strong className="text-slate-800">{itemToDelete.report_code}</strong> ({itemToDelete.item_name})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
