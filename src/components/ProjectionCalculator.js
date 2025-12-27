'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateCompoundInterest } from '@/utils/finance';

export default function ProjectionCalculator({ currentStock, portfolio }) {
    const [investment, setInvestment] = useState(1000);
    const [years, setYears] = useState(10);
    const [rate, setRate] = useState(10); // Default 10% assumption if history fails
    const [projectionData, setProjectionData] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Auto-fill Rate and clear projection only when the stock symbol changes
    useEffect(() => {
        if (currentStock) {
            // Auto-fill expected return based on 52-week change
            if (currentStock.fiftyTwoWeekChangePercent !== undefined) {
                setRate(Math.round(currentStock.fiftyTwoWeekChangePercent * 100) / 100);
            } else {
                setRate(10.00); // Default fallback
            }

            // Clear previous projection data when switching stocks
            setProjectionData([]);
        }
    }, [currentStock?.symbol]);

    // 2. Reactively sync Initial Investment whenever symbol OR portfolio changes
    useEffect(() => {
        if (currentStock) {
            const holding = portfolio?.find(p => p.symbol === currentStock.symbol);
            if (holding) {
                const totalValue = holding.price * holding.amount;
                setInvestment(Math.round(totalValue * 100) / 100);
            } else {
                setInvestment(1000.00); // Default if not owned
            }
        }
    }, [currentStock?.symbol, portfolio]);

    const handleSimulate = async () => {
        if (!currentStock) return;
        setLoading(true);

        try {
            // Fetch 5 years history used to calc average return
            // Ideally we would calculate real CAGR from backend history, but for simulation let's use a simplified approach
            // or just let user input expected rate.
            // Let's TRY to key off history if possible, else default.

            // Actually, let's fetch history to show the USER the past trend, but for PROJECTION
            // we usually project forward.
            // Let's calculate the projection locally based on the input rate.

            const data = calculateCompoundInterest(investment, rate / 100, years);
            setProjectionData(data);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, color: 'var(--accent)' }}>Investment Simulator</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Project the value of your investment in {currentStock ? currentStock.symbol : 'this stock'} over time.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Initial Investment ($)</label>
                    <input type="number" step="0.01" className="input" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Duration (Years)</label>
                    <input type="number" step="1" className="input" value={years} onChange={(e) => setYears(Number(e.target.value))} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Expected Annual Return (%)</label>
                    <input type="number" step="0.01" className="input" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSimulate} disabled={!currentStock}>
                {currentStock ? 'Run Simulation' : 'Select a Stock First'}
            </button>

            {projectionData.length > 0 && (
                <div style={{ marginTop: '2rem', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                            <XAxis dataKey="year" stroke="var(--text-secondary)" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                            <YAxis stroke="var(--text-secondary)" tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid var(--glass-border)' }}
                                formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Value']}
                            />
                            <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p>Final Value: <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>${projectionData[projectionData.length - 1].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
                    </div>
                </div>
            )}
        </div>
    );
}
