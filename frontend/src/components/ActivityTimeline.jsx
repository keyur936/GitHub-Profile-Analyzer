import React from 'react';
import { Activity, GitCommit, PlusCircle, Star, GitPullRequest, AlertCircle, GitFork, MessageSquare } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function ActivityTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-github-border text-center text-github-muted">
        No recent public activity recorded on GitHub.
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit className="w-4 h-4 text-emerald-400" />;
      case 'CreateEvent':
        return <PlusCircle className="w-4 h-4 text-blue-400" />;
      case 'WatchEvent':
        return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
      case 'PullRequestEvent':
        return <GitPullRequest className="w-4 h-4 text-purple-400" />;
      case 'IssuesEvent':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'ForkEvent':
        return <GitFork className="w-4 h-4 text-sky-400" />;
      case 'IssueCommentEvent':
        return <MessageSquare className="w-4 h-4 text-gray-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-github-border space-y-6">
      
      <div className="flex items-center space-x-3 border-b border-github-border pb-4">
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Developer Activity Timeline</h2>
          <p className="text-xs text-github-muted">Recent public GitHub events and contributions</p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-github-border">
        {events.slice(0, 15).map((ev, index) => (
          <div key={ev.id || index} className="relative flex items-start space-x-4 group">
            
            {/* Event Dot Icon */}
            <div className="absolute -left-6 p-1.5 bg-github-card border border-github-border rounded-full group-hover:border-blue-500/50 transition-colors">
              {getEventIcon(ev.type)}
            </div>

            {/* Event Body */}
            <div className="flex-1 bg-github-card/60 border border-github-border/60 rounded-xl p-4 space-y-1 hover:border-github-border transition-colors">
              <div className="text-xs sm:text-sm font-medium text-white">
                {ev.action_text}
              </div>
              <div className="text-[11px] text-github-muted font-mono">
                {formatDate(ev.created_at)}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
