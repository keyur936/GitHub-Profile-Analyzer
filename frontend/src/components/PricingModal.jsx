import React, { useState } from 'react';
import { X, Coins, Sparkles, Check, ShieldCheck, CreditCard, QrCode, ArrowRight, Loader2, Zap } from 'lucide-react';
import { buyCreditsApi } from '../services/api';

const PACKS = [
  {
    id: 'starter_500',
    name: 'Starter Pack',
    price: 50,
    credits: 500,
    perCredit: '₹0.10 / credit',
    featured: false,
    badge: 'Basic'
  },
  {
    id: 'popular_1000',
    name: 'Popular Pro Pack',
    price: 100,
    credits: 1000,
    perCredit: '₹0.10 / credit',
    featured: true,
    badge: 'Most Popular 🔥'
  },
  {
    id: 'mega_3000',
    name: 'Mega Developer Pack',
    price: 250,
    credits: 3000,
    perCredit: '₹0.08 / credit',
    featured: false,
    badge: 'Best Value (20% OFF)'
  }
];

export default function PricingModal({ isOpen, onClose, user, onCreditsPurchased }) {
  const [selectedPackId, setSelectedPackId] = useState('popular_1000');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi or card
  const [step, setStep] = useState('select'); // select or checkout
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedPack = PACKS.find(p => p.id === selectedPackId) || PACKS[1];

  const handleProceedToCheckout = () => {
    setStep('checkout');
    setError('');
  };

  const handleCompletePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await buyCreditsApi({
        packId: selectedPack.id,
        paymentMethod: paymentMethod
      });
      setSuccessData(res);
      onCreditsPurchased(res.new_credits);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('select');
    setSuccessData(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-github-card border border-github-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden my-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-github-muted hover:text-white rounded-xl bg-github-dark/50 hover:bg-github-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success View */}
        {successData ? (
          <div className="py-8 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Payment Successful!</h2>
              <p className="text-sm text-emerald-400 font-semibold">
                ₹{successData.amount_paid} Paid • +{successData.added_credits} Credits Added
              </p>
            </div>

            <div className="p-4 bg-github-dark/60 rounded-2xl border border-github-border/60 max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between text-github-muted">
                <span>Transaction ID:</span>
                <span className="font-mono text-white">{successData.transaction_id}</span>
              </div>
              <div className="flex justify-between text-github-muted">
                <span>New Total Balance:</span>
                <span className="font-bold text-amber-400 font-mono text-sm">{successData.new_credits} 🪙 Credits</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              Done & Start Analyzing
            </button>
          </div>
        ) : step === 'select' ? (
          /* Step 1: Select Pack */
          <div className="space-y-6">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold">
                <Coins className="w-4 h-4" /> Refill Credits
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Choose a Credit Pack
              </h2>
              <p className="text-xs sm:text-sm text-github-muted">
                Free credits exhausted? Get 1,000 Credits for just ₹100 to analyze and compare any profile!
              </p>
            </div>

            {/* Packs Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PACKS.map((pack) => {
                const isSelected = selectedPackId === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPackId(pack.id)}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                      pack.featured
                        ? isSelected
                          ? 'bg-gradient-to-b from-amber-500/20 to-github-card border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.03]'
                          : 'bg-github-card/80 border-amber-500/50 hover:border-amber-500'
                        : isSelected
                        ? 'bg-github-card border-blue-500 shadow-lg'
                        : 'bg-github-card/40 border-github-border hover:border-github-border/80'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        pack.featured
                          ? 'bg-amber-500 text-black font-extrabold'
                          : 'bg-github-border text-github-muted'
                      }`}>
                        {pack.badge}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{pack.name}</h3>
                      <div className="mt-2 flex items-baseline space-x-1">
                        <span className="text-3xl font-extrabold text-white">₹{pack.price}</span>
                        <span className="text-xs text-github-muted">INR</span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-amber-400 font-mono flex items-center gap-1">
                        <Coins className="w-4 h-4" /> {pack.credits.toLocaleString()} Credits
                      </div>
                    </div>

                    <div className="pt-2 border-t border-github-border/40 text-[11px] text-github-muted">
                      • {pack.credits / 10} Profile Analyses
                      <br />
                      • {Math.floor(pack.credits / 15)} Profile Comparisons
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Pack Summary & Proceed CTA */}
            <div className="p-4 bg-github-dark/80 rounded-2xl border border-github-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-github-muted">Selected Plan:</div>
                <div className="text-base font-bold text-white">
                  {selectedPack.name} — <span className="text-amber-400 font-mono">₹{selectedPack.price}</span> ({selectedPack.credits} 🪙)
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <span>Proceed to Pay ₹{selectedPack.price}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* Step 2: Payment Checkout Screen */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-github-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Checkout & Pay ₹{selectedPack.price}</h3>
                <p className="text-xs text-github-muted">Instant top-up of {selectedPack.credits.toLocaleString()} Credits</p>
              </div>
              <button
                onClick={() => setStep('select')}
                className="text-xs text-blue-400 hover:underline"
              >
                Change Plan
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
                {error}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-github-muted uppercase tracking-wider">Select Payment Method</label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs font-semibold transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-blue-500/15 border-blue-500 text-white'
                      : 'bg-github-dark border-github-border text-github-muted hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span>UPI / GPay / PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs font-semibold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-blue-500/15 border-blue-500 text-white'
                      : 'bg-github-dark border-github-border text-github-muted hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span>Credit / Debit Card</span>
                </button>
              </div>
            </div>

            {/* Payment Details Container */}
            <div className="p-5 bg-github-dark/80 rounded-2xl border border-github-border space-y-4">
              {paymentMethod === 'upi' ? (
                <div className="space-y-3 text-xs text-center">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-fit mx-auto">
                    <QrCode className="w-24 h-24 text-white mx-auto" />
                  </div>
                  <div className="text-github-muted">Scan QR or Pay to UPI ID:</div>
                  <div className="font-mono font-bold text-amber-400 bg-github-card px-3 py-1.5 rounded-lg border border-github-border inline-block">
                    analyzer@upi
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="text-github-muted">Card Number (Test Mode):</div>
                  <input
                    type="text"
                    disabled
                    value="4242 •••• •••• 4242"
                    className="w-full px-3 py-2 bg-github-card text-white rounded-lg border border-github-border font-mono"
                  />
                </div>
              )}
            </div>

            {/* Complete Payment Button */}
            <button
              onClick={handleCompletePayment}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-base rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Payment ₹{selectedPack.price}...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Pay ₹{selectedPack.price} & Add {selectedPack.credits.toLocaleString()} Credits</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-github-muted flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted & Instant Credit Activation</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
