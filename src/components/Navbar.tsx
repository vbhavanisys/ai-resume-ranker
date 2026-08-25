import React, { useState } from 'react';
import { PageType, UserProfile } from '../types';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  History, 
  Upload, 
  FileText, 
  BarChart3, 
  Home,
  LogIn,
  UserPlus
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  user: UserProfile;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onLogout,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const authenticatedNavItems: { label: string; page: PageType; icon: React.ReactNode }[] = [
    { label: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Analyze Resume', page: 'upload', icon: <Upload className="w-4 h-4" /> },
    { label: 'Analysis History', page: 'analysis-history', icon: <History className="w-4 h-4" /> },
    { label: 'Profile', page: 'profile', icon: <User className="w-4 h-4" /> },
  ];

  const unauthenticatedNavItems: { label: string; page: PageType; icon: React.ReactNode }[] = [
    { label: 'Login', page: 'login', icon: <LogIn className="w-4 h-4" /> },
    { label: 'Register', page: 'register', icon: <UserPlus className="w-4 h-4" /> },
  ];

  const activeNavItems = user.isLoggedIn ? authenticatedNavItems : unauthenticatedNavItems;

  return (
    <header className="bg-[#050505]/95 backdrop-blur-md fixed top-0 w-full z-50 border-b border-white/10">
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 h-16 max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick(user.isLoggedIn ? 'dashboard' : 'login')}
          className="font-bold text-lg sm:text-xl md:text-2xl text-white cursor-pointer flex items-center gap-2 sm:gap-2.5 hover:opacity-90 transition-opacity"
        >
          <img 
            src="/icon.png" 
            alt="AI Resume Ranker Icon" 
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-indigo-500/30 shadow-xs shrink-0" 
            referrerPolicy="no-referrer"
          />
          <span className="tracking-tight truncate max-w-[170px] sm:max-w-none">AI Resume <span className="text-indigo-400 font-normal italic">Ranker</span></span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
          {activeNavItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors h-10 ${
                  isActive
                    ? 'text-indigo-400 bg-white/5 font-semibold border-b-2 border-indigo-500'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Actions (Tablet & Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {user.isLoggedIn ? (
            <>
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/5 font-medium text-sm px-3 py-2 rounded-md transition-colors"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>Profile</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 px-3.5 py-2 rounded-md transition-colors shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('login')}
                className={`flex items-center gap-1.5 font-medium text-sm px-3.5 py-2 rounded-md transition-colors ${
                  currentPage === 'login'
                    ? 'text-indigo-400 bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="flex items-center gap-1.5 bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 px-4 py-2 rounded-md transition-colors shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111111] border-b border-white/10 px-4 pt-3 pb-5 space-y-1 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 py-1">
            Navigation Pages
          </div>
          {activeNavItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors text-left min-h-[44px] ${
                  isActive
                    ? 'text-indigo-400 bg-indigo-500/10 font-semibold border-l-4 border-indigo-500'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="border-t border-white/10 pt-3 mt-3 flex flex-col gap-2">
            {user.isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    onOpenProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-white/90 bg-white/5 hover:bg-white/10 font-medium text-sm py-3 rounded-lg transition-colors min-h-[44px]"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Profile ({user.name})</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium text-sm py-3 rounded-lg transition-colors min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full flex items-center justify-center gap-1.5 text-indigo-400 border border-indigo-500/30 font-medium text-sm py-2.5 rounded-lg hover:bg-white/5 transition-colors min-h-[44px]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-indigo-500 transition-colors min-h-[44px]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
