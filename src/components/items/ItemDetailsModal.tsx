import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Lock, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Share2,
  Check
} from 'lucide-react';

export const ItemDetailsModal: React.FC = () => {
  const { 
    selectedItemId, 
    setSelectedItemId, 
    items, 
    setSelectedItemForRecovery, 
    setCurrentView,
    showToast 
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  if (!selectedItemId) return null;

  const item = items.find(i => i.item_id === selectedItemId);
  if (!item) return null;

  const handleOpenRecovery = () => {
    setSelectedItemForRecovery(item);
    setSelectedItemId(null);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/item/${item.report_code}`);
    setCopiedLink(true);
    showToast(`Report code ${item.report_code} copied!`, 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReportIncorrect = () => {
    setShowFlagModal(false);
    showToast('Report flagged for administrative review. Thank you!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
              item.report_type === 'lost' 
                ? 'bg-rose-100 text-rose-700' 
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {item.report_type === 'lost' ? 'Lost Belonging' : 'Found Belonging'}
            </span>
            <span className="font-mono text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              {item.report_code}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Share Report"
            >
              {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSelectedItemId(null)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Visual & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-4/3 border border-slate-200">
              <img
                src={item.image}
                alt={item.item_name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 shadow-xs">
                {item.category}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {item.item_name}
              </h2>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#4169E1] shrink-0" />
                  <span className="font-semibold text-slate-700">Location:</span>
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4169E1] shrink-0" />
                  <span className="font-semibold text-slate-700">
                    {item.report_type === 'lost' ? 'Lost Date:' : 'Found Date:'}
                  </span>
                  <span>{item.report_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#4169E1] shrink-0" />
                  <span className="font-semibold text-slate-700">Brand / Color:</span>
                  <span>{item.brand || 'Unspecified'} • {item.color || 'Unspecified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4169E1] shrink-0" />
                  <span className="font-semibold text-slate-700">Status:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#4169E1] border border-blue-100">
                    {item.status}
                  </span>
                </div>
              </div>

              {item.current_custody && (
                <div className="mt-3 bg-[#E8F0FF] border border-blue-200 rounded-xl p-3 text-xs text-[#1E3A8A]">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-[#4169E1]" />
                    <span>Current Custody Location</span>
                  </div>
                  <p>{item.current_custody}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description & Identifying Features */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Description
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {item.description}
              </p>
            </div>

            {item.identifying_features && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Distinct Identifying Features
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {item.identifying_features}
                </p>
              </div>
            )}

            {item.additional_info && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Additional Campus Notes
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {item.additional_info}
                </p>
              </div>
            )}
          </div>

          {/* Privacy Protection Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Campus Privacy Protection: </span>
              In accordance with university security policies, personal telephone numbers and emails of reporters are not exposed publicly. All identity claims undergo administrative validation.
            </div>
          </div>

          {/* Flag modal state */}
          {showFlagModal && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
              <div className="font-bold text-amber-900">Report Inaccurate or Inappropriate Content</div>
              <p className="text-amber-800">
                Are you sure you want to flag report {item.report_code}? Campus administrators will be notified to review this record.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleReportIncorrect}
                  className="px-3 py-1 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700"
                >
                  Confirm Flag
                </button>
                <button
                  onClick={() => setShowFlagModal(false)}
                  className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowFlagModal(true)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Incorrect Information</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedItemId(null);
                setCurrentView('smart_match');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#4169E1] hover:bg-blue-50 border border-blue-200 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Check Smart Matches</span>
            </button>

            {item.report_type === 'found' && item.status !== 'Recovered' && (
              <button
                onClick={handleOpenRecovery}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#4169E1] hover:bg-[#1E3A8A] text-white shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Claim This Item (Recovery Request)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
