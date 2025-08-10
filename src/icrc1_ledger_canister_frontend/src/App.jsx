import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
  Wallet,
  Send,
  History,
  RefreshCw,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import ICRC1Service from './services/icrc1Service.jsx';
import './App.scss';

function App() {
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState('');
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('wallet');
  const [icrc1Service, setIrc1Service] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({});

  useEffect(() => {
    // Initialize AuthClient
    AuthClient.create().then(client => {
      setAuthClient(client);
      
      // Check if user is already authenticated
      if (client.isAuthenticated()) {
        handleAuthenticated(client);
      }
    });
  }, []);

  const handleAuthenticated = async (client) => {
    const identity = client.getIdentity();
    setIdentity(identity);
    setPrincipal(identity.getPrincipal().toText());
    
    // Initialize ICRC1 service
    const service = new ICRC1Service('icrc1_ledger_canister', identity);
    setIrc1Service(service);
    
    // Fetch initial data
    await fetchBalance();
    await fetchTokenInfo();
  };

  const login = async () => {
    if (!authClient) return;
    
    await authClient.login({
      identityProvider: process.env.NODE_ENV === 'development' 
        ? `http://127.0.0.1:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`
        : 'https://identity.ic0.app',
      onSuccess: () => handleAuthenticated(authClient),
    });
  };

  const logout = async () => {
    if (!authClient) return;
    
    await authClient.logout();
    setIdentity(null);
    setPrincipal('');
    setBalance(0);
    setTransactions([]);
    setIrc1Service(null);
    setTokenInfo({});
  };

  const fetchBalance = async () => {
    if (!icrc1Service || !principal) return;
    
    try {
      setIsLoading(true);
      const balance = await icrc1Service.getBalance(principal);
      setBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setMessage({ text: 'Failed to fetch balance', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    // Mock transactions for now
    setTransactions([
      { id: 1, type: 'received', amount: 1000, from: 'System', timestamp: Date.now() - 86400000 },
      { id: 2, type: 'sent', amount: 500, to: 'User123', timestamp: Date.now() - 172800000 }
    ]);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!icrc1Service || !transferAmount || !transferTo) {
      setMessage({ text: 'Please fill all fields', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const result = await icrc1Service.transfer(transferTo, transferAmount);
      
      if (result.success) {
        setMessage({ text: `Transfer successful! Block: ${result.blockIndex}`, type: 'success' });
        setTransferAmount('');
        setTransferTo('');
        await fetchBalance();
      } else {
        setMessage({ text: `Transfer failed: ${result.error}`, type: 'error' });
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setMessage({ text: 'Transfer failed', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage({ text: 'Copied to clipboard!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 2000);
  };

  const formatBalance = (balance) => {
    return (Number(balance) / 100000000).toFixed(8);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const fetchTokenInfo = async () => {
    if (!icrc1Service) return;
    
    try {
      const [name, symbol, totalSupply, fee] = await Promise.all([
        icrc1Service.getName(),
        icrc1Service.getSymbol(),
        icrc1Service.getTotalSupply(),
        icrc1Service.getFee()
      ]);
      
      setTokenInfo({ name, symbol, totalSupply, fee });
    } catch (error) {
      console.error('Error fetching token info:', error);
    }
  };

  if (!identity) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
          <h1>DLTK Ledger</h1>
          <p>Welcome to the Dev Liftoff Token Ledger</p>
          <button className="btn btn-primary" onClick={login}>
            Connect Internet Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>DLTK Ledger</h1>
        <div className="user-info">
          <span className="principal">{principal.slice(0, 10)}...{principal.slice(-10)}</span>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <main className="main">
        <div className="balance-card">
          <div className="balance-header">
            <Wallet size={24} />
            <h2>Wallet Balance</h2>
          </div>
          <div className="balance-amount">
            {isLoading ? (
              <Loader2 size={32} className="spinner" />
            ) : (
              <>
                <span className="amount">{formatBalance(balance)}</span>
                <span className="currency">{tokenInfo.symbol || 'DLTK'}</span>
              </>
            )}
          </div>
          <button className="btn btn-secondary" onClick={fetchBalance} disabled={isLoading}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            <Wallet size={16} />
            Wallet
          </button>
          <button 
            className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfer')}
          >
            <Send size={16} />
            Transfer
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={16} />
            History
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'wallet' && (
            <div className="wallet-info">
              <div className="info-item">
                <label>Principal ID:</label>
                <div className="value-with-copy">
                  <span>{principal}</span>
                  <button onClick={() => copyToClipboard(principal)}>
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="info-item">
                <label>Token Name:</label>
                <span>{tokenInfo.name || 'Dev Liftoff Token'}</span>
              </div>
              <div className="info-item">
                <label>Total Supply:</label>
                <span>{tokenInfo.totalSupply ? formatBalance(tokenInfo.totalSupply) : 'Loading...'}</span>
              </div>
              <div className="info-item">
                <label>Transfer Fee:</label>
                <span>{tokenInfo.fee ? formatBalance(tokenInfo.fee) : 'Loading...'} {tokenInfo.symbol || 'DLTK'}</span>
              </div>
            </div>
          )}

          {activeTab === 'transfer' && (
            <form className="transfer-form" onSubmit={handleTransfer}>
              <div className="form-group">
                <label htmlFor="transferTo">To (Principal ID):</label>
                <input
                  id="transferTo"
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="Enter principal ID"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="transferAmount">Amount:</label>
                <input
                  id="transferAmount"
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Enter amount"
                  step="0.00000001"
                  min="0"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <Loader2 size={16} className="spinner" /> : 'Send'}
              </button>
            </form>
          )}

          {activeTab === 'history' && (
            <div className="transaction-history">
              <button className="btn btn-secondary" onClick={fetchTransactions}>
                <RefreshCw size={16} />
                Refresh History
              </button>
              <div className="transactions">
                {transactions.map(tx => (
                  <div key={tx.id} className={`transaction ${tx.type}`}>
                    <div className="tx-icon">
                      {tx.type === 'received' ? <CheckCircle size={16} /> : <Send size={16} />}
                    </div>
                    <div className="tx-details">
                      <div className="tx-type">{tx.type === 'received' ? 'Received' : 'Sent'}</div>
                      <div className="tx-amount">{formatBalance(tx.amount)} DLTK</div>
                      <div className="tx-info">
                        {tx.type === 'received' ? `From: ${tx.from}` : `To: ${tx.to}`}
                      </div>
                    </div>
                    <div className="tx-date">{formatDate(tx.timestamp)}</div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="no-transactions">No transactions yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
