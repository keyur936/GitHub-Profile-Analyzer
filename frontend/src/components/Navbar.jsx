import React from 'react';
import { Github, BarChart3, GitCompare, Info, Search } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onQuickSearch }) {
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

          {/* Navigation Items */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'home'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-github-muted hover:text-white hover:bg-github-card'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
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
              <span>Analyzer</span>
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
              <span>Compare</span>
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
              <span>About</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
