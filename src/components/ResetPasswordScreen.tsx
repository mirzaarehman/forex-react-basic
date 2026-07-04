import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  CheckCircle, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface ResetPasswordScreenProps {
  onBackToLogin: () => void;
}

export default function ResetPasswordScreen({ onBackToLogin }: ResetPasswordScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0); // 0 to 4
  const [strengthText, setStrengthText] = useState('Strength');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const checkStrength = (val: string) => {
    setPassword(val);
    if (!val) {
      setStrength(0);
      setStrengthText('Strength');
      return;
    }
    let score = 0;
    if (val.length >= 6) score += 1;
    if (val.length >= 10) score += 1;
    if (/[A-Z]/.test(val)) score += 1;
    if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 1;
    
    setStrength(score === 0 ? 1 : score);
    
    if (score === 1) {
      setStrengthText('Weak');
    } else if (score === 2) {
      setStrengthText('Medium');
    } else if (score === 3) {
      setStrengthText('Strong');
    } else if (score >= 4) {
      setStrengthText('Secure');
    }
  };

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (strength < 2) {
      setError('Please provide a stronger password.');
      return;
    }
    
    setSuccess('Password updated successfully! Redirecting...');
    setError('');
    setTimeout(() => {
      onBackToLogin();
    }, 1500);
  };

  // Strength classes for password meter
  const getBarColorClass = (barIndex: number) => {
    if (strength < barIndex) return 'bg-[#353534]'; // Default surface-variant
    if (strength === 1) return 'bg-red-400'; // Error
    if (strength === 2) return 'bg-amber-400'; // Tertiary
    if (strength === 3) return 'bg-blue-400'; // Primary
    return 'bg-[#40e56c]'; // Secondary (Success)
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col justify-center items-center font-sans antialiased p-6 relative overflow-hidden w-full">
      {/* Ambient Grid Overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none"></div>

      {/* Top Bar Navigation */}
      <header className="fixed top-0 left-0 w-full flex items-center h-16 px-6 bg-[#131313]/90 backdrop-blur-md z-40 border-b border-[#2C2C2C] justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2962ff] rounded flex items-center justify-center text-white">
            <Lock size={16} />
          </div>
          <span className="font-bold text-white text-base">Apex Ledger</span>
        </div>
        <div className="text-sm font-bold text-white uppercase tracking-wider">
          ForexPro CRM
        </div>
      </header>

      <main className="w-full max-w-md mx-auto mt-16 relative z-10">
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle size={14} />
            <span>{success}</span>
          </div>
        )}

        {/* STEP 1: Email Entry */}
        {step === 1 && (
          <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-8 shadow-2xl relative">
            <div className="mb-6 text-center select-none">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2962ff]/10 text-[#2962ff] mb-4">
                <RefreshCw size={28} className="animate-spin-slow" />
              </span>
              <h1 className="text-xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-xs text-[#c3c5d8] leading-relaxed max-w-sm mx-auto">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSendLink} className="space-y-5">
              <div>
                <label className="block text-xs text-[#c3c5d8] mb-1.5" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8d90a2]">
                    <Mail size={16} />
                  </div>
                  <input 
                    className="w-full pl-10 bg-[#121212] border border-[#2C2C2C] rounded text-white p-3 font-mono text-xs focus:ring-1 focus:ring-[#2962ff] focus:border-[#2962ff] transition-colors focus:outline-none" 
                    id="email" 
                    type="email"
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2962ff] text-white hover:bg-[#004ee8] font-bold text-xs py-3 rounded transition-all uppercase tracking-widest hover:shadow-[0_4px_12px_rgba(41,98,255,0.3)] active:scale-[0.98]"
              >
                Send Recovery Link
              </button>

              <div className="text-center mt-6 pt-4 border-t border-[#2C2C2C]/50">
                <button 
                  type="button"
                  onClick={onBackToLogin}
                  className="inline-flex items-center gap-2 text-xs text-[#b6c4ff] hover:underline"
                >
                  <ArrowLeft size={12} />
                  Return to Login
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Confirmation / Demo Simulator Link */}
        {step === 2 && (
          <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-8 shadow-2xl text-center relative">
            <div className="mb-6 select-none">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-[#40e56c] mb-4">
                <CheckCircle size={28} />
              </span>
              <h1 className="text-xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-xs text-[#c3c5d8] leading-relaxed max-w-sm mx-auto">
                We've sent a password reset link to <span className="font-mono text-[#e5e2e1] bg-[#121212] px-1.5 py-0.5 rounded border border-[#2C2C2C]">{email || 'name@company.com'}</span>. Please check your inbox.
              </p>
            </div>

            <div className="space-y-4 mt-8">
              <button 
                onClick={() => setStep(3)}
                className="w-full bg-[#2a2a2a] text-[#e5e2e1] hover:bg-[#353534] border border-[#434656] font-bold text-xs py-3 rounded transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Sparkles size={14} className="text-[#40e56c]" />
                Simulate Clicking Link (Demo)
              </button>

              <p className="text-xs text-[#8d90a2]">
                Didn't receive the email?{' '}
                <button 
                  onClick={() => { setSuccess('We re-sent the recovery link.'); setError(''); }} 
                  className="text-[#b6c4ff] hover:underline font-semibold"
                >
                  Click to resend
                </button>
              </p>

              <div className="text-center mt-6 pt-4 border-t border-[#2C2C2C]/50">
                <button 
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-xs text-[#b6c4ff] hover:underline"
                >
                  <ArrowLeft size={12} />
                  Return to Link Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Create New Password */}
        {step === 3 && (
          <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-8 shadow-2xl relative">
            <div className="mb-6 text-center select-none">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2962ff]/10 text-[#2962ff] mb-4">
                <Lock size={28} />
              </span>
              <h1 className="text-xl font-bold text-white mb-2">Create New Password</h1>
              <p className="text-xs text-[#c3c5d8] leading-relaxed">
                Your new password must be unique and highly secure.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Password */}
              <div>
                <label className="block text-xs text-[#c3c5d8] mb-1.5" htmlFor="new-password">New Password</label>
                <div className="relative">
                  <input 
                    className="w-full bg-[#121212] border border-[#2C2C2C] rounded text-white p-3 pr-10 font-mono text-xs focus:ring-0 focus:border-[#2962ff] transition-colors focus:outline-none" 
                    id="new-password" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { checkStrength(e.target.value); setError(''); }}
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8d90a2] hover:text-[#e5e2e1]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                <div className="mt-3">
                  <div className="flex justify-between gap-1 mb-1.5">
                    <div className={`h-1 w-[24%] rounded-sm transition-all duration-300 ${getBarColorClass(1)}`}></div>
                    <div className={`h-1 w-[24%] rounded-sm transition-all duration-300 ${getBarColorClass(2)}`}></div>
                    <div className={`h-1 w-[24%] rounded-sm transition-all duration-300 ${getBarColorClass(3)}`}></div>
                    <div className={`h-1 w-[24%] rounded-sm transition-all duration-300 ${getBarColorClass(4)}`}></div>
                  </div>
                  <p className="text-xs text-[#8d90a2] text-right font-medium">
                    Strength: <span className={`font-bold uppercase ${
                      strength === 1 ? 'text-red-400' :
                      strength === 2 ? 'text-amber-400' :
                      strength === 3 ? 'text-blue-400' :
                      strength >= 4 ? 'text-[#40e56c]' : 'text-[#8d90a2]'
                    }`}>{strengthText}</span>
                  </p>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs text-[#c3c5d8] mb-1.5" htmlFor="confirm-password">Confirm New Password</label>
                <input 
                  className="w-full bg-[#121212] border border-[#2C2C2C] rounded text-white p-3 font-mono text-xs focus:ring-0 focus:border-[#2962ff] transition-colors focus:outline-none" 
                  id="confirm-password" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  required 
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#2962ff] text-white hover:bg-[#004ee8] font-bold text-xs py-3 rounded transition-all uppercase tracking-widest hover:shadow-[0_4px_12px_rgba(41,98,255,0.3)]"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
