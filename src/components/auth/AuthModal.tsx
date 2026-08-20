import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Building2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../../types';
import { Badge } from '../common/Badge';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalInitialRole, 
    loginWithPassword,
    signupWithPassword,
    setCreatorSurveyModalOpen,
    loginWithOtp,
    requestOtp,
    showToast
  } = useApp();

  // Mode: 'password' vs 'otp'
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  
  // In password mode: 'login' vs 'signup'
  const [isSignup, setIsSignup] = useState<boolean>(false);

  // Form states
  const [selectedRole, setSelectedRole] = useState<UserRole>('creator');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP states
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [dispatchedOtp, setDispatchedOtp] = useState<string | null>(null);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authModalInitialRole) {
      setSelectedRole(authModalInitialRole);
    }
  }, [authModalInitialRole]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (authMethod === 'otp' && otpStep === 'verify' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [authMethod, otpStep, countdown]);

  if (!authModalOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setOtpCode('');
    setError(null);
    setDispatchedOtp(null);
    setOtpStep('input');
  };

  const handleClose = () => {
    setAuthModalOpen(false);
    resetForm();
  };

  // 1. Password Form Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (isSignup) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }

      if (selectedRole === 'creator') {
        setIsLoading(false);
        handleClose();
        setCreatorSurveyModalOpen(true);
        return;
      }

      const res = await signupWithPassword(name.trim(), email.trim(), password, selectedRole);
      setIsLoading(false);

      if (res.success) {
        handleClose();
      } else {
        setError(res.message || 'Signup failed. Please try again.');
      }
    } else {
      const res = await loginWithPassword(email.trim(), password);
      setIsLoading(false);

      if (res.success) {
        handleClose();
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    }
  };

  // 2. OTP Request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return;

    setIsLoading(true);
    const res = await requestOtp(email.trim(), selectedRole);
    setIsLoading(false);

    if (res.success) {
      setOtpStep('verify');
      setCountdown(60);
      if (res.debugCode) {
        setDispatchedOtp(res.debugCode);
        setOtpCode(res.debugCode);
      }
    } else {
      setError(res.message || 'Failed to dispatch code.');
    }
  };

  // 3. OTP Verify
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otpCode.length < 6) return;

    setIsLoading(true);
    const success = await loginWithOtp(email.trim(), otpCode.trim());
    setIsLoading(false);

    if (success) {
      handleClose();
    } else {
      setError('Invalid or expired 6-digit code.');
    }
  };

  // Quick Demo Account Autofill
  const autofillDemo = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setSelectedRole(demoRole);
    setIsSignup(false);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-[#10111a] p-6 sm:p-8 shadow-2xl glow-purple text-slate-100 max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Header */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {authMethod === 'password' 
              ? (isSignup ? 'Create your Influzo Account' : 'Welcome back to Influzo') 
              : (otpStep === 'input' ? 'Passwordless OTP Sign In' : 'Enter 6-Digit Code')}
          </h3>
          <p className="text-xs text-slate-400">
            {authMethod === 'password'
              ? (isSignup ? 'Connect with brands or creators with automated escrow.' : 'Sign in to access your dashboard & contracts.')
              : `Security code dispatched to ${email || 'your device'}`}
          </p>
        </div>

        {/* Auth Method Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => { setAuthMethod('password'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'password' 
                ? 'bg-violet-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Password Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('otp'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'otp' 
                ? 'bg-violet-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Instant 6-Digit OTP</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= METHOD 1: PASSWORD AUTH ================= */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            
            {/* If Signup, select Role and Name */}
            {isSignup && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('creator')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        selectedRole === 'creator'
                          ? 'bg-violet-950/70 border-violet-500 text-white shadow-md shadow-violet-900/20'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <UserIcon className="w-4 h-4 text-violet-400" />
                      <span>Creator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('brand')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        selectedRole === 'brand'
                          ? 'bg-violet-950/70 border-violet-500 text-white shadow-md shadow-violet-900/20'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>Brand / Agency</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name / Brand Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Password {isSignup && '(Min 6 characters)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignup ? 'Create Account & Launch' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Toggle Sign In / Sign Up */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setError(null); }}
                className="text-xs text-slate-400 hover:text-violet-300 transition"
              >
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

            {/* Quick Demo Logins for Fast Testing */}
            {!isSignup && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 text-center">
                  Quick Demo 1-Click Fill
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => autofillDemo('elena@techreviews.com', 'creator')}
                    className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 text-[11px] text-slate-300 hover:text-white transition text-left"
                  >
                    <span className="font-bold block text-violet-400">Elena Rostova</span>
                    <span className="text-[10px] text-slate-500">Creator Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillDemo('growth@taskflow.ai', 'brand')}
                    className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-white transition text-left"
                  >
                    <span className="font-bold block text-indigo-400">TaskFlow AI</span>
                    <span className="text-[10px] text-slate-500">Brand Account</span>
                  </button>
                </div>
              </div>
            )}

          </form>
        )}

        {/* ================= METHOD 2: OTP AUTH ================= */}
        {authMethod === 'otp' && (
          <div>
            {otpStep === 'input' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    I am joining as:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('creator')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        selectedRole === 'creator'
                          ? 'bg-violet-950/70 border-violet-500 text-white shadow-md shadow-violet-900/20'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <UserIcon className="w-4 h-4 text-violet-400" />
                      <span>Creator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('brand')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        selectedRole === 'brand'
                          ? 'bg-violet-950/70 border-violet-500 text-white shadow-md shadow-violet-900/20'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>Brand</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Work Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. alex@creator.io or +1 (555) 019-2834"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send 6-Digit OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {dispatchedOtp && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Live Security SMS / Email Dispatch:
                      </span>
                      <Badge variant="emerald">Live OTP</Badge>
                    </div>
                    <p className="text-[11px] text-slate-200">
                      Your verification code is: <strong className="text-white font-mono text-sm tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/50">{dispatchedOtp}</strong>
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    6-Digit Security Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-[0.5em] font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Access Dashboard</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpStep('input')}
                    className="hover:text-white transition text-[11px]"
                  >
                    ← Change Email/Phone
                  </button>

                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={handleSendOtp}
                    className="text-violet-400 hover:text-violet-300 disabled:text-slate-600 transition flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
