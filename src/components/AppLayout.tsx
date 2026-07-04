import React from 'react';
import Sidebar from './Sidebar';
import DashboardScreen from './DashboardScreen';
import DepositScreen from './DepositScreen';
import WithdrawScreen from './WithdrawScreen';
import TradeTrackingScreen from './TradeTrackingScreen';
import TransactionsScreen from './TransactionsScreen';
import SupportScreen from './SupportScreen';
import KYCVerificationScreen from './KYCVerificationScreen';
import { 
  UserProfile, 
  TradingAccount, 
  DepositTransaction, 
  WithdrawalTransaction, 
  OpenPosition, 
  SupportTicket 
} from '../types';

interface AppLayoutProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  user: UserProfile;
  accounts: TradingAccount[];
  deposits: DepositTransaction[];
  withdrawals: WithdrawalTransaction[];
  positions: OpenPosition[];
  tickets: SupportTicket[];
  
  onCreateAccount: (newAccount: { environment: 'Live' | 'Demo'; platform: string; leverage: string }) => void;
  onDepositSubmit: (amount: number, accountId: string, method: string) => void;
  onWithdrawSubmit: (amount: number, accountId: string, method: string, ending: string) => void;
  onAddPosition: (newPos: Omit<OpenPosition, 'id' | 'profit' | 'currentPrice'>) => void;
  onClosePosition: (id: string) => void;
  onAddTicket: (ticket: { subject: string; category: string; description: string }) => void;
  onLogout: () => void;
}

export default function AppLayout({
  activeScreen,
  setActiveScreen,
  user,
  accounts,
  deposits,
  withdrawals,
  positions,
  tickets,
  onCreateAccount,
  onDepositSubmit,
  onWithdrawSubmit,
  onAddPosition,
  onClosePosition,
  onAddTicket,
  onLogout
}: AppLayoutProps) {
  
  // Render main screen contents conditionally based on active navigation item selection
  const renderContent = () => {
    switch (activeScreen) {
      case 'dashboard':
      case 'accounts':
        return (
          <DashboardScreen 
            accounts={accounts} 
            onCreateAccount={onCreateAccount} 
            setActiveScreen={setActiveScreen} 
          />
        );
      case 'deposit':
        return (
          <DepositScreen 
            accounts={accounts} 
            deposits={deposits} 
            onDepositSubmit={onDepositSubmit} 
          />
        );
      case 'withdraw':
        return (
          <WithdrawScreen 
            accounts={accounts} 
            withdrawals={withdrawals} 
            onWithdrawSubmit={onWithdrawSubmit} 
          />
        );
      case 'trades':
        return (
          <TradeTrackingScreen 
            positions={positions} 
            onAddPosition={onAddPosition} 
            onClosePosition={onClosePosition} 
          />
        );
      case 'transactions':
        return (
          <TransactionsScreen 
            deposits={deposits} 
            withdrawals={withdrawals} 
          />
        );
      case 'support':
        return (
          <SupportScreen 
            tickets={tickets} 
            onAddTicket={onAddTicket} 
          />
        );
      case 'settings':
        return (
          <KYCVerificationScreen />
        );
      default:
        return (
          <DashboardScreen 
            accounts={accounts} 
            onCreateAccount={onCreateAccount} 
            setActiveScreen={setActiveScreen} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans antialiased flex relative">
      {/* Ambient Grid Overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none"></div>

      {/* Navigation Sidebar Gated on Left */}
      <Sidebar 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        user={user} 
        onLogout={onLogout} 
      />

      {/* Main Fluid Content Canvas Box */}
      <div className="flex-1 min-h-screen lg:pl-[240px] flex flex-col relative z-10 overflow-hidden w-full">
        {renderContent()}
      </div>
    </div>
  );
}
