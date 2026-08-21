import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  Sparkles, 
  Bell, 
  Building2, 
  User as UserIcon, 
  Compass, 
  Kanban, 
  PlusCircle, 
  BarChart3, 
  Inbox, 
  FileEdit, 
  Wallet, 
  Layers,
  ShieldCheck,
  Scale,
  Settings,
  Activity,
  Users,
  LogOut,
  ChevronDown,
  ArrowRight,
  LogIn,
  DollarSign
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const Navbar: React.FC = () => {
  const { 
    perspective, 
    setPerspective, 
    brandTab, 
    setBrandTab, 
    creatorTab, 
    setCreatorTab, 
    adminTab,
    setAdminTab,
    notifications, 
    setIsAiModalOpen,
    wallet,
    currentUser,
    setAuthModalOpen,
    setAuthModalInitialRole,
    logout,
    creators,
    deals
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingVerificationsCount = creators.filter(c => !c.verified || c.verificationStatus === 'pending').length;
  const openDisputesCount = deals.filter(d => d.escrowStatus === 'disputed').length;

  const handleOpenAuth = (role: 'creator' | 'brand' = 'creator') => {
    setAuthModalInitialRole(role);
    setAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0a0b10]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setPerspective('landing')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white font-sans flex items-center gap-1">
                  Influzo<span className="text-violet-400">.</span>
                </span>
              </div>
            </button>

            {/* Public Links when unauthenticated or on Landing */}
            {!currentUser && (
              <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-400">
                <button 
                  onClick={() => { setPerspective('brand'); setBrandTab('discovery'); }}
                  className="hover:text-white transition"
                >
                  Explore Creators
                </button>
                <button 
                  onClick={() => setPerspective('landing')}
                  className="hover:text-white transition"
                >
                  ROI Calculator
                </button>
                <button 
                  onClick={() => setPerspective('landing')}
                  className="hover:text-white transition"
                >
                  Platform Guarantee
                </button>
              </nav>
            )}
          </div>

          {/* Center Tabs for Authenticated Portals */}
          <div className="hidden lg:flex items-center gap-1">
            {currentUser?.role === 'brand' && (
              <>
                <button
                  onClick={() => { setPerspective('brand'); setBrandTab('discovery'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    perspective === 'brand' && brandTab === 'discovery' ? 'bg-violet-950/60 text-violet-300 border border-violet-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Creator Discovery
                </button>
                <button
                  onClick={() => { setPerspective('brand'); setBrandTab('pipeline'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    perspective === 'brand' && brandTab === 'pipeline' ? 'bg-violet-950/60 text-violet-300 border border-violet-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  Deal Pipeline
                </button>
                <button
                  onClick={() => { setPerspective('brand'); setBrandTab('studio'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    perspective === 'brand' && brandTab === 'studio' ? 'bg-violet-950/60 text-violet-300 border border-violet-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Create Campaign
                </button>
                <button
                  onClick={() => { setPerspective('brand'); setBrandTab('analytics'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    perspective === 'brand' && brandTab === 'analytics' ? 'bg-violet-950/60 text-violet-300 border border-violet-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Live ROI
                </button>
              </>
            )}

            {currentUser?.role === 'creator' && (
              <>
                <button
                  onClick={() => { setPerspective('creator'); setCreatorTab('overview'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    perspective === 'creator' && creatorTab === 'overview' ? 'bg-violet-950/60 text-violet-300 border border-violet-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Overview
                </button>
                <button
                  onClick={() => { setPerspective('creator'); setCreatorTab('inbox'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    perspective === 'creator' && creatorTab === 'inbox' ? 'bg-violet-950/60 text-violet-300 border border-violet-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  Deals Inbox
                </button>
                <button
                  onClick={() => { setPerspective('creator'); setCreatorTab('mediakit'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    perspective === 'creator' && creatorTab === 'mediakit' ? 'bg-violet-950/60 text-violet-300 border border-violet-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  Media Kit & Rates
                </button>
                <button
                  onClick={() => { setPerspective('creator'); setCreatorTab('wallet'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    perspective === 'creator' && creatorTab === 'wallet' ? 'bg-violet-950/60 text-violet-300 border border-violet-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  Escrow Wallet
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => { setPerspective('admin'); setAdminTab('overview'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    adminTab === 'overview' ? 'bg-red-950/60 text-red-300 border border-red-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Overview
                </button>
                <button
                  onClick={() => { setPerspective('admin'); setAdminTab('verifications'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    adminTab === 'verifications' ? 'bg-red-950/60 text-red-300 border border-red-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  KYC Queue {pendingVerificationsCount > 0 && `(${pendingVerificationsCount})`}
                </button>
                <button
                  onClick={() => { setPerspective('admin'); setAdminTab('disputes'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    adminTab === 'disputes' ? 'bg-red-950/60 text-red-300 border border-red-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  Dispute Arbitrator {openDisputesCount > 0 && `(${openDisputesCount})`}
                </button>
                <button
                  onClick={() => { setPerspective('admin'); setAdminTab('transactions'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    adminTab === 'transactions' ? 'bg-red-950/60 text-red-300 border border-red-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Financial Ledger
                </button>
                <button
                  onClick={() => { setPerspective('admin'); setAdminTab('settings'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    adminTab === 'settings' ? 'bg-red-950/60 text-red-300 border border-red-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings & Fees
                </button>
                <button
                  onClick={() => { setPerspective('admin'); setAdminTab('audit'); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    adminTab === 'audit' ? 'bg-red-950/60 text-red-300 border border-red-700/50 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Audit Trail
                </button>
              </>
            )}
          </div>

          {/* Right Area: Actions & Auth */}
          <div className="flex items-center gap-3">
            
            {/* AI Assistant CTA */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/40 text-violet-200 hover:text-white hover:border-violet-400 text-xs font-semibold shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse-slow" />
              <span className="hidden sm:inline">AI Matchmaker</span>
            </button>

            {/* If Not Logged In */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth('creator')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-violet-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => handleOpenAuth('brand')}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/25 transition"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* If Authenticated */
              <div className="flex items-center gap-3">
                
                {/* Creator Wallet quick badge */}
                {currentUser.role === 'creator' && (
                  <div 
                    onClick={() => { setPerspective('creator'); setCreatorTab('wallet'); }}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs cursor-pointer hover:bg-emerald-950/60 transition"
                  >
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold">${wallet.available.toLocaleString()}</span>
                  </div>
                )}

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition relative"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#12131c] border border-slate-800 shadow-2xl p-4 z-50 text-slate-100 animate-in fade-in">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Escrow & Deal Alerts</h4>
                        <span className="text-[11px] text-violet-400">{notifications.length} alerts</span>
                      </div>
                      <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">{notif.title}</span>
                              <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                            </div>
                            <p className="text-slate-400 text-[11px]">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-violet-500/60"
                    />
                    <div className="hidden sm:block text-left">
                      <span className="text-xs font-bold text-white block leading-tight">{currentUser.name}</span>
                      <span className="text-[10px] text-violet-400 capitalize">{currentUser.role} Account</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#12131c] border border-slate-800 shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-slate-800/80">
                        <p className="font-bold text-white truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{currentUser.emailOrPhone}</p>
                      </div>

                      {currentUser.role === 'creator' && (
                        <button
                          onClick={() => {
                            setPerspective('creator');
                            setCreatorTab('mediakit');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 flex items-center gap-2"
                        >
                          <FileEdit className="w-3.5 h-3.5 text-violet-400" />
                          <span>Edit Media Kit</span>
                        </button>
                      )}

                      {currentUser.role === 'brand' && (
                        <button
                          onClick={() => {
                            setPerspective('brand');
                            setBrandTab('studio');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 flex items-center gap-2"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                          <span>New Campaign Brief</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
