import React from 'react';
import SearchBar from '../components/SearchBar';
import RecentlyAnalyzed from '../components/RecentlyAnalyzed';
import { BarChart3, Code2, Sparkles, FolderGit2, ShieldCheck, Activity, Trophy, Search, Cpu } from 'lucide-react';

export default function HomePage({ onSearch, onSelectRecent }) {
  return (
    <div className="space-y-20 py-8 sm:py-12">
      
      {/* Hero Section */}
      <div className="relative text-center space-y-8 max-w-4xl mx-auto px-4">
        {/* Decorative Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official GitHub REST API Integration</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            GitHub Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-sky-400">Analyzer</span>
          </h1>

          <p className="text-lg sm:text-xl text-github-muted max-w-2xl mx-auto leading-relaxed">
            Turn any public GitHub profile into a detailed developer report.
          </p>
        </div>

        {/* Hero Search Box */}
        <div className="pt-4">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Recently Analyzed Section */}
        <div className="pt-6">
          <RecentlyAnalyzed onSelectProfile={onSelectRecent} />
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Comprehensive Developer Analytics
          </h2>
          <p className="text-github-muted text-sm sm:text-base">
            Everything you need to evaluate public developer impact, code distribution, and projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-github-border space-y-3 hover:border-blue-500/50 transition-all group">
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl w-fit">
              <FolderGit2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              Complete Profile Analysis
            </h3>
            <p className="text-xs sm:text-sm text-github-muted leading-relaxed">
              Fetches followers, public repos, bio, account age, location, and total gists directly from GitHub.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-github-border space-y-3 hover:border-purple-500/50 transition-all group">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl w-fit">
              <Code2 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
              Language Analytics
            </h3>
            <p className="text-xs sm:text-sm text-github-muted leading-relaxed">
              Interactive Donut chart breakdown showing language usage percentages across all public repositories.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-github-border space-y-3 hover:border-amber-500/50 transition-all group">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl w-fit">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              Repository Ranking
            </h3>
            <p className="text-xs sm:text-sm text-github-muted leading-relaxed">
              Ranks top projects by star impact, forks, and recency with searchable & filterable repo explorer.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-github-border space-y-3 hover:border-emerald-500/50 transition-all group">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl w-fit">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              Activity Insights
            </h3>
            <p className="text-xs sm:text-sm text-github-muted leading-relaxed">
              Timeline feed of recent public commits, PRs, issues, repository creations, and starred projects.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-github-border space-y-3 hover:border-sky-500/50 transition-all group">
            <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl w-fit">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
              Developer Activity Score
            </h3>
            <p className="text-xs sm:text-sm text-github-muted leading-relaxed">
              Transparent 0-100 evaluation metric with explicit disclaimer and individual factor breakdown.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-github-border space-y-3 hover:border-rose-500/50 transition-all group">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl w-fit">
              <Cpu className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
              Compare & PDF Export
            </h3>
            <p className="text-xs sm:text-sm text-github-muted leading-relaxed">
              Compare two profiles head-to-head or download a clean PDF report of any developer profile.
            </p>
          </div>

        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-github-border space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">How It Works</h2>
            <p className="text-github-muted text-sm">Four simple steps to generate a developer report</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3 p-4 bg-github-card/40 rounded-2xl border border-github-border/60">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center mx-auto text-lg shadow-lg">
                1
              </div>
              <h3 className="text-base font-bold text-white">Enter Input</h3>
              <p className="text-xs text-github-muted">Paste a GitHub URL or enter any public username.</p>
            </div>

            <div className="space-y-3 p-4 bg-github-card/40 rounded-2xl border border-github-border/60">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center mx-auto text-lg shadow-lg">
                2
              </div>
              <h3 className="text-base font-bold text-white">Fetch Data</h3>
              <p className="text-xs text-github-muted">Flask backend queries official GitHub REST APIs with pagination.</p>
            </div>

            <div className="space-y-3 p-4 bg-github-card/40 rounded-2xl border border-github-border/60">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center mx-auto text-lg shadow-lg">
                3
              </div>
              <h3 className="text-base font-bold text-white">Process Metrics</h3>
              <p className="text-xs text-github-muted">Computes language distribution, insights, charts, and activity score.</p>
            </div>

            <div className="space-y-3 p-4 bg-github-card/40 rounded-2xl border border-github-border/60">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center mx-auto text-lg shadow-lg">
                4
              </div>
              <h3 className="text-base font-bold text-white">View Dashboard</h3>
              <p className="text-xs text-github-muted">Explore interactive charts, repositories, timeline, or export PDF.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
