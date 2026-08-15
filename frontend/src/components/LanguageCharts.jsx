import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Code2, Award, PieChart as PieIcon } from 'lucide-react';
import { getLanguageColor } from '../utils/helpers';

export default function LanguageCharts({ languages }) {
  if (!languages || !languages.distribution || languages.distribution.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-github-border text-center text-github-muted">
        No language data available.
      </div>
    );
  }

  const { distribution, most_used, top_5 } = languages;

  // Format data for Recharts PieChart
  const chartData = distribution.map(item => ({
    name: item.name,
    value: item.count,
    percentage: item.percentage,
    color: getLanguageColor(item.name)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-github-card p-3 border border-github-border rounded-xl shadow-xl text-xs space-y-1">
          <div className="flex items-center space-x-2 font-semibold text-white">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <div className="text-github-muted">
            {data.value} repos ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-github-border space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-github-border pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <PieIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Language Distribution</h2>
            <p className="text-xs text-github-muted">Programming language usage across repositories</p>
          </div>
        </div>

        {most_used && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Most Used: {most_used}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Donut Chart */}
        <div className="lg:col-span-6 h-64 sm:h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#161b22" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right Top Languages List */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400" /> Top Languages Breakdown
          </h3>

          <div className="space-y-3">
            {distribution.slice(0, 5).map((lang, idx) => {
              const color = getLanguageColor(lang.name);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                    <span className="flex items-center space-x-2 text-white">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span>{lang.name}</span>
                    </span>
                    <span className="text-github-muted font-mono">
                      {lang.percentage}% ({lang.count} repos)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-github-card rounded-full overflow-hidden border border-github-border/50">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${lang.percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
