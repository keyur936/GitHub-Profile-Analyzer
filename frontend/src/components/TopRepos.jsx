import React from 'react';
import { Trophy, Star, GitFork, ExternalLink, Calendar, Shield } from 'lucide-react';
import { getLanguageColor, formatDate, formatNumber } from '../utils/helpers';

export default function TopRepos({ repos, onSelectRepo }) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-github-border space-y-6">
      
      <div className="flex items-center space-x-3 border-b border-github-border pb-4">
        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Top Repositories</h2>
          <p className="text-xs text-github-muted">Ranked by star engagement, forks, and overall activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.slice(0, 6).map((repo, index) => {
          const langColor = getLanguageColor(repo.language);
          return (
            <div
              key={repo.id || index}
              onClick={() => onSelectRepo && onSelectRepo(repo)}
              className="glass-card rounded-xl p-5 border border-github-border flex flex-col justify-between space-y-4 hover:border-blue-500/40 cursor-pointer group transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {repo.name}
                  </span>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-github-muted hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-github-muted line-clamp-2 leading-relaxed">
                  {repo.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-2 border-t border-github-border/40 flex items-center justify-between text-xs text-github-muted">
                
                {/* Language Tag */}
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
                  <span className="text-white font-medium">{repo.language || 'Other'}</span>
                </div>

                {/* Stars & Forks */}
                <div className="flex items-center space-x-3 font-mono">
                  <span className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{formatNumber(repo.stargazers_count)}</span>
                  </span>

                  <span className="flex items-center space-x-1 text-purple-400">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{formatNumber(repo.forks_count)}</span>
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
