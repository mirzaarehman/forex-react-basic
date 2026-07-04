import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  X, 
  Activity, 
  Coins, 
  Bell, 
  User, 
  CheckCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { OpenPosition } from '../types';

interface TradeTrackingScreenProps {
  positions: OpenPosition[];
  onAddPosition: (newPos: Omit<OpenPosition, 'id' | 'profit' | 'currentPrice'>) => void;
  onClosePosition: (id: string) => void;
}

export default function TradeTrackingScreen({ positions, onAddPosition, onClosePosition }: TradeTrackingScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Forex' | 'Indices' | 'Metals'>('All');
  const [selectedAccount, setSelectedCategoryAcc] = useState('All Accounts');
  
  // New Trade Modal state
  const [newTradeModal, setNewTradeModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('EURUSD');
  const [newType, setNewType] = useState<'BUY' | 'SELL'>('BUY');
  const [newVolume, setNewVolume] = useState(1.00);
  const [newSL, setNewSL] = useState('');
  const [newTP, setNewTP] = useState('');

  // Real-time flash cell highlights
  const [flashStates, setFlashStates] = useState<Record<string, 'up' | 'down' | null>>({});
  const [localPositions, setLocalPositions] = useState<OpenPosition[]>(positions);

  // Sync props to local positions
  useEffect(() => {
    setLocalPositions(positions);
  }, [positions]);

  // Live market price feed simulator
  useEffect(() => {
    const timer = setInterval(() => {
      if (localPositions.length === 0) return;
      
      // Select 1 random position to modify
      const randIdx = Math.floor(Math.random() * localPositions.length);
      const target = localPositions[randIdx];
      
      // Determine positive or negative pip movement
      const direction = Math.random() > 0.45 ? 1 : -1;
      const pipMultiplier = target.symbol === 'XAUUSD' ? 0.35 : target.symbol === 'US100' ? 2.50 : 0.00012;
      const change = direction * pipMultiplier;

      const updatedPrice = Number((target.currentPrice + change).toFixed(target.symbol.includes('USD') && !target.symbol.includes('XAU') ? 5 : 2));
      
      // Update profit based on position type
      const priceDiff = updatedPrice - target.openPrice;
      const volumeFactor = target.volume * (target.symbol === 'XAUUSD' ? 100 : target.symbol === 'US100' ? 10 : 10000);
      const calculatedProfit = target.type === 'BUY' 
        ? Number((priceDiff * volumeFactor).toFixed(2))
        : Number((-priceDiff * volumeFactor).toFixed(2));

      // Trigger transient state flash highlight
      const flashDir = direction === 1 ? 'up' : 'down';
      setFlashStates(prev => ({ ...prev, [target.id]: flashDir }));
      
      // Update local position
      setLocalPositions(prev => prev.map(p => 
        p.id === target.id 
          ? { ...p, currentPrice: updatedPrice, profit: calculatedProfit }
          : p
      ));

      // Remove flash state after 1.2s
      setTimeout(() => {
        setFlashStates(prev => ({ ...prev, [target.id]: null }));
      }, 1200);

    }, 3000);

    return () => clearInterval(timer);
  }, [localPositions]);

  // Handler for New Trade submission
  const handleNewTrade = (e: React.FormEvent) => {
    e.preventDefault();
    let symbolLabel = newSymbol.substring(0, 2).toUpperCase();
    let openValue = 1.08450;
    let cat: 'Forex' | 'Indices' | 'Metals' = 'Forex';

    if (newSymbol === 'GBPUSD') {
      symbolLabel = 'GU';
      openValue = 1.26500;
    } else if (newSymbol === 'XAUUSD') {
      symbolLabel = 'XU';
      openValue = 2025.50;
      cat = 'Metals';
    } else if (newSymbol === 'US100') {
      symbolLabel = 'NQ';
      openValue = 17500.00;
      cat = 'Indices';
    } else if (newSymbol === 'USDJPY') {
      symbolLabel = 'UJ';
      openPrice: 159.20;
      openPrice: 159.20;
    }

    // Directly emit trigger to main state
    onAddPosition({
      symbol: newSymbol,
      label: symbolLabel,
      type: newType,
      volume: newVolume,
      openPrice: newSymbol === 'XAUUSD' ? 2025.50 : newSymbol === 'US100' ? 17500.00 : 1.08450,
      sl: `${newSL || 'None'} / ${newTP || 'None'}`,
      category: cat
    });

    setNewTradeModal(false);
    setNewSL('');
    setNewTP('');
  };

  const handleExport = () => {
    alert('Exporting MT5 transaction logs to CSV...');
  };

  // Filter positions
  const filteredPositions = localPositions.filter(p => {
    const symbolStr = p.symbol || '';
    const matchesSearch = symbolStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate metrics based on current live prices
  const dailyPLValue = filteredPositions.reduce((sum, p) => sum + p.profit, 0) + 120.50; 
  const weeklyPLValue = filteredPositions.reduce((sum, p) => sum + p.profit, 0) + 850.00;
  const monthlyPLValue = -340.20 + (filteredPositions.reduce((sum, p) => sum + p.profit, 0) / 10);

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
      <main className="flex-grow p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6 select-none">
        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-[#2C2C2C] pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">MT5 Trade Tracking</h1>
            <p className="text-xs text-[#8d90a2] mt-1.5 font-medium">Live performance and open positions.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              className="bg-[#1c1b1b] border border-[#2C2C2C] hover:bg-[#252525] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2"
            >
              <Download size={14} /> Export
            </button>
            <button 
              onClick={() => setNewTradeModal(true)}
              className="bg-[#2962ff] hover:bg-[#004ee8] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 uppercase tracking-wider transition-all hover:shadow-[0_4px_12px_rgba(41,98,255,0.3)] active:scale-[0.98]"
            >
              <Plus size={14} className="stroke-3" /> New Trade
            </button>
          </div>
        </div>

        {/* Metric boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Daily Card */}
          <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-5 hover:bg-[#201f1f] transition-colors relative group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-[#8d90a2] font-bold uppercase tracking-wider">Daily P/L</span>
              <TrendingUp size={16} className="text-[#40e56c]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-extrabold ${dailyPLValue >= 0 ? 'text-[#40e56c]' : 'text-red-400'}`}>
                {dailyPLValue >= 0 ? '+' : '-'}${Math.abs(dailyPLValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="font-mono text-xs text-[#8d90a2]">+1.2%</span>
            </div>
            <div className="mt-4 h-6 w-full opacity-30">
              <svg className="w-full h-full stroke-[#40e56c] fill-none stroke-2" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M0 15 L20 12 L40 18 L60 5 L80 10 L100 2"></path>
              </svg>
            </div>
          </div>

          {/* Weekly Card */}
          <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-5 hover:bg-[#201f1f] transition-colors relative group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-[#8d90a2] font-bold uppercase tracking-wider">Weekly P/L</span>
              <TrendingUp size={16} className="text-[#40e56c]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-extrabold ${weeklyPLValue >= 0 ? 'text-[#40e56c]' : 'text-red-400'}`}>
                {weeklyPLValue >= 0 ? '+' : '-'}${Math.abs(weeklyPLValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="font-mono text-xs text-[#8d90a2]">+3.8%</span>
            </div>
            <div className="mt-4 h-6 w-full opacity-30">
              <svg className="w-full h-full stroke-[#40e56c] fill-none stroke-2" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M0 18 L20 15 L40 16 L60 8 L80 12 L100 4"></path>
              </svg>
            </div>
          </div>

          {/* Monthly Card */}
          <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-5 hover:bg-[#201f1f] transition-colors relative group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-[#8d90a2] font-bold uppercase tracking-wider">Monthly P/L</span>
              <TrendingDown size={16} className="text-red-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-extrabold ${monthlyPLValue >= 0 ? 'text-[#40e56c]' : 'text-red-400'}`}>
                {monthlyPLValue >= 0 ? '+' : '-'}${Math.abs(monthlyPLValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="font-mono text-xs text-[#8d90a2]">-0.8%</span>
            </div>
            <div className="mt-4 h-6 w-full opacity-30">
              <svg className="w-full h-full stroke-red-400 fill-none stroke-2" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M0 5 L20 8 L40 4 L60 15 L80 12 L100 18"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Positions Table container */}
        <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl flex flex-col flex-grow shadow-md">
          {/* Table filters / header toolbar */}
          <div className="border-b border-[#2C2C2C] p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider">Open Positions</h3>
            
            <div className="flex flex-wrap gap-2 select-none">
              <div className="relative">
                <select 
                  value={selectedAccount} 
                  onChange={(e) => setSelectedCategoryAcc(e.target.value)}
                  className="bg-[#131313] border border-[#2C2C2C] rounded-lg text-xs py-1.5 pl-3 pr-8 focus:border-[#2962ff] outline-none text-[#c3c5d8] cursor-pointer appearance-none"
                >
                  <option value="All Accounts">All Accounts</option>
                  <option value="Live">Live - MT5-LIVE-98273</option>
                  <option value="Demo">Demo - MT5-DEMO-11092</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d90a2] pointer-events-none" />
              </div>

              <div className="relative">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="bg-[#131313] border border-[#2C2C2C] rounded-lg text-xs py-1.5 pl-3 pr-8 focus:border-[#2962ff] outline-none text-[#c3c5d8] cursor-pointer appearance-none"
                >
                  <option value="All">All Assets</option>
                  <option value="Forex">Forex</option>
                  <option value="Indices">Indices</option>
                  <option value="Metals">Metals</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d90a2] pointer-events-none" />
              </div>

              <div className="relative w-40 sm:w-48">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8d90a2]">
                  <Search size={12} />
                </span>
                <input 
                  type="text" 
                  placeholder="Filter Symbol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#131313] border border-[#2C2C2C] rounded-lg py-1.5 pl-8 pr-2 text-xs text-white focus:outline-none focus:border-[#2962ff]"
                />
              </div>
            </div>
          </div>

          {/* Actual Active Trades Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#131313]/50 border-b border-[#2C2C2C] text-[#8d90a2] text-[10px] font-bold uppercase tracking-wider select-none">
                  <th className="py-3 px-4">Symbol</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Open Price</th>
                  <th className="py-3 px-4">SL / TP</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4 text-right">Profit</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-white divide-y divide-[#2C2C2C]/50">
                {filteredPositions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs text-[#8d90a2]">
                      No active trades match your selections. Click "New Trade" to launch a position.
                    </td>
                  </tr>
                ) : (
                  filteredPositions.map((pos) => {
                    const isUp = flashStates[pos.id] === 'up';
                    const isDown = flashStates[pos.id] === 'down';
                    
                    return (
                      <tr key={pos.id} className="hover:bg-[#1c1b1b]/30 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center font-extrabold text-[9px] select-none ${
                            pos.category === 'Forex' ? 'bg-[#2962ff]/15 text-[#2962ff]' :
                            pos.category === 'Metals' ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'
                          }`}>
                            {pos.label}
                          </div>
                          <span className="font-bold text-white">{pos.symbol}</span>
                        </td>
                        <td className={`py-3 px-4 font-bold select-none ${
                          pos.type === 'BUY' ? 'text-[#40e56c]' : 'text-red-400'
                        }`}>
                          {pos.type}
                        </td>
                        <td className="py-3 px-4 text-white">{pos.volume.toFixed(2)}</td>
                        <td className="py-3 px-4 text-[#8d90a2]">{pos.openPrice.toFixed(pos.symbol.includes('USD') && !pos.symbol.includes('XAU') ? 5 : 2)}</td>
                        <td className="py-3 px-4 text-[#8d90a2]">{pos.sl}</td>
                        <td className={`py-3 px-4 font-bold transition-all duration-300 rounded ${
                          isUp ? 'bg-emerald-500/15 text-[#40e56c]' :
                          isDown ? 'bg-red-500/15 text-red-400' : 'text-white'
                        }`}>
                          {pos.currentPrice.toFixed(pos.symbol.includes('USD') && !pos.symbol.includes('XAU') ? 5 : 2)}
                        </td>
                        <td className={`py-3 px-4 text-right font-bold ${
                          pos.profit >= 0 ? 'text-[#40e56c]' : 'text-red-400'
                        }`}>
                          {pos.profit >= 0 ? '+' : '-'}${Math.abs(pos.profit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button 
                            onClick={() => onClosePosition(pos.id)}
                            className="text-[#8d90a2] hover:text-red-400 transition-colors p-1"
                            title="Close Position"
                          >
                            <X size={14} className="stroke-2" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Trade Dialog / Modal */}
      {newTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
          <div className="bg-[#131313] border border-[#2C2C2C] rounded-xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-[#2C2C2C] flex justify-between items-center bg-[#1c1b1b]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity size={14} className="text-[#2962ff]" />
                Execute Market Order
              </h3>
              <button 
                onClick={() => setNewTradeModal(false)}
                className="text-[#8d90a2] hover:text-red-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleNewTrade} className="p-5 space-y-4">
              {/* Symbol Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Symbol</label>
                <select 
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-full bg-[#1c1b1b] border border-[#2C2C2C] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                >
                  <option value="EURUSD">EURUSD (Euro vs US Dollar)</option>
                  <option value="GBPUSD">GBPUSD (Great Britain Pound vs US Dollar)</option>
                  <option value="XAUUSD">XAUUSD (Gold Spot vs US Dollar)</option>
                  <option value="US100">US100 (Nasdaq Index CFDs)</option>
                </select>
              </div>

              {/* Order Type radio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Order Action</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input 
                      checked={newType === 'BUY'} 
                      onChange={() => setNewType('BUY')}
                      className="sr-only peer" 
                      name="order-type" 
                      type="radio" 
                    />
                    <div className="border border-[#2C2C2C] rounded-lg p-2 flex items-center justify-center gap-2 peer-checked:border-[#40e56c] peer-checked:bg-[#40e56c]/10 transition-all font-bold text-xs">
                      BUY (Long)
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input 
                      checked={newType === 'SELL'} 
                      onChange={() => setNewType('SELL')}
                      className="sr-only peer" 
                      name="order-type" 
                      type="radio" 
                    />
                    <div className="border border-[#2C2C2C] rounded-lg p-2 flex items-center justify-center gap-2 peer-checked:border-red-400 peer-checked:bg-red-400/10 transition-all font-bold text-xs">
                      SELL (Short)
                    </div>
                  </label>
                </div>
              </div>

              {/* Volume size slider or number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider flex justify-between">
                  <span>Volume (Lots)</span>
                  <span className="font-mono text-white font-semibold">{newVolume.toFixed(2)}</span>
                </label>
                <input 
                  type="range"
                  min="0.01"
                  max="5.00"
                  step="0.05"
                  value={newVolume}
                  onChange={(e) => setNewVolume(Number(e.target.value))}
                  className="w-full accent-[#2962ff]"
                />
              </div>

              {/* SL & TP fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Stop Loss</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1.08000"
                    value={newSL}
                    onChange={(e) => setNewSL(e.target.value)}
                    className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-lg py-2 px-2.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Take Profit</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1.09500"
                    value={newTP}
                    onChange={(e) => setNewTP(e.target.value)}
                    className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-lg py-2 px-2.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setNewTradeModal(false)}
                  className="bg-transparent border border-[#2C2C2C] hover:bg-[#2a2a2a] text-white text-xs font-bold py-2 px-4 rounded-lg uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`text-white text-xs font-bold py-2 px-5 rounded-lg uppercase tracking-wider transition-all active:scale-[0.98] ${
                    newType === 'BUY' ? 'bg-[#02c953] hover:bg-[#004d1b]' : 'bg-red-500 hover:bg-red-700'
                  }`}
                >
                  Execute Trade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
