import React from 'react';
import { PageType, UserProfile, AnalysisRecord } from '../types';
import { User, Mail, ShieldCheck, Award, LogOut, LayoutDashboard, FileText, BarChart3, Clock } from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
  historyRecords: AnalysisRecord[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onNavigate,
  onLogout,
  historyRecords,
}) => {
  const totalAnalyses = historyRecords.length;
  const avgScore = totalAnalyses > 0
    ? Math.round(historyRecords.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalAnalyses)
    : 0;

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 max-w-[1000px] mx-auto w-full space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <User className="w-7 h-7 text-indigo-400" />
            <span>User Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Manage your account settings, credentials, and review evaluation summary metrics.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg font-semibold text-xs sm:text-sm transition-colors cursor-pointer min-h-[42px]"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Account</span>
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-xl shrink-0 border border-indigo-400/30">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1.5 flex-grow min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{user.name || 'Candidate User'}</h2>
            <p className="text-sm text-indigo-300 font-medium">{user.role || 'BCA Student / Candidate'}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authenticated Candidate
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Award className="w-3.5 h-3.5 text-indigo-400" /> Active Session
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <div className="text-xs text-white/50 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address
            </div>
            <div className="text-sm sm:text-base font-semibold text-white break-all">{user.email || 'student@example.com'}</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <div className="text-xs text-white/50 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" /> Application Title
            </div>
            <div className="text-sm sm:text-base font-semibold text-white">AI Resume Ranker & Match Optimizer</div>
          </div>
        </div>

        {/* Evaluation Summary Stats */}
        <div className="pt-2">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Your Analysis Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#181818] border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{totalAnalyses}</div>
              <div className="text-xs text-white/60 mt-0.5">Total Resumes Evaluated</div>
            </div>

            <div className="bg-[#181818] border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-indigo-400">{avgScore}%</div>
              <div className="text-xs text-white/60 mt-0.5">Average Job Match Score</div>
            </div>

            <div className="bg-[#181818] border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {historyRecords.filter((r) => (r.matchScore || 0) >= 80).length}
              </div>
              <div className="text-xs text-white/60 mt-0.5">High Match Qualification Count</div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Action Buttons */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-colors shadow-md cursor-pointer min-h-[44px]"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold text-sm transition-colors cursor-pointer min-h-[44px]"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Analyze New Resume</span>
          </button>
          <button
            onClick={() => onNavigate('analysis-history')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold text-sm transition-colors cursor-pointer min-h-[44px]"
          >
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>View Analysis History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
