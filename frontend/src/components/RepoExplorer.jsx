import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Star, GitFork, Eye, Archive, GitPullRequest, ExternalLink, Code2 } from 'lucide-react';
import { getLanguageColor, formatDate, formatNumber, formatSize } from '../utils/helpers';

export default function RepoExplorer({ repos, onSelectRepo }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [repoTypeFilter, setRepoTypeFilter] = useState('all'); // all, original, forked, archived
  const [sortBy, setSortBy] = useState('stars'); // stars, forks, updated, created, size, name

  // Extract unique languages
  const availableLanguages = useMemo(() => {
    if (!repos) return ['All'];
    const langs = new Set();
    repos.forEach(r => {
      if (r.language) langs.add(r.language);
    });
    return ['All', ...Array.from(langs).sort()];
  }, [repos]);

  // Filter and sort repos
  const filteredRepos = useMemo(() => {
    if (!repos) return [];

    return repos.filter(repo => {
      // 1. Search text match
      const matchesSearch = 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Language match
      const matchesLanguage = 
        selectedLanguage === 'All' || repo.language === selectedLanguage;

      // 3. Repo Type match
      let matchesType = true;
      if (repoTypeFilter === 'original') matchesType = !repo.fork;
      else if (repoTypeFilter === 'forked') matchesType = repo.fork;
      else if (repoTypeFilter === 'archived') matchesType = repo.archived;

      return matchesSearch && matchesLanguage && matchesType;
    }).sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'forks') return b.forks_count - a.forks_count;
      if (sortBy === 'updated') return new Date(b.updated_at) - new Date(a.updated_at);
      if (sortBy === 'created') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'size') return b.size - a.size;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [repos, searchTerm, selectedLanguage, repoTypeFilter, sortBy]);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-github-border space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-github-border pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <Code2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Repository Explorer</h2>
            <p className="text-xs text-github-muted">Search, filter, and inspect all public repositories</p>
          </div>
        </div>
        
        <div className="text-xs font-mono text-github-muted bg-github-card px-3 py-1.5 rounded-lg border border-github-border">
          Showing {filteredRepos.length} of {repos ? repos.length : 0} repos
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-github-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search repositories by name or description..."
            className="w-full pl-9 pr-4 py-2.5 bg-github-card text-white text-xs sm:text-sm rounded-xl border border-github-border focus:outline-none focus:border-blue-500 placeholder-github-muted"
          />
        </div>

        {/* Language Select */}
        <div className="md:col-span-3">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-3 py-2.5 bg-github-card text-white text-xs sm:text-sm rounded-xl border border-github-border focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Languages</option>
            {availableLanguages.filter(l => l !== 'All').map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Type Select */}
        <div className="md:col-span-2">
          <select
            value={repoTypeFilter}
            onChange={(e) => setRepoTypeFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-github-card text-white text-xs sm:text-sm rounded-xl border border-github-border focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="original">Original Only</option>
            <option value="forked">Forks Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="md:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 bg-github-card text-white text-xs sm:text-sm rounded-xl border border-github-border focus:outline-none focus:border-blue-500"
          >
            <option value="stars">Sort by Stars</option>
            <option value="forks">Sort by Forks</option>
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="size">Size (Largest)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Repositories Grid */}
      {filteredRepos.length === 0 ? (
        <div className="p-12 text-center text-github-muted bg-github-card/40 rounded-2xl border border-github-border/50">
          No repositories match your current filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => {
            const langColor = getLanguageColor(repo.language);
            return (
              <div
                key={repo.id}
                onClick={() => onSelectRepo && onSelectRepo(repo)}
                className="glass-card rounded-xl p-5 border border-github-border flex flex-col justify-between space-y-4 hover:border-blue-500/50 cursor-pointer group transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                        {repo.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      {repo.fork && (
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] rounded-md font-medium">
                          Fork
                        </span>
                      )}
                      {repo.archived && (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] rounded-md font-medium">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-github-muted line-clamp-2 leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>

                  {/* Topics Pills */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {repo.topics.slice(0, 3).map(topic => (
                        <span key={topic} className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-[10px] rounded-full">
                          #{topic}
                        </span>
                      ))}
                      {repo.topics.length > 3 && (
                        <span className="text-[10px] text-github-muted self-center">
                          +{repo.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-github-border/40 flex items-center justify-between text-xs text-github-muted">
                  
                  {/* Language */}
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
                    <span className="text-white font-medium">{repo.language || 'Other'}</span>
                  </div>

                  {/* Metrics */}
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
      )}

    </div>
  );
}
