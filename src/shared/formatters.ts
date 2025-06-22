/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency
 * @param value The number to format
 * @param currency The currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(value);
};

/**
 * Format a date string to a localized date string
 * @param dateString The date string to format
 * @param options Options for the date formatting
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string => {
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Format a percentage value
 * @param value The percentage value (e.g., 0.1 for 10%)
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};