import React from 'react';
import { PageType } from '../types';
import { ArrowRight, Sparkles, Brain, Check, X as CloseIcon, FileText } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 sm:space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 px-3 sm:px-6 max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[auto] sm:min-h-[580px]">
        <div className="flex-1 space-y-4 sm:space-y-6 z-10 w-full">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3.5 py-1.5 rounded-full font-medium text-xs sm:text-sm border border-indigo-500/20 shadow-xs max-w-full">
            <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">Precision Intellect Technology • BCA Final Project</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Elevate Your Career with <span className="text-indigo-400">AI-Powered</span> Resume Analysis.
          </h1>

          <p className="text-sm sm:text-lg text-white/60 max-w-2xl leading-relaxed">
            Transform messy resume data into structured, actionable insights. Our professional analysis tool uses advanced AI algorithms to score, optimize, and rank your resume against real-world job descriptions.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-indigo-600 text-white px-6 py-3.5 rounded-lg font-semibold text-sm hover:bg-indigo-500 transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer min-h-[44px]"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('analysis-result')}
              className="bg-white/5 text-white border border-white/10 px-6 py-3.5 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>View Sample Report</span>
            </button>
          </div>
        </div>

        {/* Hero Card Preview */}
        <div className="flex-1 w-full max-w-lg relative z-10">
          <div className="glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden bg-[#111111]/90 border border-white/10 shadow-2xl">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600 opacity-20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600 opacity-20 rounded-full blur-2xl"></div>

            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-md shrink-0">
                AD
              </div>
              <div className="min-w-0">
                <div className="font-bold text-base sm:text-lg text-white truncate">Alex Developer</div>
                <div className="font-mono text-xs text-white/50 truncate">Senior Software Engineer</div>
              </div>
              <div className="ml-auto text-right shrink-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 leading-none">92</div>
                <div className="text-[11px] sm:text-xs font-semibold text-white/50 mt-1">Match Score</div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-white/80">Keyword Optimization</span>
                  <span className="text-indigo-400">High</span>
                </div>
                <div className="h-2 bg-white/10 w-full rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[85%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-white/80">Impact Formatting</span>
                  <span className="text-indigo-400">Excellent</span>
                </div>
                <div className="h-2 bg-white/10 w-full rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[95%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
              <div className="text-xs font-semibold text-white/50 mb-2">Key Skills Detected</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded text-xs font-mono font-medium">React</span>
                <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded text-xs font-mono font-medium">TypeScript</span>
                <span className="bg-white/5 text-white/70 border border-white/10 px-2.5 py-1 rounded text-xs font-mono font-medium">Node.js</span>
                <span className="bg-white/5 text-white/70 border border-white/10 px-2.5 py-1 rounded text-xs font-mono font-medium">AWS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[50vw] h-full bg-gradient-to-bl from-indigo-900/20 to-transparent opacity-60 -z-10 rounded-bl-[100px] pointer-events-none"></div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-8 sm:py-12 px-3 sm:px-6 bg-[#050505] border-y border-white/10">
        <div className="max-w-[1280px] mx-auto space-y-8 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-3xl font-bold text-white">Objective Analysis. Actionable Results.</h2>
            <p className="text-xs sm:text-base text-white/60 leading-relaxed">Our professional suite of tools is designed to reduce cognitive load while maximizing the impact of your career documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature 1: Intelligent AI Scoring */}
            <div className="bg-[#111111] rounded-xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-md">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Intelligent AI Scoring</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 sm:mb-6 max-w-lg">
                  Receive an objective, data-driven score assessing your resume's overall impact, readability, and structural integrity against target industry requirements.
                </p>
              </div>

              <div className="bg-white/5 p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 border border-white/10">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-indigo-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeWidth="3" />
                  </svg>
                  <span className="absolute text-xs sm:text-sm font-bold text-white">85</span>
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">Strong Candidate Profile</div>
                  <div className="font-mono text-[11px] sm:text-xs text-white/50">Top 15% of parsed resumes in your field.</div>
                </div>
              </div>
            </div>

            {/* Feature 2: Skill Gap Analysis */}
            <div className="bg-[#111111] rounded-xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">radar</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Skill Gap Analysis</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 sm:mb-6">
                  Instantly identify missing technical and soft skills required by specific job descriptions.
                </p>
              </div>

              <div className="space-y-2 bg-white/5 p-3 sm:p-3.5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs text-rose-400 font-medium">
                  <CloseIcon className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Missing: Docker, AWS</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Matched: React, CI/CD</span>
                </div>
              </div>
            </div>

            {/* Feature 3: ATS Keyword Optimization */}
            <div className="bg-[#111111] rounded-xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all md:col-span-3">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center">
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 text-white rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">ATS Keyword Optimization</h3>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    Ensure your resume passes Applicant Tracking Systems. We highlight critical keywords from the job description and suggest natural placements within your experience bullet points to increase your match rate.
                  </p>
                </div>

                <div className="flex-1 w-full">
                  <div className="bg-white/5 rounded-xl p-3.5 sm:p-4 font-mono text-xs border border-white/10">
                    <div className="text-white/40 mb-1 font-semibold uppercase text-[10px]">Original Bullet:</div>
                    <div className="text-white/70 line-through decoration-rose-500/80 mb-3 bg-black/40 p-2 rounded border border-white/5 break-words">
                      Managed a team to build a web application.
                    </div>
                    <div className="text-indigo-400 mb-1 font-semibold uppercase text-[10px]">AI Optimized Bullet:</div>
                    <div className="text-white border-l-2 border-indigo-500 pl-3 bg-black/40 p-2.5 rounded border border-white/5 break-words">
                      Spearheaded an <span className="font-bold text-indigo-400">Agile</span> team of 5 to architect a scalable <span className="font-bold text-indigo-400">React</span> web application, improving load times by 30%.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="px-3 sm:px-6 max-w-[1280px] mx-auto">
        <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border border-indigo-500/30 text-white rounded-2xl p-5 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Ready to Rank Your Resume?</h3>
            <p className="text-white/70 text-xs sm:text-sm max-w-xl leading-relaxed">
              Navigate straight to the Resume Upload or Job Description module to create a brand new analysis report.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('upload')}
              className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-bold text-sm hover:bg-indigo-500 transition-colors shadow-md cursor-pointer min-h-[44px] text-center"
            >
              Upload Resume
            </button>
            <button
              onClick={() => onNavigate('job-description')}
              className="bg-white/10 border border-white/15 text-white px-5 py-3 rounded-lg font-bold text-sm hover:bg-white/20 transition-colors cursor-pointer min-h-[44px] text-center"
            >
              Enter Job Description
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
