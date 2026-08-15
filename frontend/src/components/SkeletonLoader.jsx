import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

const LOADING_STEPS = [
  'Fetching GitHub profile...',
  'Retrieving public repositories...',
  'Analyzing programming language statistics...',
  'Calculating developer activity score & insights...',
  'Preparing your developer report dashboard...'
];

export default function SkeletonLoader({ username }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-pulse">
      
      {/* Progress Status Message Card */}
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 bg-blue-950/20 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl border border-blue-500/30">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Analyzing @{username || 'GitHub Profile'}
          </h2>
          <p className="text-sm text-blue-400 font-medium animate-pulse">
            {LOADING_STEPS[currentStepIndex]}
          </p>
        </div>

        {/* Step Progress Checklist */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-github-muted">
          {LOADING_STEPS.map((step, idx) => (
            <div key={idx} className={`flex items-center space-x-1.5 ${idx <= currentStepIndex ? 'text-blue-400 font-medium' : 'opacity-40'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Step {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="glass-panel rounded-2xl p-8 border border-github-border space-y-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-github-border/40 rounded-2xl" />
          <div className="space-y-3 flex-1">
            <div className="h-6 w-48 bg-github-border/40 rounded-lg" />
            <div className="h-4 w-32 bg-github-border/40 rounded-lg" />
            <div className="h-4 w-3/4 bg-github-border/30 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-github-border space-y-3 h-28">
            <div className="w-8 h-8 bg-github-border/40 rounded-xl" />
            <div className="h-6 w-16 bg-github-border/40 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-github-border h-72 bg-github-card/40" />
        <div className="glass-panel rounded-2xl p-6 border border-github-border h-72 bg-github-card/40" />
      </div>

    </div>
  );
}
