import React, { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { apiService } from '../services/api';

const TIMEZONES = [
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

const TimezoneSelector = ({ currentTimezone, onTimezoneChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(currentTimezone || 'UTC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedTimezone(currentTimezone || 'UTC');
  }, [currentTimezone]);

  const handleTimezoneChange = async (timezone) => {
    try {
      setLoading(true);
      setError('');
      
      // Update timezone via API
      await apiService.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ timezone })
      });
      
      setSelectedTimezone(timezone);
      onTimezoneChange(timezone);
      setIsOpen(false);
    } catch (err) {
      setError('Failed to update timezone');
      console.error('Timezone update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimezoneInfo = () => {
    const timezone = TIMEZONES.find(tz => tz.value === selectedTimezone);
    return timezone || TIMEZONES[0];
  };

  const formatCurrentTime = (timezone) => {
    try {
      return new Date().toLocaleString('en-US', {
        timeZone: timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'Invalid timezone';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Timezone Display Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <div className="text-left">
            <div className="text-sm font-medium">{getCurrentTimezoneInfo().label}</div>
            <div className="text-xs text-gray-400">
              {formatCurrentTime(selectedTimezone)} ({getCurrentTimezoneInfo().offset})
            </div>
          </div>
        </div>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {TIMEZONES.map((timezone) => (
            <button
              key={timezone.value}
              onClick={() => handleTimezoneChange(timezone.value)}
              disabled={loading}
              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-700 transition-colors disabled:opacity-50 ${
                selectedTimezone === timezone.value ? 'bg-amber-600' : ''
              }`}
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{timezone.label}</div>
                <div className="text-xs text-gray-400">
                  {formatCurrentTime(timezone.value)} ({timezone.offset})
                </div>
              </div>
              {selectedTimezone === timezone.value && (
                <Check className="w-4 h-4 text-white" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
        </div>
      )}
    </div>
  );
};

export default TimezoneSelector;
