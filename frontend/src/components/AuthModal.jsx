import React, { useState } from 'react';
import { X, Sparkles, Lock, Mail, User, ArrowRight, Loader2, Coins, KeyRound, ShieldCheck, RefreshCw } from 'lucide-react';
import { sendOtpApi, verifyOtpApi, loginUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'signup' }) {
  const [tab, setTab] = useState(initialTab); // 'login' or 'signup'
  const [step, setStep] = useState(1); // Step 1: Details, Step 2: OTP Verification
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

  const handleResetState = () => {
    setStep(1);
    setOtp('');
    setDemoOtp('');
    setError('');
    setInfoMsg('');
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setInfoMsg('');
    setLoading(true);

    try {
      const res = await sendOtpApi({ email, name, password });
      setDemoOtp(res.demo_otp || '');
      setInfoMsg(res.message || `6-digit OTP code sent to ${email}`);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await verifyOtpApi({ email, otp });
      onAuthSuccess(res.user, res.message || '🎉 Email Verified! 100 Free Credits added.');
      handleResetState();
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      onAuthSuccess(res.user, res.message || 'Welcome back!');
      handleResetState();
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
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
          onClick={() => { handleResetState(); onClose(); }}
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
            <span className="font-bold text-amber-300">Real Email Signup Bonus:</span>
            <p className="text-github-muted text-[11px]">Verify email to get <strong className="text-amber-400">100 FREE Credits</strong> instantly!</p>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex bg-github-dark p-1 rounded-xl border border-github-border/60">
          <button
            type="button"
            onClick={() => { setTab('signup'); handleResetState(); }}
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
            onClick={() => { setTab('login'); handleResetState(); }}
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
            {tab === 'signup'
              ? step === 1
                ? 'Create Verified Account'
                : 'Verify Email OTP'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-github-muted">
            {tab === 'signup'
              ? step === 1
                ? 'Enter your name and real email to receive a 6-digit OTP code.'
                : `Enter the 6-digit OTP code sent to ${email}`
              : 'Sign in to access your credit balance and developer reports.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Info Alert */}
        {infoMsg && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-xl text-xs flex items-center justify-between">
            <span>{infoMsg}</span>
          </div>
        )}

        {/* Form Router */}
        {tab === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  placeholder="Your password"
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : step === 1 ? (
          /* Step 1: Send OTP Form */
          <form onSubmit={handleSendOtp} className="space-y-4">
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-github-muted">Real Email Address</label>
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
                  <span>Sending 6-Digit OTP...</span>
                </>
              ) : (
                <>
                  <span>Send 6-Digit OTP to Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Verify OTP Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            {/* Demo OTP Auto-fill helper box */}
            {demoOtp && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" /> OTP Verification Code:
                  </span>
                  <span className="font-mono text-base font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                    {demoOtp}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(demoOtp)}
                  className="w-full py-1 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-semibold transition-colors"
                >
                  ⚡ Auto-fill Demo OTP ({demoOtp})
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-github-muted">Enter 6-Digit OTP Code</label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-github-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 584920"
                  className="w-full pl-9 pr-4 py-3 bg-github-dark text-white text-base font-mono tracking-widest text-center font-bold rounded-xl border border-github-border focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/20 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying OTP...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Claim 100 Free Credits</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-github-muted hover:text-white transition-colors"
            >
              ← Back to change email
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
