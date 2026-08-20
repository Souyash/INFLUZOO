import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  DollarSign, 
  Layers, 
  Camera, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { NicheType, PlatformType } from '../../types';
import { Badge } from '../common/Badge';
import { LiveCameraCapture } from './LiveCameraCapture';

interface CreatorSignupSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorSignupSurveyModal: React.FC<CreatorSignupSurveyModalProps> = ({ isOpen, onClose }) => {
  const { signupCreatorWithSurvey } = useApp();

  const [step, setStep] = useState<number>(1);
  
  // Step 1: Credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Survey
  const [handle, setHandle] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [bio, setBio] = useState('Content creator passionate about authentic brand partnerships.');
  const [selectedNiches, setSelectedNiches] = useState<NicheType[]>(['Tech & AI']);
  const [primaryPlatform, setPrimaryPlatform] = useState<PlatformType>('youtube');
  const [followersCount, setFollowersCount] = useState<number>(45000);
  const [avgEngagementRate, setAvgEngagementRate] = useState<number>(5.6);
  const [basePrice, setBasePrice] = useState<number>(650);

  // Step 3: Photo KYC
  const [kycPhoto, setKycPhoto] = useState<string | null>(null);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const niches: NicheType[] = [
    'Tech & AI',
    'Beauty & Skincare',
    'Fitness & Health',
    'Gaming & Esports',
    'Lifestyle & Travel',
    'Fashion & Apparel',
    'Finance & Crypto',
    'Food & Culinary'
  ];

  const handleNicheToggle = (n: NicheType) => {
    if (selectedNiches.includes(n)) {
      if (selectedNiches.length > 1) {
        setSelectedNiches(selectedNiches.filter(x => x !== n));
      }
    } else {
      setSelectedNiches([...selectedNiches, n]);
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!handle) {
      setHandle(`@${email.split('@')[0]}`);
    }
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (selectedNiches.length === 0) {
      setError('Please select at least 1 content niche.');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setError(null);
    if (!kycPhoto) {
      setError('Please capture or upload a live selfie photo for verification.');
      return;
    }

    setIsLoading(true);
    const res = await signupCreatorWithSurvey({
      name: name.trim(),
      email: email.trim(),
      password,
      handle: handle.trim(),
      location,
      bio,
      niches: selectedNiches,
      primaryPlatform,
      followersCount,
      avgEngagementRate,
      basePrice,
      kycPhoto,
    });
    setIsLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-violet-500/40 bg-[#10111a] p-6 sm:p-8 shadow-2xl glow-purple text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Steps Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">Creator Verification & Onboarding</h3>
              <Badge variant="purple">Step {step} of 3</Badge>
            </div>
            <p className="text-xs text-slate-400">
              {step === 1 && 'Create your credentials to secure your account.'}
              {step === 2 && 'Tell brands about your audience and primary rate card.'}
              {step === 3 && 'Take a quick live selfie for Super Admin verification review.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full transition-all ${step >= 1 ? 'bg-violet-500 scale-110' : 'bg-slate-800'}`} />
            <span className={`w-3 h-3 rounded-full transition-all ${step >= 2 ? 'bg-violet-500 scale-110' : 'bg-slate-800'}`} />
            <span className={`w-3 h-3 rounded-full transition-all ${step >= 3 ? 'bg-violet-500 scale-110' : 'bg-slate-800'}`} />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= STEP 1: CREDENTIALS ================= */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="mt-6 space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name / Brand Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="alex@creatorhub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password (Min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-violet-600/30"
              >
                <span>Continue to Profile Survey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 2: PROFILE SURVEY ================= */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="mt-6 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary Handle
                </label>
                <input
                  type="text"
                  required
                  placeholder="@yourhandle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  City, Country
                </label>
                <input
                  type="text"
                  required
                  placeholder="Austin, TX, USA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Content Categories & Niches (Pick 1-3)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {niches.map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => handleNicheToggle(n)}
                    className={`p-2 rounded-xl text-xs font-medium border text-left transition ${
                      selectedNiches.includes(n)
                        ? 'bg-violet-950/70 border-violet-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary Platform
                </label>
                <select
                  value={primaryPlatform}
                  onChange={(e) => setPrimaryPlatform(e.target.value as PlatformType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white uppercase font-bold focus:outline-none focus:border-violet-500"
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Followers Count
                </label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  required
                  value={followersCount}
                  onChange={(e) => setFollowersCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Starting Rate ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min={50}
                    step={50}
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-emerald-400 font-extrabold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-violet-600/30"
              >
                <span>Next: Live Photo KYC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: LIVE PHOTO KYC ================= */}
        {step === 3 && (
          <div className="mt-6 space-y-5 animate-in fade-in">
            <LiveCameraCapture
              initialPhoto={kycPhoto || undefined}
              onPhotoCaptured={(dataUrl) => setKycPhoto(dataUrl)}
            />

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isLoading || !kycPhoto}
                onClick={handleFinalSubmit}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center gap-2 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Application for Admin Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
