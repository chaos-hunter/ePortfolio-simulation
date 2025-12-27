'use client';

import { useState, useEffect } from 'react';
import StockSearch from '@/components/StockSearch';
import StockCard from '@/components/StockCard';
import PortfolioSummary from '@/components/PortfolioSummary';
import ProjectionCalculator from '@/components/ProjectionCalculator';

export default function Home() {
  const [currentStock, setCurrentStock] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [cash, setCash] = useState(0); // Start with $0 as requested
  const [loaded, setLoaded] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  // Load from SessionStorage (resets on close)
  useEffect(() => {
    const savedPortfolio = sessionStorage.getItem('sim_portfolio');
    const savedCash = sessionStorage.getItem('sim_cash');
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
    // If savedCash exists, use it, otherwise keep 0 (but careful of "null" string)
    if (savedCash !== null) setCash(parseFloat(savedCash));
    setLoaded(true);
  }, []);

  // Save to SessionStorage
  useEffect(() => {
    if (loaded) {
      sessionStorage.setItem('sim_portfolio', JSON.stringify(portfolio));
      sessionStorage.setItem('sim_cash', JSON.stringify(cash));
    }
  }, [portfolio, cash, loaded]);

  const handleDeposit = (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;
    setCash(prev => prev + amount);
    setDepositAmount('');
  };

  const handleBuy = ({ symbol, price, amount, name }) => {
    const cost = price * amount;
    if (cost > cash) {
      alert('Insufficient funds!');
      return;
    }

    setCash((prev) => prev - cost);
    setPortfolio((prev) => {
      const existing = prev.find((item) => item.symbol === symbol);
      if (existing) {
        return prev.map((item) =>
          item.symbol === symbol
            ? { ...item, amount: item.amount + amount }
            : item
        );
      }
      return [...prev, { symbol, price, amount, name }];
    });
  };

  const handleSell = (symbol, amountToSell) => {
    const item = portfolio.find(i => i.symbol === symbol);
    if (!item) return;

    const actualSellAmount = Math.min(item.amount, amountToSell);
    const cashToAdd = item.price * actualSellAmount;

    setPortfolio((prev) => {
      return prev.map(i => {
        if (i.symbol === symbol) {
          if (i.amount <= actualSellAmount) {
            return null;
          } else {
            return { ...i, amount: i.amount - actualSellAmount };
          }
        }
        return i;
      }).filter(Boolean);
    });

    setCash(prev => prev + cashToAdd);
  };

  return (
    <main className="container" style={{ paddingBottom: '3rem' }}>
      <header style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          background: 'linear-gradient(to right, #00e676, #2979ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          ProInvestor Sim
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Real-time Data & Wealth Projection Engine</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="main-content">
          <StockSearch onSelect={setCurrentStock} />

          {currentStock && (
            <>
              <StockCard data={currentStock} onBuy={handleBuy} />
              <ProjectionCalculator currentStock={currentStock} portfolio={portfolio} />
            </>
          )}

          {!currentStock && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Search for a stock symbol (e.g., NVDA, TSLA, SPY) to begin.</p>
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginTop: 0 }}>Wallet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Current Balance</p>
            <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>

            <form onSubmit={handleDeposit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                placeholder="Amount to Add"
                className="input"
                style={{ width: '100px' }}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="0.01"
                step="0.01"
              />
              <button type="submit" className="btn btn-primary">+</button>
            </form>
          </div>

          <PortfolioSummary portfolio={portfolio} cash={cash} onSell={handleSell} />
        </div>
      </div>
    </main>
  );
}
