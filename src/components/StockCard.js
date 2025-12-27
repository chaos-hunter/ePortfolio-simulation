'use client';

import { useState } from 'react';

export default function StockCard({ data, onBuy }) {
    const [amount, setAmount] = useState(1);
    const price = data.regularMarketPrice;
    const change = data.regularMarketChangePercent;
    const isPositive = change >= 0;

    return (
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0 }}>{data.symbol}</h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{data.longName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0 }}>${price?.toFixed(2)}</h2>
                    <p style={{ margin: 0, color: isPositive ? 'var(--primary)' : 'var(--danger)' }}>
                        {isPositive ? '+' : ''}{change?.toFixed(2)}%
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.5rem' }}>
                <input
                    type="number"
                    min="0.0001"
                    step="any"
                    className="input"
                    style={{ width: '100px' }}
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (amount > 0) {
                            onBuy({ symbol: data.symbol, price, amount, name: data.longName });
                        }
                    }}
                >
                    Buy Share(s)
                </button>
            </div>
        </div>
    );
}
