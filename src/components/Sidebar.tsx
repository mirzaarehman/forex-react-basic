import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  PlusCircle, 
  MinusCircle, 
  Activity, 
  Receipt, 
  HelpCircle, 
  Settings, 
  LogOut,
  Sparkles,
  User,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  user: UserProfile;
  onLogout: () => void;
}

export default function Sidebar({ activeScreen, setActiveScreen, user, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: Wallet },
    { id: 'deposit', label: 'Deposit', icon: PlusCircle },
    { id: 'withdraw', label: 'Withdraw', icon: MinusCircle },
    { id: 'trades', label: 'Trades', icon: Activity },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#0e0e0e] border-r border-[#2C2C2C] flex flex-col py-6 z-50 text-[#e5e2e1] select-none font-sans">
      {/* Brand & Logo */}
      <div className="px-6 mb-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-[#2962ff] rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(41,98,255,0.4)]">
          <ShieldCheck size={20} className="stroke-2" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight leading-none text-white">Apex Ledger</span>
          <span className="text-[10px] uppercase tracking-widest text-[#8d90a2] font-semibold mt-0.5">Institutional</span>
        </div>
      </div>

      {/* Mini Profile Info Card */}
      <div className="px-4 mb-6">
        <div className="bg-[#1c1b1b] border border-[#2c2c2c] rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#353534] flex items-center justify-center overflow-hidden border border-[#434656] relative group">
            {user.avatarUrl ? (
              <img 
                alt="Trader Profile" 
                className="w-full h-full object-cover" 
                src={user.avatarUrl}
                referrerPolicy="no-referrer"
              />
            ) : (
              <User size={18} className="text-[#c3c5d8]" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Sparkles size={12} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-white truncate leading-tight">{user.name}</div>
            <div className="font-mono text-xs text-[#40e56c] truncate mt-0.5">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setActiveScreen('deposit')}
          className="w-full py-2.5 px-4 bg-[#2962ff] hover:bg-[#004ee8] text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(41,98,255,0.25)] hover:shadow-[0_4px_16px_rgba(41,98,255,0.4)] mt-4 active:scale-[0.98]"
        >
          Deposit Funds
        </button>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-1 px-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id || (item.id === 'dashboard' && activeScreen === 'accounts');
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-[#1c1b1b] text-[#40e56c] border-l-4 border-[#40e56c] pl-3 font-semibold' 
                  : 'text-[#c3c5d8] hover:text-white hover:bg-[#1c1b1b]/50'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#40e56c]' : 'text-[#8d90a2]'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Items */}
      <div className="px-2 pt-4 border-t border-[#2C2C2C] mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#8d90a2] hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
