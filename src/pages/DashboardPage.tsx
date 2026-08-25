import React, { useState, useRef } from 'react';
import { PageType, AnalysisRecord } from '../types';
import {
  UploadCloud,
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Trash2,
  FileCode,
  X
} from 'lucide-react';
import { extractResumeText, formatFileSize } from '../utils/resumeExtractor';

interface DashboardPageProps {
  onNavigate: (page: PageType) => void;
  historyRecords: AnalysisRecord[];
  uploadedFileName: string;
  setUploadedFileName: (name: string) => void;
  uploadedFileSize: number;
  setUploadedFileSize: (size: number) => void;
  extractedText: string;
  setExtractedText: (text: string) => void;
  jobDescriptionText: string;
  setJobDescriptionText: (text: string) => void;
  onAnalyze: () => void;
  onSelectRecord: (record: AnalysisRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  historyRecords,
  uploadedFileName,
  setUploadedFileName,
  uploadedFileSize,
  setUploadedFileSize,
  extractedText,
  setExtractedText,
  jobDescriptionText,
  setJobDescriptionText,
  onAnalyze,
  onSelectRecord,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = async (file: File) => {
    setErrorMessage(null);

    // Validate file size (25 MB limit)
    const maxSizeInBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorMessage(
        `File size (${formatFileSize(file.size)}) exceeds the 25MB limit. Please upload a smaller file.`
      );
      return;
    }

    setIsProcessing(true);
    setProgressStage(`Parsing ${file.name}...`);

    try {
      const result = await extractResumeText(file);
      if (result.success && result.text) {
        setUploadedFileName(file.name);
        setUploadedFileSize(file.size);
        setExtractedText(result.text);
      } else {
        setErrorMessage(result.error || 'Failed to extract text from document.');
      }
    } catch (err) {
      console.error('File extraction error:', err);
      setErrorMessage('An unexpected error occurred while reading the file.');
    } finally {
      setIsProcessing(false);
      setProgressStage('');
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFileName('');
    setUploadedFileSize(0);
    setExtractedText('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
      {/* Main Action Area */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">New Analysis</h1>
          <p className="text-xs sm:text-sm text-white/60">Upload a resume and provide a job description to generate an AI match score.</p>
        </div>

        <div className="bg-[#111111] rounded-xl border border-white/10 p-4 sm:p-6 shadow-2xl space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-rose-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-rose-200 cursor-pointer p-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Upload Resume */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center justify-between">
                <span>1. Upload Resume</span>
                {uploadedFileName && (
                  <span className="text-[10px] text-emerald-400 font-mono font-normal">
                    {formatFileSize(uploadedFileSize)}
                  </span>
                )}
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => {
                  if (!isProcessing) fileInputRef.current?.click();
                }}
                className={`border-2 border-dashed rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center h-full min-h-[200px] sm:min-h-[250px] transition-all relative ${
                  isProcessing
                    ? 'border-indigo-500/60 bg-indigo-500/5 cursor-wait'
                    : isDragging
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : uploadedFileName
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-white/15 bg-white/5 hover:bg-white/10 cursor-pointer'
                }`}
              >
                {isProcessing ? (
                  <div className="space-y-3 py-4">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <p className="text-xs text-indigo-300 font-mono">{progressStage}</p>
                  </div>
                ) : uploadedFileName ? (
                  <div className="space-y-3 w-full">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white break-all px-2">{uploadedFileName}</p>
                      <p className="text-xs text-emerald-400 font-medium mt-0.5">
                        {formatFileSize(uploadedFileSize)} • Text Extracted
                      </p>
                    </div>

                    <div className="flex justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="text-xs bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-md hover:bg-indigo-600/30 transition-colors flex items-center gap-1 cursor-pointer min-h-[36px]"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Change</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="text-xs bg-white/5 border border-rose-500/30 text-rose-400 px-3 py-1.5 rounded-md hover:bg-rose-500/10 transition-colors flex items-center gap-1 cursor-pointer min-h-[36px]"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-white/40 mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-white mb-1">Drag & drop your file here</p>
                    <p className="text-xs text-white/50 mb-3">or click to browse (All Document Types)</p>
                    <span className="bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold text-xs px-4 py-2 rounded-lg hover:bg-indigo-600/50 transition-colors min-h-[36px] inline-flex items-center">
                      Select File
                    </span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  id="dash-file-input"
                  type="file"
                  accept="*/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Step 2: Job Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                2. Job Description
              </label>
              <textarea
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                placeholder="Paste the full job description here (e.g. required skills, responsibilities, technical keywords)..."
                className="w-full h-full min-h-[200px] sm:min-h-[250px] p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none text-sm text-white placeholder:text-white/30 transition-colors leading-relaxed"
              />
            </div>
          </div>

          {/* Extracted Text Quick Preview if available */}
          {extractedText && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Extracted Resume Text Preview</span>
                </span>
                <button
                  onClick={() => onNavigate('upload')}
                  className="text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  Full View / Edit →
                </button>
              </div>
              <p className="text-xs font-mono text-white/70 line-clamp-2 break-words">
                {extractedText}
              </p>
            </div>
          )}

          {/* Analyze Button */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => onNavigate('job-description')}
              className="text-xs text-indigo-400 hover:underline font-medium flex items-center gap-1 cursor-pointer py-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Or use dedicated Job Description form</span>
            </button>
            
            <button
              onClick={onAnalyze}
              className="w-full sm:w-auto bg-indigo-600 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-indigo-500 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analyze Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Recent Analyses */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">Recent Analyses</h2>
        
        <div className="flex flex-col gap-3">
          {historyRecords.slice(0, 3).map((record) => (
            <div
              key={record.id}
              onClick={() => {
                onSelectRecord(record);
                onNavigate('analysis-result');
              }}
              className="bg-[#111111] border border-white/10 hover:border-white/20 rounded-xl p-3.5 sm:p-4 shadow-md transition-all cursor-pointer flex justify-between items-center group"
            >
              <div className="flex flex-col pr-2 min-w-0">
                <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-indigo-400 transition-colors truncate">
                  {record.fileName}
                </span>
                <span className="text-[11px] sm:text-xs text-white/50 mt-0.5 truncate">
                  {record.companyName} • {record.date}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <div 
                  className={`w-2.5 h-2.5 rounded-full ${
                    record.matchScore >= 80 
                      ? 'bg-emerald-400' 
                      : record.matchScore >= 70 
                      ? 'bg-amber-400' 
                      : 'bg-rose-400'
                  }`}
                ></div>
                <span className={`font-mono text-xs sm:text-sm font-bold ${
                  record.matchScore >= 80 
                    ? 'text-emerald-400' 
                    : record.matchScore >= 70 
                    ? 'text-amber-400' 
                    : 'text-rose-400'
                }`}>
                  {record.matchScore}%
                </span>
              </div>
            </div>
          ))}

          <button
            onClick={() => onNavigate('analysis-history')}
            className="text-indigo-400 font-semibold text-xs sm:text-sm text-center mt-1 hover:underline flex items-center justify-center gap-1.5 py-2.5 cursor-pointer min-h-[44px]"
          >
            <span>View All History ({historyRecords.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
