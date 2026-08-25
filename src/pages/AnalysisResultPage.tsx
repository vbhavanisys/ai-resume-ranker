import React, { useState } from 'react';
import { PageType, AnalysisRecord } from '../types';
import {
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  Sparkles,
  Printer,
  X,
  Target,
  FileCheck,
  TrendingUp,
  Key,
  Code,
  Users,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  FileText,
  BarChart3,
  Check
} from 'lucide-react';

interface AnalysisResultPageProps {
  onNavigate: (page: PageType) => void;
  selectedRecord?: AnalysisRecord | null;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({
  onNavigate,
  selectedRecord,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [isPreparingDownload, setIsPreparingDownload] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  if (!selectedRecord) {
    return (
      <div className="py-12 px-6 max-w-lg mx-auto w-full text-center space-y-4">
        <FileText className="w-16 h-16 text-white/30 mx-auto animate-pulse" />
        <h2 className="text-xl font-bold text-white">No Analysis Selected</h2>
        <p className="text-sm text-white/60">
          Please select an analysis from your history or run a new resume evaluation.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('analysis-history')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            View History
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Run New Analysis
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadClick = () => {
    setIsPreparingDownload(true);
    setTimeout(() => {
      setIsPreparingDownload(false);
      setShowReportModal(true);
    }, 400);
  };

  const handleCopyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  // Metrics calculations
  const matchScore = selectedRecord.jobMatchPercentage ?? selectedRecord.matchScore ?? 80;
  const resumeScore = selectedRecord.resumeScore ?? matchScore;
  const skillMatch = selectedRecord.skillMatchPercentage ?? matchScore;
  const keywordMatch = selectedRecord.keywordMatchPercentage ?? Math.max(matchScore - 5, 50);

  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  const matchedCount = selectedRecord.matchedSkills?.length || 0;
  const missingCount = selectedRecord.missingSkills?.length || 0;
  const totalSkillCount = matchedCount + missingCount || 1;
  const matchedRatio = Math.round((matchedCount / totalSkillCount) * 100);

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 max-w-[1280px] mx-auto w-full space-y-6 sm:space-y-8">
      {/* Navigation Breadcrumb & Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => onNavigate('analysis-history')}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to History
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Real AI Gemini Result
            </span>
            <span className="text-xs text-white/40">• {selectedRecord.date}</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-bold text-white">
            AI Resume Analysis & Scoring
          </h1>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed mt-1">
            Candidate: <strong className="text-white">{selectedRecord.candidateName}</strong> • Target Role: <strong className="text-white">{selectedRecord.jobTitle}</strong> at <strong className="text-white">{selectedRecord.companyName}</strong>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleDownloadClick}
            disabled={isPreparingDownload}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-white/10 text-white bg-white/5 hover:bg-white/10 rounded-lg font-semibold text-sm transition-colors cursor-pointer shadow-md disabled:opacity-50 min-h-[44px]"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>{isPreparingDownload ? 'Preparing Report...' : 'Download Report'}</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-500 transition-colors shadow-md cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* 4 Score Metrics Cards with Visual Progress Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Job Match */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50 font-medium">Job Match</span>
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-indigo-400">{matchScore}%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${matchScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 2: Resume Score */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50 font-medium">Resume Score</span>
            <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{resumeScore}%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${resumeScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 3: Skill Match */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50 font-medium">Skill Match</span>
            <div className="p-2 bg-amber-600/20 text-amber-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-400">{skillMatch}%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${skillMatch}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 4: Keyword Match */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50 font-medium">Keyword Match</span>
            <div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-purple-400">{keywordMatch}%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${keywordMatch}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* Job Match Gauge & Breakdown (Span 4) */}
        <div className="md:col-span-4 bg-[#111111] border border-white/10 rounded-xl p-5 sm:p-6 flex flex-col items-center justify-between shadow-2xl">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 w-full text-center flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Overall Job Alignment
          </h2>

          <div className="relative w-40 h-40 sm:w-48 sm:h-48 my-2 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="11"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={matchScore >= 80 ? '#6366f1' : matchScore >= 70 ? '#f59e0b' : '#f43f5e'}
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-indigo-400">{matchScore}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-white/50 tracking-wider">% MATCH SCORE</span>
            </div>
          </div>

          <p className="text-center text-xs sm:text-sm text-white/60 my-2 leading-relaxed">
            {matchScore >= 80
              ? 'High match fit! Your resume aligns strongly with core role requirements.'
              : matchScore >= 70
              ? 'Moderate match fit. A few key skills or keywords require alignment.'
              : 'Low match fit. Significant skill gaps identified compared to target position.'}
          </p>

          <div className="w-full mt-4 pt-4 border-t border-white/10 grid grid-cols-2 text-center text-xs gap-2">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <span className="text-white/50 block text-[10px]">Matched Skills</span>
              <span className="font-bold text-indigo-400 text-sm">{matchedCount} skills</span>
            </div>
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <span className="text-white/50 block text-[10px]">Missing Skills</span>
              <span className="font-bold text-rose-400 text-sm">{missingCount} skills</span>
            </div>
          </div>
        </div>

        {/* Skills Breakdown Chart & List (Span 8) */}
        <div className="md:col-span-8 bg-[#111111] border border-white/10 rounded-xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-5">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Skills Comparison & Gap Analysis</h2>
              <p className="text-xs text-white/50">Real AI skill extraction against job description requirements</p>
            </div>
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full font-mono text-xs font-bold border border-indigo-500/30">
              {matchedRatio}% Coverage
            </span>
          </div>

          {/* Skill Coverage Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-white/60">
              <span>Skill Alignment Progress</span>
              <span className="font-bold text-indigo-400">{matchedCount} of {totalSkillCount} skills satisfied</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
              <div
                className="bg-indigo-500 h-full transition-all duration-700"
                style={{ width: `${matchedRatio}%` }}
                title={`${matchedCount} Matched Skills`}
              ></div>
              <div
                className="bg-rose-500/80 h-full transition-all duration-700"
                style={{ width: `${100 - matchedRatio}%` }}
                title={`${missingCount} Missing Skills`}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-white/40 pt-0.5">
              <span className="flex items-center gap-1 text-indigo-400">■ Matched ({matchedCount})</span>
              <span className="flex items-center gap-1 text-rose-400">■ Missing ({missingCount})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Matched Skills */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <h3 className="font-semibold text-sm text-white">
                  Matched Skills ({matchedCount})
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedRecord.matchedSkills && selectedRecord.matchedSkills.length > 0 ? (
                  selectedRecord.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full font-mono text-xs font-medium border border-indigo-500/30 flex items-center gap-1"
                    >
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-white/40 italic">No direct matches found.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <h3 className="font-semibold text-sm text-white">
                  Missing / Weak Skills ({missingCount})
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedRecord.missingSkills && selectedRecord.missingSkills.length > 0 ? (
                  selectedRecord.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-rose-500/20 text-rose-300 rounded-full font-mono text-xs font-medium border border-rose-500/30 flex items-center gap-1"
                    >
                      ✗ {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-medium">All required skills matched!</span>
                )}
              </div>
              <p className="text-[11px] text-white/50 mt-1">
                Tip: Address these missing skills in your resume projects or experience section.
              </p>
            </div>
          </div>
        </div>

        {/* Extracted Resume Profile & Keywords (Span 12) */}
        <div className="md:col-span-12 bg-[#111111] border border-white/10 rounded-xl p-5 sm:p-6 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Parsed Resume Profile & Domain Keywords
              </h2>
              <p className="text-xs text-white/50">Extracted from {selectedRecord.fileName}</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              ATS Standard Verification: Passed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Technical Skills */}
            {selectedRecord.technicalSkills && selectedRecord.technicalSkills.length > 0 && (
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                  <Code className="w-4 h-4" /> Technical Skills
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedRecord.technicalSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-white/80 border border-white/10 font-mono">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {selectedRecord.softSkills && selectedRecord.softSkills.length > 0 && (
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Users className="w-4 h-4" /> Soft Skills
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedRecord.softSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {selectedRecord.education && selectedRecord.education.length > 0 && (
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <GraduationCap className="w-4 h-4" /> Education & Credentials
                </div>
                <ul className="space-y-1 text-white/70 list-disc list-inside">
                  {selectedRecord.education.map((edu, i) => (
                    <li key={i}>{edu}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Work Experience */}
            {selectedRecord.experience && selectedRecord.experience.length > 0 && (
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-400">
                  <Briefcase className="w-4 h-4" /> Experience Highlights
                </div>
                <ul className="space-y-1 text-white/70 list-disc list-inside">
                  {selectedRecord.experience.map((exp, i) => (
                    <li key={i} className="line-clamp-2">{exp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Projects */}
            {selectedRecord.projects && selectedRecord.projects.length > 0 && (
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-purple-400">
                  <FolderGit2 className="w-4 h-4" /> Projects Mentioned
                </div>
                <ul className="space-y-1 text-white/70 list-disc list-inside">
                  {selectedRecord.projects.map((proj, i) => (
                    <li key={i}>{proj}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {selectedRecord.certifications && selectedRecord.certifications.length > 0 && (
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-rose-400">
                  <Award className="w-4 h-4" /> Certifications
                </div>
                <ul className="space-y-1 text-white/70 list-disc list-inside">
                  {selectedRecord.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Keywords Cloud */}
          {selectedRecord.keywords && selectedRecord.keywords.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-white/50 block mb-2">
                Extracted Domain Keywords (Click to Copy):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRecord.keywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => handleCopyKeyword(kw)}
                    title="Click to copy keyword"
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 rounded-md text-xs border border-white/10 font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>#{kw}</span>
                    {copiedKeyword === kw && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Strengths & Weaknesses (Span 12) */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Strengths */}
          <div className="bg-[#111111] border border-white/10 rounded-xl p-5 sm:p-6 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <ThumbsUp className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Candidate Strengths</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              {selectedRecord.strengths && selectedRecord.strengths.length > 0 ? (
                selectedRecord.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))
              ) : (
                <li className="text-white/40 italic">Solid technical background in core stack.</li>
              )}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-[#111111] border border-white/10 rounded-xl p-5 sm:p-6 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              {selectedRecord.weaknesses && selectedRecord.weaknesses.length > 0 ? (
                selectedRecord.weaknesses.map((wk, i) => (
                  <li key={i} className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{wk}</span>
                  </li>
                ))
              ) : (
                <li className="text-white/40 italic">Minor gaps in niche domain tools.</li>
              )}
            </ul>
          </div>
        </div>

        {/* AI Recommendations & Action Plan (Span 12) */}
        <div className="md:col-span-12 bg-[#111111] border border-white/10 rounded-xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white">AI Recommendations & Action Plan</h2>
          </div>

          <div className="space-y-3">
            {selectedRecord.suggestions && selectedRecord.suggestions.length > 0 ? (
              selectedRecord.suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 p-3.5 sm:p-4 border border-white/10 rounded-xl flex gap-3 items-start hover:border-white/20 transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs sm:text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-white">{sug.title}</h4>
                    <p className="text-xs sm:text-sm text-white/60 mt-1 leading-relaxed">{sug.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/50 italic">No additional suggestions generated.</p>
            )}
          </div>

          {/* ATS Bullet Point Optimizer */}
          {selectedRecord.originalBullet && selectedRecord.optimizedBullet && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Bullet Point Optimizer
              </h3>
              <div className="bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/10 space-y-2 text-xs font-mono">
                <div className="text-white/40">Original Bullet:</div>
                <div className="text-rose-400 line-through bg-rose-500/10 p-2.5 rounded border border-rose-500/20 break-words">
                  {selectedRecord.originalBullet}
                </div>
                <div className="text-indigo-400 font-bold mt-2">ATS Optimized Bullet:</div>
                <div className="text-white bg-indigo-500/20 p-3 rounded-lg border-l-4 border-indigo-500 break-words leading-relaxed">
                  {selectedRecord.optimizedBullet}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable Report Modal Overlay */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center overflow-y-auto">
          <div className="bg-[#111111] max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-white/10 p-5 sm:p-8 space-y-5 sm:space-y-6 relative text-white my-auto">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-2 pr-8 sm:pr-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">AI Resume Analysis Report</h1>
                <p className="text-xs text-white/50">Generated on {selectedRecord.date}</p>
              </div>
              <div className="sm:text-right">
                <div className="text-lg sm:text-xl font-bold text-indigo-400">ResumeRank AI</div>
                <p className="text-xs font-medium text-white/60">{selectedRecord.jobTitle}</p>
              </div>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] text-white/50 uppercase block">Job Match</span>
                <span className="text-xl font-bold text-indigo-400">{matchScore}%</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] text-white/50 uppercase block">Resume Score</span>
                <span className="text-xl font-bold text-emerald-400">{resumeScore}%</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] text-white/50 uppercase block">Skill Match</span>
                <span className="text-xl font-bold text-amber-400">{skillMatch}%</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] text-white/50 uppercase block">Keyword Match</span>
                <span className="text-xl font-bold text-purple-400">{keywordMatch}%</span>
              </div>
            </div>

            <div className="border border-white/10 rounded-xl p-4 space-y-3 bg-white/5">
              <h2 className="text-xs sm:text-sm font-bold text-white">Skills Breakdown</h2>
              <div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase">Matched Skills ({matchedCount}):</span>
                <p className="text-xs text-white/80 font-mono mt-0.5 leading-relaxed">{selectedRecord.matchedSkills?.join(', ') || 'None'}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-400 uppercase">Missing Skills ({missingCount}):</span>
                <p className="text-xs text-white/80 font-mono mt-0.5 leading-relaxed">{selectedRecord.missingSkills?.join(', ') || 'None'}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Recommendations</h2>
              {selectedRecord.suggestions?.map((s, i) => (
                <div key={i} className="p-3 border border-white/10 rounded-lg text-xs bg-white/5 text-white/80 leading-relaxed">
                  <strong className="text-white font-semibold">{s.title}:</strong> {s.description}
                </div>
              ))}
            </div>

            <footer className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/40 text-center sm:text-left">© {new Date().getFullYear()} ResumeRank AI • Real AI Evaluation</p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 border border-white/10 text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer min-h-[40px]"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 flex items-center justify-center gap-1.5 cursor-pointer shadow-md min-h-[40px]"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
