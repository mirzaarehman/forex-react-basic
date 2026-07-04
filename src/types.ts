export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  country: string;
  role: string;
  avatarUrl: string;
  balance: number;
}

export type AccountEnvironment = 'Live' | 'Demo';

export interface TradingAccount {
  id: string;
  environment: AccountEnvironment;
  platform: string;
  type: string; // e.g. "Standard USD", "Raw Spread EUR", etc.
  leverage: string; // e.g. "1:500"
  balance: number;
  equity: number;
  currencySymbol: string; // "$" or "€"
  status: 'active' | 'archived';
  archivedDate?: string;
  finalBalance?: string;
}

export interface DepositTransaction {
  id: string;
  dateTime: string;
  method: string;
  amount: number;
  status: 'Pending' | 'Success' | 'Failed';
  txId: string;
}

export interface WithdrawalTransaction {
  id: string;
  dateTime: string;
  method: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  accountEnding: string;
  txId?: string;
}

export interface ChatMessage {
  sender: 'agent' | 'user';
  message: string;
  time: string;
}

export interface OpenPosition {
  id: string;
  symbol: string;
  label: string; // e.g., "EU" for EURUSD
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  sl: string;
  tp?: string;
  profit: number;
  category: 'Forex' | 'Indices' | 'Metals';
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'Open' | 'Pending Info' | 'Closed';
  lastUpdated: string;
  category: string;
  description: string;
}
