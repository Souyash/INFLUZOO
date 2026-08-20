import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Key, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AdminLoginModal: React.FC = () => {
  const { adminLoginModalOpen, setAdminLoginModalOpen, loginAsAdmin } = useApp();
  const [passkey, setPasskey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!adminLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;

    setIsLoading(true);
    setError(null);

    const success = await loginAsAdmin(passkey.trim());
    setIsLoading(false);

    if (success) {
      setAdminLoginModalOpen(false);
      setPasskey('');
    } else {
      setError('Invalid master passkey. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-red-500/40 bg-[#0f0e17] p-6 sm:p-8 shadow-2xl glow-purple text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setAdminLoginModalOpen(false);
            setError(null);
            setPasskey('');
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">Super Admin Access Portal</h3>
          <p className="text-xs text-slate-400">
            Restricted gateway for Influzo platform operators, dispute arbitrators, and compliance officers.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Master Operator Passkey
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Demo: admin123</span>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter root master passkey..."
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !passkey.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Authorize & Unlock Admin Suite</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
