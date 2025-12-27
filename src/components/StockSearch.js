'use client';

import { useState } from 'react';

export default function StockSearch({ onSelect }) {
    const [symbol, setSymbol] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!symbol) return;

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/stock?symbol=${symbol}`);
            const data = await res.json();

            if (res.ok) {
                onSelect(data);
            } else {
                setError(data.error || 'Failed to fetch stock');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    className="input"
                    placeholder="Enter Symbol (e.g., AAPL)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            {error && <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</p>}
        </div>
    );
}
