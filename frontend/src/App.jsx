import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import CompareProfiles from './components/CompareProfiles';
import { fetchProfileAnalysis } from './services/api';
import { saveRecentProfile } from './utils/helpers';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, dashboard, compare, about
  const [analyzingUser, setAnalyzingUser] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyzeProfile = async (userInput) => {
    if (!userInput || !userInput.trim()) return;

    setLoading(true);
    setError(null);
    setAnalyzingUser(userInput);

    try {
      const data = await fetchProfileAnalysis(userInput);
      setAnalysisData(data);
      if (data.profile) {
        saveRecentProfile(data.profile);
      }
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the GitHub profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9]">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickSearch={handleAnalyzeProfile}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Loading State */}
        {loading && (
          <div className="py-12">
            <SkeletonLoader username={analyzingUser} />
          </div>
        )}

        {/* Error Message Box */}
        {!loading && error && (
          <div className="max-w-2xl mx-auto my-12 glass-panel p-8 rounded-2xl border border-rose-500/40 bg-rose-950/20 text-center space-y-4 shadow-2xl">
            <div className="inline-flex p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">GitHub Profile Not Found</h2>
              <p className="text-sm text-rose-300 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => { setError(null); setActiveTab('home'); }}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-rose-600/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tab Router Views */}
        {!loading && !error && (
          <>
            {activeTab === 'home' && (
              <HomePage
                onSearch={handleAnalyzeProfile}
                onSelectRecent={handleAnalyzeProfile}
              />
            )}

            {activeTab === 'dashboard' && (
              analysisData ? (
                <DashboardPage
                  data={analysisData}
                  onNewSearch={handleAnalyzeProfile}
                />
              ) : (
                <HomePage
                  onSearch={handleAnalyzeProfile}
                  onSelectRecent={handleAnalyzeProfile}
                />
              )
            )}

            {activeTab === 'compare' && (
              <CompareProfiles
                onSelectUser={handleAnalyzeProfile}
              />
            )}

            {activeTab === 'about' && (
              <AboutPage />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
