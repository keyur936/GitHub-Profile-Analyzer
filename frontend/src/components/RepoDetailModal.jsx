import React from 'react';
import { X, ExternalLink, Star, GitFork, Eye, AlertCircle, Calendar, Shield, GitBranch, HardDrive, Tag } from 'lucide-react';
import { getLanguageColor, formatDate, formatNumber, formatSize } from '../utils/helpers';

export default function RepoDetailModal({ repo, onClose }) {
  if (!repo) return null;

  const langColor = getLanguageColor(repo.language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-github-card border border-github-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-github-muted hover:text-white rounded-xl bg-github-dark/50 hover:bg-github-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: langColor }} />
            <span className="text-xs font-semibold text-github-muted uppercase tracking-wider">{repo.language || 'Other'}</span>
            {repo.fork && (
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] rounded-md font-medium">
                Forked
              </span>
            )}
            {repo.archived && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] rounded-md font-medium">
                Archived
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {repo.name}
          </h2>

          <p className="text-github-text text-sm leading-relaxed">
            {repo.description || 'No description provided.'}
          </p>

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {repo.topics.map(topic => (
                <span key={topic} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-github-dark/50 p-4 rounded-xl border border-github-border/60">
          <div className="space-y-1">
            <div className="text-xs text-github-muted flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Stars
            </div>
            <div className="text-lg font-bold text-white font-mono">{formatNumber(repo.stargazers_count)}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-github-muted flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-purple-400" /> Forks
            </div>
            <div className="text-lg font-bold text-white font-mono">{formatNumber(repo.forks_count)}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-github-muted flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Open Issues
            </div>
            <div className="text-lg font-bold text-white font-mono">{formatNumber(repo.open_issues_count)}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-github-muted flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-sky-400" /> Watchers
            </div>
            <div className="text-lg font-bold text-white font-mono">{formatNumber(repo.watchers_count)}</div>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-github-muted border-t border-github-border/60 pt-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Created: <strong className="text-white">{formatDate(repo.created_at)}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Last Updated: <strong className="text-white">{formatDate(repo.updated_at)}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <span>Default Branch: <strong className="text-white">{repo.default_branch || 'main'}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>License: <strong className="text-white">{repo.license}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-sky-400" />
            <span>Size: <strong className="text-white">{formatSize(repo.size)}</strong></span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-github-border/60 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-github-dark hover:bg-github-border text-github-text text-sm font-medium rounded-xl transition-colors"
          >
            Close
          </button>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <span>Open Repository on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
