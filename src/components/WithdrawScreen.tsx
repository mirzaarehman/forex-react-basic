import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  HelpCircle, 
  Bell, 
  User, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Info,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { TradingAccount, WithdrawalTransaction } from '../types';

interface WithdrawScreenProps {
  accounts: TradingAccount[];
  withdrawals: WithdrawalTransaction[];
  onWithdrawSubmit: (amount: number, accountId: string, method: string, ending: string) => void;
}

export default function WithdrawScreen({ accounts, withdrawals, onWithdrawSubmit }: WithdrawScreenProps) {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'bank' | 'crypto'>('bank');
  
  // Bank fields
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');

  // Crypto fields
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('TRC20');

  // OTP Verification code (6 boxes)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Set default account ID
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const activeAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];
  const maxAvailable = activeAccount ? activeAccount.balance : 10240.50;

  const handleMax = () => {
    if (maxAvailable) {
      setAmount(maxAvailable);
      setError('');
    }
  };

  // OTP change handler with auto focus moving forward and backward
  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val)) && val !== '') return;
    
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next
    if (val !== '' && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount) || 0;

    if (!selectedAccountId) {
      setError('Please select an account.');
      return;
    }
    if (numAmount <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }
    if (numAmount < 50) {
      setError('Minimum withdrawal is $50.00.');
      return;
    }
    if (numAmount > maxAvailable) {
      setError(`Insufficient funds in select account. Available balance is $${maxAvailable.toLocaleString('en-US')}.`);
      return;
    }

    if (withdrawalMethod === 'bank') {
      if (!bankName || !accountNumber || !swiftCode) {
        setError('Please complete all beneficiary bank details.');
        return;
      }
    } else {
      if (!cryptoAddress) {
        setError('Please enter a destination wallet address.');
        return;
      }
    }

    // Check OTP has all elements filled
    if (otp.some(box => box === '')) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    const finalMethod = withdrawalMethod === 'bank' ? 'Bank Transfer' : `Crypto Wallet (${cryptoNetwork})`;
    const endingStr = withdrawalMethod === 'bank' 
      ? `Ending ${accountNumber.slice(-4) || '4452'}` 
      : `${cryptoNetwork} Wallet`;

    onWithdrawSubmit(numAmount, selectedAccountId, finalMethod, endingStr);

    setSuccess(`Withdrawal request of $${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} successfully submitted!`);
    setAmount('');
    setBankName('');
    setAccountNumber('');
    setSwiftCode('');
    setCryptoAddress('');
    setOtp(['', '', '', '', '', '']);
    otpRefs[0].current?.focus();

    setTimeout(() => {
      setSuccess('');
    }, 4500);
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen text-[#e5e2e1] font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16 px-6 lg:px-8 bg-[#131313]/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#2C2C2C] select-none font-sans">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg text-white">ForexPro CRM</div>
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
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar grid grid-cols-1 xl:grid-cols-12 gap-6 select-none">
        {/* Header Title */}
        <div className="xl:col-span-12">
          <h1 className="text-2xl font-bold text-white tracking-tight">Withdraw Funds</h1>
          <p className="text-xs text-[#8d90a2] mt-1.5">Transfer available balance to your external accounts securely.</p>
        </div>

        {/* Alerts Block */}
        {(success || error) && (
          <div className="xl:col-span-12">
            {success && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 shadow-lg font-semibold">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3 shadow-lg font-semibold">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Left Column: Form Details */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Available balance card */}
          <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-[#8d90a2] uppercase tracking-wider">Available for Withdrawal</span>
              <span className="inline-flex items-center gap-1 text-[#40e56c] font-semibold text-xs bg-[#40e56c]/10 border border-[#40e56c]/20 px-2 py-0.5 rounded-full uppercase tracking-widest text-[9px]">
                Verified
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              ${Math.floor(maxAvailable).toLocaleString('en-US')}.
              <span className="text-xl text-[#8d90a2] font-mono">
                {(maxAvailable % 1).toFixed(2).substring(2)}
              </span>
            </div>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-white border-b border-[#2C2C2C] pb-4 font-sans">Withdrawal Details</h3>

            {/* Select account */}
            <div>
              <label className="block text-xs text-[#c3c5d8] mb-2 font-medium">From Account</label>
              <select 
                value={selectedAccountId}
                onChange={(e) => { setSelectedAccountId(e.target.value); setError(''); }}
                className="w-full bg-[#121212] border border-[#2c2c2c] rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-[#2962ff]"
              >
                {accounts.filter(a => a.status === 'active').map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.id} ({acc.type}) - {acc.currencySymbol}{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs text-[#c3c5d8] mb-2 font-medium">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#8d90a2] font-mono text-sm">$</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-[#121212] border border-[#2c2c2c] rounded-lg text-white font-mono text-xs pl-8 pr-16 py-3 focus:outline-none focus:border-[#2962ff]"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAmount(val === '' ? '' : Number(val));
                    setError('');
                  }}
                  min="50"
                  max={maxAvailable}
                  required
                />
                <button 
                  type="button"
                  onClick={handleMax}
                  className="absolute right-3 top-3 text-xs text-[#2962ff] hover:text-[#004ee8] font-bold uppercase tracking-wider"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Tabs for Withdrawal Method */}
            <div>
              <label className="block text-xs text-[#c3c5d8] mb-2 font-medium">Withdrawal Method</label>
              <div className="flex gap-2 p-1 bg-[#121212] rounded border border-[#2c2c2c]">
                <button 
                  type="button"
                  onClick={() => { setWithdrawalMethod('bank'); setError(''); }}
                  className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded transition-all ${
                    withdrawalMethod === 'bank' 
                      ? 'bg-[#1c1b1b] text-white border-b-2 border-[#2962ff]' 
                      : 'text-[#8d90a2] hover:text-white hover:bg-[#131313]'
                  }`}
                >
                  Bank Transfer
                </button>
                <button 
                  type="button"
                  onClick={() => { setWithdrawalMethod('crypto'); setError(''); }}
                  className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded transition-all ${
                    withdrawalMethod === 'crypto' 
                      ? 'bg-[#1c1b1b] text-white border-b-2 border-[#2962ff]' 
                      : 'text-[#8d90a2] hover:text-white hover:bg-[#131313]'
                  }`}
                >
                  Crypto Wallet
                </button>
              </div>

              {/* Sub Forms */}
              <div className="mt-4 p-4 border border-[#2c2c2c] rounded bg-[#161616] space-y-4">
                {withdrawalMethod === 'bank' ? (
                  <>
                    <div>
                      <label className="block text-[11px] text-[#8d90a2] mb-1">Beneficiary Bank</label>
                      <input 
                        type="text" 
                        placeholder="Bank Name"
                        className="w-full bg-[#121212] border border-[#2c2c2c] rounded text-white p-2.5 text-xs focus:outline-none focus:border-[#2962ff]"
                        value={bankName}
                        onChange={(e) => { setBankName(e.target.value); setError(''); }}
                        required={withdrawalMethod === 'bank'}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-[#8d90a2] mb-1">IBAN / Account No.</label>
                        <input 
                          type="text" 
                          placeholder="Account Number"
                          className="w-full bg-[#121212] border border-[#2c2c2c] rounded text-white p-2.5 text-xs font-mono focus:outline-none focus:border-[#2962ff]"
                          value={accountNumber}
                          onChange={(e) => { setAccountNumber(e.target.value); setError(''); }}
                          required={withdrawalMethod === 'bank'}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#8d90a2] mb-1">SWIFT / BIC</label>
                        <input 
                          type="text" 
                          placeholder="SWIFT CODE"
                          className="w-full bg-[#121212] border border-[#2c2c2c] rounded text-white p-2.5 text-xs font-mono uppercase focus:outline-none focus:border-[#2962ff]"
                          value={swiftCode}
                          onChange={(e) => { setSwiftCode(e.target.value); setError(''); }}
                          required={withdrawalMethod === 'bank'}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] text-[#8d90a2] mb-1">Token</label>
                        <select className="w-full bg-[#121212] border border-[#2c2c2c] rounded text-white p-2 text-xs focus:outline-none">
                          <option>USDT</option>
                          <option>USDC</option>
                          <option>BTC</option>
                          <option>ETH</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] text-[#8d90a2] mb-1">Network</label>
                        <select 
                          value={cryptoNetwork}
                          onChange={(e) => setCryptoNetwork(e.target.value)}
                          className="w-full bg-[#121212] border border-[#2c2c2c] rounded text-white p-2 text-xs focus:outline-none"
                        >
                          <option value="TRC20">TRON (TRC20)</option>
                          <option value="ERC20">Ethereum (ERC20)</option>
                          <option value="SOL">Solana (SPL)</option>
                          <option value="BTC">Bitcoin Network</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#8d90a2] mb-1">Destination Address</label>
                      <input 
                        type="text" 
                        placeholder="e.g. T9yD14Nj9y..."
                        className="w-full bg-[#121212] border border-[#2c2c2c] rounded text-white p-2.5 text-xs font-mono focus:outline-none focus:border-[#2962ff]"
                        value={cryptoAddress}
                        onChange={(e) => { setCryptoAddress(e.target.value); setError(''); }}
                        required={withdrawalMethod === 'crypto'}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* OTP Verification code inputs */}
            <div className="bg-[#1c1b1b] border border-[#2c2c2c] rounded-lg p-4 flex flex-col md:flex-row items-start gap-4">
              <Lock className="text-[#2962ff] shrink-0 mt-1" size={20} />
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-white mb-0.5">Security Verification</label>
                <p className="text-[11px] text-[#8d90a2] mb-3">Enter the 6-digit code sent to your registered authenticator app.</p>
                
                <div className="flex items-center gap-2 max-w-[280px]">
                  {otp.map((val, idx) => (
                    <React.Fragment key={idx}>
                      <input 
                        ref={otpRefs[idx]}
                        type="text" 
                        maxLength={1}
                        placeholder="·"
                        value={val}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-9 h-11 text-center bg-[#121212] border border-[#2c2c2c] rounded text-white font-mono text-base font-bold focus:border-[#2962ff] focus:ring-0 outline-none"
                      />
                      {idx === 2 && <span className="text-[#8d90a2] font-semibold text-lg">-</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Trigger */}
            <button 
              type="submit"
              className="w-full py-3.5 bg-[#2962ff] hover:bg-[#004ee8] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_4px_14px_rgba(41,98,255,0.3)] active:scale-[0.98]"
            >
              Submit Withdrawal Request
            </button>
          </form>
        </div>

        {/* Right Column: Withdrawals History */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Important Notice */}
          <div className="bg-[#1e1e1e] border-l-4 border-l-[#02c953] border border-[#2C2C2C] rounded-xl p-5 shadow-sm">
            <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
              <Info size={14} className="text-[#02c953]" />
              Important Notice
            </h4>
            <p className="text-[11px] text-[#c3c5d8] leading-relaxed">
              Withdrawals are processed within 24 hours during standard London banking hours. Bank transfers may take an additional 1-3 business days to credit in your destination bank account depending on your local provider. Minimum withdrawal is $50.
            </p>
          </div>

          {/* Recent Withdrawals */}
          <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#2C2C2C] pb-3">
              <h3 className="text-sm font-bold text-white font-sans">Recent Withdrawals</h3>
              <button className="text-[10px] font-bold text-[#2962ff] uppercase tracking-wider hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {withdrawals.map((withdraw) => (
                <div key={withdraw.id} className="flex justify-between items-center hover:bg-[#252525] p-2.5 -mx-2.5 rounded-lg transition-colors group">
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded bg-[#121212] border border-[#2c2c2c] flex items-center justify-center text-[#8d90a2] group-hover:text-[#2962ff] transition-colors shrink-0">
                      <Briefcase size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{withdraw.method}</p>
                      <p className="text-[10px] text-[#8d90a2] mt-0.5">{withdraw.dateTime}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-xs font-bold text-white">
                      ${Math.abs(withdraw.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest mt-0.5 ${
                      withdraw.status === 'Completed' ? 'text-[#40e56c]' : 'text-red-400'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        withdraw.status === 'Completed' ? 'bg-[#40e56c]' : 'bg-red-400'
                      }`}></span>
                      {withdraw.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
