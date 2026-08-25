import React, { useState } from 'react';
import { PageType } from '../types';
import { Mail, Lock, ArrowRight, User, Globe, Briefcase, Loader2, AlertTriangle, X } from 'lucide-react';
import { api } from '../utils/api';

interface LoginPageProps {
  onNavigate: (page: PageType) => void;
  onLoginSuccess: (name?: string, email?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('bhavani.v1013@gmail.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const result = await api.login(email, password);
        onLoginSuccess(result.user.name, result.user.email);
        onNavigate('dashboard');
      } else {
        const result = await api.register(fullName || 'New Candidate', email, password);
        onLoginSuccess(result.user.name, result.user.email);
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-6 sm:py-12 px-3 sm:px-6">
      <div className="w-full max-w-md bg-[#111111] rounded-xl shadow-2xl border border-white/10 p-5 sm:p-8">
        <div className="text-center mb-5 sm:mb-6">
          <div className="flex justify-center mb-3">
            <img 
              src="/icon.png" 
              alt="AI Resume Ranker Logo" 
              className="w-12 h-12 rounded-xl border border-indigo-500/30 shadow-lg object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            {activeTab === 'login'
              ? 'Sign in to continue to AI Resume Ranker'
              : 'Join AI Resume Ranker today'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex mb-6 border-b border-white/10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 font-medium text-sm text-center transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 font-medium text-sm text-center transition-colors cursor-pointer ${
              activeTab === 'signup'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 cursor-pointer p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Developer"
                  required={activeTab === 'signup'}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              {activeTab === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset request logged for ' + email)}
                  className="text-xs text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 rounded-lg transition-colors mt-6 flex justify-center items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center mb-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-white/40 uppercase">
              Or continue with
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const result = await api.login('google.user@example.com', 'google123');
                  onLoginSuccess(result.user.name, result.user.email);
                } catch {
                  onLoginSuccess('Google Candidate', 'google.user@example.com');
                }
                onNavigate('dashboard');
              }}
              className="flex justify-center items-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs font-semibold text-white cursor-pointer"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  const result = await api.login('linkedin.user@example.com', 'linkedin123');
                  onLoginSuccess(result.user.name, result.user.email);
                } catch {
                  onLoginSuccess('LinkedIn Candidate', 'linkedin.user@example.com');
                }
                onNavigate('dashboard');
              }}
              className="flex justify-center items-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs font-semibold text-white cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>LinkedIn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
