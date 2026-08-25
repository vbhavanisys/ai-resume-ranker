import React, { useState } from 'react';
import { PageType } from '../types';
import { Sparkles, FileText, ArrowLeft, ArrowRight, Layers, Building2, Briefcase } from 'lucide-react';

interface JobDescriptionPageProps {
  onNavigate: (page: PageType) => void;
  jobDescriptionText: string;
  setJobDescriptionText: (text: string) => void;
  uploadedFileName: string;
  onAnalyze: () => void;
}

export const JobDescriptionPage: React.FC<JobDescriptionPageProps> = ({
  onNavigate,
  jobDescriptionText,
  setJobDescriptionText,
  uploadedFileName,
  onAnalyze,
}) => {
  const [jobTitle, setJobTitle] = useState('Senior Frontend Developer');
  const [companyName, setCompanyName] = useState('TechCorp');

  const presetJDs = [
    {
      title: 'Senior Frontend Developer (React, TS)',
      company: 'TechCorp',
      text: `We are looking for a Senior Frontend Developer with 3+ years of experience in React, TypeScript, Tailwind CSS, Node.js, and GraphQL. Responsibilities include building scalable web UIs, optimizing performance, writing unit tests with Jest, and implementing CI/CD pipelines.`
    },
    {
      title: 'Full Stack Java Engineer',
      company: 'Acme Corp',
      text: `Seeking a Full Stack Engineer proficient in Java, Spring Boot, Microservices, PostgreSQL, and React. Must have hands-on experience with Docker, AWS cloud infrastructure, and RESTful API design.`
    },
    {
      title: 'Product Manager',
      company: 'Startup Inc',
      text: `Requirements: 2+ years in software product management. Experience writing user stories, managing Agile sprints in Jira, performing A/B testing, and utilizing analytics tools like Mixpanel.`
    }
  ];

  const handleApplyPreset = (preset: typeof presetJDs[0]) => {
    setJobTitle(preset.title);
    setCompanyName(preset.company);
    setJobDescriptionText(preset.text);
  };

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">Provide Target Job Description</h1>
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
          Step 2 of Analysis: Paste the target role description to generate keyword matching and skill gap recommendations.
        </p>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-xl p-4 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
        {/* File status badge */}
        <div className="bg-indigo-500/10 p-3 sm:p-3.5 rounded-lg border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium break-all">
            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Active Resume File: <strong className="text-white">{uploadedFileName || 'Senior_Frontend_Eng_Alex.pdf'}</strong></span>
          </div>
          <button
            onClick={() => onNavigate('upload')}
            className="text-xs text-indigo-400 font-bold underline hover:text-indigo-300 transition-colors cursor-pointer self-end sm:self-auto min-h-[32px] flex items-center"
          >
            Change File
          </button>
        </div>

        {/* Form fields for job details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Company / Organization
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. TechCorp"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> Quick Sample Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {presetJDs.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-indigo-300 transition-colors cursor-pointer min-h-[38px] flex items-center"
              >
                + {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Textarea */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Job Description Details
            </label>
            <span className="text-xs text-white/40 font-mono">
              {jobDescriptionText.length} chars
            </span>
          </div>
          <textarea
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
            placeholder="Paste the full job post requirements, required skills, tools, and experience level..."
            rows={8}
            className="w-full p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder:text-white/30 transition-colors leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full sm:w-auto py-2 text-sm font-medium text-white/60 hover:text-white flex items-center justify-center sm:justify-start gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Upload
          </button>

          <button
            onClick={onAnalyze}
            className="w-full sm:w-auto bg-indigo-600 text-white font-semibold text-sm px-8 py-3 rounded-lg hover:bg-indigo-500 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Analysis Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
