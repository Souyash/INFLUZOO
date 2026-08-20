import React from 'react';
import { Zap, ShieldCheck, ArrowUpRight, Lock, Key } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setPerspective, setBrandTab, setCreatorTab, setAdminLoginModalOpen, setAuthModalOpen, setAuthModalInitialRole } = useApp();

  return (
    <footer className="border-t border-slate-800/80 bg-[#07080d] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-base font-extrabold text-white">Influzo</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The AI creator marketplace and automated escrow infrastructure connecting high-growth brands with verified creators.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bank-grade Escrow & Dispute Protection</span>
            </div>
          </div>

          {/* Col 2: Brands */}
          <div className="space-y-2.5">
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">For Brands & Agencies</h5>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => { setPerspective('brand'); setBrandTab('discovery'); }}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  AI Creator Discovery <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setAuthModalInitialRole('brand'); setAuthModalOpen(true); }}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  Launch Brand Campaign <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setPerspective('brand'); setBrandTab('pipeline'); }}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  Escrow Deal Pipeline <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Creators */}
          <div className="space-y-2.5">
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">For Creators</h5>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => { setAuthModalInitialRole('creator'); setAuthModalOpen(true); }}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  Claim Verified Media Kit <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setPerspective('creator'); setCreatorTab('wallet'); }}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  Instant Stripe Escrow Payouts <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Escrow Protection & Staff Portal */}
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <h5 className="font-semibold text-slate-200 text-xs">Influzo Guarantee</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Every collaboration is protected by milestone-locked escrow. Zero ghosting. 100% verified ROI.
              </p>
            </div>

            {/* Discrete Secret Staff/Admin Login Link */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setAdminLoginModalOpen(true)}
                className="text-[11px] text-slate-500 hover:text-red-400 font-mono transition flex items-center gap-1.5"
              >
                <Key className="w-3 h-3" />
                <span>Staff / Operator Gateway</span>
              </button>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© 2026 Influzo Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">FDIC Escrow Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
