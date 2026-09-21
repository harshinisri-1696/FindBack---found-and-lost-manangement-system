import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Tag, 
  HelpCircle,
  Eye,
  FileCheck,
  Percent
} from 'lucide-react';
import { SmartMatchResult } from '../../types';

export const SmartMatchPage: React.FC = () => {
  const { 
    items, 
    currentUser, 
    allSystemMatches, 
    setSelectedItemId, 
    setSelectedItemForRecovery,
    setCurrentView 
  } = useApp();

  const [filterMyReportsOnly, setFilterMyReportsOnly] = useState(false);

  // Filter matches
  const displayedMatches = filterMyReportsOnly && currentUser
    ? allSystemMatches.filter(m => m.lostItem.user_id === currentUser.user_id || m.foundItem.user_id === currentUser.user_id)
    : allSystemMatches;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#E8F0FF] text-[#4169E1]">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Possible Matches for Campus Items
            </h1>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            FindBack's automated multi-factor matching engine analyzes item taxonomy, token similarity, location proximity, and timeline delta to surface candidate matches.
          </p>
        </div>

        {currentUser && (
          <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setFilterMyReportsOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${!filterMyReportsOnly ? 'bg-[#4169E1] text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All Campus Matches ({allSystemMatches.length})
            </button>
            <button
              onClick={() => setFilterMyReportsOnly(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filterMyReportsOnly ? 'bg-[#4169E1] text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              My Reported Items Only
            </button>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold text-amber-950">Important Verification Notice: </span>
          All results displayed below represent algorithmic <strong>Possible Matches</strong>, not confirmed ownership. Physical custody release requires formal administrative review, matching proof, or custodian handover.
        </div>
      </div>

      {/* Matching Cards Grid */}
      {displayedMatches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Potential Matches Identified</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            When students and faculty submit matching lost and found reports with similar names, locations, and dates, they will automatically appear here.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('report_lost')}
              className="px-4 py-2 text-xs font-semibold bg-[#4169E1] text-white rounded-xl shadow-xs"
            >
              Report a Lost Item
            </button>
            <button
              onClick={() => setCurrentView('browse')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl"
            >
              Browse All Items
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedMatches.map((match, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Card Header with Match Percentage */}
              <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                    match.overallScore >= 80 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : match.overallScore >= 60 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    <Percent className="w-3 h-3" />
                    <span>Possible Match: {match.overallScore}%</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Confidence Level: {match.overallScore >= 80 ? 'Very High' : match.overallScore >= 60 ? 'Moderate' : 'Preliminary'}
                  </span>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  Pairing: {match.lostItem.report_code} ↔ {match.foundItem.report_code}
                </span>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
                  {/* Left: Lost Item */}
                  <div className="lg:col-span-4 bg-rose-50/30 border border-rose-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                        Lost Item Report
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{match.lostItem.report_code}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={match.lostItem.image}
                        alt={match.lostItem.item_name}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {match.lostItem.item_name}
                        </h4>
                        <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-slate-400" />
                            <span>{match.lostItem.category}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{match.lostItem.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Lost: {match.lostItem.report_date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 italic">
                      "{match.lostItem.description}"
                    </p>
                  </div>

                  {/* Middle: Match Factors Indicator */}
                  <div className="lg:col-span-3 flex flex-col items-center justify-center p-2">
                    <div className="w-full space-y-2 max-w-xs">
                      {/* Overall Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Similarity Index</span>
                          <span>{match.overallScore}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              match.overallScore >= 80 ? 'bg-emerald-500' : match.overallScore >= 60 ? 'bg-[#4169E1]' : 'bg-amber-500'
                            }`}
                            style={{ width: `${match.overallScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Factor Checkmarks */}
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                        {match.factors.map((factor, fIdx) => (
                          <div key={fIdx} className="flex items-center justify-between">
                            <span className="flex items-center gap-1 truncate pr-1">
                              <CheckCircle2 className={`w-3 h-3 shrink-0 ${factor.matched ? 'text-emerald-600' : 'text-slate-300'}`} />
                              <span className="truncate">{factor.name}</span>
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 shrink-0">
                              {factor.score}/{factor.weight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Found Item */}
                  <div className="lg:col-span-4 bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        Possible Found Match
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{match.foundItem.report_code}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={match.foundItem.image}
                        alt={match.foundItem.item_name}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {match.foundItem.item_name}
                        </h4>
                        <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-slate-400" />
                            <span>{match.foundItem.category}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{match.foundItem.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Found: {match.foundItem.report_date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 italic">
                      "{match.foundItem.description}"
                    </p>
                  </div>
                </div>

                {/* Match Action Bar */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Held at: <strong>{match.foundItem.current_custody || 'Central Campus Security'}</strong></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedItemId(match.foundItem.item_id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Found Details</span>
                    </button>

                    <button
                      onClick={() => setSelectedItemForRecovery(match.foundItem)}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#4169E1] hover:bg-[#1E3A8A] text-white shadow-xs flex items-center gap-1.5 transition"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Initiate Recovery Request</span>
                    </button>
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
