import React, { useState, useEffect } from 'react'
import { 
  Target, 
  TrendingUp, 
  Heart, 
  CheckCircle, 
  Calendar,
  Award,
  Activity
} from 'lucide-react'
import { apiService } from '../services/api'

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await apiService.request('/analytics/dashboard')
      setAnalytics(data.analytics)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Journey</h1>
        <p className="text-gray-600 mt-2">Find peace through mindful habits and inner growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Completion Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mindful Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.overallCompletionRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Total Habits */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sacred Practices</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalHabits}
              </p>
            </div>
          </div>
        </div>

        {/* Total Completions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mindful Moments</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalCompletions}
              </p>
            </div>
          </div>
        </div>

        {/* Average Mood */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inner Peace</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.averageMood}/10
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Habits Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Habits */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Habits</h3>
          {analytics.habitStats.length > 0 ? (
            <div className="space-y-4">
              {analytics.habitStats.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{habit.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{habit.name}</p>
                      <p className="text-sm text-gray-500">
                        {habit.completionRate}% completion
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {habit.currentStreak} day streak
                    </p>
                    <p className="text-xs text-gray-500">
                      Best: {habit.longestStreak} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No habits yet</p>
          )}
        </div>

        {/* Active Goals */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Goals</h3>
          {analytics.goals.length > 0 ? (
            <div className="space-y-4">
              {analytics.goals.map((goal) => (
                <div key={goal.id} className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-gray-900">{goal.title}</p>
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(goal.currentValue / goal.targetValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No active goals</p>
          )}
        </div>
      </div>

      {/* Recent Moods */}
      {analytics.recentMoods.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Moods</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.recentMoods.map((mood) => (
              <div key={mood.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(mood.date).toLocaleDateString()}
                  </span>
                  <span className="text-lg font-bold text-pink-600">
                    {mood.rating}/10
                  </span>
                </div>
                {mood.notes && (
                  <p className="text-sm text-gray-600 mb-2">{mood.notes}</p>
                )}
                {mood.tags && mood.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {mood.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {analytics.achievements.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.achievements.map((achievement) => (
              <div key={achievement.id} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Award className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="font-medium text-gray-900">{achievement.name}</span>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
