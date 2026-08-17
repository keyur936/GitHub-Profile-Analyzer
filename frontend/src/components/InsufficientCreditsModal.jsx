import React, { useState } from 'react';
import { X, Coins, Sparkles, Gift, Loader2 } from 'lucide-react';
import { refillCreditsApi } from '../services/api';

export default function InsufficientCreditsModal({ isOpen, onClose, user, requiredCredits = 10, onRefilled }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleClaimBonus = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await refillCreditsApi();
      setMessage(res.message || '50 Free Credits claimed!');
      onRefilled(res.credits);
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 1500);
    } catch (err) {
      setMessage(err.message || 'Failed to claim credits.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-github-card border border-github-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-github-muted hover:text-white rounded-xl bg-github-dark/50 hover:bg-github-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-3xl flex items-center justify-center mx-auto text-amber-400">
          <Coins className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Insufficient Credits</h2>
          <p className="text-xs text-github-muted leading-relaxed">
            You need <strong className="text-amber-400">{requiredCredits} Credits</strong> to perform this action. Your current balance is <strong className="text-white">{user ? user.credits : 0} Credits</strong>.
          </p>
        </div>

        {message ? (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold">
            {message}
          </div>
        ) : (
          <div className="p-4 bg-github-dark/60 rounded-2xl border border-github-border/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-github-muted">Daily Bonus Refill:</span>
              <span className="text-emerald-400 font-bold font-mono">+50 🪙 Free</span>
            </div>
            
            <button
              onClick={handleClaimBonus}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Claiming Bonus...</span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  <span>Claim +50 Free Daily Bonus Credits</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
