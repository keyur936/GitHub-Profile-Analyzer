import React, { useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import StatsOverview from '../components/StatsOverview';
import LanguageCharts from '../components/LanguageCharts';
import RepoCharts from '../components/RepoCharts';
import TopRepos from '../components/TopRepos';
import RepoExplorer from '../components/RepoExplorer';
import RepoDetailModal from '../components/RepoDetailModal';
import ActivityTimeline from '../components/ActivityTimeline';
import DeveloperInsights from '../components/DeveloperInsights';
import ActivityScore from '../components/ActivityScore';
import ExportReport from '../components/ExportReport';
import SearchBar from '../components/SearchBar';
import { Search, RotateCcw } from 'lucide-react';

export default function DashboardPage({ data, onNewSearch }) {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  if (!data) return null;

  const { username, profile, repositories, events, analytics } = data;

  return (
    <div id="developer-report-container" className="space-y-10 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-github-border pb-4 no-print">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-github-muted uppercase tracking-wider">Report For:</span>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg font-mono font-bold text-sm">
            @{profile.login}
          </span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setShowSearchModal(!showSearchModal)}
            className="px-4 py-2 bg-github-card hover:bg-github-border text-white border border-github-border rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-2 transition-colors"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Search Another Profile</span>
          </button>

          <ExportReport elementId="developer-report-container" username={profile.login} />
        </div>
      </div>

      {/* Inline Search Drawer if open */}
      {showSearchModal && (
        <div className="p-6 glass-panel rounded-2xl border border-blue-500/30 space-y-3 no-print">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Analyze New Profile</span>
            <button onClick={() => setShowSearchModal(false)} className="text-github-muted hover:text-white text-xs">Close</button>
          </div>
          <SearchBar onSearch={(userInput) => { setShowSearchModal(false); onNewSearch(userInput); }} compact />
        </div>
      )}

      {/* 1. Profile Header */}
      <ProfileHeader profile={profile} />

      {/* 2. GitHub Statistics */}
      <StatsOverview summary={analytics.summary} />

      {/* 3. Language Distribution */}
      <LanguageCharts languages={analytics.languages} />

      {/* 4. Top Repositories */}
      <TopRepos repos={analytics.top_repositories} onSelectRepo={setSelectedRepo} />

      {/* 5. Repository Analytics Charts */}
      <RepoCharts charts={analytics.charts} />

      {/* 6. Repository Explorer */}
      <RepoExplorer repos={repositories} onSelectRepo={setSelectedRepo} />

      {/* 7. Developer Activity Timeline */}
      <ActivityTimeline events={events} />

      {/* 8. Developer Insights */}
      <DeveloperInsights insights={analytics.insights} />

      {/* 9. GitHub Activity Score */}
      <ActivityScore activityScore={analytics.activity_score} />

      {/* Repository Detail Modal */}
      {selectedRepo && (
        <RepoDetailModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}

    </div>
  );
}
