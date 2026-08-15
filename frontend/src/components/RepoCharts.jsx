import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Star, GitFork, Calendar, BarChart2 } from 'lucide-react';
import { getLanguageColor } from '../utils/helpers';

export default function RepoCharts({ charts }) {
  if (!charts) return null;

  const { stars_per_repo = [], forks_per_repo = [], creation_timeline = [] } = charts;

  const CustomStarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-github-card p-3 border border-github-border rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-semibold text-white">{data.name}</div>
          <div className="text-amber-400 font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {data.stars} Stars
          </div>
          <div className="text-github-muted">Language: {data.language}</div>
        </div>
      );
    }
    return null;
  };

  const CustomForkTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-github-card p-3 border border-github-border rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-semibold text-white">{data.name}</div>
          <div className="text-purple-400 font-bold flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" /> {data.forks} Forks
          </div>
          <div className="text-github-muted">Language: {data.language}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Stars & Forks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stars per Repository Bar Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-github-border space-y-4">
          <div className="flex items-center space-x-3 border-b border-github-border pb-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Stars per Repository</h3>
              <p className="text-xs text-github-muted">Top repositories ordered by star count</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stars_per_repo} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#8b949e" 
                  tick={{ fontSize: 11 }} 
                  interval={0} 
                  angle={-25} 
                  textAnchor="end" 
                />
                <YAxis stroke="#8b949e" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomStarTooltip />} />
                <Bar dataKey="stars" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forks per Repository Bar Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-github-border space-y-4">
          <div className="flex items-center space-x-3 border-b border-github-border pb-3">
            <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <GitFork className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Forks per Repository</h3>
              <p className="text-xs text-github-muted">Top repositories ordered by fork count</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forks_per_repo} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#8b949e" 
                  tick={{ fontSize: 11 }} 
                  interval={0} 
                  angle={-25} 
                  textAnchor="end" 
                />
                <YAxis stroke="#8b949e" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomForkTooltip />} />
                <Bar dataKey="forks" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Creation Timeline Area Chart */}
      {creation_timeline.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-github-border space-y-4">
          <div className="flex items-center space-x-3 border-b border-github-border pb-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Repository Creation Timeline</h3>
              <p className="text-xs text-github-muted">Number of public projects created per year</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={creation_timeline} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRepos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                <XAxis dataKey="year" stroke="#8b949e" tick={{ fontSize: 12 }} />
                <YAxis stroke="#8b949e" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '0.75rem', fontSize: '12px' }} 
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="repos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRepos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
