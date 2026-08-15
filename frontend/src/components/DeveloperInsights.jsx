import React from 'react';
import { Lightbulb, CheckCircle2, TrendingUp } from 'lucide-react';

export default function DeveloperInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-github-border space-y-6">
      
      <div className="flex items-center space-x-3 border-b border-github-border pb-4">
        <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <Lightbulb className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Developer Insights</h2>
          <p className="text-xs text-github-muted">Key factual observations derived from public repository telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item, index) => (
          <div
            key={index}
            className="glass-card rounded-xl p-5 border border-github-border space-y-2 flex items-start space-x-3"
          >
            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                {item.title}
              </h3>
              <p className="text-xs text-github-text leading-relaxed">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
