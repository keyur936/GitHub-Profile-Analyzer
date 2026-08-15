import React from 'react';
import { ShieldCheck, Info, CheckCircle } from 'lucide-react';

export default function ActivityScore({ activityScore }) {
  if (!activityScore) return null;

  const { score, label, disclaimer, breakdown = [] } = activityScore;

  // Determine gauge color based on score
  const getGaugeColor = (val) => {
    if (val >= 80) return 'text-emerald-400 stroke-emerald-400';
    if (val >= 60) return 'text-blue-400 stroke-blue-400';
    if (val >= 40) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const gaugeColorClass = getGaugeColor(score);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-github-border space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-github-border pb-4">
        <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">GitHub Activity Score</h2>
          <p className="text-xs text-github-muted">Application-generated developer evaluation metric</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Circular Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-github-card/40 rounded-2xl border border-github-border/60 text-center space-y-4">
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-github-border fill-none"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`fill-none transition-all duration-1000 ${gaugeColorClass}`}
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                {score}
              </span>
              <span className="text-xs text-github-muted font-medium">/ 100</span>
            </div>
          </div>

          <div>
            <div className="text-lg font-bold text-white">{label}</div>
            <div className="text-xs text-blue-400 font-mono mt-0.5">Calculated Score</div>
          </div>

        </div>

        {/* Right Factor Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400" /> Transparent Scoring Factors
          </h3>

          <div className="space-y-3">
            {breakdown.map((item, index) => (
              <div key={index} className="space-y-1 bg-github-card/60 p-3 rounded-xl border border-github-border/40">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-white font-semibold">{item.factor}</span>
                  <span className="text-blue-400 font-mono">{item.points} / {item.max_points} pts</span>
                </div>
                <div className="w-full h-1.5 bg-github-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(item.points / item.max_points) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-github-muted">{item.description}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start space-x-3 text-xs text-github-text">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Disclaimer: </strong>
          {disclaimer}
        </div>
      </div>

    </div>
  );
}
