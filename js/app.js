// Main application logic and event handlers

// Toggle range visualization
function toggleRange() {
    showRange = !showRange;
    const btn = document.getElementById('toggleRangeBtn');
    const textSpan = btn.querySelector('.toggle-text');

    if (showRange) {
        btn.classList.add('active');
        textSpan.textContent = 'Hide Min-Max Range';
    } else {
        btn.classList.remove('active');
        textSpan.textContent = 'Show Min-Max Range';
    }

    // Redraw chart with new setting
    handleCompare();
}

// Initialize color picker
function initColorPicker() {
    const colorOptionsContainer = document.getElementById('colorOptions');

    COLOR_SCHEMES.forEach((scheme, index) => {
        const option = document.createElement('div');
        option.className = 'color-option';
        if (index === 0) option.classList.add('active'); // First one is active by default

        // For custom option, show gear icon
        if (scheme.isCustom) {
            option.innerHTML = '<span style="font-size: 20px;">⚙️</span>';
            option.style.backgroundColor = '#f0f0f0';
        } else {
            option.style.setProperty('--color1', scheme.series1.primary);
            option.style.setProperty('--color2', scheme.series2.primary);
        }

        option.title = scheme.name;
        option.dataset.schemeId = scheme.id;

        option.addEventListener('click', function() {
            // If custom option, show modal
            if (scheme.isCustom) {
                showCustomColorModal();
                return;
            }

            // Remove active class from all options
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });

            // Add active class to clicked option
            this.classList.add('active');

            // Change color scheme
            setColorScheme(scheme.id);

            // Redraw chart with new colors
            handleCompare();
        });

        colorOptionsContainer.appendChild(option);
    });
}

// Show custom color modal
function showCustomColorModal() {
    const modal = document.getElementById('customColorModal');
    if (modal) {
        modal.style.display = 'flex';

        // Get current custom colors
        const customScheme = COLOR_SCHEMES.find(s => s.id === 'custom');
        if (customScheme) {
            // Extract RGB and convert to hex
            const color1 = rgbToHex(customScheme.series1.primary);
            const color2 = rgbToHex(customScheme.series2.primary);

            document.getElementById('color1Picker').value = color1;
            document.getElementById('color2Picker').value = color2;
            document.getElementById('color1Value').textContent = color1;
            document.getElementById('color2Value').textContent = color2;
        }
    }
}

// Close custom color modal
function closeCustomColorModal() {
    const modal = document.getElementById('customColorModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Apply custom colors
function applyCustomColors() {
    const color1 = document.getElementById('color1Picker').value;
    const color2 = document.getElementById('color2Picker').value;

    // Update custom scheme colors
    updateCustomColors(color1, color2);

    // Set active scheme to custom
    setColorScheme('custom');

    // Update UI
    document.querySelectorAll('.color-option').forEach((opt, idx) => {
        opt.classList.remove('active');
        if (opt.dataset.schemeId === 'custom') {
            opt.classList.add('active');
        }
    });

    // Redraw chart
    handleCompare();

    // Close modal
    closeCustomColorModal();
}

// Helper to convert rgb(r,g,b) string to hex
function rgbToHex(rgb) {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return '#667eea'; // default
}

// Handle compare button click
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
    updateStats(stats1, stats2, diffMetrics, name1, name2, data1, data2);
}

// Initialize event listeners
function initEventListeners() {
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
}

// Auto-compare on page load with sample data
window.addEventListener('load', function() {
    initColorPicker();
    initEventListeners();
    handleCompare();
});

