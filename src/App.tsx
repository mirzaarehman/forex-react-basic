import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import AppLayout from './components/AppLayout';
import { 
  INITIAL_USER, 
  INITIAL_ACCOUNTS, 
  INITIAL_DEPOSITS, 
  INITIAL_WITHDRAWALS, 
  INITIAL_POSITIONS, 
  INITIAL_TICKETS 
} from './data';
import { 
  UserProfile, 
  TradingAccount, 
  DepositTransaction, 
  WithdrawalTransaction, 
  OpenPosition, 
  SupportTicket 
} from './types';

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for instant preview onboarding
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');

  // Core application states
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [accounts, setAccounts] = useState<TradingAccount[]>(INITIAL_ACCOUNTS);
  const [deposits, setDeposits] = useState<DepositTransaction[]>(INITIAL_DEPOSITS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalTransaction[]>(INITIAL_WITHDRAWALS);
  const [positions, setPositions] = useState<OpenPosition[]>(INITIAL_POSITIONS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  // Sign In handler
  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowResetPassword(false);
    setActiveScreen('dashboard');
  };

  // Sign Out handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveScreen('dashboard');
  };

  // Open New Trading Account
  const handleCreateAccount = (newAcc: { environment: 'Live' | 'Demo'; platform: string; leverage: string }) => {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const prefix = newAcc.platform === 'MetaTrader 5' ? 'MT5' : 'MT4';
    const finalId = `${prefix}-${newAcc.environment.toUpperCase()}-${randomId}`;

    const newAccountRecord: TradingAccount = {
      id: finalId,
      type: `${newAcc.platform} ${newAcc.environment} Account`,
      environment: newAcc.environment,
      platform: newAcc.platform,
      balance: newAcc.environment === 'Live' ? 0.00 : 10000.00,
      equity: newAcc.environment === 'Live' ? 0.00 : 10000.00,
      leverage: newAcc.leverage,
      currencySymbol: '$',
      status: 'active'
    };

    setAccounts(prev => [newAccountRecord, ...prev]);

    // Update profile balance if demo funds are pre-loaded
    if (newAcc.environment === 'Demo') {
      setUser(prev => ({
        ...prev,
        balance: prev.balance + 10000
      }));
    }
  };

  // Handle Secure Deposit Submission
  const handleDepositSubmit = (amount: number, accountId: string, method: string) => {
    // Increment specific account
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          balance: acc.balance + amount,
          equity: acc.equity + amount
        };
      }
      return acc;
    }));

    // Update overall portfolio balance
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));

    // Append to Deposits ledger
    const randomTxId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const now = new Date();
    const dateTimeStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const newDeposit: DepositTransaction = {
      id: `dep-${Date.now()}`,
      txId: randomTxId,
      dateTime: dateTimeStr,
      method: method,
      amount: amount,
      status: 'Success'
    };

    setDeposits(prev => [newDeposit, ...prev]);
  };

  // Handle SWIFT Bank Withdrawal Submission
  const handleWithdrawSubmit = (amount: number, accountId: string, method: string, ending: string) => {
    // Decrement specific account
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          balance: Math.max(0, acc.balance - amount),
          equity: Math.max(0, acc.equity - amount)
        };
      }
      return acc;
    }));

    // Update overall portfolio balance
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount)
    }));

    // Append to Withdrawals ledger
    const randomTxId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const now = new Date();
    const dateTimeStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const newWithdrawal: WithdrawalTransaction = {
      id: `with-${Date.now()}`,
      txId: randomTxId,
      dateTime: dateTimeStr,
      method: `${method} (${ending})`,
      amount: -amount,
      status: 'Completed',
      accountEnding: ending
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);
  };

  // Launch New Trading Position
  const handleAddPosition = (pos: Omit<OpenPosition, 'id' | 'profit' | 'currentPrice'>) => {
    const randomPositionId = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    const newPosRecord: OpenPosition = {
      ...pos,
      id: randomPositionId,
      currentPrice: pos.openPrice,
      profit: 0.00
    };

    setPositions(prev => [newPosRecord, ...prev]);
  };

  // Close Active Trading Position (clears profits directly into balance!)
  const handleClosePosition = (id: string) => {
    const target = positions.find(p => p.id === id);
    if (!target) return;

    // Credit profits directly to the first active trading account
    const activeAcc = accounts.find(a => a.status === 'active');
    if (activeAcc) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === activeAcc.id) {
          return {
            ...acc,
            balance: acc.balance + target.profit,
            equity: acc.equity + target.profit
          };
        }
        return acc;
      }));

      // Adjust main profile balance counter
      setUser(prev => ({
        ...prev,
        balance: prev.balance + target.profit
      }));
    }

    // Filter out the closed trade
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  // Create Customer Support Case
  const handleAddTicket = (ticket: { subject: string; category: string; description: string }) => {
    const randomIdNum = Math.floor(1000 + Math.random() * 9000);
    const finalId = `TKT-${randomIdNum}`;

    const now = new Date();
    const updatedStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newTicketRecord: SupportTicket = {
      id: finalId,
      subject: ticket.subject,
      category: ticket.category,
      status: 'Open',
      lastUpdated: updatedStr,
      description: ticket.description
    };

    setTickets(prev => [newTicketRecord, ...prev]);
  };

  // App Routing logic
  if (!isAuthenticated) {
    if (showResetPassword) {
      return (
        <ResetPasswordScreen 
          onBackToLogin={() => setShowResetPassword(false)} 
        />
      );
    }
    return (
      <LoginScreen 
        onLoginSuccess={handleLogin} 
        onForgotPassword={() => setShowResetPassword(true)} 
      />
    );
  }

  return (
    <AppLayout
      activeScreen={activeScreen}
      setActiveScreen={setActiveScreen}
      user={user}
      accounts={accounts}
      deposits={deposits}
      withdrawals={withdrawals}
      positions={positions}
      tickets={tickets}
      onCreateAccount={handleCreateAccount}
      onDepositSubmit={handleDepositSubmit}
      onWithdrawSubmit={handleWithdrawSubmit}
      onAddPosition={handleAddPosition}
      onClosePosition={handleClosePosition}
      onAddTicket={handleAddTicket}
      onLogout={handleLogout}
    />
  );
}
