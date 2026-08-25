import React from 'react';
import { UserProfile } from '../types';
import { X, User, Mail, ShieldCheck, Award } from 'lucide-react';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#111111] rounded-xl max-w-md w-full border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-white">
            <User className="w-5 h-5 text-indigo-400" />
            <span>User Profile</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base sm:text-lg text-white truncate">{user.name}</h3>
              <p className="text-xs sm:text-sm text-white/60 truncate">{user.role}</p>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[11px] sm:text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-3 h-3" /> Student Account
              </span>
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3 pt-2 border-t border-white/10 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-white/5 gap-0.5 sm:gap-0">
              <span className="text-white/60 flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" /> Email:
              </span>
              <span className="font-medium text-white break-all">{user.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-white/5 gap-0.5 sm:gap-0">
              <span className="text-white/60 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400 shrink-0" /> Project:
              </span>
              <span className="font-medium text-white">BCA AI Resume Ranker</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-white/60">Status:</span>
              <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active Session</span>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors cursor-pointer min-h-[40px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
