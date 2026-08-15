import React from 'react';
import { ExternalLink, MapPin, Building, Link as LinkIcon, Twitter, Calendar, Users, FolderGit2, Code } from 'lucide-react';
import { formatDate, formatNumber } from '../utils/helpers';

export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 sm:p-8 border border-github-border relative overflow-hidden shadow-xl">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group">
            <img
              src={profile.avatar_url}
              alt={profile.login}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-github-border shadow-lg group-hover:border-blue-500/50 transition-colors object-cover"
            />
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-semibold rounded-full uppercase tracking-wider">
              {profile.type || 'User'}
            </div>
          </div>

          <div className="space-y-2 max-w-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {profile.name}
              </h1>
              <p className="text-blue-400 font-mono text-sm sm:text-base">
                @{profile.login}
              </p>
            </div>

            <p className="text-github-text text-sm sm:text-base leading-relaxed">
              {profile.bio}
            </p>

            {/* Profile Meta Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-github-muted pt-1">
              {profile.location && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{profile.location}</span>
                </span>
              )}

              {profile.company && (
                <span className="flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-purple-400" />
                  <span>{profile.company}</span>
                </span>
              )}

              {profile.blog && (
                <a
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[180px]">{profile.blog}</span>
                </a>
              )}

              {profile.twitter_username && (
                <a
                  href={`https://twitter.com/${profile.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5 text-sky-400" />
                  <span>@{profile.twitter_username}</span>
                </a>
              )}

              {profile.created_at && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-github-muted" />
                  <span>Joined {formatDate(profile.created_at)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 bg-github-card hover:bg-github-border text-white border border-github-border rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] shadow-sm"
          >
            <span>View GitHub Profile</span>
            <ExternalLink className="w-4 h-4 text-blue-400" />
          </a>
        </div>

      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-github-border/60">
        <div className="px-4 py-3 bg-github-card/40 rounded-xl border border-github-border/40">
          <div className="text-github-muted text-xs flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-400" /> Followers
          </div>
          <div className="text-lg font-bold text-white">{formatNumber(profile.followers)}</div>
        </div>

        <div className="px-4 py-3 bg-github-card/40 rounded-xl border border-github-border/40">
          <div className="text-github-muted text-xs flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-purple-400" /> Following
          </div>
          <div className="text-lg font-bold text-white">{formatNumber(profile.following)}</div>
        </div>

        <div className="px-4 py-3 bg-github-card/40 rounded-xl border border-github-border/40">
          <div className="text-github-muted text-xs flex items-center gap-1.5 mb-1">
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" /> Public Repos
          </div>
          <div className="text-lg font-bold text-white">{formatNumber(profile.public_repos)}</div>
        </div>

        <div className="px-4 py-3 bg-github-card/40 rounded-xl border border-github-border/40">
          <div className="text-github-muted text-xs flex items-center gap-1.5 mb-1">
            <Code className="w-3.5 h-3.5 text-amber-400" /> Public Gists
          </div>
          <div className="text-lg font-bold text-white">{formatNumber(profile.public_gists)}</div>
        </div>
      </div>

    </div>
  );
}
