/**
 * Date utility functions to handle timezone issues
 * Fixes the problem where selecting 12th date shows 11th date on frontend
 */

/**
 * Convert a date string to a proper date object without timezone issues
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} - Date object set to local timezone
 */
export const parseDateString = (dateString) => {
  if (!dateString) return null;
  
  // If it's already a Date object, return it
  if (dateString instanceof Date) return dateString;
  
  // Handle ISO string format
  if (dateString.includes('T')) {
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  
  // Handle YYYY-MM-DD format
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Format a date for display without timezone issues
 * @param {string|Date} date - Date string or Date object
 * @param {string} format - Format type ('short', 'long', 'full')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = parseDateString(date);
  if (!dateObj) return '';
  
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
  };
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Create a date string in YYYY-MM-DD format for form inputs
 * @param {Date|string} date - Date object or string
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const toDateInputString = (date) => {
  if (!date) return '';
  
  const dateObj = parseDateString(date);
  if (!dateObj) return '';
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Add days to a date
 * @param {Date|string} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} - New date object
 */
export const addDays = (date, days) => {
  const dateObj = parseDateString(date);
  if (!dateObj) return null;
  
  const newDate = new Date(dateObj);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if date is today
 */
export const isToday = (date) => {
  const dateObj = parseDateString(date);
  if (!dateObj) return false;
  
  const today = new Date();
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear();
};

/**
 * Check if a date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if date is in the future
 */
export const isFuture = (date) => {
  const dateObj = parseDateString(date);
  if (!dateObj) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  
  return dateObj > today;
};

/**
 * Get the current date in YYYY-MM-DD format
 * @returns {string} - Current date string
 */
export const getCurrentDateString = () => {
  const today = new Date();
  return toDateInputString(today);
};

/**
 * Create a date string for a future date (e.g., 7 days from now)
 * @param {number} daysFromNow - Number of days from now
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const getFutureDateString = (daysFromNow = 7) => {
  const futureDate = addDays(new Date(), daysFromNow);
  return toDateInputString(futureDate);
};

/**
 * Compare two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} - -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export const compareDates = (date1, date2) => {
  const d1 = parseDateString(date1);
  const d2 = parseDateString(date2);
  
  if (!d1 || !d2) return 0;
  
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}; 