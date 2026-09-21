import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Check, 
  MapPin, 
  Calendar, 
  Building2,
  FileCheck
} from 'lucide-react';

export const RecoveryRequestModal: React.FC = () => {
  const { 
    selectedItemForRecovery, 
    setSelectedItemForRecovery, 
    submitRecoveryRequest,
    currentUser,
    setCurrentView,
    showToast
  } = useApp();

  const [message, setMessage] = useState('');
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newReqId, setNewReqId] = useState('');
  const [formErrors, setFormErrors] = useState<{ message?: string; details?: string }>({});

  if (!selectedItemForRecovery) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { message?: string; details?: string } = {};

    if (!message.trim() || message.trim().length < 10) {
      errors.message = 'Please provide a clear explanation of when/how you lost this item (at least 10 characters).';
    }
    if (!identifyingDetails.trim() || identifyingDetails.trim().length < 5) {
      errors.details = 'Please specify at least one unique verification detail (serial number, lock pattern, distinctive sticker, or private contents).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const req = submitRecoveryRequest(
      selectedItemForRecovery.item_id,
      message.trim(),
      identifyingDetails.trim()
    );

    setNewReqId(req.request_id);
    setSubmitted(true);
    showToast('Recovery request submitted successfully for proctor review.', 'success');
  };

  const handleClose = () => {
    setSelectedItemForRecovery(null);
    setSubmitted(false);
    setMessage('');
    setIdentifyingDetails('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#1E3A8A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Submit Campus Recovery Request</h3>
              <p className="text-xs text-blue-200">
                Claiming Found Item: {selectedItemForRecovery.report_code}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Item Summary Box */}
          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <img
              src={selectedItemForRecovery.image}
              alt={selectedItemForRecovery.item_name}
              className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0 text-xs">
              <div className="font-bold text-slate-900 truncate text-sm">
                {selectedItemForRecovery.item_name}
              </div>
              <div className="text-slate-500 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#4169E1]" />
                  {selectedItemForRecovery.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#4169E1]" />
                  {selectedItemForRecovery.report_date}
                </span>
              </div>
              {selectedItemForRecovery.current_custody && (
                <div className="text-[#1E3A8A] font-medium flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3 text-[#4169E1]" />
                  <span>Held at: {selectedItemForRecovery.current_custody}</span>
                </div>
              )}
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-[#1E3A8A] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-[#4169E1] shrink-0 mt-0.5" />
                <p>
                  To prevent fraudulent claims, please provide specific unpublicized details that prove your ownership. Campus proctors will review your submission before clearing physical release.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Why do you believe this is your item? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => {
                    setMessage(e.target.value);
                    if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                  }}
                  placeholder="e.g. I attended the 11 AM lecture in Seminar Hall A and forgot it on the 3rd bench..."
                  className={`w-full text-xs p-3 rounded-xl border ${formErrors.message ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} focus:outline-hidden focus:ring-2 focus:ring-[#4169E1]`}
                />
                {formErrors.message && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Additional Identifying Information <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={identifyingDetails}
                  onChange={e => {
                    setIdentifyingDetails(e.target.value);
                    if (formErrors.details) setFormErrors({ ...formErrors, details: undefined });
                  }}
                  placeholder="e.g. Exact serial number, specific phone wallpaper, keychain engraving, scratch on bottom corner, wallet cash breakdown..."
                  className={`w-full text-xs p-3 rounded-xl border ${formErrors.details ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} focus:outline-hidden focus:ring-2 focus:ring-[#4169E1]`}
                />
                {formErrors.details && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.details}</p>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                <div className="font-semibold text-slate-900 mb-1">Requester Credentials:</div>
                <div>Name: <span className="font-medium text-slate-800">{currentUser?.name || 'Rohan Sharma'}</span></div>
                <div>User ID: <span className="font-mono text-slate-800">{currentUser?.college_id || 'USER104'}</span></div>
                <div>Department: <span className="text-slate-800">{currentUser?.department || 'Information Technology'}</span></div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#4169E1] hover:bg-[#1E3A8A] text-white rounded-xl shadow-xs transition"
                >
                  Submit Recovery Request
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Recovery Request Logged Successfully
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your claim has been assigned tracking ID <span className="font-mono font-bold text-slate-800">#{newReqId.slice(-6)}</span>. You will receive notification alerts as campus proctors verify your evidence.
                </p>
              </div>

              {/* Status Timeline as required by prompt Section 10 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 text-center">
                  Verification Lifecycle Timeline
                </div>

                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Step 1 */}
                  <div className="flex sm:flex-col items-center gap-3 sm:text-center w-full">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-800">Request Submitted</div>
                      <div className="text-[10px] text-slate-500">Just Now</div>
                    </div>
                  </div>

                  {/* Line 1 */}
                  <div className="hidden sm:block h-0.5 w-full bg-amber-300"></div>

                  {/* Step 2 */}
                  <div className="flex sm:flex-col items-center gap-3 sm:text-center w-full">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs animate-pulse">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-900">Under Verification</div>
                      <div className="text-[10px] text-amber-700">Proctor Review</div>
                    </div>
                  </div>

                  {/* Line 2 */}
                  <div className="hidden sm:block h-0.5 w-full bg-slate-200"></div>

                  {/* Step 3 */}
                  <div className="flex sm:flex-col items-center gap-3 sm:text-center w-full opacity-60">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Approved / Handover</div>
                      <div className="text-[10px] text-slate-500">Pending Approval</div>
                    </div>
                  </div>

                  {/* Line 3 */}
                  <div className="hidden sm:block h-0.5 w-full bg-slate-200"></div>

                  {/* Step 4 */}
                  <div className="flex sm:flex-col items-center gap-3 sm:text-center w-full opacity-60">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Recovered</div>
                      <div className="text-[10px] text-slate-500">Claim Closed</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setCurrentView('dashboard');
                  }}
                  className="px-5 py-2 text-xs font-semibold bg-[#4169E1] hover:bg-[#1E3A8A] text-white rounded-xl shadow-xs transition"
                >
                  View My Dashboard
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl"
                >
                  Back to Browse
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
