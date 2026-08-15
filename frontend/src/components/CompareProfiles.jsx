import React, { useState } from 'react';
import { GitCompare, Trophy, ArrowRight, Star, GitFork, Users, FolderGit2, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { compareProfiles } from '../services/api';
import { formatNumber } from '../utils/helpers';
import SearchBar from './SearchBar';

export default function CompareProfiles({ onSelectUser }) {
  const [user1Input, setUser1Input] = useState('torvalds');
  const [user2Input, setUser2Input] = useState('gaearon');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [compareResult, setCompareResult] = useState(null);

  const handleCompare = async (e) => {
    if (e) e.preventDefault();
    if (!user1Input.trim() || !user2Input.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await compareProfiles(user1Input, user2Input);
      setCompareResult(data);
    } catch (err) {
      setError(err.message || 'Failed to compare profiles.');
    } finally {
      setLoading(false);
    }
  };

  const getWinnerBadge = (val1, val2) => {
    if (val1 > val2) return 'user1';
    if (val2 > val1) return 'user2';
    return 'tie';
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full text-xs font-semibold">
          <GitCompare className="w-4 h-4" /> Compare Developers
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Developer Head-to-Head Comparison
        </h1>
        <p className="text-github-muted text-sm sm:text-base">
          Analyze and compare metrics, repositories, stars, language focus, and activity scores of any two GitHub profiles.
        </p>
      </div>

      {/* Input Box */}
      <form onSubmit={handleCompare} className="glass-panel p-6 sm:p-8 rounded-2xl border border-github-border max-w-4xl mx-auto space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider">Developer 1</label>
            <input
              type="text"
              value={user1Input}
              onChange={(e) => setUser1Input(e.target.value)}
              placeholder="e.g. torvalds"
              className="w-full px-4 py-3 bg-github-card text-white text-sm rounded-xl border border-github-border focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider">Developer 2</label>
            <input
              type="text"
              value={user2Input}
              onChange={(e) => setUser2Input(e.target.value)}
              placeholder="e.g. gaearon"
              className="w-full px-4 py-3 bg-github-card text-white text-sm rounded-xl border border-github-border focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !user1Input.trim() || !user2Input.trim()}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-purple-600/20"
        >
          <span>{loading ? 'Fetching & Analyzing...' : 'Run Head-to-Head Comparison'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Comparison Results */}
      {compareResult && (
        <div className="space-y-8 max-w-5xl mx-auto">
          
          {/* Side-by-Side Profiles Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* User 1 Profile */}
            <div className="glass-panel p-6 rounded-2xl border border-github-border space-y-4 text-center relative overflow-hidden">
              <img
                src={compareResult.user1.profile.avatar_url}
                alt={compareResult.user1.username}
                className="w-20 h-20 rounded-2xl mx-auto border-2 border-github-border object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{compareResult.user1.profile.name}</h3>
                <p className="text-purple-400 font-mono text-xs">@{compareResult.user1.profile.login}</p>
              </div>
              <button
                onClick={() => onSelectUser(compareResult.user1.profile.login)}
                className="px-3 py-1.5 bg-github-card hover:bg-github-border text-xs text-white rounded-lg border border-github-border transition-colors"
              >
                View Full Analysis Report
              </button>
            </div>

            {/* User 2 Profile */}
            <div className="glass-panel p-6 rounded-2xl border border-github-border space-y-4 text-center relative overflow-hidden">
              <img
                src={compareResult.user2.profile.avatar_url}
                alt={compareResult.user2.username}
                className="w-20 h-20 rounded-2xl mx-auto border-2 border-github-border object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{compareResult.user2.profile.name}</h3>
                <p className="text-purple-400 font-mono text-xs">@{compareResult.user2.profile.login}</p>
              </div>
              <button
                onClick={() => onSelectUser(compareResult.user2.profile.login)}
                className="px-3 py-1.5 bg-github-card hover:bg-github-border text-xs text-white rounded-lg border border-github-border transition-colors"
              >
                View Full Analysis Report
              </button>
            </div>

          </div>

          {/* Metric Comparison Table */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-github-border space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-github-border pb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Key Metrics Comparison
            </h3>

            <div className="space-y-3 font-mono text-sm">
              
              {/* Metric Row Helper */}
              {[
                {
                  label: 'Activity Score',
                  val1: compareResult.user1.analytics.activity_score.score,
                  val2: compareResult.user2.analytics.activity_score.score,
                  format: (v) => `${v} / 100`
                },
                {
                  label: 'Total Stars',
                  val1: compareResult.user1.analytics.summary.total_stars,
                  val2: compareResult.user2.analytics.summary.total_stars,
                  format: formatNumber
                },
                {
                  label: 'Total Forks',
                  val1: compareResult.user1.analytics.summary.total_forks,
                  val2: compareResult.user2.analytics.summary.total_forks,
                  format: formatNumber
                },
                {
                  label: 'Followers',
                  val1: compareResult.user1.profile.followers,
                  val2: compareResult.user2.profile.followers,
                  format: formatNumber
                },
                {
                  label: 'Public Repositories',
                  val1: compareResult.user1.profile.public_repos,
                  val2: compareResult.user2.profile.public_repos,
                  format: formatNumber
                },
                {
                  label: 'Most Used Language',
                  val1: compareResult.user1.analytics.languages.most_used,
                  val2: compareResult.user2.analytics.languages.most_used,
                  raw: true
                }
              ].map((row, idx) => {
                const winner = typeof row.val1 === 'number' ? getWinnerBadge(row.val1, row.val2) : 'tie';
                return (
                  <div key={idx} className="grid grid-cols-12 items-center bg-github-card/50 p-3 rounded-xl border border-github-border/40">
                    <div className={`col-span-4 text-center font-bold ${winner === 'user1' ? 'text-amber-400' : 'text-white'}`}>
                      {row.raw ? row.val1 : row.format(row.val1)}
                      {winner === 'user1' && <span className="ml-2 text-xs text-amber-400">👑</span>}
                    </div>

                    <div className="col-span-4 text-center text-xs font-sans text-github-muted uppercase font-bold">
                      {row.label}
                    </div>

                    <div className={`col-span-4 text-center font-bold ${winner === 'user2' ? 'text-amber-400' : 'text-white'}`}>
                      {row.raw ? row.val2 : row.format(row.val2)}
                      {winner === 'user2' && <span className="ml-2 text-xs text-amber-400">👑</span>}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
