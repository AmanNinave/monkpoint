import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flame, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import { getUserTimezone, formatDateForDisplay } from '../utils/timezone';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [showActivities, setShowActivities] = useState(false);

  useEffect(() => {
    console.log('📅 Calendar useEffect triggered:', { currentDate, view });
    fetchCalendarData();
  }, [currentDate, view]);

  const fetchCalendarData = async () => {
    try {
      setError('');

      let userTimezone = 'UTC';
      try {
        userTimezone = getUserTimezone();
      } catch (error) {
        console.warn('Could not get user timezone, using UTC:', error);
      }

      console.log('📅 Fetching calendar data with timezone:', userTimezone);

      const data = await apiService.request('/calendar', {
        method: 'POST',
        body: JSON.stringify({
          date: currentDate.toISOString(),
          view: view
        })
      });

      if (data.success) {
        console.log('📅 Calendar data received:', data);
        const calendarData = {
          success: data.success,
          stats: data.stats,
          days: data.days,
          weekDays: data.weekDays || [],
          dayData: data.dayData || { activities: [], activitiesScheduled: 0 }
        };
        setCalendarData(calendarData);
        setError('');
      } else {
        console.error('📅 Calendar API returned error:', data);
        throw new Error(data.error || 'Failed to fetch calendar data');
      }
    } catch (err) {
      console.error('📅 Calendar fetch error:', err);
      setError('Failed to load calendar data');

      setCalendarData({
        success: true,
        stats: { activeDays: 0, totalActivities: 0, consistency: 0 },
        days: [],
        weekDays: [],
        dayData: { activitiesScheduled: 0, activities: [] }
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day) => {
    console.log("day: ", day);
    if (day.activities > 0 && day.activityDetails) {
      setSelectedDay(day);
      setShowActivities(true);
    }
  };

  const formatDate = (date) => {
    try {
      const userTimezone = getUserTimezone();
      return formatDateForDisplay(date, userTimezone, 'date').replace(/\d{1,2},/, '').trim();
    } catch (error) {
      console.warn('Error formatting date, using fallback:', error);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const formatWeekRange = (date) => {
    try {
      const userTimezone = getUserTimezone();
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startFormatted = formatDateForDisplay(startOfWeek, userTimezone, 'date');
      const endFormatted = formatDateForDisplay(endOfWeek, userTimezone, 'date');

      return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
      console.warn('Error formatting week range, using fallback:', error);
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  };

  const formatDayDate = (date) => {
    try {
      const userTimezone = getUserTimezone();
      return formatDateForDisplay(date, userTimezone, 'date');
    } catch (error) {
      console.warn('Error formatting day date, using fallback:', error);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Loading Skeleton Components
  const SkeletonStats = () => (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-gray-800 rounded-lg p-3">
          <div className="h-6 bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4 mx-auto"></div>
        </div>
      ))}
    </div>
  );

  const SkeletonCalendarGrid = () => (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="grid grid-cols-7 gap-1 mb-3">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className="text-center">
            <div className="h-4 bg-gray-700 rounded animate-pulse mx-auto w-8"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-700 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );

  const renderMonthView = () => {
    if (!calendarData) {
      console.log('📅 No calendar data for month view');
      return null;
    }

    const { days = [], stats = { activeDays: 0, totalActivities: 0, consistency: 0 } } = calendarData;
    console.log('📅 Calendar data structure:', { calendarData, days: days.length, stats });

    const today = new Date();
    const isToday = (date) => {
      return new Date(date).toDateString() === today.toDateString();
    };

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            className="bg-gray-800 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-xl font-bold text-white">{stats.activeDays}</div>
            <div className="text-gray-400 text-xs">Active Days</div>
          </motion.div>
          <motion.div
            className="bg-gray-800 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-xl font-bold text-white">{stats.totalActivities}</div>
            <div className="text-gray-400 text-xs">Total Activities</div>
          </motion.div>
          <motion.div
            className="bg-gray-800 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-xl font-bold text-white">{stats.consistency}%</div>
            <div className="text-gray-400 text-xs">Consistency</div>
          </motion.div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 text-xs font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <motion.div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square rounded-md p-1 relative cursor-pointer transition-colors
                  ${day.isCurrentMonth ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-900 text-gray-500'}
                  ${isToday(day.date) ? 'bg-amber-600 text-white' : ''}
                  ${day.activities > 0 ? 'hover:bg-amber-500 hover:text-white' : ''}
                `}
                title={day.activities > 0 ? `${day.activities} activities` : ''}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
              >
                <div className="text-xs font-medium">{day.day}</div>
                {day.activities > 0 && (
                  <motion.div
                    className="absolute bottom-1 right-1 flex space-x-0.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.01 + 0.2 }}
                  >
                    {day.activities > 3 ? (
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Flame className="w-3 h-3 text-amber-500" />
                      </motion.div>
                    ) : (
                      Array.from({ length: Math.min(day.activities, 3) }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-4 h-4 bg-amber-500 rounded-full"
                          whileHover={{ scale: 1.5 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.01 + 0.1 + (i * 0.05) }}
                        />
                      ))
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderWeekView = () => {
    if (!calendarData) return null;

    const { weekDays = [], streak = 0 } = calendarData;
    const today = new Date();
    const isToday = (date) => {
      return new Date(date).toDateString() === today.toDateString();
    };

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Week Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Week View</h2>
            <p className="text-gray-400 text-sm">{formatWeekRange(currentDate)}</p>
          </div>
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-white font-medium text-sm">{streak} day streak</span>
          </motion.div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => handleDayClick(day)}
              title={day.activities > 0 ? `Click to view ${day.activities} activities` : ''}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="text-gray-400 text-xs mb-1">{day.dayName}</div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2 ${isToday(day.date) ? 'bg-amber-600 text-white' : 'bg-gray-700 text-white'
                }`}>
                {day.day}
              </div>

              {/* Activity Bars */}
              <div className="space-y-0.5 mb-2">
                {Array.from({ length: Math.min(day.activities, 3) }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-0.5 bg-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: index * 0.05 + 0.1 + (i * 0.1) }}
                  />
                ))}
              </div>

              <div className="text-gray-400 text-xs mb-1">
                {day.activities} {day.activities === 1 ? 'activity' : 'activities'}
              </div>

              {day.completed && (
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Flame className="w-3 h-3 text-amber-500 mx-auto" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Typical Activity Times */}
        <motion.div
          className="bg-gray-800 rounded-lg p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-white font-medium mb-2 text-sm">Typical Activity Times</h3>
          <div className="flex justify-between text-gray-400 text-xs">
            {['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'].map(time => (
              <span key={time}>{time}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderDayView = () => {
    if (!calendarData) return null;
    const { dayData = { activitiesScheduled: 0, activities: [] } } = calendarData;
    const times = Array.from({ length: 24 }, (_, i) => i);

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Day Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 bg-white px-3 py-2 rounded-lg">{formatDayDate(currentDate)}</h2>
            <p className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-lg mt-1">{dayData.activitiesScheduled} activities scheduled</p>
          </div>
          <motion.div
            className="flex items-center space-x-2 bg-gray-800 px-2 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
            <span className="text-white text-xs">Today</span>
          </motion.div>
        </div>

        {/* Time Grid */}
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex">
            {/* Time Labels */}
            <div className="w-12 space-y-3">
              {times.map(hour => (
                <div key={hour} className="text-gray-400 text-xs h-8 flex items-start">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Activity Grid */}
            <div className="flex-1 relative">
              {times.map(hour => {
                const hourActivities = dayData.activities.filter(activity =>
                  new Date(activity.time).getHours() === hour
                );

                return (
                  <div key={hour} className="h-8 border-b border-gray-700 relative">
                    {hourActivities.length > 0 && (
                      <motion.div
                        className="absolute left-0 top-0.5 w-full h-1.5 bg-amber-500 rounded-full cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "tween", stiffness: 200 }}
                        onClick={() => handleDayClick({
                          date: currentDate,
                          activities: hourActivities.length,
                          activityDetails: hourActivities
                        })}
                        title={`${hourActivities.length} activities at ${hour.toString().padStart(2, '0')}:00`}
                      ></motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity List for the Day */}
          {dayData.activities.length > 0 && (
            <motion.div
              className="mt-4 p-3 bg-gray-700 rounded-lg cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => handleDayClick({
                date: currentDate,
                activities: dayData.activities.length,
                activityDetails: dayData.activities
              })}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-white text-sm font-medium">
                  View all {dayData.activities.length} activities for today
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 bg-gray-900 min-h-screen">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-6 w-24 bg-gray-700 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-16 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex items-center space-x-1">
              <div className="w-7 h-7 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-7 w-24 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-7 h-7 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* View Toggles Skeleton */}
        <div className="flex space-x-1">
          {[1, 2, 3].map(item => (
            <div key={item} className="h-8 w-16 bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <SkeletonStats />
          <SkeletonCalendarGrid />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {error}
      </motion.div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CalendarIcon className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">Calendar</h1>
            <p className="text-gray-400 text-sm">Track your mindfulness journey</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={goToToday}
            className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Today
          </motion.button>

          <div className="flex items-center space-x-1">
            <motion.button
              onClick={() => navigateDate(-1)}
              className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-3.5 h-3.5 text-white" />
            </motion.button>

            <motion.div
              className="text-gray-900 font-medium min-w-[100px] text-center text-sm bg-white px-2 py-1 rounded"
              key={currentDate.toString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'month' && formatDate(currentDate)}
              {view === 'week' && formatWeekRange(currentDate)}
              {view === 'day' && formatDayDate(currentDate)}
            </motion.div>

            <motion.button
              onClick={() => navigateDate(1)}
              className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* View Toggles */}
      <motion.div
        className="flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {['day', 'week', 'month'].map((viewType) => (
          <motion.button
            key={viewType}
            onClick={() => setView(viewType)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors text-sm ${view === viewType
              ? 'bg-amber-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Calendar Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </motion.div>
      </AnimatePresence>

      {/* Activities Modal */}
      <AnimatePresence>
        {showActivities && selectedDay && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Activities for {formatDayDate(selectedDay.date)}
                </h3>
                <motion.button
                  onClick={() => setShowActivities(false)}
                  className="text-gray-400 hover:text-white"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              <div className="space-y-3">
                {selectedDay.activityDetails.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-700 rounded-lg p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          className={`w-2 h-2 rounded-full ${activity.type === 'habit' ? 'bg-green-500' :
                            activity.type === 'mood' ? 'bg-blue-500' :
                              'bg-purple-500'
                            }`}
                          whileHover={{ scale: 1.5 }}
                        ></motion.div>
                        <span className="text-white font-medium">{activity.name}</span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        {activity.value}{activity.unit}
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {new Date(activity.time).toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <motion.button
                  onClick={() => setShowActivities(false)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;