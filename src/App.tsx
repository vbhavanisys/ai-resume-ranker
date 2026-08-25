import React, { useState, useEffect } from 'react';
import { PageType, AnalysisRecord, UserProfile } from './types';
import { initialAnalysisRecords } from './data/mockData';
import { api, clearToken } from './utils/api';
import { Loader2, Sparkles, AlertTriangle, RefreshCw, X } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProfileModal } from './components/ProfileModal';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { JobDescriptionPage } from './pages/JobDescriptionPage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { AnalysisHistoryPage } from './pages/AnalysisHistoryPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    role: 'Candidate',
    isLoggedIn: false,
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [historyRecords, setHistoryRecords] = useState<AnalysisRecord[]>(initialAnalysisRecords);
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord>(initialAnalysisRecords[0]);

  const [uploadedFileName, setUploadedFileName] = useState('Senior_Frontend_Eng_Alex.pdf');
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(245760); // Default ~240 KB
  const [extractedText, setExtractedText] = useState<string>(
    `RESUME DOCUMENT: Senior_Frontend_Eng_Alex.pdf\n\nCandidate Name: Alex Developer\nEmail: alex.developer@example.com | Phone: +1 (555) 019-2834\nLocation: San Francisco, CA | LinkedIn: linkedin.com/in/alexdev\n\nPROFESSIONAL SUMMARY\nResults-driven Software Engineer with 4+ years of experience specializing in React, TypeScript, Node.js, and modern cloud web architectures. Proven track record of developing high-performance frontend interfaces and scalable RESTful APIs.\n\nTECHNICAL SKILLS\n• Frontend: React, TypeScript, Next.js, Redux, Tailwind CSS, HTML5, CSS3, JavaScript (ES6+)\n• Backend: Node.js, Express.js, REST APIs, GraphQL, PostgreSQL, MongoDB\n• Developer Tools: Git, GitHub, Docker, Jest, Vite, Webpack, Vercel`
  );
  const [jobDescriptionText, setJobDescriptionText] = useState(
    'Seeking a Senior Frontend Engineer with React, TypeScript, Tailwind CSS, Node.js, and GraphQL experience. Requirements include unit testing with Jest, microservice integrations, and agile teamwork.'
  );

  // Analysis Loading & Error states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('Initializing AI Model...');
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  // Check auth and load database history on mount
  useEffect(() => {
    async function loadInitialData() {
      setIsLoadingHistory(true);
      try {
        const currentUser = await api.getCurrentUser();
        if (currentUser && currentUser.isLoggedIn) {
          setUser(currentUser);
          setCurrentPage('dashboard');
        } else {
          setUser({ name: '', email: '', role: 'Candidate', isLoggedIn: false });
          setCurrentPage('login');
        }

        const mongoHistory = await api.getAnalysisHistory();
        if (mongoHistory) {
          setHistoryRecords(mongoHistory);
          if (mongoHistory.length > 0) {
            setSelectedRecord(mongoHistory[0]);
          }
        }
      } catch (err) {
        console.warn('Initial database load notice:', err);
        setUser({ name: '', email: '', role: 'Candidate', isLoggedIn: false });
        setCurrentPage('login');
      } finally {
        setIsLoadingHistory(false);
      }
    }
    loadInitialData();
  }, []);

  const fetchHistoryFromDb = async () => {
    setIsLoadingHistory(true);
    try {
      const records = await api.getAnalysisHistory();
      if (records) {
        setHistoryRecords(records);
        if (records.length > 0 && !selectedRecord) {
          setSelectedRecord(records[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load history from database:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleNavigate = (page: PageType) => {
    // If authenticated user tries to navigate to login or register, redirect to dashboard
    if (user.isLoggedIn && (page === 'login' || page === 'register')) {
      setCurrentPage('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Unauthenticated access guard
    const publicPages: PageType[] = ['login', 'register'];
    if (!user.isLoggedIn && !publicPages.includes(page)) {
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = async (name?: string, email?: string) => {
    setUser({
      name: name || 'Student User',
      email: email || 'student@bca.edu',
      role: 'BCA Student / Candidate',
      isLoggedIn: true,
    });
    await fetchHistoryFromDb();
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    clearToken();
    setUser({
      name: '',
      email: '',
      role: 'Candidate',
      isLoggedIn: false,
    });
    setCurrentPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    setAnalysisError(null);
    setIsAnalyzing(true);
    setAnalysisStage('Preparing Resume and Job Description...');

    try {
      // Step 1: Save Job Description
      setAnalysisStage('Saving Job Requirements to Database...');
      await api.saveJobDescription('Senior Frontend Engineer', 'TechCorp Solutions', jobDescriptionText).catch(() => {});

      // Step 2: Save Resume Text
      if (extractedText) {
        setAnalysisStage('Saving Extracted Resume Text...');
        await api.saveResumeData(uploadedFileName, extractedText, uploadedFileSize).catch(() => {});
      }

      // Step 3: Run Gemini AI Analysis
      setAnalysisStage('Running Gemini 3.6 Flash NLP Skill & Match Extraction...');
      const record = await api.runAnalysis({
        candidateName: user.name || 'Alex Developer',
        fileName: uploadedFileName || 'Senior_Frontend_Eng_Alex.pdf',
        jobTitle: 'Senior Frontend Engineer',
        companyName: 'TechCorp Solutions',
        extractedText,
        jobDescriptionText,
      });

      setAnalysisStage('Finalizing Analysis Report...');
      setHistoryRecords((prev) => [record, ...prev]);
      setSelectedRecord(record);
      
      // Short pause for UX smoothness
      setTimeout(() => {
        setIsAnalyzing(false);
        handleNavigate('analysis-result');
      }, 400);

    } catch (err: any) {
      console.error('Analysis error:', err);
      setIsAnalyzing(false);
      setAnalysisError(err.message || 'AI Analysis encountered an error. Please try again.');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await api.deleteAnalysisRecord(id).catch(() => {});
    } catch (err) {
      console.warn('Failed to delete record on backend:', err);
    }
    setHistoryRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#e0e0e0] font-sans antialiased selection:bg-indigo-600 selection:text-white relative">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Loading Modal during AI Analysis */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-[#111111] border border-indigo-500/30 rounded-2xl p-6 sm:p-10 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
              <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">AI Analysis in Progress</h3>
              <p className="text-xs sm:text-sm text-indigo-300 font-mono animate-pulse">
                {analysisStage}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-left space-y-1.5 text-xs text-white/60">
              <div className="flex items-center justify-between">
                <span>1. Parse & Tokenize Skills</span>
                <span className="text-emerald-400 font-bold">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>2. Gemini 3.6 Flash Evaluation</span>
                <span className="text-indigo-400 font-bold animate-pulse">Processing...</span>
              </div>
              <div className="flex items-center justify-between">
                <span>3. Gap & Bullet Optimization</span>
                <span className="text-white/30">Pending</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert Overlay */}
      {analysisError && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>Analysis Failed</span>
              </div>
              <button
                onClick={() => setAnalysisError(null)}
                className="text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              {analysisError}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAnalysisError(null)}
                className="px-4 py-2 border border-white/10 rounded-lg text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={handleAnalyze}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page View Router */}
      <main className="flex-grow pt-16 flex flex-col">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            historyRecords={historyRecords}
            uploadedFileName={uploadedFileName}
            setUploadedFileName={setUploadedFileName}
            uploadedFileSize={uploadedFileSize}
            setUploadedFileSize={setUploadedFileSize}
            extractedText={extractedText}
            setExtractedText={setExtractedText}
            jobDescriptionText={jobDescriptionText}
            setJobDescriptionText={setJobDescriptionText}
            onAnalyze={handleAnalyze}
            onSelectRecord={setSelectedRecord}
          />
        )}

        {currentPage === 'upload' && (
          <ResumeUploadPage
            onNavigate={handleNavigate}
            uploadedFileName={uploadedFileName}
            setUploadedFileName={setUploadedFileName}
            uploadedFileSize={uploadedFileSize}
            setUploadedFileSize={setUploadedFileSize}
            extractedText={extractedText}
            setExtractedText={setExtractedText}
          />
        )}

        {currentPage === 'job-description' && (
          <JobDescriptionPage
            onNavigate={handleNavigate}
            jobDescriptionText={jobDescriptionText}
            setJobDescriptionText={setJobDescriptionText}
            uploadedFileName={uploadedFileName}
            onAnalyze={handleAnalyze}
          />
        )}

        {currentPage === 'analysis-result' && (
          <AnalysisResultPage
            onNavigate={handleNavigate}
            selectedRecord={selectedRecord}
          />
        )}

        {currentPage === 'analysis-history' && (
          <AnalysisHistoryPage
            onNavigate={handleNavigate}
            records={historyRecords}
            onSelectRecord={setSelectedRecord}
            onDeleteRecord={handleDeleteRecord}
            isLoading={isLoadingHistory}
            onRefresh={fetchHistoryFromDb}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            historyRecords={historyRecords}
          />
        )}
      </main>

      {/* Reusable Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Profile Modal */}
      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
