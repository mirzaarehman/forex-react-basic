import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  ArrowRight, 
  User, 
  Bell, 
  X,
  FileText,
  LifeBuoy
} from 'lucide-react';
import { SupportTicket, ChatMessage } from '../types';

interface SupportScreenProps {
  tickets: SupportTicket[];
  onAddTicket: (ticket: { subject: string; category: string; description: string }) => void;
}

export default function SupportScreen({ tickets, onAddTicket }: SupportScreenProps) {
  const [activeTicketId, setActiveTicketId] = useState<string | null>('TKT-1082');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Deposits');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local chat messages state
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({
    'TKT-1082': [
      { sender: 'agent', message: 'Hello! I see you submitted a wire deposit request earlier. Has the bank transfer completed on your end?', time: '09:12' },
      { sender: 'user', message: 'Yes, I initiated the SWIFT transfer from my HSBC account. Here is the transaction slip reference.', time: '09:15' },
      { sender: 'agent', message: 'Perfect. I have forwarded the SWIFT slip to our accounts ledger team. Your trading balance will credit within 1 hour.', time: '09:18' }
    ],
    'TKT-1104': [
      { sender: 'user', message: 'I need to reset my MT5 password.', time: 'Yesterday' },
      { sender: 'agent', message: 'You can trigger a master password reset directly from the Trading Accounts panel by clicking on the Account ID.', time: 'Yesterday' }
    ]
  });

  const [activeMessageText, setActiveMessageText] = useState('');

  const activeTicket = tickets.find(t => t.id === activeTicketId) || tickets[0];
  const activeChatList = activeTicketId ? (chats[activeTicketId] || []) : [];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newDescription) {
      alert('Please complete all ticket details.');
      return;
    }
    
    onAddTicket({
      subject: newSubject,
      category: newCategory,
      description: newDescription
    });

    // Reset Form
    setNewSubject('');
    setNewDescription('');

    // Pre-seed mock chats for this new ticket
    const tempId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setChats(prev => ({
      ...prev,
      [tempId]: [
        { sender: 'user', message: newDescription, time: 'Just now' },
        { sender: 'agent', message: 'Thank you for submitting a support ticket. A broker representative has been assigned and will reply shortly.', time: 'Just now' }
      ]
    }));

    setActiveTicketId(tempId);
    alert('Support Ticket Submitted Successfully!');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessageText.trim() || !activeTicketId) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      message: activeMessageText,
      time: 'Just now'
    };

    setChats(prev => {
      const current = prev[activeTicketId] || [];
      return {
        ...prev,
        [activeTicketId]: [...current, userMsg]
      };
    });

    const typedText = activeMessageText;
    setActiveMessageText('');

    // Simulate Agent Auto response after 1.5s
    setTimeout(() => {
      let agentReply = "I've logged this details into our CRM database. Our compliance officer is checking your records.";
      if (typedText.toLowerCase().includes('deposit') || typedText.toLowerCase().includes('fund')) {
        agentReply = "We have received your funds request. Your wire processing typically clears in London clearing house cycles.";
      } else if (typedText.toLowerCase().includes('leverage') || typedText.toLowerCase().includes('margin')) {
        agentReply = "FCA regulated accounts are limited to 1:30 leverage by default, but professional status can increase this up to 1:500 upon validation.";
      }

      const agentMsg: ChatMessage = {
        sender: 'agent',
        message: agentReply,
        time: 'Just now'
      };

      setChats(prev => {
        const current = prev[activeTicketId] || [];
        return {
          ...prev,
          [activeTicketId]: [...current, agentMsg]
        };
      });
    }, 1500);
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

      {/* Main Container */}
      <main className="flex-grow p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6 select-none font-sans">
        
        {/* Title and description */}
        <div className="border-b border-[#2C2C2C] pb-5">
          <h1 className="text-2xl font-bold text-white tracking-tight">Support &amp; Help Center</h1>
          <p className="text-xs text-[#8d90a2] mt-1.5 font-medium">Need assistance? Search our knowledge base or submit a ticket to our 24/5 support desk.</p>
        </div>

        {/* Global Search bar */}
        <div className="relative max-w-2xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d90a2]">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search help topics (e.g., Wire deposits, FCA leverage limits...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c1b1b] border border-[#2C2C2C] rounded-lg py-3.5 pl-12 pr-4 text-xs text-white placeholder-[#8d90a2] focus:outline-none focus:border-[#2962ff]"
          />
        </div>

        {/* Quick Help Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-5 hover:bg-[#201f1f] transition-all cursor-pointer">
            <BookOpen className="text-[#2962ff] mb-3" size={24} />
            <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-1">Account Guides</h3>
            <p className="text-[11px] text-[#c3c5d8] leading-relaxed">
              Step-by-step documentation on leverage configurations, archived MT5 setups, and credentials reset.
            </p>
          </div>
          <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-5 hover:bg-[#201f1f] transition-all cursor-pointer">
            <LifeBuoy className="text-[#40e56c] mb-3" size={24} />
            <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-1">Deposit Desk</h3>
            <p className="text-[11px] text-[#c3c5d8] leading-relaxed">
              Global clearing wire specifications, SWIFT details, crypto network speeds, and processing cycles.
            </p>
          </div>
          <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-5 hover:bg-[#201f1f] transition-all cursor-pointer">
            <FileText className="text-red-400 mb-3" size={24} />
            <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-1">Compliance</h3>
            <p className="text-[11px] text-[#c3c5d8] leading-relaxed">
              Understand national KYC uploader policies, segregated client accounts, and FCA investor protection frameworks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
          
          {/* Left: Active Tickets list */}
          <div className="lg:col-span-4 bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2C2C2C] pb-2">Support Tickets</h3>
            
            <div className="space-y-3">
              {tickets.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => setActiveTicketId(t.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    activeTicketId === t.id 
                      ? 'bg-[#2962ff]/10 border-[#2962ff]' 
                      : 'bg-[#131313] border-[#2C2C2C] hover:bg-[#252525]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-[10px] font-bold text-[#8d90a2]">{t.id}</span>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      t.status === 'Open' 
                        ? 'bg-[#2962ff]/10 border-[#2962ff]/20 text-[#2962ff]'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-[#40e56c]'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-white truncate">{t.subject}</p>
                  <div className="flex justify-between mt-2.5 text-[9px] text-[#8d90a2]">
                    <span className="font-semibold">{t.category}</span>
                    <span>{t.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Live Chat Screen */}
          <div className="lg:col-span-5 bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl flex flex-col h-[480px] overflow-hidden shadow-sm relative">
            
            {/* Chat header */}
            <div className="p-4 bg-[#252525]/40 border-b border-[#2C2C2C] flex justify-between items-center select-none">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#40e56c] status-live-pulse"></div>
                <div>
                  <h4 className="font-bold text-xs text-white">{activeTicket ? activeTicket.subject : 'Ticket Chat'}</h4>
                  <p className="text-[10px] text-[#8d90a2]">ID: {activeTicket ? activeTicket.id : 'N/A'}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#8d90a2] font-semibold bg-[#131313] border border-[#2C2C2C] px-2 py-0.5 rounded">
                Desk Broker Online
              </span>
            </div>

            {/* Chat Messages flow area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-[#131313]/20">
              {activeChatList.map((msg, i) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl p-3 shadow-sm ${
                      isUser 
                        ? 'bg-[#2962ff] text-white rounded-tr-none' 
                        : 'bg-[#2a2a2a] text-[#e5e2e1] rounded-tl-none border border-[#434656]/50'
                    }`}>
                      <p className="text-xs leading-relaxed font-sans">{msg.message}</p>
                      <span className="block text-right text-[8px] text-[#c3c5d8]/75 mt-1 font-mono">{msg.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat input toolbar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#2C2C2C] bg-[#121212] flex gap-2">
              <input 
                type="text" 
                placeholder="Type your reply here..."
                value={activeMessageText}
                onChange={(e) => setActiveMessageText(e.target.value)}
                className="flex-1 bg-[#1c1b1b] border border-[#2C2C2C] rounded-lg px-3 py-2 text-xs text-white placeholder-[#8d90a2] focus:outline-none"
              />
              <button 
                type="submit"
                className="w-10 h-10 rounded-lg bg-[#2962ff] hover:bg-[#004ee8] text-white flex items-center justify-center transition-all shadow-md shrink-0"
              >
                <Send size={14} className="stroke-2" />
              </button>
            </form>
          </div>

          {/* Right: Submit New Support ticket card */}
          <div className="lg:col-span-3 bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2C2C2C] pb-2 mb-4">Open New Ticket</h3>
            
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  placeholder="Summarize request..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="bg-[#131313] border border-[#2C2C2C] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#2962ff]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-[#131313] border border-[#2C2C2C] rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="Deposits">Deposits</option>
                  <option value="Withdrawals">Withdrawals</option>
                  <option value="KYC Verification">KYC Verification</option>
                  <option value="MT5 Credentials">MT5 Credentials</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Detail your request..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="bg-[#131313] border border-[#2C2C2C] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#2962ff]"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-[#2962ff] hover:bg-[#004ee8] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
              >
                Submit Ticket
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
