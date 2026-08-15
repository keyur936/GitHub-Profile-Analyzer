import React, { useState, useEffect } from 'react';
import { History, Users, ArrowRight } from 'lucide-react';
import { getRecentProfiles } from '../utils/helpers';

export default function RecentlyAnalyzed({ onSelectProfile }) {
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    setRecents(getRecentProfiles());
  }, []);

  if (recents.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-github-muted uppercase tracking-wider px-1">
        <span className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-blue-400" /> Recently Analyzed Profiles
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {recents.map((item) => (
          <div
            key={item.login}
            onClick={() => onSelectProfile(item.login)}
            className="glass-card p-3 rounded-xl border border-github-border flex items-center space-x-3 cursor-pointer hover:border-blue-500/50 group transition-all"
          >
            <img
              src={item.avatar_url}
              alt={item.login}
              className="w-9 h-9 rounded-lg border border-github-border object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white group-hover:text-blue-400 truncate">
                {item.name}
              </div>
              <div className="text-[11px] text-github-muted font-mono truncate">
                @{item.login}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
