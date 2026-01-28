// Statistics calculation functions

// Calculate statistics
function calculateStats(data) {
    const sum = data.reduce((a, b) => a + b, 0);
    const avg = sum / data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);

    // Calculate variance (coefficient of variation)
    const variance = data.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / avg) * 100;

    return {
        avg: avg.toFixed(2),
        min: min,
        max: max,
        variance: coefficientOfVariation.toFixed(2),
        range: max - min
    };
}

// Calculate difference metrics between two series
function calculateDifferences(data1, data2) {
    const minLength = Math.min(data1.length, data2.length);
    const differences = [];
    let sumAbsDiff = 0;
    let maxDiff = 0;

    for (let i = 0; i < minLength; i++) {
        const diff = Math.abs(data1[i] - data2[i]);
        differences.push(diff);
        sumAbsDiff += diff;
        if (diff > maxDiff) maxDiff = diff;
    }

    const avgDiff = sumAbsDiff / minLength;
    const avg1 = data1.reduce((a, b) => a + b, 0) / data1.length;
    const avg2 = data2.reduce((a, b) => a + b, 0) / data2.length;
    const avgValue = (avg1 + avg2) / 2;
    const avgDiffPercent = (avgDiff / avgValue) * 100;

    // Calculate difference between series averages (Series 1 vs Series 2)
    const seriesAvgDiff = Math.abs(avg1 - avg2);
    const seriesDiffPercent = (seriesAvgDiff / avgValue) * 100;

    // Calculate correlation coefficient
    const correlation = calculateCorrelation(data1.slice(0, minLength), data2.slice(0, minLength));

    return {
        avgDiff: avgDiff.toFixed(2),
        avgDiffPercent: avgDiffPercent.toFixed(2),
        seriesAvgDiff: seriesAvgDiff.toFixed(2),
        seriesDiffPercent: seriesDiffPercent.toFixed(2),
        maxDiff: maxDiff,
        correlation: correlation.toFixed(3)
    };
}

// Calculate Pearson correlation coefficient
function calculateCorrelation(data1, data2) {
    const n = data1.length;
    const sum1 = data1.reduce((a, b) => a + b, 0);
    const sum2 = data2.reduce((a, b) => a + b, 0);
    const sum1Sq = data1.reduce((a, b) => a + b * b, 0);
    const sum2Sq = data2.reduce((a, b) => a + b * b, 0);
    const pSum = data1.reduce((acc, val, i) => acc + val * data2[i], 0);

    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

    if (den === 0) return 0;
    return num / den;
}

// Evaluate variance level
function getVarianceLevel(variance) {
    if (variance < 5) return { level: 'Very Low', class: 'low-variance' };
    if (variance < 10) return { level: 'Low', class: 'low-variance' };
    if (variance < 20) return { level: 'Medium', class: 'medium-variance' };
    return { level: 'High', class: 'high-variance' };
}

