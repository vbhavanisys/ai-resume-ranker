import React, { useState, useRef } from 'react';
import { PageType } from '../types';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ArrowRight,
  X,
  Info,
  AlertTriangle,
  Copy,
  Check,
  Edit3,
  Loader2,
  Trash2,
  RefreshCw,
  FileCode
} from 'lucide-react';
import { extractResumeText, formatFileSize } from '../utils/resumeExtractor';

interface ResumeUploadPageProps {
  onNavigate: (page: PageType) => void;
  uploadedFileName: string;
  setUploadedFileName: (name: string) => void;
  uploadedFileSize: number;
  setUploadedFileSize: (size: number) => void;
  extractedText: string;
  setExtractedText: (text: string) => void;
}

export const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({
  onNavigate,
  uploadedFileName,
  setUploadedFileName,
  uploadedFileSize,
  setUploadedFileSize,
  extractedText,
  setExtractedText,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [candidateName, setCandidateName] = useState('Alex Developer');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload Progress & Extraction state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState('');

  // Extracted text UI state
  const [isEditingText, setIsEditingText] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = async (file: File) => {
    setErrorMessage(null);

    // Validate file size (25 MB limit)
    const maxSizeInBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorMessage(
        `File size (${formatFileSize(file.size)}) exceeds the 25MB limit. Please choose a smaller file.`
      );
      return;
    }

    // Start progress simulation & text extraction
    setIsProcessing(true);
    setProgressPercent(15);
    setProgressStage(`Validating ${file.name}...`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgressPercent(45);
      setProgressStage('Reading document structure...');

      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgressPercent(75);
      setProgressStage('Extracting text and technical keywords...');

      const result = await extractResumeText(file);

      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgressPercent(100);
      setProgressStage('Extraction complete!');

      if (result.success && result.text) {
        setUploadedFileName(file.name);
        setUploadedFileSize(file.size);
        setExtractedText(result.text);
      } else {
        setErrorMessage(result.error || 'Failed to extract text from document.');
      }
    } catch (err) {
      console.error('File extraction error:', err);
      setErrorMessage('An unexpected error occurred while parsing the file.');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgressPercent(0);
        setProgressStage('');
      }, 400);
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

  const handleCopyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = extractedText ? extractedText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = extractedText ? extractedText.length : 0;

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">
          Upload Resume Document
        </h1>
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
          Step 1 of Analysis: Upload a PDF or DOCX file to extract text content, work history, and technical skills.
        </p>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-xl p-4 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
        {/* Candidate Info Optional Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Candidate Name
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Alex Developer"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Supported File Formats
            </label>
            <div className="px-3.5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs sm:text-sm text-indigo-300 font-medium flex items-center justify-between">
              <span>All Document Types (PDF, Word, TXT, MD, RTF, etc.)</span>
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* Error Message Banner */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 sm:p-4 rounded-xl flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-300">File Validation Error</h4>
                <p className="text-xs text-rose-200/80 mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 transition-colors cursor-pointer p-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Zone / Active File State */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => {
            if (!isProcessing) fileInputRef.current?.click();
          }}
          className={`border-2 border-dashed rounded-xl p-5 sm:p-10 flex flex-col items-center justify-center text-center transition-all min-h-[220px] sm:min-h-[260px] relative ${
            isProcessing
              ? 'border-indigo-500/60 bg-indigo-500/5 cursor-wait'
              : isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : uploadedFileName
              ? 'border-emerald-500/40 bg-emerald-500/10'
              : 'border-white/15 bg-white/5 hover:bg-white/10 cursor-pointer'
          }`}
        >
          {isProcessing ? (
            /* Upload & Extraction Progress State */
            <div className="w-full max-w-md space-y-4 py-4">
              <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto animate-spin">
                <Loader2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-white">Extracting Resume Content...</h3>
                <p className="text-xs text-indigo-300 font-mono">{progressStage}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-white/50 font-mono">{progressPercent}%</p>
            </div>
          ) : uploadedFileName ? (
            /* Selected File Card State */
            <div className="space-y-4 w-full">
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-400 mx-auto" />
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white break-all px-2">{uploadedFileName}</h3>
                <p className="text-xs text-emerald-400 font-medium mt-1">
                  File Uploaded & Verified • {formatFileSize(uploadedFileSize)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2 max-w-xs mx-auto sm:max-w-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold hover:bg-indigo-600/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change File</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white/5 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-semibold hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove File</span>
                </button>
              </div>
            </div>
          ) : (
            /* Dropzone Default State */
            <>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 px-2">
                Drag and drop your resume file here
              </h3>
              <p className="text-xs sm:text-sm text-white/50 mb-5 max-w-sm px-2">
                Supports all document formats (PDF, Word, TXT, MD, RTF, etc.) up to 25MB.
              </p>
              <button
                type="button"
                className="bg-indigo-600 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-indigo-500 transition-colors shadow-md cursor-pointer min-h-[44px] w-full sm:w-auto max-w-xs"
              >
                Browse File
              </button>
            </>
          )}

          <input
            ref={fileInputRef}
            id="upload-page-input"
            type="file"
            accept="*/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Extracted Resume Text Display Section */}
        {extractedText && !isProcessing && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400 shrink-0" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Extracted Resume Content
                </h3>
                <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  {wordCount} words
                </span>
                <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded bg-white/5 text-white/50 font-mono">
                  {charCount} chars
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingText(!isEditingText)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px] ${
                    isEditingText
                      ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingText ? 'Lock Preview' : 'Edit Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3 py-2 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {isEditingText ? (
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={10}
                className="w-full p-3 sm:p-4 bg-white/5 border border-indigo-500/40 rounded-xl text-xs sm:text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y break-words"
                placeholder="Parsed resume text content..."
              />
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 max-h-64 overflow-y-auto text-xs sm:text-sm font-mono text-white/80 leading-relaxed whitespace-pre-wrap break-words selection:bg-indigo-600 selection:text-white">
                {extractedText}
              </div>
            )}
          </div>
        )}

        {/* Tip / Info Banner */}
        <div className="bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/10 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/60 leading-relaxed">
            <strong className="text-white">Tip:</strong> The extracted text above will be used to analyze keyword density, skill matches, and ATS formatting score against the target Job Description in Step 2.
          </p>
        </div>

        {/* Footer Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto py-2 text-sm font-medium text-white/60 hover:text-white transition-colors cursor-pointer text-center sm:text-left"
          >
            ← Back to Dashboard
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              disabled={isProcessing}
              onClick={() => {
                if (!uploadedFileName) {
                  setUploadedFileName('Alex_Developer_Resume.pdf');
                  setUploadedFileSize(245760);
                }
                onNavigate('job-description');
              }}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              <span>Next: Add Job Description</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
