import React, { useState } from 'react';
import { 
  Plus, 
  Wallet, 
  ChevronRight, 
  Sparkles, 
  X, 
  Info,
  Archive,
  ArrowRight,
  TrendingUp,
  Search,
  Bell,
  User,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { TradingAccount } from '../types';

interface DashboardScreenProps {
  accounts: TradingAccount[];
  onCreateAccount: (newAccount: { environment: 'Live' | 'Demo'; platform: string; leverage: string }) => void;
  setActiveScreen: (screen: string) => void;
}

export default function DashboardScreen({ accounts, onCreateAccount, setActiveScreen }: DashboardScreenProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newEnv, setNewEnv] = useState<'Live' | 'Demo'>('Live');
  const [newPlatform, setNewPlatform] = useState('MetaTrader 5');
  const [newLeverage, setNewLeverage] = useState('1:500');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering active/archived accounts
  const activeAccounts = accounts.filter(acc => acc.status === 'active');
  const archivedAccounts = accounts.filter(acc => acc.status === 'archived');

  // Compute stats
  const totalEquity = activeAccounts.reduce((sum, acc) => {
    // Standard conversion to USD for calculation
    const value = acc.equity;
    return sum + value;
  }, 0);

  const freeMargin = totalEquity * 0.74; // Mock margin logic

  const liveCount = activeAccounts.filter(acc => acc.environment === 'Live').length;
  const demoCount = activeAccounts.filter(acc => acc.environment === 'Demo').length;

  // Filter based on search term
  const filteredActive = activeAccounts.filter(acc => {
    const idStr = acc.id || '';
    const typeStr = acc.type || '';
    return idStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
           typeStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAccount({
      environment: newEnv,
      platform: newPlatform,
      leverage: newLeverage
    });
    setSuccessMsg(`Successfully provisioned new ${newPlatform} ${newEnv} environment!`);
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen text-[#e5e2e1] font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16 px-6 lg:px-8 bg-[#131313]/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#2C2C2C] select-none">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg text-white tracking-tight">ForexPro CRM</span>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d90a2]">
              <Search size={18} />
            </span>
            <input 
              className="w-full bg-[#1c1b1b] border border-[#2C2C2C] rounded-lg py-2 pl-10 pr-4 text-xs font-mono text-white placeholder-[#8d90a2] focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] transition-all" 
              placeholder="Search accounts, trades..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4 text-sm font-bold text-[#c3c5d8]">
          <button className="text-[#8d90a2] hover:text-[#2962ff] transition-colors relative p-1.5 hover:bg-[#1c1b1b] rounded-lg">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#ffb4ab] rounded-full"></span>
          </button>
          <div className="h-6 w-px bg-[#2C2C2C] hidden md:block"></div>
          <button className="flex items-center gap-2 text-[#8d90a2] hover:text-[#2962ff] transition-colors p-1 rounded-lg">
            <span className="hidden md:block uppercase tracking-wider text-[11px] text-[#2962ff]">Account Switcher</span>
            <User size={18} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        {/* Page Title & Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2C2C2C] pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Trading Accounts</h1>
            <p className="text-xs text-[#8d90a2] mt-1.5">Manage your Live and Demo trading environments.</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-[#2962ff] hover:bg-[#004ee8] text-white font-bold text-xs py-3 px-5 rounded-lg flex items-center gap-2 transition-all shadow-[0_4px_12px_rgba(41,98,255,0.3)] hover:shadow-[0_4px_16px_rgba(41,98,255,0.5)] uppercase tracking-wider active:scale-[0.98]"
          >
            <Plus size={14} className="stroke-2" />
            Open New Account
          </button>
        </div>

        {/* Dynamic Alert Banner */}
        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 shadow-lg select-none">
            <CheckCircle size={16} />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Summary Bar (Bento grid stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
          {/* Bento Total Equity */}
          <div className="level-1-card rounded-xl p-5 flex flex-col gap-2 shadow-sm">
            <span className="text-[11px] font-bold text-[#8d90a2] uppercase tracking-wider">Total Equity</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                ${Math.floor(totalEquity).toLocaleString('en-US')}
              </span>
              <span className="font-mono text-sm text-[#8d90a2]">
                .{(totalEquity % 1).toFixed(2).substring(2)}
              </span>
            </div>
          </div>

          {/* Bento Free Margin */}
          <div className="level-1-card rounded-xl p-5 flex flex-col gap-2 shadow-sm">
            <span className="text-[11px] font-bold text-[#8d90a2] uppercase tracking-wider">Free Margin</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white tracking-tight">
                ${Math.floor(freeMargin).toLocaleString('en-US')}
              </span>
              <span className="font-mono text-xs text-[#8d90a2]">
                .{(freeMargin % 1).toFixed(2).substring(2)}
              </span>
            </div>
          </div>

          {/* Bento Environments Info */}
          <div className="level-1-card rounded-xl p-5 flex flex-col justify-center gap-3 shadow-sm bg-gradient-to-br from-[#1c1b1b] to-[#121212]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#40e56c] status-live-pulse"></div>
              <span className="text-[11px] font-bold text-[#40e56c] uppercase tracking-widest">{liveCount} Live Accounts</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#b6c4ff]"></div>
              <span className="text-[11px] font-bold text-[#b6c4ff] uppercase tracking-widest">{demoCount} Demo Accounts</span>
            </div>
          </div>
        </div>

        {/* Active Accounts Grid */}
        <div>
          <h2 className="text-base font-bold text-white mb-4 border-b border-[#2C2C2C] pb-2">Active Accounts</h2>
          {filteredActive.length === 0 ? (
            <div className="text-center py-10 bg-[#1c1b1b] border border-dashed border-[#2C2C2C] rounded-xl text-xs text-[#8d90a2]">
              No active accounts match your filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredActive.map((acc) => (
                <div key={acc.id} className="level-1-card rounded-xl flex flex-col relative overflow-hidden shadow-md group">
                  {/* Top Color Accent Line */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${
                    acc.environment === 'Live' ? 'bg-[#40e56c]' : 'bg-[#2962ff]'
                  }`}></div>

                  {/* Card Header */}
                  <div className="p-5 border-b border-[#2C2C2C] flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{acc.id}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          acc.environment === 'Live' ? 'bg-[#40e56c] status-live-pulse' : 'bg-[#b6c4ff]'
                        }`}></div>
                      </div>
                      <span className="text-xs text-[#8d90a2] mt-1">{acc.type}</span>
                    </div>
                    <span className="bg-[#2a2a2a] text-[#e5e2e1] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-[#434656] uppercase tracking-wider">
                      {acc.leverage}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#8d90a2] font-semibold uppercase tracking-wider mb-1">Balance</span>
                        <div className="flex items-baseline">
                          <span className="text-lg font-bold text-white">
                            {acc.currencySymbol}{Math.floor(acc.balance).toLocaleString('en-US')}
                          </span>
                          <span className="font-mono text-xs text-[#8d90a2]">
                            .{(acc.balance % 1).toFixed(2).substring(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-[#8d90a2] font-semibold uppercase tracking-wider mb-1">Equity</span>
                        <div className="flex items-baseline justify-end">
                          <span className="text-lg font-bold text-white">
                            {acc.currencySymbol}{Math.floor(acc.equity).toLocaleString('en-US')}
                          </span>
                          <span className={`font-mono text-xs ml-1 ${
                            acc.equity >= acc.balance ? 'text-[#40e56c]' : 'text-red-400'
                          }`}>
                            .{(acc.equity % 1).toFixed(2).substring(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-[#1c1b1b] border-t border-[#2C2C2C] flex gap-3 select-none">
                    <button 
                      onClick={() => setActiveScreen('deposit')}
                      className="flex-1 bg-transparent border border-[#434656] hover:bg-[#2a2a2a] hover:border-[#8d90a2] text-white font-bold text-[10px] py-2 rounded uppercase tracking-wider transition-colors"
                    >
                      Deposit
                    </button>
                    <button 
                      onClick={() => setActiveScreen('trades')}
                      className="flex-1 bg-[#2a2a2a] border border-[#2C2C2C] hover:bg-[#2962ff] text-white font-bold text-[10px] py-2 rounded uppercase tracking-wider transition-all"
                    >
                      Trade
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Archived Accounts Data Table */}
        <div className="mt-4">
          <h3 className="text-sm font-bold text-white mb-4 border-b border-[#2C2C2C] pb-2 flex items-center gap-2">
            <Archive size={16} className="text-[#8d90a2]" />
            Archived Accounts
          </h3>
          <div className="overflow-x-auto border border-[#2C2C2C] rounded-lg">
            <table className="w-full text-left border-collapse min-w-[500px] select-none">
              <thead>
                <tr className="bg-[#1c1b1b] border-b border-[#2C2C2C]">
                  <th className="py-3 px-4 text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Account ID</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Type</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider text-right">Final Balance</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Archived Date</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-white divide-y divide-[#2C2C2C]/50">
                {archivedAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#1c1b1b]/50 transition-colors group">
                    <td className="py-3.5 px-4 flex items-center gap-2 text-[#8d90a2] group-hover:text-white transition-colors">
                      <div className="w-2 h-2 rounded-full bg-[#8d90a2]"></div>
                      {acc.id}
                    </td>
                    <td className="py-3.5 px-4 text-[#8d90a2]">{acc.type}</td>
                    <td className="py-3.5 px-4 text-right text-[#8d90a2] font-semibold">{acc.finalBalance}</td>
                    <td className="py-3.5 px-4 text-[#8d90a2]">{acc.archivedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Account Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#131313] border border-[#2C2C2C] rounded-xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-[#2C2C2C] flex justify-between items-center bg-[#1c1b1b]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-[#2962ff]" />
                Open New Account
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-[#8d90a2] hover:text-red-400 transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="p-6 flex flex-col gap-5">
                {/* Account Type Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#c3c5d8] uppercase tracking-wider">Environment</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input 
                        checked={newEnv === 'Live'} 
                        onChange={() => setNewEnv('Live')}
                        className="sr-only peer" 
                        name="env" 
                        type="radio"
                      />
                      <div className="border border-[#2C2C2C] rounded-lg p-4 flex flex-col items-center gap-2 peer-checked:border-[#40e56c] peer-checked:bg-[#40e56c]/10 transition-colors">
                        <TrendingUp size={24} className="text-[#40e56c]" />
                        <span className="font-bold text-xs text-white">Live</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input 
                        checked={newEnv === 'Demo'} 
                        onChange={() => setNewEnv('Demo')}
                        className="sr-only peer" 
                        name="env" 
                        type="radio"
                      />
                      <div className="border border-[#2C2C2C] rounded-lg p-4 flex flex-col items-center gap-2 peer-checked:border-[#2962ff] peer-checked:bg-[#2962ff]/10 transition-colors">
                        <Clock size={24} className="text-[#2962ff]" />
                        <span className="font-bold text-xs text-white">Demo</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Platform */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#c3c5d8] uppercase tracking-wider" htmlFor="platform">Platform</label>
                  <select 
                    id="platform"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full bg-[#1c1b1b] border border-[#2C2C2C] rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] cursor-pointer"
                  >
                    <option value="MetaTrader 5">MetaTrader 5</option>
                    <option value="MetaTrader 4">MetaTrader 4</option>
                  </select>
                </div>

                {/* Leverage */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#c3c5d8] uppercase tracking-wider" htmlFor="leverage">Leverage</label>
                  <select 
                    id="leverage"
                    value={newLeverage}
                    onChange={(e) => setNewLeverage(e.target.value)}
                    className="w-full bg-[#1c1b1b] border border-[#2C2C2C] rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] cursor-pointer"
                  >
                    <option value="1:100">1:100</option>
                    <option value="1:200">1:200</option>
                    <option value="1:500">1:500</option>
                  </select>
                </div>
              </div>

              <div className="p-5 border-t border-[#2C2C2C] bg-[#1c1b1b] flex justify-end gap-3 select-none">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-transparent border border-[#2C2C2C] hover:bg-[#2a2a2a] text-white text-xs font-bold py-2.5 px-4 rounded-lg uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#2962ff] text-white hover:bg-[#004ee8] text-xs font-bold py-2.5 px-5 rounded-lg uppercase tracking-wider transition-all shadow-md active:scale-[0.98]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
