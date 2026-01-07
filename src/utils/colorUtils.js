/**
 * Color utility functions for the Travel Journal app
 * These are pure functions with no side effects - highly reusable
 */

/**
 * Convert hex color to rgba
 * @param {string} hex - Hex color code (e.g., "#ff5733")
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== "string") {
    return `rgba(128, 128, 128, ${alpha})`;
  }
  
  // Remove # if present
  const cleanHex = hex.replace("#", "");
  
  // Handle shorthand hex (e.g., #fff)
  const fullHex = cleanHex.length === 3
    ? cleanHex.split("").map(char => char + char).join("")
    : cleanHex;
    
  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color code
 * @returns {object} Object with r, g, b properties
 */
export const hexToRgb = (hex) => {
  if (!hex || typeof hex !== "string") {
    return { r: 128, g: 128, b: 128 };
  }
  
  const cleanHex = hex.replace("#", "");
  const fullHex = cleanHex.length === 3
    ? cleanHex.split("").map(char => char + char).join("")
    : cleanHex;
    
  return {
    r: parseInt(fullHex.slice(0, 2), 16),
    g: parseInt(fullHex.slice(2, 4), 16),
    b: parseInt(fullHex.slice(4, 6), 16),
  };
};

/**
 * Determine if a color is light or dark
 * @param {string} hex - Hex color code
 * @returns {boolean} True if color is light
 */
export const isLightColor = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

/**
 * Get contrasting text color (black or white)
 * @param {string} backgroundColor - Hex color code
 * @returns {string} "#000000" or "#ffffff"
 */
export const getContrastColor = (backgroundColor) => {
  return isLightColor(backgroundColor) ? "#000000" : "#ffffff";
};

/**
 * Lighten a hex color
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened hex color
 */
export const lightenColor = (hex, percent) => {
  const { r, g, b } = hexToRgb(hex);
  const amount = Math.round(2.55 * percent);
  
  const newR = Math.min(255, r + amount);
  const newG = Math.min(255, g + amount);
  const newB = Math.min(255, b + amount);
  
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
};

/**
 * Darken a hex color
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
export const darkenColor = (hex, percent) => {
  const { r, g, b } = hexToRgb(hex);
  const amount = Math.round(2.55 * percent);
  
  const newR = Math.max(0, r - amount);
  const newG = Math.max(0, g - amount);
  const newB = Math.max(0, b - amount);
  
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
};

