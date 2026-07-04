import { TradingAccount, DepositTransaction, WithdrawalTransaction, OpenPosition, SupportTicket, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  name: "Alex Sterling",
  email: "trader@institution.com",
  phone: "(555) 000-0000",
  country: "US",
  role: "Senior Trader",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop", // Professional headshot
  balance: 10240.50
};

export const INITIAL_ACCOUNTS: TradingAccount[] = [
  {
    id: "MT5-LIVE-98273",
    environment: "Live",
    platform: "MetaTrader 5",
    type: "Standard USD",
    leverage: "1:500",
    balance: 10240.50,
    equity: 10450.20,
    currencySymbol: "$",
    status: "active"
  },
  {
    id: "MT5-RAW-44129",
    environment: "Live",
    platform: "MetaTrader 5",
    type: "Raw Spread EUR",
    leverage: "1:200",
    balance: 8150.00,
    equity: 7920.45,
    currencySymbol: "€",
    status: "active"
  },
  {
    id: "MT5-DEMO-11092",
    environment: "Demo",
    platform: "MetaTrader 5",
    type: "Demo USD",
    leverage: "1:100",
    balance: 50000.00,
    equity: 50000.00,
    currencySymbol: "$",
    status: "active"
  },
  {
    id: "MT4-LIVE-33211",
    environment: "Live",
    platform: "MetaTrader 4",
    type: "Standard USD",
    leverage: "1:500",
    balance: 0,
    equity: 0,
    currencySymbol: "$",
    status: "archived",
    archivedDate: "2023-10-14",
    finalBalance: "$0.00"
  },
  {
    id: "MT5-DEMO-99102",
    environment: "Demo",
    platform: "MetaTrader 5",
    type: "Demo EUR",
    leverage: "1:100",
    balance: 0,
    equity: 0,
    currencySymbol: "€",
    status: "archived",
    archivedDate: "2023-08-01",
    finalBalance: "€4,210.50"
  }
];

export const INITIAL_DEPOSITS: DepositTransaction[] = [
  {
    id: "TXN-9982-FX",
    dateTime: "2024-10-24 14:32:01",
    method: "Wire Transfer",
    amount: 5000.00,
    status: "Pending",
    txId: "TXN-9982-FX"
  },
  {
    id: "TXN-8741-CR",
    dateTime: "2024-10-22 09:15:44",
    method: "Crypto (USDT)",
    amount: 1500.00,
    status: "Success",
    txId: "TXN-8741-CR"
  },
  {
    id: "TXN-6620-CC",
    dateTime: "2024-10-18 16:45:12",
    method: "Credit Card",
    amount: 250.00,
    status: "Failed",
    txId: "TXN-6620-CC"
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalTransaction[] = [
  {
    id: "W-8391",
    dateTime: "Oct 12, 2024",
    method: "Bank Transfer (Ending 4452)",
    amount: -1500.00,
    status: "Completed",
    accountEnding: "Ending 4452"
  },
  {
    id: "W-8392",
    dateTime: "Oct 05, 2024",
    method: "Crypto Wallet (BTC)",
    amount: -3200.00,
    status: "Completed",
    accountEnding: "BTC"
  },
  {
    id: "W-8393",
    dateTime: "Sep 28, 2024",
    method: "Bank Transfer (Ending 4452)",
    amount: -850.00,
    status: "Failed",
    accountEnding: "Ending 4452"
  }
];

export const INITIAL_POSITIONS: OpenPosition[] = [
  {
    id: "P-101",
    symbol: "EURUSD",
    label: "EU",
    type: "BUY",
    volume: 1.00,
    openPrice: 1.08450,
    currentPrice: 1.08620,
    sl: "1.08000 / 1.09500",
    profit: 170.00,
    category: "Forex"
  },
  {
    id: "P-102",
    symbol: "GBPUSD",
    label: "GU",
    type: "SELL",
    volume: 0.50,
    openPrice: 1.26500,
    currentPrice: 1.26650,
    sl: "1.27000 / 1.25000",
    profit: -75.00,
    category: "Forex"
  },
  {
    id: "P-103",
    symbol: "XAUUSD",
    label: "XU",
    type: "BUY",
    volume: 0.10,
    openPrice: 2025.50,
    currentPrice: 2032.10,
    sl: "2010.00 / 2050.00",
    profit: 66.00,
    category: "Metals"
  },
  {
    id: "P-104",
    symbol: "US100",
    label: "NQ",
    type: "BUY",
    volume: 1.00,
    openPrice: 17500.00,
    currentPrice: 17510.50,
    sl: "17400.00 / 17800.00",
    profit: 210.00,
    category: "Indices"
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "#TK-8921",
    subject: "Withdrawal delayed via Bank Transfer",
    status: "Open",
    lastUpdated: "2h ago",
    category: "Funding / Billing",
    description: "I submitted a withdrawal request 24 hours ago via bank transfer to bank account ending 4452 and it still shows pending status. Please prioritize."
  },
  {
    id: "#TK-8854",
    subject: "API Rate Limit Increase Request",
    status: "Pending Info",
    lastUpdated: "1d ago",
    category: "API / Technical",
    description: "We are currently hitting rate limits during peak London trading hours with our institutional automated trading bot. We request to increase the limit to 200 requests/sec."
  },
  {
    id: "#TK-8710",
    subject: "MT4 Connection Error (Resolved)",
    status: "Closed",
    lastUpdated: "5d ago",
    category: "Trading Platform",
    description: "I am getting error common error during trading session. Help. (Resolved by changing institutional server IP to primary proxy)."
  }
];
