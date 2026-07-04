import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Shield, 
  Zap, 
  TrendingUp, 
  Coins,
  ArrowRight,
  Globe,
  Phone,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onForgotPassword: () => void;
}

export default function LoginScreen({ onLoginSuccess, onForgotPassword }: LoginScreenProps) {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('trader@institution.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('');

  // Notifications
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    setSuccess('Authentication successful! Loading protocol...');
    setTimeout(() => {
      onLoginSuccess({
        name: email === 'trader@institution.com' ? 'Alex Sterling' : email.split('@')[0],
        email: email,
        phone: '(555) 000-0000',
        country: 'US',
        role: 'Senior Trader',
        avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop",
        balance: 10240.50
      });
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !regEmail || !regPhone || !regCountry) {
      setError('Please complete all personal and contact information.');
      return;
    }
    setSuccess('Registration request submitted! Please authenticate.');
    setTimeout(() => {
      setView('login');
      setEmail(regEmail);
      setPassword('password123');
      setSuccess('Registration successful! You can now log in using your credentials.');
      setError('');
    }, 1500);
  };

  const handleGoogleSSO = () => {
    setSuccess('Connecting with Google SSO...');
    setTimeout(() => {
      onLoginSuccess({
        name: 'Alexander Vance',
        email: 'a.vance@institutional.apex.com',
        phone: '+44 20 7946 0958',
        country: 'UK',
        role: 'Chief Investment Officer',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop',
        balance: 24592.80
      });
    }, 1000);
  };

  if (view === 'login') {
    return (
      <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex items-center justify-center font-sans antialiased geometric-bg relative overflow-hidden w-full p-6">
        {/* Ambient Grid Overlay */}
        <div className="absolute inset-0 grid-overlay pointer-events-none"></div>

        {/* Floating Mini Brand Header on top left */}
        <div className="absolute top-6 left-6 flex items-center gap-3 z-20 select-none">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2a2a2a] border border-[#434656] shadow-lg">
            <Coins className="text-[#2962ff] text-xl" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white leading-none text-base">Apex Ledger</span>
            <span className="text-[10px] text-[#c3c5d8] tracking-wider uppercase font-bold mt-0.5">Institutional</span>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="relative z-10 w-full max-w-md px-4 py-8">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#2a2a2a] border border-[#434656] mb-4 shadow-lg">
              <Coins className="text-[#2962ff]" size={24} />
            </div>
            <h1 className="font-bold text-2xl text-white tracking-tight">Apex Ledger</h1>
            <p className="text-sm text-[#c3c5d8] mt-1.5">Institutional Trading Protocol</p>
          </div>

          {/* Auth Card */}
          <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md relative">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-[#2C2C2C] pb-4">Secure Login</h2>

            {/* Notification Badges */}
            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle size={14} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-bold text-[#c3c5d8] uppercase tracking-wider mb-2" htmlFor="email">
                  Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8d90a2]">
                    <Mail size={16} />
                  </div>
                  <input 
                    className="block w-full pl-10 pr-3 py-2.5 bg-[#0e0e0e] border border-[#2C2C2C] rounded text-white font-mono text-xs placeholder-[#8d90a2] focus:ring-1 focus:ring-[#2962ff] focus:border-[#2962ff] transition-colors focus:outline-none" 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="trader@institution.com" 
                    required 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-bold text-[#c3c5d8] uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs text-[#b6c4ff] hover:text-[#2962ff] transition-colors font-medium"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8d90a2]">
                    <Lock size={16} />
                  </div>
                  <input 
                    className="block w-full pl-10 pr-10 py-2.5 bg-[#0e0e0e] border border-[#2C2C2C] rounded text-white font-mono text-xs placeholder-[#8d90a2] focus:ring-1 focus:ring-[#2962ff] focus:border-[#2962ff] transition-colors focus:outline-none" 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••" 
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8d90a2] hover:text-[#e5e2e1] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input 
                  className="h-4 w-4 rounded border-[#2C2C2C] bg-[#0e0e0e] text-[#2962ff] focus:ring-[#2962ff] focus:ring-offset-[#1c1b1b]" 
                  id="remember-me" 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="ml-2 block text-xs text-[#c3c5d8] cursor-pointer" htmlFor="remember-me">
                  Remember this device
                </label>
              </div>

              {/* Submit Button */}
              <button 
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded shadow-sm text-xs font-bold text-white bg-[#2962ff] hover:bg-[#004ee8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2962ff] focus:ring-offset-[#1c1b1b] transition-all uppercase tracking-widest mt-6 hover:shadow-[0_4px_16px_rgba(41,98,255,0.3)] active:scale-[0.98]" 
                type="submit"
              >
                Authenticate
              </button>
            </form>

            {/* SSO Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2C2C2C]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#1c1b1b] text-xs text-[#8d90a2]">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={handleGoogleSSO}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-[#2C2C2C] rounded bg-transparent text-xs font-semibold text-[#e5e2e1] hover:bg-[#2a2a2a] transition-colors hover:border-[#434656]" 
                  type="button"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  Google SSO
                </button>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-[#c3c5d8]">
            Requesting institutional access?{' '}
            <button 
              onClick={() => { setView('register'); setError(''); setSuccess(''); }}
              className="text-[#b6c4ff] hover:text-[#2962ff] font-medium transition-colors hover:underline"
            >
              Apply here
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  // Registration View
  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col md:flex-row font-sans antialiased">
      {/* Left Side: Brand Value Proposition */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-[#0e0e0e] flex-col justify-between p-10 lg:p-12 border-r border-[#2C2C2C] relative overflow-hidden select-none">
        {/* Abstract Dot Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #8d90a2 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#2962ff] rounded flex items-center justify-center text-white">
              <Coins size={18} />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">Apex Ledger</span>
          </div>
          <p className="text-sm text-[#c3c5d8] max-w-md leading-relaxed">
            Institutional-grade trading infrastructure. Open your account to access deep liquidity, advanced analytical tools, and secure segregated accounts.
          </p>
        </div>

        {/* Feature Cards Column */}
        <div className="space-y-5 relative z-10">
          {/* Feature 1 */}
          <div className="bg-[#131313] p-5 rounded-lg border border-[#2C2C2C] hover:bg-[#1c1b1b] transition-all">
            <div className="flex items-center gap-2 mb-1.5 text-white">
              <Shield size={16} className="text-[#2962ff]" />
              <h3 className="font-bold text-sm">Secure &amp; Regulated</h3>
            </div>
            <p className="text-xs text-[#c3c5d8] leading-relaxed">
              Client funds are segregated in Tier-1 banks. Fully compliant and regulated by top-tier financial authorities globally.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#131313] p-5 rounded-lg border border-[#2C2C2C] hover:bg-[#1c1b1b] transition-all">
            <div className="flex items-center gap-2 mb-1.5 text-white">
              <Zap size={16} className="text-[#40e56c]" />
              <h3 className="font-bold text-sm">Ultra-Fast Execution</h3>
            </div>
            <p className="text-xs text-[#c3c5d8] leading-relaxed">
              Direct market access with average execution speeds under 30ms. Fully optimized server hubs near primary market centers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#131313] p-5 rounded-lg border border-[#2C2C2C] hover:bg-[#1c1b1b] transition-all">
            <div className="flex items-center gap-2 mb-1.5 text-white">
              <TrendingUp size={16} className="text-[#ffb4a2]" />
              <h3 className="font-bold text-sm">Deep Liquidity</h3>
            </div>
            <p className="text-xs text-[#c3c5d8] leading-relaxed">
              Access to over 80+ currency pairs, premium indices, and raw commodity spreads with tight pricing models.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-[#2C2C2C]">
          <p className="text-[11px] text-[#8d90a2]">
            © 2026 ForexPro Institutional. Trading involves significant risk of loss.
          </p>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full md:w-1/2 lg:w-7/12 bg-[#131313] flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* Mobile Header (Visible only on small screens) */}
          <div className="md:hidden mb-6 text-center select-none">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 bg-[#2962ff] rounded flex items-center justify-center text-white">
                <Coins size={14} />
              </div>
              <h1 className="font-bold text-lg text-white">Apex Ledger</h1>
            </div>
            <p className="text-xs text-[#c3c5d8]">Create your institutional account</p>
          </div>

          {/* Form Container */}
          <div className="bg-[#1e1e1e] rounded-xl border border-[#2C2C2C] p-6 lg:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
            <div className="border-b border-[#2C2C2C] pb-4 mb-6">
              <h2 className="text-xl font-bold text-white">Registration</h2>
              <p className="text-xs text-[#c3c5d8] mt-1">Please complete the following details to begin.</p>
            </div>

            {/* Error / Success badges */}
            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <UserCheck size={14} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* Step 1: Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#b6c4ff] uppercase tracking-wider">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#c3c5d8] mb-1.5" htmlFor="firstName">First Name</label>
                    <input 
                      className="w-full bg-[#121212] border border-[#2C2C2C] rounded text-white text-xs py-2 px-3 focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] transition-colors" 
                      id="firstName" 
                      placeholder="e.g. Alex" 
                      type="text"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setError(''); }}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#c3c5d8] mb-1.5" htmlFor="lastName">Last Name</label>
                    <input 
                      className="w-full bg-[#121212] border border-[#2C2C2C] rounded text-white text-xs py-2 px-3 focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] transition-colors" 
                      id="lastName" 
                      placeholder="e.g. Sterling" 
                      type="text"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); setError(''); }}
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Contact Info */}
              <div className="space-y-4 pt-4 border-t border-[#2C2C2C]">
                <h3 className="text-xs font-bold text-[#b6c4ff] uppercase tracking-wider">Contact Information</h3>
                <div>
                  <label className="block text-xs text-[#c3c5d8] mb-1.5" htmlFor="regEmail">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8d90a2]">
                      <Mail size={14} />
                    </div>
                    <input 
                      className="w-full pl-9 bg-[#121212] border border-[#2C2C2C] rounded text-white text-xs py-2 px-3 focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] transition-colors" 
                      id="regEmail" 
                      placeholder="alex.sterling@example.com" 
                      type="email"
                      value={regEmail}
                      onChange={(e) => { setRegEmail(e.target.value); setError(''); }}
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#c3c5d8] mb-1.5" htmlFor="phone">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-[#1c1b1b] border border-r-0 border-[#2C2C2C] rounded-l text-[#c3c5d8] font-mono text-xs">
                      +1
                    </span>
                    <input 
                      className="flex-1 w-full bg-[#121212] border border-[#2C2C2C] rounded-r text-white font-mono text-xs py-2 px-3 focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] transition-colors" 
                      id="phone" 
                      placeholder="(555) 000-0000" 
                      type="tel"
                      value={regPhone}
                      onChange={(e) => { setRegPhone(e.target.value); setError(''); }}
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#c3c5d8] mb-1.5" htmlFor="country">Country of Residence</label>
                  <select 
                    className="w-full bg-[#121212] border border-[#2C2C2C] rounded text-white text-xs py-2.5 px-3 focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] transition-colors" 
                    id="country"
                    value={regCountry}
                    onChange={(e) => { setRegCountry(e.target.value); setError(''); }}
                    required
                  >
                    <option value="" disabled>Select Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="EU">European Union</option>
                    <option value="AU">Australia</option>
                    <option value="SG">Singapore</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-[#2C2C2C]">
                <button 
                  type="button"
                  onClick={() => { setView('login'); setError(''); setSuccess(''); }}
                  className="px-5 py-2 rounded border border-[#434656] text-[#e5e2e1] text-xs hover:bg-[#2a2a2a] transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded bg-[#2962ff] text-white text-xs hover:bg-[#004ee8] font-semibold transition-all shadow-[0_0_10px_rgba(41,98,255,0.3)] active:scale-[0.98]"
                >
                  Register
                </button>
              </div>
            </form>

            <div className="mt-6 text-center border-t border-[#2C2C2C]/50 pt-4">
              <p className="text-xs text-[#c3c5d8]">
                Already have an account?{' '}
                <button 
                  onClick={() => { setView('login'); setError(''); setSuccess(''); }}
                  className="text-[#b6c4ff] hover:underline font-medium"
                >
                  Log in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
