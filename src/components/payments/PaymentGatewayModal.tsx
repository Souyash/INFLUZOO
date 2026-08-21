import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  ArrowRight,
  AlertCircle,
  Clock,
  Download,
  DollarSign
} from 'lucide-react';
import { Deal, PaymentMethodType } from '../../types';
import { Badge } from '../common/Badge';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ isOpen, onClose, deal }) => {
  const { confirmEscrowDeposit, platformConfig } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('stripe_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState('Alex Rivera');
  const [zipCode, setZipCode] = useState('94107');

  // Bank transfer state
  const [bankAccount, setBankAccount] = useState('Chase Business Checking (•••• 9012)');

  // Processing state
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receiptTxId, setReceiptTxId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage(null);
      setReceiptTxId(null);
    }
  }, [isOpen]);

  if (!isOpen || !deal) return null;

  const grossAmount = deal.amount;
  const platformFee = Math.round(grossAmount * (platformConfig.platformTakeRatePercent / 100));
  const creatorNetAmount = grossAmount - platformFee;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    setErrorMessage(null);

    // Simulate real gateway processing
    setTimeout(async () => {
      const res = await confirmEscrowDeposit({
        dealId: deal.id,
        paymentMethod: paymentMethod,
        payerName: deal.brandName || cardName,
        cardLast4: paymentMethod === 'stripe_card' ? cardNumber.slice(-4).replace(/\s/g, '') || '4242' : undefined,
      });

      if (res.success) {
        setStatus('success');
        setReceiptTxId(res.transactionId || `tx-${Date.now()}`);
      } else {
        setStatus('error');
        setErrorMessage(res.message || 'Payment authorization failed. Please check your details.');
      }
    }, 1500);
  };

  const handleDownloadReceipt = () => {
    const receiptText = `
========================================
       INFLUZO SMART ESCROW RECEIPT
========================================
Receipt ID: ${receiptTxId || `tx-${Date.now()}`}
Timestamp: ${new Date().toUTCString()}
Deal ID: ${deal.id}
Campaign: ${deal.campaignTitle}
Brand (Payer): ${deal.brandName}
Creator (Recipient): ${deal.creatorName} (${deal.creatorHandle})
Deliverable: ${deal.packageTitle}

----------------------------------------
FINANCIAL BREAKDOWN:
----------------------------------------
Gross Escrow Locked:     $${grossAmount.toLocaleString()}.00 USD
Platform Take-Rate:      ${platformConfig.platformTakeRatePercent}% ($${platformFee.toLocaleString()}.00 USD)
Creator Net Allocation:  $${creatorNetAmount.toLocaleString()}.00 USD
Payment Method:          ${paymentMethod.toUpperCase()}

Status: GUARANTEED IN SMART ESCROW VAULT 🔒
========================================
Thank you for building on Influzo!
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([receiptText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Influzo_Escrow_Receipt_${deal.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-violet-500/40 bg-[#10111a] p-6 sm:p-8 shadow-2xl glow-purple text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        {status !== 'processing' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* State 1 & 2: Checkout Form & Processing */}
        {status !== 'success' ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">Fund Smart Escrow</h3>
                <Badge variant="purple">100% Milestone Protected</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Funds are held in secure escrow custody and only released when you approve the creator's live post.
              </p>
            </div>

            {/* Deal Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={deal.creatorAvatar}
                    alt={deal.creatorName}
                    className="w-11 h-11 rounded-xl object-cover border border-violet-500/50"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{deal.creatorName}</h4>
                    <p className="text-xs text-slate-400 font-mono">{deal.creatorHandle} • {deal.platform.toUpperCase()}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Escrow:</span>
                  <p className="text-lg font-extrabold text-emerald-400">${grossAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium text-slate-400">Package:</span>
                <span className="font-semibold text-white truncate max-w-[280px]">{deal.packageTitle}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Payment Method
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe_card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'stripe_card'
                      ? 'bg-violet-950/80 border-violet-500 text-white shadow-md shadow-violet-900/30'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-violet-400" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-violet-950/80 border-violet-500 text-white shadow-md shadow-violet-900/30'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Apple / Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-violet-950/80 border-violet-500 text-white shadow-md shadow-violet-900/30'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span>ACH Bank Wire</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Payment Fields */}
            <form onSubmit={handleProcessPayment} className="space-y-4">
              {paymentMethod === 'stripe_card' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="08/29"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        CVC / Security Code
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="888"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        required
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">1-Click Express Checkout</h4>
                  <p className="text-xs text-slate-400">
                    Authenticate via biometric Touch ID / Face ID with your default wallet card.
                  </p>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Verified Corporate Account:</span>
                    <span className="font-bold text-teal-400">Plaid Linked</span>
                  </div>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <p className="text-[11px] text-slate-500">
                    Funds will be locked into escrow immediately with instantaneous wire clearance.
                  </p>
                </div>
              )}

              {/* Submit / Pay Button */}
              <button
                type="submit"
                disabled={status === 'processing'}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-violet-600 hover:from-emerald-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'processing' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authorizing & Locking into Escrow...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Lock ${grossAmount.toLocaleString()} into Escrow Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted • PCI-DSS Level 1 Compliant • SQLite Ledger</span>
            </div>

          </div>
        ) : (
          /* State 3: Payment Success Receipt */
          <div className="text-center space-y-5 py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Escrow Deposit Confirmed!</h3>
              <p className="text-xs text-slate-300">
                ${grossAmount.toLocaleString()} is securely locked in the Smart Escrow Vault for <span className="text-white font-bold">{deal.creatorName}</span>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Transaction ID:</span>
                <span className="text-white font-bold">{receiptTxId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payer:</span>
                <span className="text-white">{deal.brandName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Escrow Custody:</span>
                <span className="text-emerald-400 font-bold">${grossAmount.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Deliverable:</span>
                <span className="text-slate-300 truncate max-w-[200px]">{deal.packageTitle}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-violet-400" />
                <span>Download Receipt (.txt)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition"
              >
                Done & View Deal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
