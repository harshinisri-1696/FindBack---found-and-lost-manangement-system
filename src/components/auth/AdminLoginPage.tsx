import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Building2, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2,
  BadgeCheck,
  Eye,
  EyeOff,
  Radio,
  ArrowLeft
} from 'lucide-react';
import { LostFoundLogo } from '../common/LostFoundLogo';

export const AdminLoginPage: React.FC = () => {
  const { loginUser, users, setCurrentView, showToast } = useApp();

  const [adminId, setAdminId] = useState('ADM001');
  const [passkey, setPasskey] = useState('');
  const [stationLocation, setStationLocation] = useState('Central Campus Security Station');
  const [securityToken, setSecurityToken] = useState('849201');
  const [showPasskey, setShowPasskey] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminId.trim()) {
      setError('Please enter your official Administrator Clearance ID.');
      return;
    }

    if (!passkey.trim()) {
      setError('Please enter your Administrative Security Passkey.');
      return;
    }

    if (securityToken.trim().length !== 6) {
      setError('A valid 6-digit security clearance token is required.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      // Find admin account
      const adminUser = users.find(u => u.role === 'admin' && (
        u.college_id.toLowerCase() === adminId.trim().toLowerCase() ||
        u.email.toLowerCase() === adminId.trim().toLowerCase()
      )) || users.find(u => u.role === 'admin');

      if (!adminUser) {
        setError('Clearance ID not recognized in Campus Administrative Security Registry.');
        return;
      }

      loginUser(adminUser);
      showToast(`Welcome Proctor ${adminUser.name}. Station: ${stationLocation}`, 'success');
      setCurrentView('admin_dashboard');
    }, 450);
  };

  const handleQuickDemoAdmin = () => {
    const adminUser = users.find(u => u.role === 'admin') || users[2];
    setAdminId(adminUser.college_id);
    setPasskey('Campus@2026');
    setSecurityToken('849201');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-900 text-slate-100 selection:bg-amber-500 selection:text-slate-950 animate-in fade-in duration-200">
      <div className="w-full max-w-lg space-y-6">
        {/* Security Portal Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl shadow-black/40 relative">
            <LostFoundLogo className="w-12 h-12" />
            <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md border-2 border-slate-900">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold tracking-wider uppercase mb-2">
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Campus Security &amp; Proctor Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administrative Control Terminal
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Restricted management console for proctor verification, custodial handovers, and item moderation.
            </p>
          </div>
        </div>

        {/* High-Security Dark Terminal Card */}
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700/60 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            {/* Admin Clearance ID */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Administrator / Proctor ID</span>
                <span className="text-[11px] font-mono text-amber-400/80">Authorized Format: ADM001</span>
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminId}
                  onChange={e => setAdminId(e.target.value)}
                  placeholder="e.g. ADM001"
                  className="w-full text-xs font-mono pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Master Security Passkey */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrative Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPasskey ? 'text' : 'password'}
                  value={passkey}
                  onChange={e => setPasskey(e.target.value)}
                  placeholder="Enter security master passkey"
                  className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Custody Station & Security Token in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Station</span>
                </label>
                <select
                  value={stationLocation}
                  onChange={e => setStationLocation(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Central Campus Security Station">Main Security Gate</option>
                  <option value="Central Library Helpdesk">Library Custody Desk</option>
                  <option value="Chief Proctor Administration Office">Chief Proctor Office</option>
                  <option value="Student Affairs Counter">Student Affairs Desk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>2FA Security Token</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Demo: 849201</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={securityToken}
                  onChange={e => setSecurityToken(e.target.value)}
                  placeholder="6-digit PIN"
                  className="w-full text-xs font-mono tracking-widest text-center py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            {/* Audit compliance checkbox */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-start gap-2.5 text-[11px] text-slate-400">
              <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Authorized proctor session. All verification clearances and item handovers are permanently logged with proctor credentials.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs tracking-wide uppercase transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Proctor Credentials...</span>
                </>
              ) : (
                <>
                  <span>Access Administrative Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Proctor Button */}
          <div className="pt-2 border-t border-slate-700/70 space-y-2.5 text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              One-Click Administrative Demo Credentials
            </div>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="w-full py-2 px-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-amber-300 hover:text-amber-200 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Fill Chief Proctor Credentials (Prof. K. Sundaram • ADM001)</span>
            </button>
          </div>

          {/* Return to Student/User Portal */}
          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentView('login')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Switch to Regular Student &amp; Faculty Login Portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
