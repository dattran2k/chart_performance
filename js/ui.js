// UI update functions

// Update statistics display
function updateStats(stats1, stats2, diffMetrics, name1, name2, data1, data2) {
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
}

