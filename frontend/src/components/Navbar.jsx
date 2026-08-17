import React from 'react';
import { Github, BarChart3, GitCompare, Info, Search, Coins, LogIn, LogOut, PlusCircle } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenPricing,
  onLogout
}) {
  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-github-border bg-github-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl group-hover:border-blue-500/60 transition-colors">
              <Github className="w-6 h-6 text-blue-400 group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                GitHub Profile <span className="text-blue-400">Analyzer</span>
              </span>
              <span className="hidden sm:block text-xs text-github-muted">Developer Intelligence Dashboard</span>
            </div>
          </div>

          {/* Navigation Items & Auth/Credit Controls */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'home'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-github-muted hover:text-white hover:bg-github-card'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Search</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-github-muted hover:text-white hover:bg-github-card'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'compare'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-github-muted hover:text-white hover:bg-github-card'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden md:inline">Compare</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'about'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-github-muted hover:text-white hover:bg-github-card'
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="hidden md:inline">About</span>
            </button>

            {/* Auth / Credit Controls */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-github-border">
                {/* Credit Badge */}
                <button
                  onClick={onOpenPricing}
                  title="Buy Credits (1,000 Credits for ₹100)"
                  className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-sm group"
                >
                  <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>{user.credits.toLocaleString()} 🪙</span>
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400 opacity-70 group-hover:opacity-100" />
                </button>

                {/* User Info Pill */}
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-github-card rounded-xl border border-github-border text-xs">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium text-white truncate max-w-[100px]">{user.name}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="p-2 text-github-muted hover:text-rose-400 rounded-xl hover:bg-github-card transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('signup')}
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-lg shadow-blue-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In (+100 🪙)</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}
