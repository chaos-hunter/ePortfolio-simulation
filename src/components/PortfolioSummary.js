'use client';
import { useState } from 'react';

export default function PortfolioSummary({ portfolio, cash, onSell }) {
    const totalValue = portfolio.reduce((acc, item) => acc + (item.price * item.amount), 0);

    return (
        <div className="glass-panel">
            <h3 style={{ marginTop: 0 }}>Paper Trading Portfolio</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Cash Available</p>
                    <h2 style={{ margin: 0 }}>${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                </div>
                <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Total Assets</p>
                    <h2 style={{ margin: 0 }}>${(cash + totalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                </div>
            </div>

            {portfolio.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No stocks owned yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {portfolio.map((item, index) => (
                        <PortfolioItem key={index} item={item} onSell={onSell} />
                    ))}
                </div>
            )}
        </div>
    );
}

function PortfolioItem({ item, onSell }) {
    const [sellAmount, setSellAmount] = useState('');

    const handleSellClick = () => {
        const amount = parseFloat(sellAmount);
        if (!amount || amount <= 0) return;
        onSell(item.symbol, amount);
        setSellAmount('');
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px'
        }}>
            <div>
                <strong>{item.symbol}</strong>
                <span style={{ color: 'var(--text-secondary)', marginLeft: '1rem' }}>
                    {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} shares @ ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="number"
                    placeholder="Qty"
                    className="input"
                    style={{ width: '70px', padding: '0.25rem 0.5rem' }}
                    min="0.01"
                    step="0.01"
                    max={item.amount}
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                />
                <button
                    className="btn btn-danger"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={handleSellClick}
                >
                    Sell
                </button>
            </div>
        </div>
    );
}
