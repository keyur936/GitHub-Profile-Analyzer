import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';

export default function SearchBar({ onSearch, initialValue = '', isLoading = false, compact = false }) {
  const [input, setInput] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const handleQuickSample = (username) => {
    setInput(username);
    onSearch(username);
  };

  return (
    <div className={`w-full ${compact ? 'max-w-2xl' : 'max-w-3xl'} mx-auto`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden glass-panel border border-github-border group-focus-within:border-blue-500/80 transition-all duration-300">
          
          <div className="pl-4 sm:pl-6 text-github-muted group-focus-within:text-blue-400 transition-colors">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter GitHub profile URL or username (e.g. github.com/torvalds or torvalds)..."
            className="w-full py-4 sm:py-5 px-3 sm:px-4 bg-transparent text-white placeholder-github-muted text-sm sm:text-base focus:outline-none"
            disabled={isLoading}
          />

          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="p-2 text-github-muted hover:text-white transition-colors mr-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="mr-2 sm:mr-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 whitespace-nowrap"
          >
            <span>{isLoading ? 'Analyzing...' : 'Analyze Profile'}</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          </button>
        </div>
      </form>

      {!compact && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-github-muted">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Try popular profiles:
          </span>
          {['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'].map((sample) => (
            <button
              key={sample}
              onClick={() => handleQuickSample(sample)}
              className="px-2.5 py-1 bg-github-card hover:bg-github-border text-github-text hover:text-blue-400 rounded-md border border-github-border transition-colors"
            >
              @{sample}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
