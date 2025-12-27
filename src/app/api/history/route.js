import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';
import { subYears } from 'date-fns';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const years = searchParams.get('years') || 1;

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    const period1 = subYears(new Date(), parseInt(years)).toISOString().split('T')[0];
    const period2 = new Date().toISOString().split('T')[0];

    try {
        // period1 and period2 should be YYYY-MM-DD or dates
        const result = await yahooFinance.historical(symbol, {
            period1,
            period2,
            interval: '1d',
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: 'Failed to fetch history', details: error.message }, { status: 500 });
    }
}
