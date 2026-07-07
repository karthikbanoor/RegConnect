/**
 * Generate a unique ID with a given prefix.
 * @param {string} prefix - The prefix for the ID.
 * @returns {string} A unique identifier.
 */
export const uid = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

/**
 * Format a number as a USD currency string (no decimals).
 * @param {number} n - The number to format.
 * @returns {string} Formatted currency string.
 */
export const fmtMoney = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

/**
 * Get today's date in ISO format (YYYY-MM-DD).
 * @returns {string} Today's date string.
 */
export const todayISO = () => new Date().toISOString().slice(0, 10);
