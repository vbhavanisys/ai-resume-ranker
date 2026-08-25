import React from 'react';
import { PageType } from '../types';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 w-full py-6 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 max-w-[1280px] mx-auto gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="font-bold text-lg text-white cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-sm">psychology</span>
          </div>
          <span>ResumeRank <span className="text-indigo-400 font-normal italic">AI</span></span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 sm:gap-6 items-center justify-center text-xs sm:text-sm text-white/60">
          <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer px-2 py-1.5 min-h-[36px]">
            Home
          </button>
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer px-2 py-1.5 min-h-[36px]">
            Dashboard
          </button>
          <button onClick={() => onNavigate('upload')} className="hover:text-white transition-colors cursor-pointer px-2 py-1.5 min-h-[36px]">
            Upload Resume
          </button>
          <button onClick={() => onNavigate('job-description')} className="hover:text-white transition-colors cursor-pointer px-2 py-1.5 min-h-[36px]">
            Job Description
          </button>
          <button onClick={() => onNavigate('analysis-history')} className="hover:text-white transition-colors cursor-pointer px-2 py-1.5 min-h-[36px]">
            History
          </button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-white/40 font-mono tracking-wider text-center">
          © {new Date().getFullYear()} ResumeRank AI • BCA Project
        </div>
      </div>
    </footer>
  );
};
