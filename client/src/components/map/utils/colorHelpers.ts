/**
 * Utility functions for color manipulation in the map markers
 */

/**
 * Darkens a color by a given percentage
 * @param color - The color to darken (hex or rgb)
 * @param percent - The percentage to darken (0-100)
 * @returns The darkened color as a hex string
 */
export function darkenColor(color: string, percent: number): string {
  // Convert hex to RGB if needed
  let r: number, g: number, b: number;

  if (color.startsWith('#')) {
    // Handle hex color
    const hex = color.substring(1);
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith('rgb')) {
    // Handle rgb/rgba color
    const rgbMatch = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+\.\d+)?\)$/,
    );
    if (!rgbMatch) return color;
    r = parseInt(rgbMatch[1], 10);
    g = parseInt(rgbMatch[2], 10);
    b = parseInt(rgbMatch[3], 10);
  } else {
    return color; // Return original if format not recognized
  }

  // Calculate darkened RGB values
  r = Math.max(0, Math.floor((r * (100 - percent)) / 100));
  g = Math.max(0, Math.floor((g * (100 - percent)) / 100));
  b = Math.max(0, Math.floor((b * (100 - percent)) / 100));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Lightens a color by a given percentage
 * @param color - The color to lighten (hex or rgb)
 * @param percent - The percentage to lighten (0-100)
 * @returns The lightened color as a hex string
 */
export function lightenColor(color: string, percent: number): string {
  // Convert hex to RGB if needed
  let r: number, g: number, b: number;

  if (color.startsWith('#')) {
    // Handle hex color
    const hex = color.substring(1);
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith('rgb')) {
    // Handle rgb/rgba color
    const rgbMatch = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+\.\d+)?\)$/,
    );
    if (!rgbMatch) return color;
    r = parseInt(rgbMatch[1], 10);
    g = parseInt(rgbMatch[2], 10);
    b = parseInt(rgbMatch[3], 10);
  } else {
    return color; // Return original if format not recognized
  }

  // Calculate lightened RGB values
  r = Math.min(255, Math.floor(r + ((255 - r) * percent) / 100));
  g = Math.min(255, Math.floor(g + ((255 - g) * percent) / 100));
  b = Math.min(255, Math.floor(b + ((255 - b) * percent) / 100));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
