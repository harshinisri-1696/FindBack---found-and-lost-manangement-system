import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Package, 
  PlusCircle, 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown,
  Compass,
  FileSpreadsheet,
  GraduationCap,
  Lock
} from 'lucide-react';
import { LostFoundLogo } from './LostFoundLogo';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    logoutUser, 
    switchUserRole,
    unreadNotificationsCount
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (view: any) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <LostFoundLogo className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#172033]">
                  Find<span className="text-[#4169E1]">Back</span>
                </span>
                <span className="bg-[#E8F0FF] text-[#4169E1] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight -mt-0.5 hidden sm:block">
                Find it. Report it. Return it.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'home' ? 'text-[#4169E1] bg-[#E8F0FF] font-semibold' : 'hover:text-[#172033] hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('browse')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'browse' ? 'text-[#4169E1] bg-[#E8F0FF] font-semibold' : 'hover:text-[#172033] hover:bg-slate-100'
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => handleNavClick('report_lost')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'report_lost' ? 'text-[#4169E1] bg-[#E8F0FF] font-semibold' : 'hover:text-[#172033] hover:bg-slate-100'
              }`}
            >
              Report Lost
            </button>
            <button
              onClick={() => handleNavClick('report_found')}
              className={`px-3 py-2 rounded-lg transition ${
                currentView === 'report_found' ? 'text-[#4169E1] bg-[#E8F0FF] font-semibold' : 'hover:text-[#172033] hover:bg-slate-100'
              }`}
            >
              Report Found
            </button>
            <button
              onClick={() => handleNavClick('smart_match')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                currentView === 'smart_match' ? 'text-[#4169E1] bg-[#E8F0FF] font-semibold' : 'hover:text-[#172033] hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Smart Match</span>
            </button>
          </nav>

          {/* User Status / Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentUser ? (
              <>
                {/* Notifications Bell */}
                <button
                  onClick={() => handleNavClick('notifications')}
                  className="relative p-2 text-slate-600 hover:text-[#4169E1] hover:bg-[#E8F0FF] rounded-lg transition"
                  title="Campus Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 transition"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs text-white ${
                      currentUser.role === 'admin' ? 'bg-slate-900 text-amber-400 border border-amber-400/40' : 'bg-[#4169E1]'
                    }`}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-xs font-semibold text-slate-900 leading-tight">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <span>{currentUser.college_id}</span>
                        <span>•</span>
                        <span className={`font-semibold capitalize ${currentUser.role === 'admin' ? 'text-amber-700' : 'text-blue-600'}`}>
                          {currentUser.role}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          currentUser.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-[#E8F0FF] text-[#4169E1]'
                        }`}>
                          {currentUser.role}
                        </span>
                      </div>

                      {currentUser.role === 'admin' ? (
                        <>
                          <button
                            onClick={() => handleNavClick('admin_dashboard')}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#4169E1] flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            Admin Console
                          </button>
                          <button
                            onClick={() => handleNavClick('admin_reports')}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#4169E1] flex items-center gap-2"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                            Manage Reports
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleNavClick('dashboard')}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#4169E1] flex items-center gap-2"
                          >
                            <Compass className="w-4 h-4 text-[#4169E1]" />
                            User Dashboard
                          </button>
                          <button
                            onClick={() => handleNavClick('my_reports')}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#4169E1] flex items-center gap-2"
                          >
                            <Package className="w-4 h-4 text-slate-500" />
                            My Reports
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#4169E1] flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        My Profile
                      </button>

                      <div className="my-1 border-t border-slate-100"></div>

                      <button
                        onClick={() => {
                          logoutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#4169E1] px-3 py-2 transition cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  onClick={() => handleNavClick('register')}
                  className="text-xs font-bold bg-[#4169E1] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser && (
              <button
                onClick={() => handleNavClick('notifications')}
                className="relative p-2 text-slate-600 hover:text-[#4169E1]"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentView === 'home' ? 'text-[#4169E1] bg-[#E8F0FF]' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('browse')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentView === 'browse' ? 'text-[#4169E1] bg-[#E8F0FF]' : 'text-slate-700'
            }`}
          >
            Browse Registry
          </button>
          <button
            onClick={() => handleNavClick('report_lost')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentView === 'report_lost' ? 'text-[#4169E1] bg-[#E8F0FF]' : 'text-slate-700'
            }`}
          >
            Report Lost Item
          </button>
          <button
            onClick={() => handleNavClick('report_found')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentView === 'report_found' ? 'text-[#4169E1] bg-[#E8F0FF]' : 'text-slate-700'
            }`}
          >
            Report Found Item
          </button>
          <button
            onClick={() => handleNavClick('smart_match')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentView === 'smart_match' ? 'text-[#4169E1] bg-[#E8F0FF]' : 'text-slate-700'
            }`}
          >
            Smart Match
          </button>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {!currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#4169E1] text-white font-bold text-xs"
                >
                  Register Account
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => handleNavClick('admin_dashboard')}
                    className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-amber-700 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Console
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#4169E1] flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    User Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
