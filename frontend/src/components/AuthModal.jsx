import React, { useState } from 'react';
import { X, Sparkles, Lock, Mail, User, ArrowRight, Loader2, Coins } from 'lucide-react';
import { registerUser, loginUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'signup' }) {
  const [tab, setTab] = useState(initialTab); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'signup') {
        const res = await registerUser({ email, name, password });
        onAuthSuccess(res.user, res.message || '100 Free Credits added to your account!');
        onClose();
      } else {
        const res = await loginUser({ email, password });
        onAuthSuccess(res.user, res.message || 'Welcome back!');
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-github-card border border-github-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
        
        {/* Decorative Ambient Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-github-muted hover:text-white rounded-xl bg-github-dark/50 hover:bg-github-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Free Credits Banner */}
        <div className="p-3 bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 border border-amber-500/30 rounded-2xl flex items-center space-x-3 text-xs text-white">
          <div className="p-2 bg-amber-500/20 rounded-xl">
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="font-bold text-amber-300">New User Special Offer:</span>
            <p className="text-github-muted text-[11px]">Sign up now to get <strong className="text-amber-400">100 FREE Credits</strong> instantly!</p>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex bg-github-dark p-1 rounded-xl border border-github-border/60">
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'signup'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-github-muted hover:text-white'
            }`}
          >
            Create Account (+100 🪙)
          </button>
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-github-muted hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {tab === 'signup' ? 'Get Started Free' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-github-muted">
            {tab === 'signup'
              ? 'Analyze & compare public GitHub profiles using your free credits.'
              : 'Sign in to access your credit balance and analyze developer reports.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {tab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-github-muted">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-github-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-9 pr-4 py-2.5 bg-github-dark text-white text-xs rounded-xl border border-github-border focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-github-muted">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-github-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-github-dark text-white text-xs rounded-xl border border-github-border focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-github-muted">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-github-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-4 py-2.5 bg-github-dark text-white text-xs rounded-xl border border-github-border focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{tab === 'signup' ? 'Claim 100 Credits & Sign Up' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
