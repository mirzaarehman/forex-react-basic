import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Bell, 
  User, 
  TrendingUp, 
  ChevronDown
} from 'lucide-react';
import { DepositTransaction, WithdrawalTransaction } from '../types';

interface TransactionsScreenProps {
  deposits: DepositTransaction[];
  withdrawals: WithdrawalTransaction[];
}

export default function TransactionsScreen({ deposits, withdrawals }: TransactionsScreenProps) {
  const [filterType, setFilterType] = useState<'All' | 'Deposit' | 'Withdrawal'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Map deposits and withdrawals into a single unified chronological transaction list
  const unifiedList = [
    ...deposits.map(d => ({
      id: d.id,
      txId: d.txId,
      date: d.dateTime,
      type: 'Deposit' as const,
      method: d.method,
      amount: d.amount,
      status: d.status
    })),
    ...withdrawals.map(w => ({
      id: w.id,
      txId: w.txId,
      date: w.dateTime,
      type: 'Withdrawal' as const,
      method: w.method,
      amount: -w.amount,
      status: w.status
    }))
  ].sort((a, b) => b.id.localeCompare(a.id)); // Sort by ID descending (newest first)

  // Filter list
  const filteredList = unifiedList.filter(tx => {
    const txIdStr = tx.txId || '';
    const methodStr = tx.method || '';
    const matchesSearch = txIdStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          methodStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleExport = () => {
    alert('Preparing your complete account ledger. Downloading CSV ledger statements...');
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
      <main className="flex-grow p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6 select-none font-sans">
        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-[#2C2C2C] pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Transactions Overview</h1>
            <p className="text-xs text-[#8d90a2] mt-1.5 font-medium">History of all deposits, withdrawals, and ledger credits.</p>
          </div>
          <button 
            onClick={handleExport}
            className="bg-[#1c1b1b] border border-[#2C2C2C] hover:bg-[#252525] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download size={14} /> Export Statement
          </button>
        </div>

        {/* Filters and search block */}
        <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Tabs */}
          <div className="flex gap-1.5 p-1 bg-[#131313] border border-[#2c2c2c] rounded-lg">
            <button 
              onClick={() => setFilterType('All')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${
                filterType === 'All' 
                  ? 'bg-[#1c1b1b] text-white border-b-2 border-[#2962ff]' 
                  : 'text-[#8d90a2] hover:text-white'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('Deposit')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${
                filterType === 'Deposit' 
                  ? 'bg-[#1c1b1b] text-white border-b-2 border-[#2962ff]' 
                  : 'text-[#8d90a2] hover:text-white'
              }`}
            >
              Deposits
            </button>
            <button 
              onClick={() => setFilterType('Withdrawal')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${
                filterType === 'Withdrawal' 
                  ? 'bg-[#1c1b1b] text-white border-b-2 border-[#2962ff]' 
                  : 'text-[#8d90a2] hover:text-white'
              }`}
            >
              Withdrawals
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d90a2]">
              <Search size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search reference or method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#131313] border border-[#2C2C2C] rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#2962ff]"
            />
          </div>
        </div>

        {/* Ledger list table card */}
        <div className="bg-[#1e1e1e] border border-[#2C2C2C] rounded-xl shadow-md overflow-hidden flex-grow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#131313]/50 border-b border-[#2C2C2C] text-[#8d90a2] text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Transaction Reference</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Date &amp; Time</th>
                  <th className="py-3.5 px-4 text-right">Amount (USD)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-white divide-y divide-[#2C2C2C]/50">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-[#8d90a2]">
                      No transactions found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#1c1b1b]/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                          tx.type === 'Deposit' 
                            ? 'bg-[#40e56c]/10 text-[#40e56c]' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.type === 'Deposit' ? (
                            <ArrowDownLeft size={10} className="stroke-2" />
                          ) : (
                            <ArrowUpRight size={10} className="stroke-2" />
                          )}
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white group-hover:text-[#2962ff] transition-colors">{tx.txId}</td>
                      <td className="py-3.5 px-4 text-[#c3c5d8]">{tx.method}</td>
                      <td className="py-3.5 px-4 text-[#8d90a2]">{tx.date}</td>
                      <td className={`py-3.5 px-4 text-right font-extrabold text-sm ${
                        tx.amount >= 0 ? 'text-[#40e56c]' : 'text-red-400'
                      }`}>
                        {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          tx.status === 'Success' || tx.status === 'Completed'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-[#40e56c]'
                            : tx.status === 'Pending'
                            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
