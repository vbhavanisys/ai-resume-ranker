import { AnalysisRecord, UserProfile } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function getToken(): string | null {
  return localStorage.getItem('resumerank_token');
}

export function setToken(token: string) {
  localStorage.setItem('resumerank_token', token);
}

export function clearToken() {
  localStorage.removeItem('resumerank_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, { ...options, headers });
    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = json.message || json.error || `HTTP ${response.status}: Request failed`;
      throw new Error(errorMsg);
    }

    return json as T;
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const token = res.data?.token || '';
    const userData = res.data?.user;

    if (token) {
      setToken(token);
    }

    return {
      token,
      user: {
        name: userData?.name || 'Candidate User',
        email: userData?.email || email,
        role: userData?.role || 'BCA Student / Candidate',
        isLoggedIn: true,
      },
    };
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName: name, name, email, password }),
    });

    const token = res.data?.token || '';
    const userData = res.data?.user;

    if (token) {
      setToken(token);
    }

    return {
      token,
      user: {
        name: userData?.name || name || 'Registered Candidate',
        email: userData?.email || email,
        role: userData?.role || 'BCA Student / Candidate',
        isLoggedIn: true,
      },
    };
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const token = getToken();
    if (!token) return null;

    try {
      const res = await request<AuthResponse>('/auth/me');
      const u = res.data?.user;
      if (!u) return null;

      return {
        name: u.name,
        email: u.email,
        role: u.role || 'BCA Student / Candidate',
        isLoggedIn: true,
      };
    } catch {
      clearToken();
      return null;
    }
  },

  // Resume Upload
  async uploadResumeFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return request<{ success: boolean; data: any }>('/upload/resume', {
      method: 'POST',
      body: formData,
    });
  },

  async saveResumeData(fileName: string, extractedText: string, fileSize: number) {
    return request<{ success: boolean; data: any }>('/upload/resume', {
      method: 'POST',
      body: JSON.stringify({ fileName, extractedText, fileSize }),
    });
  },

  // Job Description
  async saveJobDescription(jobTitle: string, companyName: string, jobDescriptionText: string) {
    return request<{ success: boolean; data: any }>('/job/description', {
      method: 'POST',
      body: JSON.stringify({ jobTitle, companyName, jobDescriptionText }),
    });
  },

  // Resume Analysis
  async runAnalysis(payload: {
    candidateName?: string;
    fileName?: string;
    jobTitle?: string;
    companyName?: string;
    extractedText?: string;
    jobDescriptionText?: string;
    resumeId?: string;
    jobId?: string;
  }): Promise<AnalysisRecord> {
    const res = await request<{ success: boolean; data: any }>('/analysis/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const doc = res.data || {};
    const score = doc.jobMatchPercentage ?? doc.matchScore ?? doc.resumeScore ?? 80;

    return {
      id: doc.id || doc._id || `ana-${Date.now()}`,
      candidateName: doc.candidateName || payload.candidateName || 'Candidate',
      jobTitle: doc.jobTitle || payload.jobTitle || 'Target Role',
      companyName: doc.companyName || payload.companyName || 'Target Company',
      matchScore: score,
      resumeScore: doc.resumeScore ?? score,
      jobMatchPercentage: doc.jobMatchPercentage ?? score,
      skillMatchPercentage: doc.skillMatchPercentage ?? score,
      keywordMatchPercentage: doc.keywordMatchPercentage ?? score,
      date: doc.date || 'Today',
      fileType: (doc.fileName || payload.fileName || '').endsWith('.docx') ? 'docx' : 'pdf',
      fileName: doc.fileName || payload.fileName || 'Uploaded_Resume.pdf',
      status: score >= 80 ? 'High Match' : score >= 70 ? 'Moderate Match' : 'Low Match',
      technicalSkills: doc.technicalSkills || [],
      softSkills: doc.softSkills || [],
      education: doc.education || [],
      experience: doc.experience || [],
      projects: doc.projects || [],
      certifications: doc.certifications || [],
      keywords: doc.keywords || [],
      matchedSkills: doc.matchedSkills || [],
      missingSkills: doc.missingSkills || [],
      strengths: doc.strengths || [],
      weaknesses: doc.weaknesses || [],
      suggestions: doc.suggestions || [],
      originalBullet: doc.originalBullet || '',
      optimizedBullet: doc.optimizedBullet || '',
    };
  },

  // Analysis History
  async getAnalysisHistory(): Promise<AnalysisRecord[]> {
    const res = await request<{ success: boolean; data: AnalysisRecord[] }>('/history');
    const list = res.data || [];
    return list.map((doc: any) => {
      const score = doc.jobMatchPercentage ?? doc.matchScore ?? doc.resumeScore ?? 75;
      return {
        id: doc.id || doc._id,
        candidateName: doc.candidateName || 'Candidate',
        jobTitle: doc.jobTitle || 'Target Role',
        companyName: doc.companyName || 'Target Company',
        matchScore: score,
        resumeScore: doc.resumeScore ?? score,
        jobMatchPercentage: doc.jobMatchPercentage ?? score,
        skillMatchPercentage: doc.skillMatchPercentage ?? score,
        keywordMatchPercentage: doc.keywordMatchPercentage ?? score,
        date: doc.date || 'Recently',
        fileType: (doc.fileName || '').endsWith('.docx') ? 'docx' : 'pdf',
        fileName: doc.fileName || 'Resume.pdf',
        status: score >= 80 ? 'High Match' : score >= 70 ? 'Moderate Match' : 'Low Match',
        technicalSkills: doc.technicalSkills || [],
        softSkills: doc.softSkills || [],
        education: doc.education || [],
        experience: doc.experience || [],
        projects: doc.projects || [],
        certifications: doc.certifications || [],
        keywords: doc.keywords || [],
        matchedSkills: doc.matchedSkills || [],
        missingSkills: doc.missingSkills || [],
        strengths: doc.strengths || [],
        weaknesses: doc.weaknesses || [],
        suggestions: doc.suggestions || [],
        originalBullet: doc.originalBullet,
        optimizedBullet: doc.optimizedBullet,
      };
    });
  },

  async deleteAnalysisRecord(id: string) {
    return request<{ success: boolean; message?: string }>(`/history/${id}`, {
      method: 'DELETE',
    });
  },

  // Dashboard Stats
  async getDashboardStats() {
    return request<{ success: boolean; data: any }>('/dashboard/stats');
  },
};
