// Chart drawing and configuration

let chart = null;
let showRange = false; // Default: don't show range visualization

// Draw chart with dual Y-axis
function drawChart(data1, data2, name1, name2) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');

    // Destroy old chart if exists
    if (chart) {
        chart.destroy();
    }

    const maxLength = Math.max(data1.length, data2.length);
    const labels = Array.from({ length: maxLength }, (_, i) => `#${i + 1}`);

    // Calculate stats for min/max ranges
    const stats1 = calculateStats(data1);
    const stats2 = calculateStats(data2);

    // Find common max value for both Y-axes to ensure they have the same scale
    const globalMax = Math.max(stats1.max, stats2.max);
    const yAxisMax = Math.ceil(globalMax * 1.1); // Add 10% padding

    // Create range datasets - from min to max (not from 0)
    const range1Max = Array(maxLength).fill(stats1.max);
    const range1Min = Array(maxLength).fill(stats1.min);  // Use actual min value
    const range2Max = Array(maxLength).fill(stats2.max);
    const range2Min = Array(maxLength).fill(stats2.min);  // Use actual min value

    // Build datasets array conditionally based on showRange flag
    const datasets = [];

    // Add range datasets only if showRange is enabled
    if (showRange) {
        datasets.push(
            // Series 1 range - use left Y-axis (min to max)
            {
                label: `${name1} Range (${stats1.min}-${stats1.max})`,
                data: range1Max,
                borderColor: 'transparent',
                backgroundColor: COLORS.series1.rangeBackground,
                borderWidth: 0,
                pointRadius: 0,
                tension: 0,
                fill: '+1',
                order: 4,
                isRange: true,
                yAxisID: 'y'
            },
            {
                label: `${name1} Min`,
                data: range1Min,
                borderColor: 'transparent',
                backgroundColor: COLORS.series1.rangeBackground,
                borderWidth: 0,
                pointRadius: 0,
                tension: 0,
                fill: false,
                order: 5,
                isRange: true,
                yAxisID: 'y'
            }
        );
    }

    // Add Series 1 data
    datasets.push(
        {
            label: name1,
            data: data1,
            borderColor: COLORS.series1.primary,
            backgroundColor: showRange ? COLORS.series1.background : COLORS.series1.fillArea,
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: COLORS.series1.primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            tension: 0.3,
            fill: !showRange,  // Fill from 0 when range is disabled
            order: 1,
            yAxisID: 'y'
        }
    );

    // Add range datasets for Series 2 only if showRange is enabled
    if (showRange) {
        datasets.push(
            // Series 2 range - use right Y-axis (min to max)
            {
                label: `${name2} Range (${stats2.min}-${stats2.max})`,
                data: range2Max,
                borderColor: 'transparent',
                backgroundColor: COLORS.series2.rangeBackground,
                borderWidth: 0,
                pointRadius: 0,
                tension: 0,
                fill: '+1',
                order: 4,
                isRange: true,
                yAxisID: 'y2'
            },
            {
                label: `${name2} Min`,
                data: range2Min,
                borderColor: 'transparent',
                backgroundColor: COLORS.series2.rangeBackground,
                borderWidth: 0,
                pointRadius: 0,
                tension: 0,
                fill: false,
                order: 5,
                isRange: true,
                yAxisID: 'y2'
            }
        );
    }

    // Add Series 2 data
    datasets.push(
        {
            label: name2,
            data: data2,
            borderColor: COLORS.series2.primary,
            backgroundColor: showRange ? COLORS.series2.background : COLORS.series2.fillArea,
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: COLORS.series2.primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            tension: 0.3,
            fill: !showRange,  // Fill from 0 when range is disabled
            order: 2,
            yAxisID: 'y2'
        }
    );

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
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
                    filter: function(tooltipItem) {
                        // Don't show tooltip for range lines
                        return !tooltipItem.dataset.isRange;
                    },
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.isRange) return null;
                            return context.dataset.label + ': ' + context.parsed.y;
                        },
                        afterBody: function(tooltipItems) {
                            // Filter out range datasets
                            const dataItems = tooltipItems.filter(item => !item.dataset.isRange);

                            if (dataItems.length === 2) {
                                const diff = Math.abs(dataItems[0].parsed.y - dataItems[1].parsed.y);
                                const diffPercent = ((diff / ((dataItems[0].parsed.y + dataItems[1].parsed.y) / 2)) * 100).toFixed(2);
                                return ['', `Difference: ${diff.toFixed(2)} (${diffPercent}%)`];
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    position: 'left',
                    beginAtZero: true,
                    max: yAxisMax,  // Use synchronized max value
                    ticks: {
                        callback: function(value) {
                            // Add "min: " or "max: " prefix for Series 1 min/max values
                            if (value === stats1.min) {
                                return 'min: ' + value;
                            }
                            if (value === stats1.max) {
                                return 'max: ' + value;
                            }
                            return value;
                        },
                        font: function(context) {
                            const value = context.tick ? context.tick.value : context.parsed;
                            // Make min/max values bold
                            if (value === stats1.min || value === stats1.max) {
                                return {
                                    size: 12,
                                    weight: 'bold'
                                };
                            }
                            return {
                                size: 11
                            };
                        },
                        color: function(context) {
                            const value = context.tick ? context.tick.value : context.parsed;
                            // Color code min/max values
                            if (value === stats1.min || value === stats1.max) {
                                return COLORS.series1.primary;
                            }
                            return '#666';
                        }
                    },
                    afterBuildTicks: function(axis) {
                        // Get existing tick values
                        const existingValues = axis.ticks.map(t => typeof t === 'object' ? t.value : t);

                        // Add min/max values for Series 1
                        const minMaxValues = [stats1.min, stats1.max];
                        const uniqueMinMax = [...new Set(minMaxValues)];

                        uniqueMinMax.forEach(val => {
                            if (!existingValues.includes(val)) {
                                axis.ticks.push({ value: val });
                            }
                        });

                        // Sort ticks
                        axis.ticks.sort((a, b) => {
                            const aVal = typeof a === 'object' ? a.value : a;
                            const bVal = typeof b === 'object' ? b.value : b;
                            return aVal - bVal;
                        });
                    },
                    grid: {
                        color: function(context) {
                            const value = context.tick.value;
                            // Highlight grid lines for min/max values
                            if (value === stats1.min || value === stats1.max) {
                                return COLORS.series1.grid;
                            }
                            return 'rgba(0, 0, 0, 0.05)';
                        },
                        lineWidth: function(context) {
                            const value = context.tick.value;
                            if (value === stats1.min || value === stats1.max) {
                                return 2;
                            }
                            return 1;
                        }
                    },
                    title: {
                        display: true,
                        text: name1,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: COLORS.series1.primary
                    }
                },
                y2: {
                    position: 'right',
                    beginAtZero: true,
                    max: yAxisMax,  // Use synchronized max value
                    ticks: {
                        callback: function(value) {
                            // Add "min: " or "max: " prefix for Series 2 min/max values
                            if (value === stats2.min) {
                                return 'min: ' + value;
                            }
                            if (value === stats2.max) {
                                return 'max: ' + value;
                            }
                            return value;
                        },
                        font: function(context) {
                            const value = context.tick ? context.tick.value : context.parsed;
                            // Make min/max values bold
                            if (value === stats2.min || value === stats2.max) {
                                return {
                                    size: 12,
                                    weight: 'bold'
                                };
                            }
                            return {
                                size: 11
                            };
                        },
                        color: function(context) {
                            const value = context.tick ? context.tick.value : context.parsed;
                            // Color code min/max values
                            if (value === stats2.min || value === stats2.max) {
                                return COLORS.series2.primary;
                            }
                            return '#666';
                        }
                    },
                    afterBuildTicks: function(axis) {
                        // Get existing tick values
                        const existingValues = axis.ticks.map(t => typeof t === 'object' ? t.value : t);

                        // Add min/max values for Series 2
                        const minMaxValues = [stats2.min, stats2.max];
                        const uniqueMinMax = [...new Set(minMaxValues)];

                        uniqueMinMax.forEach(val => {
                            if (!existingValues.includes(val)) {
                                axis.ticks.push({ value: val });
                            }
                        });

                        // Sort ticks
                        axis.ticks.sort((a, b) => {
                            const aVal = typeof a === 'object' ? a.value : a;
                            const bVal = typeof b === 'object' ? b.value : b;
                            return aVal - bVal;
                        });
                    },
                    grid: {
                        drawOnChartArea: false, // Don't draw grid lines for right axis
                        color: function(context) {
                            const value = context.tick.value;
                            // Highlight grid lines for min/max values
                            if (value === stats2.min || value === stats2.max) {
                                return COLORS.series2.grid;
                            }
                            return 'rgba(0, 0, 0, 0.05)';
                        },
                        lineWidth: function(context) {
                            const value = context.tick.value;
                            if (value === stats2.min || value === stats2.max) {
                                return 2;
                            }
                            return 1;
                        }
                    },
                    title: {
                        display: true,
                        text: name2,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: COLORS.series2.primary
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

