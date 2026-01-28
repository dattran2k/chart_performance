let chart = null;

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

// Draw chart
function drawChart(data1, data2, name1, name2) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');

    // Destroy old chart if exists
    if (chart) {
        chart.destroy();
    }

    const maxLength = Math.max(data1.length, data2.length);
    const labels = Array.from({ length: maxLength }, (_, i) => `#${i + 1}`);

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: name1,
                    data: data1,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#667eea',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: name2,
                    data: data2,
                    borderColor: '#f093fb',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#f093fb',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        },
                        afterBody: function(context) {
                            if (context.length === 2) {
                                const diff = Math.abs(context[0].parsed.y - context[1].parsed.y);
                                const diffPercent = ((diff / ((context[0].parsed.y + context[1].parsed.y) / 2)) * 100).toFixed(2);
                                return ['', `Difference: ${diff.toFixed(2)} (${diffPercent}%)`];
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Value',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// Update statistics
function updateStats(stats1, stats2, diffMetrics, name1, name2) {
    // Update titles
    document.getElementById('series1Title').textContent = `${name1} - Statistics`;
    document.getElementById('series2Title').textContent = `${name2} - Statistics`;

    document.getElementById('avg1').textContent = stats1.avg;
    document.getElementById('min1').textContent = stats1.min;
    document.getElementById('max1').textContent = stats1.max;
    document.getElementById('variance1').textContent = stats1.variance + '%';

    document.getElementById('avg2').textContent = stats2.avg;
    document.getElementById('min2').textContent = stats2.min;
    document.getElementById('max2').textContent = stats2.max;
    document.getElementById('variance2').textContent = stats2.variance + '%';

    // Update difference metrics
    document.getElementById('avgDiff').textContent = diffMetrics.seriesAvgDiff;
    document.getElementById('seriesDiffPercent').textContent = diffMetrics.seriesDiffPercent + '%';

    // Create conclusion
    const variance1Level = getVarianceLevel(parseFloat(stats1.variance));
    const variance2Level = getVarianceLevel(parseFloat(stats2.variance));
    const avgVariance = (parseFloat(stats1.variance) + parseFloat(stats2.variance)) / 2;
    const avgVarianceLevel = getVarianceLevel(avgVariance);

    const conclusionHTML = `
        <p><strong>📊 Variance Analysis:</strong></p>
        <p>• ${name1}: <span class="${variance1Level.class}">${variance1Level.level}</span> variance (${stats1.variance}%) - Range: ${stats1.range}</p>
        <p>• ${name2}: <span class="${variance2Level.class}">${variance2Level.level}</span> variance (${stats2.variance}%) - Range: ${stats2.range}</p>
        <p style="margin-top: 15px;"><strong>📈 Performance Comparison:</strong></p>
        <p style="font-size: 1.15rem;">• <strong>${name1} vs ${name2}:</strong> Performance difference of <span style="color: #667eea; font-weight: bold; font-size: 1.3rem;">${diffMetrics.seriesDiffPercent}%</span></p>
        <p style="margin-top: 15px;"><strong>🎯 Conclusion:</strong></p>
        <p class="${avgVarianceLevel.class}" style="font-size: 1.1rem;">
            Both series show <strong>${avgVarianceLevel.level}</strong> variance (${avgVariance.toFixed(2)}%).
            ${avgVariance < 10 ? '✅ Data is relatively stable with minimal fluctuation.' :
              avgVariance < 20 ? '⚠️ Data shows moderate fluctuation.' :
              '❗ Data shows significant fluctuation.'}
        </p>
        <p style="margin-top: 10px; font-size: 1.05rem; font-weight: 600; color: #333;">
            ${parseFloat(diffMetrics.seriesDiffPercent) < 5 ? `✅ ${name1} and ${name2} perform very similarly with only <strong>${diffMetrics.seriesDiffPercent}%</strong> difference.` :
              parseFloat(diffMetrics.seriesDiffPercent) < 10 ? `⚠️ ${name1} shows <strong>${diffMetrics.seriesDiffPercent}%</strong> ${parseFloat(stats1.avg) > parseFloat(stats2.avg) ? 'better' : 'lower'} performance than ${name2}.` :
              `❗ Significant <strong>${diffMetrics.seriesDiffPercent}%</strong> performance difference between ${name1} and ${name2}.`}
        </p>
    `;

    document.getElementById('conclusion').innerHTML = conclusionHTML;
}

// Handle compare
function handleCompare() {
    const input1 = document.getElementById('series1').value.trim();
    const input2 = document.getElementById('series2').value.trim();
    const name1 = document.getElementById('series1Name').value.trim() || 'Series 1';
    const name2 = document.getElementById('series2Name').value.trim() || 'Series 2';

    if (!input1 || !input2) {
        alert('Please enter both series values!');
        return;
    }

    // Convert input to number arrays
    const data1 = input1.split(/\s+/).map(Number).filter(n => !isNaN(n));
    const data2 = input2.split(/\s+/).map(Number).filter(n => !isNaN(n));

    if (data1.length === 0 || data2.length === 0) {
        alert('Invalid data! Please enter numbers separated by spaces.');
        return;
    }

    // Calculate statistics
    const stats1 = calculateStats(data1);
    const stats2 = calculateStats(data2);
    const diffMetrics = calculateDifferences(data1, data2);

    // Draw chart
    drawChart(data1, data2, name1, name2);

    // Update statistics
    updateStats(stats1, stats2, diffMetrics, name1, name2);
}

// Event listeners
document.getElementById('compareBtn').addEventListener('click', handleCompare);

// Allow Enter key to compare
document.getElementById('series1Name').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleCompare();
});

document.getElementById('series1').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleCompare();
});

document.getElementById('series2Name').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleCompare();
});

document.getElementById('series2').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleCompare();
});

// Auto-compare on page load with sample data
window.addEventListener('load', function() {
    handleCompare();
});

