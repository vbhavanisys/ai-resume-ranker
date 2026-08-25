import React, { useState } from 'react';
import { PageType } from '../types';
import { Mail, Lock, User, UserPlus, Globe, Briefcase, Loader2, AlertTriangle, X } from 'lucide-react';
import { api } from '../utils/api';

interface RegisterPageProps {
  onNavigate: (page: PageType) => void;
  onLoginSuccess: (name?: string, email?: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service to create an account.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await api.register(fullName, email, password);
      onLoginSuccess(result.user.name, result.user.email);
      onNavigate('dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try a different email address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-6 sm:py-12 px-3 sm:px-6">
      <div className="w-full max-w-md bg-[#111111] rounded-xl shadow-2xl border border-white/10 p-5 sm:p-8">
        <div className="text-center mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Get instant access to AI resume scoring & ranking
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider" htmlFor="regFullName">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                id="regFullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Developer"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider" htmlFor="regEmail">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                id="regEmail"
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
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider" htmlFor="regPassword">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                id="regPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-indigo-500 rounded border-white/20 bg-white/5 focus:ring-indigo-500"
            />
            <label htmlFor="terms" className="text-xs text-white/60">
              I agree to the <span className="text-indigo-400 underline cursor-pointer">Terms of Service</span> and <span className="text-indigo-400 underline cursor-pointer">Privacy Policy</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 rounded-lg transition-colors mt-4 flex justify-center items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register & Start Analysis</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-white/60">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-indigo-400 font-bold hover:underline cursor-pointer"
          >
            Sign In here
          </button>
        </div>

        <div className="mt-6">
          <div className="relative flex items-center mb-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-white/40 uppercase">
              Or sign up with
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const result = await api.register('Google Student', 'google.student@bca.edu', 'google123');
                  onLoginSuccess(result.user.name, result.user.email);
                } catch {
                  onLoginSuccess('Google Student', 'google.student@bca.edu');
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
                  const result = await api.register('LinkedIn Student', 'linkedin.student@bca.edu', 'linkedin123');
                  onLoginSuccess(result.user.name, result.user.email);
                } catch {
                  onLoginSuccess('LinkedIn Student', 'linkedin.student@bca.edu');
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
