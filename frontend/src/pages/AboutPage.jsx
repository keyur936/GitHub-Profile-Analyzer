import React from 'react';
import { Info, Shield, Code, Server, Zap, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8 px-4">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold">
          <Info className="w-4 h-4" /> About GitHub Profile Analyzer
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Transparency & Methodology
        </h1>
        <p className="text-github-muted text-sm sm:text-base leading-relaxed">
          Learn how GitHub Profile Analyzer fetches public data, calculates language stats, and computes developer metrics.
        </p>
      </div>

      <div className="space-y-6">
        
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-github-border space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Official GitHub REST API Integration</h2>
          </div>
          <p className="text-xs sm:text-sm text-github-text leading-relaxed">
            GitHub Profile Analyzer exclusively queries official, publicly accessible GitHub REST API endpoints (<code className="text-blue-400 font-mono">/users</code>, <code className="text-blue-400 font-mono">/users/.../repos</code>, <code className="text-blue-400 font-mono">/events/public</code>). It respects GitHub guidelines, handles pagination up to 100 items per page to retrieve all public repositories, and does NOT scrape HTML pages or request user credentials.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-github-border space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">GitHub Activity Score (0–100)</h2>
          </div>
          <p className="text-xs sm:text-sm text-github-text leading-relaxed">
            The developer activity score is an <strong>application-generated metric</strong> designed to evaluate public impact, community engagement, language versatility, and recent contribution activity. It combines 5 key factors:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-github-muted pl-4 border-l-2 border-purple-500/40">
            <li>• <strong>Star Impact (25 pts)</strong>: Logarithmic scale based on total stars received.</li>
            <li>• <strong>Community Engagement (20 pts)</strong>: Based on repository forks and follower count.</li>
            <li>• <strong>Portfolio Output (20 pts)</strong>: Count of original public projects created.</li>
            <li>• <strong>Public Event Activity (20 pts)</strong>: Based on public commits, PRs, issues, and creations.</li>
            <li>• <strong>Language Versatility (15 pts)</strong>: Diversity of programming languages used.</li>
          </ul>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-github-border space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Rate Limits & In-Memory Caching</h2>
          </div>
          <p className="text-xs sm:text-sm text-github-text leading-relaxed">
            To prevent hitting GitHub API rate limits (60 unauthenticated requests/hr or 5,000 authenticated requests/hr), the Flask backend implements an in-memory TTL caching layer. Analyzed profiles are cached for 5 minutes (300s).
          </p>
        </div>

      </div>

    </div>
  );
}
