import React from 'react';
import { Star, GitFork, FolderGit2, Users, GitPullRequest, Archive } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

export default function StatsOverview({ summary }) {
  if (!summary) return null;

  const stats = [
    {
      label: 'Total Repositories',
      value: summary.total_repos,
      icon: FolderGit2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Total Stars',
      value: summary.total_stars,
      icon: Star,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30'
    },
    {
      label: 'Total Forks',
      value: summary.total_forks,
      icon: GitFork,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      label: 'Total Followers',
      value: summary.followers,
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      label: 'Original Repositories',
      value: summary.original_repos,
      icon: GitPullRequest,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30'
    },
    {
      label: 'Forked Repositories',
      value: summary.forked_repos,
      icon: Archive,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`glass-card rounded-2xl p-4 sm:p-5 border border-github-border flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-all duration-300 shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.borderColor} border`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatNumber(stat.value)}
              </div>
              <div className="text-xs text-github-muted font-medium mt-1">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
