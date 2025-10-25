/**
 * Frontend timezone utilities for MonkPoint
 * Handles timezone conversions and date formatting
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
 * Get user's timezone from localStorage or default to UTC
 * @returns {string} - User's timezone
 */
export const getUserTimezone = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.timezone || 'UTC';
    }
    return 'UTC';
  } catch (error) {
    console.error('Error getting user timezone:', error);
    return 'UTC';
  }
};

/**
 * Set user's timezone in localStorage
 * @param {string} timezone - Timezone to set
 */
export const setUserTimezone = (timezone) => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      user.timezone = timezone;
      localStorage.setItem('user', JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error setting user timezone:', error);
  }
};

/**
 * Format date in user's timezone
 * @param {Date|string} date - Date to format
 * @param {string} userTimezone - User's timezone
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatInUserTimezone = (date, userTimezone = 'UTC', options = {}) => {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('en-US', {
      timeZone: userTimezone,
      ...options
    });
  } catch (error) {
    console.error('Error formatting date in user timezone:', error);
    return new Date(date).toLocaleString();
  }
};

/**
 * Format date for display in user's timezone
 * @param {Date|string} date - Date to format
 * @param {string} userTimezone - User's timezone
 * @param {string} format - Format type ('date', 'time', 'datetime', 'relative')
 * @returns {string} - Formatted date string
 */
export const formatDateForDisplay = (date, userTimezone = 'UTC', format = 'datetime') => {
  try {
    const dateObj = new Date(date);
    const userTimezone = getUserTimezone();
    
    switch (format) {
      case 'date':
        return dateObj.toLocaleDateString('en-US', {
          timeZone: userTimezone,
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      
      case 'time':
        return dateObj.toLocaleTimeString('en-US', {
          timeZone: userTimezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      
      case 'datetime':
        return dateObj.toLocaleString('en-US', {
          timeZone: userTimezone,
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      
      case 'relative':
        return getRelativeTime(dateObj, userTimezone);
      
      default:
        return dateObj.toLocaleString('en-US', { timeZone: userTimezone });
    }
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return new Date(date).toLocaleString();
  }
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date} date - Date to compare
 * @param {string} userTimezone - User's timezone
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date, userTimezone = 'UTC') => {
  try {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (Math.abs(diffSeconds) < 60) {
      return diffSeconds < 0 ? 'just now' : 'in a moment';
    } else if (Math.abs(diffMinutes) < 60) {
      return diffMinutes < 0 ? `${Math.abs(diffMinutes)} minutes ago` : `in ${diffMinutes} minutes`;
    } else if (Math.abs(diffHours) < 24) {
      return diffHours < 0 ? `${Math.abs(diffHours)} hours ago` : `in ${diffHours} hours`;
    } else if (Math.abs(diffDays) < 7) {
      return diffDays < 0 ? `${Math.abs(diffDays)} days ago` : `in ${diffDays} days`;
    } else {
      return formatDateForDisplay(date, userTimezone, 'date');
    }
  } catch (error) {
    console.error('Error getting relative time:', error);
    return formatDateForDisplay(date, userTimezone, 'date');
  }
};

/**
 * Convert UTC date to user's timezone
 * @param {Date|string} utcDate - UTC date
 * @param {string} userTimezone - User's timezone
 * @returns {Date} - Date in user's timezone
 */
export const convertToUserTimezone = (utcDate, userTimezone = 'UTC') => {
  try {
    const dateObj = new Date(utcDate);
    // Create a new date in the user's timezone
    const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
    const userTime = new Date(utcTime + (getTimezoneOffset(userTimezone) * 60000));
    return userTime;
  } catch (error) {
    console.error('Error converting to user timezone:', error);
    return new Date(utcDate);
  }
};

/**
 * Get timezone offset in minutes
 * @param {string} timezone - Timezone
 * @returns {number} - Offset in minutes
 */
export const getTimezoneOffset = (timezone) => {
  try {
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const target = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    return (target.getTime() - utc.getTime()) / 60000;
  } catch (error) {
    console.error('Error getting timezone offset:', error);
    return 0;
  }
};

/**
 * Get current time in user's timezone
 * @param {string} userTimezone - User's timezone
 * @returns {Date} - Current time in user's timezone
 */
export const getCurrentTimeInTimezone = (userTimezone = 'UTC') => {
  try {
    return new Date().toLocaleString('en-US', { timeZone: userTimezone });
  } catch (error) {
    console.error('Error getting current time in timezone:', error);
    return new Date();
  }
};

/**
 * Validate timezone string
 * @param {string} timezone - Timezone to validate
 * @returns {boolean} - True if valid timezone
 */
export const isValidTimezone = (timezone) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get timezone info for display
 * @param {string} timezone - Timezone
 * @returns {Object} - Timezone info
 */
export const getTimezoneInfo = (timezone) => {
  try {
    const now = new Date();
    const offset = getTimezoneOffset(timezone);
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetString = `${offset >= 0 ? '+' : '-'}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    return {
      timezone,
      offset,
      offsetString,
      currentTime: formatInUserTimezone(now, timezone, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    };
  } catch (error) {
    console.error('Error getting timezone info:', error);
    return {
      timezone,
      offset: 0,
      offsetString: '+00:00',
      currentTime: 'Invalid timezone'
    };
  }
};
