import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  ShieldCheck,
  RefreshCw, 
  Mail, 
  Phone, 
  User as UserIcon,
  UserPlus,
  Compass, 
  Package, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { LostFoundLogo } from './LostFoundLogo';

export const Footer: React.FC = () => {
  const { setCurrentView, resetToSampleData } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <LostFoundLogo className="w-9 h-9" />
              <div>
                <span className="text-xl font-extrabold tracking-tight text-[#172033]">
                  Find<span className="text-[#4169E1]">Back</span>
                </span>
                <span className="ml-2 bg-[#E8F0FF] text-[#4169E1] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  Campus
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              "Find it. Report it. Return it." – A centralized smart campus platform connecting students, faculty, and campus security to report, cross-match, and safely recover lost belongings.
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E3A8A] px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4169E1]" />
              <span>Campus Lost &amp; Found Portal</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Registry</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-[#4169E1] transition">
                  Campus Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('browse')} className="hover:text-[#4169E1] transition">
                  Browse Found &amp; Lost
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('report_lost')} className="hover:text-[#4169E1] transition">
                  Report Lost Article
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('report_found')} className="hover:text-[#4169E1] transition">
                  Report Found Article
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('smart_match')} className="hover:text-[#4169E1] transition flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Smart Match Engine</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Custody */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Campus Custody</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Central Library Helpdesk (1st Floor)</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Main Campus Gate Security Station</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Security Helpdesk: Ext. 4022</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>lostfound@college.edu</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Actions */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentView('login')}
                className="w-full flex items-center justify-between text-left px-3 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#4169E1] transition"
              >
                <span className="flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-[#4169E1]" />
                  <span>User Portal</span>
                </span>
                <span className="text-[10px] text-blue-600 font-bold">Sign In</span>
              </button>

              <button
                onClick={() => setCurrentView('register')}
                className="w-full flex items-center justify-between text-left px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
              >
                <span className="flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                  <span>Register Account</span>
                </span>
              </button>

              <button
                onClick={resetToSampleData}
                className="w-full flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-amber-800 transition"
                title="Reset sample lost & found data"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                <span>Reset Demo Records</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FindBack Campus Lost &amp; Found System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-700 cursor-pointer">Security Protocol</span>
            <span>•</span>
            <span className="hover:text-slate-700 cursor-pointer">Custody Guidelines</span>
            <span>•</span>
            <span className="hover:text-slate-700 cursor-pointer">Privacy Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
