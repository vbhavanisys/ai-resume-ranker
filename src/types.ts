export type PageType = 
  | 'home' 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'upload' 
  | 'job-description' 
  | 'analysis-result' 
  | 'analysis-history'
  | 'profile';

export interface AnalysisSuggestion {
  title: string;
  description: string;
  icon?: string;
}

export interface AnalysisRecord {
  id: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  matchScore: number;
  resumeScore?: number;
  jobMatchPercentage?: number;
  skillMatchPercentage?: number;
  keywordMatchPercentage?: number;
  date: string;
  fileType: 'pdf' | 'docx';
  fileName: string;
  status: 'High Match' | 'Moderate Match' | 'Low Match';
  technicalSkills?: string[];
  softSkills?: string[];
  education?: string[];
  experience?: string[];
  projects?: string[];
  certifications?: string[];
  keywords?: string[];
  matchedSkills: string[];
  missingSkills: string[];
  strengths?: string[];
  weaknesses?: string[];
  suggestions: AnalysisSuggestion[];
  originalBullet?: string;
  optimizedBullet?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
}
