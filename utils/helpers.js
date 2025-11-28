/**
 * Utility Helper Functions
 * Common utilities for date formatting, string manipulation, and other helpers
 */

/**
 * Format a date into a human-readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'time', 'full', 'relative'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
    if (!date) return '';

    const d = new Date(date);

    if (isNaN(d.getTime())) return 'Invalid Date';

    const options = {
        short: { month: 'short', day: 'numeric', year: 'numeric' }, // Jan 15, 2024
        long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }, // Monday, January 15, 2024
        time: { hour: 'numeric', minute: '2-digit', hour12: true }, // 3:45 PM
        full: {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }, // Mon, Jan 15, 2024, 3:45 PM
        dayMonth: { month: 'short', day: 'numeric' }, // Jan 15
        monthYear: { month: 'long', year: 'numeric' }, // January 2024
    };

    if (format === 'relative') {
        return getRelativeTime(d);
    }

    return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Get relative time string (e.g., "2 hours ago", "yesterday")
 * @param {Date|string|number} date - Date to convert
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - d) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays === 1) {
        return 'Yesterday';
    } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.floor(diffInDays / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
};

/**
 * Truncate a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 100, suffix = '...') => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - suffix.length).trim() + suffix;
};

/**
 * Truncate text to a specific number of words
 * @param {string} str - String to truncate
 * @param {number} maxWords - Maximum number of words
 * @param {string} suffix - Suffix to add when truncated
 * @returns {string} Truncated string
 */
export const truncateWords = (str, maxWords = 20, suffix = '...') => {
    if (!str) return '';
    const words = str.trim().split(/\s+/);
    if (words.length <= maxWords) return str;
    return words.slice(0, maxWords).join(' ') + suffix;
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize the first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Title-cased string
 */
export const titleCase = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Generate a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export const generateId = (length = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Format a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    if (typeof num !== 'number') return num;
    return num.toLocaleString('en-US');
};

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
};

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @param {number} maxInitials - Maximum number of initials
 * @returns {string} Initials
 */
export const getInitials = (name, maxInitials = 2) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts
        .slice(0, maxInitials)
        .map(part => part.charAt(0).toUpperCase())
        .join('');
};

/**
 * Sleep/delay function for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the delay
 */
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get greeting based on time of day
 * @returns {string} Greeting message
 */
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

/**
 * Get time of day period
 * @returns {string} 'morning', 'afternoon', 'evening', or 'night'
 */
export const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
};

/**
 * Group array items by a key
 * @param {Array} array - Array to group
 * @param {string|Function} key - Key or function to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupKey = typeof key === 'function' ? key(item) : item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
};

/**
 * Sort array by date field
 * @param {Array} array - Array to sort
 * @param {string} dateField - Date field name
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortByDate = (array, dateField = 'createdAt', order = 'desc') => {
    return [...array].sort((a, b) => {
        const dateA = new Date(a[dateField]);
        const dateB = new Date(b[dateField]);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
};

/**
 * Filter array by date range
 * @param {Array} array - Array to filter
 * @param {string} dateField - Date field name
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Array} Filtered array
 */
export const filterByDateRange = (array, dateField, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return array.filter(item => {
        const date = new Date(item[dateField]);
        return date >= start && date <= end;
    });
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places
 * @returns {number} Percentage
 */
export const percentage = (value, total, decimals = 0) => {
    if (total === 0) return 0;
    return Number(((value / total) * 100).toFixed(decimals));
};

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

// Export all utilities as a single object
export default {
    formatDate,
    getRelativeTime,
    truncate,
    truncateWords,
    capitalize,
    titleCase,
    generateId,
    formatNumber,
    debounce,
    throttle,
    isEmpty,
    deepClone,
    getInitials,
    sleep,
    getGreeting,
    getTimeOfDay,
    groupBy,
    sortByDate,
    filterByDateRange,
    percentage,
    clamp,
};
