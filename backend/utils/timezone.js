import moment from 'moment-timezone';

/**
 * Timezone utility functions for MonkPoint
 * Handles all timezone conversions and date operations
 */

// Common timezones for user selection
export const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: '+00:00' },
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00/-04:00' },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: '-06:00/-05:00' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: '-07:00/-06:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-08:00/-07:00' },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00/+01:00' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: '+01:00/+02:00' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: '+01:00/+02:00' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: '+08:00' },
  { value: 'Asia/Kolkata', label: 'Mumbai/Delhi (IST)', offset: '+05:30' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+04:00' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: '+10:00/+11:00' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: '+12:00/+13:00' },
];

/**
 * Convert UTC date to user's timezone
 * @param {Date|string} utcDate - UTC date
 * @param {string} userTimezone - User's timezone
 * @returns {Date} - Date in user's timezone
 */
export const convertToUserTimezone = (utcDate, userTimezone = 'UTC') => {
  try {
    const momentDate = moment.utc(utcDate);
    return momentDate.tz(userTimezone).toDate();
  } catch (error) {
    console.error('Error converting to user timezone:', error);
    return new Date(utcDate);
  }
};

/**
 * Convert user's local date to UTC
 * @param {Date|string} localDate - Local date
 * @param {string} userTimezone - User's timezone
 * @returns {Date} - UTC date
 */
export const convertToUTC = (localDate, userTimezone = 'UTC') => {
  try {
    const momentDate = moment.tz(localDate, userTimezone);
    return momentDate.utc().toDate();
  } catch (error) {
    console.error('Error converting to UTC:', error);
    return new Date(localDate);
  }
};

/**
 * Format date in user's timezone
 * @param {Date|string} date - Date to format
 * @param {string} userTimezone - User's timezone
 * @param {string} format - Moment format string
 * @returns {string} - Formatted date string
 */
export const formatInUserTimezone = (date, userTimezone = 'UTC', format = 'YYYY-MM-DD HH:mm:ss') => {
  try {
    const momentDate = moment.utc(date);
    return momentDate.tz(userTimezone).format(format);
  } catch (error) {
    console.error('Error formatting date in user timezone:', error);
    return moment(date).format(format);
  }
};

/**
 * Get start of day in user's timezone
 * @param {Date|string} date - Date
 * @param {string} userTimezone - User's timezone
 * @returns {Date} - Start of day in UTC
 */
export const getStartOfDayInTimezone = (date, userTimezone = 'UTC') => {
  try {
    const momentDate = moment.tz(date, userTimezone).startOf('day');
    return momentDate.utc().toDate();
  } catch (error) {
    console.error('Error getting start of day:', error);
    return moment(date).startOf('day').toDate();
  }
};

/**
 * Get end of day in user's timezone
 * @param {Date|string} date - Date
 * @param {string} userTimezone - User's timezone
 * @returns {Date} - End of day in UTC
 */
export const getEndOfDayInTimezone = (date, userTimezone = 'UTC') => {
  try {
    const momentDate = moment.tz(date, userTimezone).endOf('day');
    return momentDate.utc().toDate();
  } catch (error) {
    console.error('Error getting end of day:', error);
    return moment(date).endOf('day').toDate();
  }
};

/**
 * Get current date in user's timezone
 * @param {string} userTimezone - User's timezone
 * @returns {Date} - Current date in user's timezone
 */
export const getCurrentDateInTimezone = (userTimezone = 'UTC') => {
  try {
    return moment.tz(userTimezone).toDate();
  } catch (error) {
    console.error('Error getting current date in timezone:', error);
    return new Date();
  }
};

/**
 * Get timezone offset for a specific date
 * @param {string} timezone - Timezone
 * @param {Date|string} date - Date (optional, defaults to now)
 * @returns {string} - Offset string (e.g., '+05:30')
 */
export const getTimezoneOffset = (timezone, date = new Date()) => {
  try {
    return moment.tz(date, timezone).format('Z');
  } catch (error) {
    console.error('Error getting timezone offset:', error);
    return '+00:00';
  }
};

/**
 * Validate timezone string
 * @param {string} timezone - Timezone to validate
 * @returns {boolean} - True if valid timezone
 */
export const isValidTimezone = (timezone) => {
  try {
    return moment.tz.zone(timezone) !== null;
  } catch (error) {
    return false;
  }
};

/**
 * Get user's timezone from request headers or default to UTC
 * @param {Object} req - Express request object
 * @returns {string} - User's timezone
 */
export const getUserTimezone = (req) => {
  // First try to get from user profile if authenticated
  if (req.user && req.user.timezone) {
    return req.user.timezone;
  }
  
  // Then try to get from request headers
  const timezoneHeader = req.headers['x-timezone'] || req.headers['timezone'];
  if (timezoneHeader && isValidTimezone(timezoneHeader)) {
    return timezoneHeader;
  }
  
  // Default to UTC
  return 'Asia/Kolkata';
};

/**
 * Create date range for queries in user's timezone
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @param {string} userTimezone - User's timezone
 * @returns {Object} - Object with start and end dates in UTC
 */
export const createDateRangeInTimezone = (startDate, endDate, userTimezone = 'UTC') => {
  try {
    const start = getStartOfDayInTimezone(startDate, userTimezone);
    const end = getEndOfDayInTimezone(endDate, userTimezone);
    
    return {
      start,
      end,
      startISO: start.toISOString(),
      endISO: end.toISOString()
    };
  } catch (error) {
    console.error('Error creating date range in timezone:', error);
    return {
      start: new Date(startDate),
      end: new Date(endDate),
      startISO: new Date(startDate).toISOString(),
      endISO: new Date(endDate).toISOString()
    };
  }
};

/**
 * Format date for display in user's timezone
 * @param {Date|string} date - Date to format
 * @param {string} userTimezone - User's timezone
 * @param {string} format - Display format
 * @returns {Object} - Formatted date object
 */
export const formatDateForDisplay = (date, userTimezone = 'UTC', format = 'YYYY-MM-DD') => {
  try {
    const momentDate = moment.utc(date);
    const localDate = momentDate.tz(userTimezone);
    
    return {
      date: localDate.toDate(),
      formatted: localDate.format(format),
      iso: localDate.toISOString(),
      timezone: userTimezone,
      offset: localDate.format('Z')
    };
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return {
      date: new Date(date),
      formatted: moment(date).format(format),
      iso: new Date(date).toISOString(),
      timezone: userTimezone,
      offset: '+00:00'
    };
  }
};
