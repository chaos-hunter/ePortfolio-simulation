export const calculateCompoundInterest = (principal, rate, years, contributions = 0) => {
    // Basic compound interest: A = P(1 + r/n)^(nt)
    // Simplified for annual compounding for this simulation
    let balance = principal;
    const dataPoints = [];

    for (let i = 0; i <= years; i++) {
        dataPoints.push({ year: i, value: Math.round(balance) });
        balance = balance * (1 + rate) + contributions;
    }

    return dataPoints;
};

export const calculateCAGR = (startPrice, endPrice, years) => {
    // CAGR = (End Value / Start Value) ^ (1 / n) - 1
    if (startPrice === 0) return 0;
    return Math.pow(endPrice / startPrice, 1 / years) - 1;
};
