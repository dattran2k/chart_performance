// Color constants for chart series

// Alpha (opacity) constants - Change these to adjust transparency across all color schemes
const ALPHA = {
    BORDER: 0.9,              // Line border opacity
    BACKGROUND: 0.15,         // Fill area under line (when range is enabled)
    RANGE: 0.8,              // Range line opacity (not used currently since borderWidth is 0)
    RANGE_BACKGROUND: 0.35,   // Range shaded area - Main visibility control
    FILL_AREA: 0.1,          // Fill area from 0 to value (when range is disabled) - matches original
    GRID: 0.5                // Grid line opacity
};

// Helper function to create color object with alpha values
function createColorConfig(r, g, b) {
    return {
        primary: `rgb(${r}, ${g}, ${b})`,
        border: `rgba(${r}, ${g}, ${b}, ${ALPHA.BORDER})`,
        background: `rgba(${r}, ${g}, ${b}, ${ALPHA.BACKGROUND})`,
        range: `rgba(${r}, ${g}, ${b}, ${ALPHA.RANGE})`,
        rangeBackground: `rgba(${r}, ${g}, ${b}, ${ALPHA.RANGE_BACKGROUND})`,
        fillArea: `rgba(${r}, ${g}, ${b}, ${ALPHA.FILL_AREA})`,  // For area chart mode
        grid: `rgba(${r}, ${g}, ${b}, ${ALPHA.GRID})`
    };
}

// Available color schemes - High contrast pairs for better visibility
const COLOR_SCHEMES = [
    {
        id: 'purple-pink',
        name: 'Purple & Pink',
        series1: createColorConfig(102, 126, 234),   // #667eea - Original purple
        series2: createColorConfig(240, 147, 251)    // #f093fb - Original pink
    },
    {
        id: 'blue-orange',
        name: 'Blue & Orange',
        series1: createColorConfig(0, 71, 171),      // Deep Blue
        series2: createColorConfig(255, 102, 0)      // Bright Orange
    },
    {
        id: 'purple-lime',
        name: 'Purple & Lime',
        series1: createColorConfig(139, 0, 255),     // Electric Purple
        series2: createColorConfig(170, 255, 0)      // Lime Green
    },
    {
        id: 'red-cyan',
        name: 'Red & Cyan',
        series1: createColorConfig(204, 0, 0),       // Pure Red
        series2: createColorConfig(0, 204, 204)      // Cyan
    },
    {
        id: 'magenta-green',
        name: 'Magenta & Green',
        series1: createColorConfig(255, 0, 102),     // Hot Magenta
        series2: createColorConfig(0, 204, 102)      // Emerald Green
    },
    {
        id: 'navy-gold',
        name: 'Navy & Gold',
        series1: createColorConfig(0, 0, 128),       // Navy Blue
        series2: createColorConfig(255, 176, 0)      // Gold
    },
    {
        id: 'red-black',
        name: 'Red & Black',
        series1: createColorConfig(230, 0, 0),       // Bright Red
        series2: createColorConfig(26, 26, 26)       // Deep Black
    },
    {
        id: 'black-yellow',
        name: 'Black & Yellow',
        series1: createColorConfig(0, 0, 0),         // Pure Black
        series2: createColorConfig(255, 215, 0)      // Gold/Yellow
    },
    {
        id: 'custom',
        name: 'Custom',
        series1: createColorConfig(102, 126, 234),   // Default to purple
        series2: createColorConfig(240, 147, 251),   // Default to pink
        isCustom: true
    }
];

// Default color scheme
let COLORS = COLOR_SCHEMES[0];

// Function to change color scheme
function setColorScheme(schemeId) {
    const scheme = COLOR_SCHEMES.find(s => s.id === schemeId);
    if (scheme) {
        COLORS = {
            series1: { ...scheme.series1 },
            series2: { ...scheme.series2 }
        };
        return true;
    }
    return false;
}

// Function to update custom colors
function updateCustomColors(color1Hex, color2Hex) {
    const rgb1 = hexToRgb(color1Hex);
    const rgb2 = hexToRgb(color2Hex);

    if (rgb1 && rgb2) {
        const customScheme = COLOR_SCHEMES.find(s => s.id === 'custom');
        if (customScheme) {
            customScheme.series1 = createColorConfig(rgb1.r, rgb1.g, rgb1.b);
            customScheme.series2 = createColorConfig(rgb2.r, rgb2.g, rgb2.b);

            // Update current COLORS
            COLORS = {
                series1: { ...customScheme.series1 },
                series2: { ...customScheme.series2 }
            };
        }
    }
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

