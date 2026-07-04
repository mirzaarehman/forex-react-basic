import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Coins, 
  Wallet, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle,
  Lock,
  Search,
  Bell,
  User,
  Activity,
  History,
  Info
} from 'lucide-react';
import { TradingAccount, DepositTransaction } from '../types';

interface DepositScreenProps {
  accounts: TradingAccount[];
  deposits: DepositTransaction[];
  onDepositSubmit: (amount: number, accountId: string, method: string) => void;
}

export default function DepositScreen({ accounts, deposits, onDepositSubmit }: DepositScreenProps) {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'wire' | 'card' | 'ewallet'>('crypto');
  
  const [feePercent, setFeePercent] = useState(0);
  const [feeFixed, setFeeFixed] = useState(0);
  const [feeLabel, setFeeLabel] = useState('Processing Fee (0%)');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Set default account ID
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  // Update fees based on payment method selection
  useEffect(() => {
    if (paymentMethod === 'crypto') {
      setFeePercent(0);
      setFeeFixed(0);
      setFeeLabel('Processing Fee (0%)');
    } else if (paymentMethod === 'wire') {
      setFeePercent(0);
      setFeeFixed(25);
      setFeeLabel('Processing Fee ($25 Flat)');
    } else if (paymentMethod === 'card') {
      setFeePercent(0.029);
      setFeeFixed(0);
      setFeeLabel('Processing Fee (2.9%)');
    } else if (paymentMethod === 'ewallet') {
      setFeePercent(0.015);
      setFeeFixed(0);
      setFeeLabel('Processing Fee (1.5%)');
    }
  }, [paymentMethod]);

  const numAmount = Number(amount) || 0;
  const computedFee = (numAmount * feePercent) + feeFixed;
  const totalCredit = Math.max(0, numAmount - computedFee);

  const handleQuickAdd = (val: number) => {
    setAmount((prev) => {
      const current = Number(prev) || 0;
      const next = current + val;
      return next > 50000 ? 50000 : next;
    });
    setError('');
  };

  const handleMax = () => {
    setAmount(50000);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId) {
      setError('Please select an account to credit.');
      return;
    }
    if (!amount || numAmount < 100) {
      setError('Minimum deposit is $100.00.');
      return;
    }
    if (numAmount > 50000) {
      setError('Maximum deposit is $50,000.00 per transaction.');
      return;
    }

    let methodStr = 'Cryptocurrency';
    if (paymentMethod === 'wire') methodStr = 'Bank Wire';
    if (paymentMethod === 'card') methodStr = 'Credit/Debit Card';
    if (paymentMethod === 'ewallet') methodStr = 'E-Wallets';

    onDepositSubmit(totalCredit, selectedAccountId, methodStr);
    
    setSuccess(`Deposit request of $${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} has been received! Balance credited.`);
    setAmount('');
    setError('');

    setTimeout(() => {
      setSuccess('');
    }, 4500);
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen text-[#e5e2e1] font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16 px-6 lg:px-8 bg-[#131313]/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#2C2C2C] select-none">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg text-white">Deposit Gateway</div>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-[#c3c5d8]">
          <button className="text-[#8d90a2] hover:text-[#2962ff] transition-colors p-1.5 hover:bg-[#1c1b1b] rounded-lg">
            <Bell size={18} />
          </button>
          <div className="h-6 w-px bg-[#2C2C2C]"></div>
          <button className="flex items-center gap-2 text-[#8d90a2] hover:text-[#2962ff] transition-colors p-1 rounded-lg">
            <span className="hidden md:block uppercase tracking-wider text-[11px] text-[#2962ff]">Account Switcher</span>
            <User size={18} />
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        {success && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 shadow-lg select-none">
            <CheckCircle size={16} />
            <span className="font-semibold">{success}</span>
          </div>
        )}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3 shadow-lg select-none">
            <AlertTriangle size={16} />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Entry */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
            {/* Account & Amount Card */}
            <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-6">
              <h2 className="text-base font-bold text-white mb-6 border-b border-[#2C2C2C] pb-2">Deposit Details</h2>
              <div className="space-y-6">
                {/* Account Selection */}
                <div>
                  <label className="block text-xs text-[#c3c5d8] mb-2 font-medium">Select Account to Credit</label>
                  <select 
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full bg-[#131313] border border-[#2C2C2C] rounded-lg px-4 py-3 text-xs font-mono text-white focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] transition-colors cursor-pointer"
                  >
                    {accounts.filter(a => acc => a.status === 'active').map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.id} ({acc.type}) - Bal: {acc.currencySymbol}{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Entry */}
                <div>
                  <label className="block text-xs text-[#c3c5d8] mb-2 font-medium">Deposit Amount</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 pl-4 text-[#8d90a2] font-mono text-base pointer-events-none">
                      $
                    </div>
                    <input 
                      className="w-full bg-[#131313] border border-[#2C2C2C] rounded-lg pl-8 pr-16 py-4 text-[#40e56c] font-bold text-3xl text-right focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] transition-colors placeholder-[#353534]" 
                      placeholder="0.00" 
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAmount(val === '' ? '' : Number(val));
                        setError('');
                      }}
                      min="100"
                      max="50000"
                      required
                    />
                    <div className="absolute right-0 pr-4 text-[#8d90a2] font-semibold text-xs pointer-events-none">
                      USD
                    </div>
                  </div>

                  <div className="flex justify-between mt-2 text-[10px] text-[#8d90a2] uppercase tracking-wider font-semibold">
                    <span>Min: $100.00</span>
                    <span>Max: $50,000.00 per transaction</span>
                  </div>

                  {/* Increments */}
                  <div className="flex flex-wrap gap-2 mt-3 select-none">
                    <button 
                      type="button"
                      onClick={() => handleQuickAdd(100)}
                      className="px-3 py-1.5 border border-[#2C2C2C] rounded-lg text-[10px] font-bold text-[#c3c5d8] hover:bg-[#2a2a2a] hover:text-white transition-colors"
                    >
                      +100
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleQuickAdd(500)}
                      className="px-3 py-1.5 border border-[#2C2C2C] rounded-lg text-[10px] font-bold text-[#c3c5d8] hover:bg-[#2a2a2a] hover:text-white transition-colors"
                    >
                      +500
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleQuickAdd(1000)}
                      className="px-3 py-1.5 border border-[#2C2C2C] rounded-lg text-[10px] font-bold text-[#c3c5d8] hover:bg-[#2a2a2a] hover:text-white transition-colors"
                    >
                      +1,000
                    </button>
                    <button 
                      type="button"
                      onClick={handleMax}
                      className="px-3 py-1.5 border border-[#2C2C2C] rounded-lg text-[10px] font-bold text-[#2962ff] bg-[#2962ff]/10 hover:bg-[#2962ff]/20 transition-all ml-auto"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods Choice Grid */}
            <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-6">
              <h2 className="text-base font-bold text-white mb-6 border-b border-[#2C2C2C] pb-2 font-sans">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                {/* Crypto */}
                <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-all ${
                  paymentMethod === 'crypto' 
                    ? 'border-[#2962ff] bg-[#2962ff]/5' 
                    : 'border-[#2C2C2C] bg-[#131313] hover:bg-[#1c1b1b]'
                }`}>
                  <input 
                    className="sr-only" 
                    name="payment_method" 
                    type="radio" 
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={() => setPaymentMethod('crypto')}
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="flex items-center gap-2 mb-1">
                        <Coins className={`text-base ${paymentMethod === 'crypto' ? 'text-[#2962ff]' : 'text-[#8d90a2]'}`} size={16} />
                        <span className="block text-xs font-bold text-white uppercase tracking-wider">Cryptocurrency</span>
                      </span>
                      <span className="block text-[10px] text-[#c3c5d8]">BTC, ETH, USDT, USDC</span>
                      <span className="block mt-2 text-[10px] font-bold text-[#40e56c]">0% Fee • Instant</span>
                    </span>
                  </span>
                </label>

                {/* Bank Wire */}
                <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-all ${
                  paymentMethod === 'wire' 
                    ? 'border-[#2962ff] bg-[#2962ff]/5' 
                    : 'border-[#2C2C2C] bg-[#131313] hover:bg-[#1c1b1b]'
                }`}>
                  <input 
                    className="sr-only" 
                    name="payment_method" 
                    type="radio" 
                    value="wire"
                    checked={paymentMethod === 'wire'}
                    onChange={() => setPaymentMethod('wire')}
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="flex items-center gap-2 mb-1">
                        <Wallet className={`text-base ${paymentMethod === 'wire' ? 'text-[#2962ff]' : 'text-[#8d90a2]'}`} size={16} />
                        <span className="block text-xs font-bold text-white uppercase tracking-wider">Bank Wire</span>
                      </span>
                      <span className="block text-[10px] text-[#c3c5d8]">Global SWIFT / Local ACH</span>
                      <span className="block mt-2 text-[10px] font-bold text-[#8d90a2]">$25 Fee • 1-3 Business Days</span>
                    </span>
                  </span>
                </label>

                {/* Credit Card */}
                <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-[#2962ff] bg-[#2962ff]/5' 
                    : 'border-[#2C2C2C] bg-[#131313] hover:bg-[#1c1b1b]'
                }`}>
                  <input 
                    className="sr-only" 
                    name="payment_method" 
                    type="radio" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="flex items-center gap-2 mb-1">
                        <CreditCard className={`text-base ${paymentMethod === 'card' ? 'text-[#2962ff]' : 'text-[#8d90a2]'}`} size={16} />
                        <span className="block text-xs font-bold text-white uppercase tracking-wider">Credit/Debit Card</span>
                      </span>
                      <span className="block text-[10px] text-[#c3c5d8]">Visa, Mastercard</span>
                      <span className="block mt-2 text-[10px] font-bold text-red-400">2.9% Fee • Instant</span>
                    </span>
                  </span>
                </label>

                {/* E-Wallet */}
                <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-all ${
                  paymentMethod === 'ewallet' 
                    ? 'border-[#2962ff] bg-[#2962ff]/5' 
                    : 'border-[#2C2C2C] bg-[#131313] hover:bg-[#1c1b1b]'
                }`}>
                  <input 
                    className="sr-only" 
                    name="payment_method" 
                    type="radio" 
                    value="ewallet"
                    checked={paymentMethod === 'ewallet'}
                    onChange={() => setPaymentMethod('ewallet')}
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="flex items-center gap-2 mb-1">
                        <Wallet className={`text-base ${paymentMethod === 'ewallet' ? 'text-[#2962ff]' : 'text-[#8d90a2]'}`} size={16} />
                        <span className="block text-xs font-bold text-white uppercase tracking-wider">E-Wallets</span>
                      </span>
                      <span className="block text-[10px] text-[#c3c5d8]">Skrill, Neteller</span>
                      <span className="block mt-2 text-[10px] font-bold text-[#8d90a2]">1.5% Fee • Instant</span>
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </form>

          {/* Right Column: Dynamic summary card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-6 sticky top-24 select-none">
              <h2 className="text-base font-bold text-white mb-6 border-b border-[#2C2C2C] pb-2 font-sans">Transaction Summary</h2>
              
              <div className="space-y-4 mb-8 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#8d90a2]">Deposit Amount</span>
                  <span className="text-white font-mono font-bold">${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8d90a2]">{feeLabel}</span>
                  <span className="text-[#8d90a2] font-mono">${computedFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#2C2C2C]">
                  <span className="text-sm font-bold text-white uppercase">Total Credit</span>
                  <span className="text-[#2962ff] font-mono text-xl font-bold">${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Segregated account callout */}
              <div className="bg-[#121212] border border-[#2C2C2C] p-4 rounded-lg mb-8 flex gap-3 items-start">
                <Info size={18} className="text-[#40e56c] shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#c3c5d8] leading-relaxed">
                  Your funds are held in segregated top-tier bank accounts in strict compliance with FCA client money regulations.
                </p>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full py-4 px-6 bg-[#2962ff] hover:bg-[#004ee8] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(41,98,255,0.3)]"
              >
                <Lock size={14} />
                Secure Deposit
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Deposits Table */}
        <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-6 mt-4 select-none">
          <div className="flex justify-between items-center mb-6 border-b border-[#2C2C2C] pb-2">
            <h2 className="text-base font-bold text-white">Recent Deposits</h2>
            <button className="text-[10px] font-bold text-[#2962ff] uppercase tracking-wider flex items-center gap-1 hover:underline">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#2C2C2C]">
                  <th className="py-3 px-2 text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Date &amp; Time</th>
                  <th className="py-3 px-2 text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Transaction ID</th>
                  <th className="py-3 px-2 text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Method</th>
                  <th className="py-3 px-2 text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider text-right">Amount</th>
                  <th className="py-3 px-2 text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-white divide-y divide-[#2C2C2C]/50">
                {deposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-[#121212]/30 transition-colors group">
                    <td className="py-3.5 px-2 text-[#8d90a2]">{dep.dateTime}</td>
                    <td className="py-3.5 px-2 text-white font-medium group-hover:text-[#2962ff] cursor-pointer transition-colors">
                      {dep.txId}
                    </td>
                    <td className="py-3.5 px-2 text-[#c3c5d8]">
                      {dep.method}
                    </td>
                    <td className="py-3.5 px-2 text-right font-bold text-white">
                      ${dep.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        dep.status === 'Success' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-[#40e56c]'
                          : dep.status === 'Pending'
                          ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          dep.status === 'Success' 
                            ? 'bg-[#40e56c]' 
                            : dep.status === 'Pending'
                            ? 'bg-yellow-400 animate-pulse'
                            : 'bg-red-400'
                        }`}></span>
                        {dep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
