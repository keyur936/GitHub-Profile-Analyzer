import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import CompareProfiles from './components/CompareProfiles';
import AuthModal from './components/AuthModal';
import InsufficientCreditsModal from './components/InsufficientCreditsModal';
import { fetchProfileAnalysis, fetchMe, logoutUser, setStoredToken } from './services/api';
import { saveRecentProfile } from './utils/helpers';
import { AlertTriangle, Sparkles, Coins } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [analyzingUser, setAnalyzingUser] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('signup');
  const [isRefillOpen, setIsRefillOpen] = useState(false);
  const [requiredCreditsCost, setRequiredCreditsCost] = useState(10);
  const [toastMessage, setToastMessage] = useState('');

  // Load user on startup if token exists
  useEffect(() => {
    async function loadUser() {
      const u = await fetchMe();
      if (u) setUser(u);
    }
    loadUser();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenAuth = (tab = 'signup') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (userData, message) => {
    setUser(userData);
    showToast(message);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    showToast('Logged out successfully.');
  };

  const handleRefillCreditsSuccess = (newCredits) => {
    if (user) {
      setUser({ ...user, credits: newCredits });
    }
    showToast('50 Bonus Credits Added! 🪙');
  };

  const handleAnalyzeProfile = async (userInput) => {
    if (!userInput || !userInput.trim()) return;

    // Intercept if not logged in
    if (!user) {
      handleOpenAuth('signup');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalyzingUser(userInput);

    try {
      const data = await fetchProfileAnalysis(userInput);
      setAnalysisData(data);
      if (data.profile) {
        saveRecentProfile(data.profile);
      }
      if (data.user_credits !== undefined && user) {
        setUser({ ...user, credits: data.user_credits });
        showToast(`Analyzed Profile! 10 Credits Used. Remaining: ${data.user_credits} 🪙`);
      }
      setActiveTab('dashboard');
    } catch (err) {
      if (err.authRequired) {
        handleOpenAuth('login');
      } else if (err.insufficientCredits) {
        setRequiredCreditsCost(err.requiredCredits || 10);
        setIsRefillOpen(true);
      } else {
        setError(err.message || 'An error occurred while fetching the GitHub profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9] relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 bg-github-card border border-blue-500/40 text-white rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-bounce">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenRefill={() => setIsRefillOpen(true)}
        onLogout={handleLogout}
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

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialTab={authInitialTab}
      />

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        isOpen={isRefillOpen}
        onClose={() => setIsRefillOpen(false)}
        user={user}
        requiredCredits={requiredCreditsCost}
        onRefilled={handleRefillCreditsSuccess}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
