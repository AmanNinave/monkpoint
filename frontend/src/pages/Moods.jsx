import React, { useState, useEffect } from 'react'
import { 
  Heart, 
  Calendar, 
  TrendingUp, 
  Edit, 
  Trash2,
  Plus,
  Smile,
  Frown,
  Meh
} from 'lucide-react'
import { apiService } from '../services/api'

const Moods = () => {
  const [moods, setMoods] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showLogForm, setShowLogForm] = useState(false)
  const [editingMood, setEditingMood] = useState(null)

  useEffect(() => {
    fetchMoods()
    fetchAnalytics()
  }, [])

  const fetchMoods = async () => {
    try {
      setLoading(true)
      const data = await apiService.request('/moods')
      setMoods(data.moods)
    } catch (err) {
      setError('Failed to load moods')
      console.error('Moods error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const data = await apiService.request('/moods/analytics')
      setAnalytics(data.analytics)
    } catch (err) {
      console.error('Mood analytics error:', err)
    }
  }

  const handleLogMood = async (moodData) => {
    try {
      const data = await apiService.request('/moods', {
        method: 'POST',
        body: JSON.stringify(moodData)
      })
      setMoods([data.mood, ...moods])
      setShowLogForm(false)
      fetchAnalytics() // Refresh analytics
    } catch (err) {
      setError('Failed to log mood')
      console.error('Log mood error:', err)
    }
  }

  const handleUpdateMood = async (id, moodData) => {
    try {
      const data = await apiService.request(`/moods/${id}`, {
        method: 'PUT',
        body: JSON.stringify(moodData)
      })
      setMoods(moods.map(m => m.id === id ? data.mood : m))
      setEditingMood(null)
      fetchAnalytics() // Refresh analytics
    } catch (err) {
      setError('Failed to update mood')
      console.error('Update mood error:', err)
    }
  }

  const handleDeleteMood = async (id) => {
    if (!confirm('Are you sure you want to delete this mood entry?')) return
    
    try {
      await apiService.request(`/moods/${id}`, { method: 'DELETE' })
      setMoods(moods.filter(m => m.id !== id))
      fetchAnalytics() // Refresh analytics
    } catch (err) {
      setError('Failed to delete mood')
      console.error('Delete mood error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const getMoodIcon = (rating) => {
    if (rating >= 8) return <Smile className="w-6 h-6 text-green-500" />
    if (rating >= 5) return <Meh className="w-6 h-6 text-yellow-500" />
    return <Frown className="w-6 h-6 text-red-500" />
  }

  const getMoodColor = (rating) => {
    if (rating >= 8) return 'bg-green-100 border-green-200'
    if (rating >= 5) return 'bg-yellow-100 border-yellow-200'
    return 'bg-red-100 border-red-200'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inner Reflection</h1>
          <p className="text-gray-600 mt-2">Track your emotional journey and find inner peace</p>
        </div>
        <button
          onClick={() => setShowLogForm(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Reflect
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Mood</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.averageRating}/10
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalEntries}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Common Tags</p>
                <p className="text-sm text-gray-500">
                  {analytics.commonTags.length > 0 ? analytics.commonTags[0].tag : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Trend Chart */}
      {analytics && analytics.moodTrend.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Mood Trend</h3>
          <div className="flex items-end space-x-2 h-32">
            {analytics.moodTrend.map((entry, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full rounded-t"
                  style={{ 
                    height: `${(entry.rating / 10) * 100}%`,
                    backgroundColor: entry.rating >= 8 ? '#10B981' : entry.rating >= 5 ? '#F59E0B' : '#EF4444'
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-xs font-medium text-gray-700">{entry.rating}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Tags */}
      {analytics && analytics.commonTags.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Mood Tags</h3>
          <div className="flex flex-wrap gap-2">
            {analytics.commonTags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-pink-100 text-pink-600 text-sm rounded-full"
              >
                {tag.tag} ({tag.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mood Entries */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Mood History</h3>
        </div>
        
        {moods.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {moods.map((mood) => (
              <MoodEntry
                key={mood.id}
                mood={mood}
                onEdit={() => setEditingMood(mood)}
                onDelete={() => handleDeleteMood(mood.id)}
                getMoodIcon={getMoodIcon}
                getMoodColor={getMoodColor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mood entries yet</h3>
            <p className="text-gray-500 mb-4">Start tracking your daily emotions</p>
            <button
              onClick={() => setShowLogForm(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg"
            >
              Log Your First Mood
            </button>
          </div>
        )}
      </div>

      {/* Log/Edit Mood Modal */}
      {(showLogForm || editingMood) && (
        <MoodForm
          mood={editingMood}
          onSave={editingMood ? 
            (data) => handleUpdateMood(editingMood.id, data) : 
            handleLogMood
          }
          onClose={() => {
            setShowLogForm(false)
            setEditingMood(null)
          }}
        />
      )}
    </div>
  )
}

// Mood Entry Component
const MoodEntry = ({ mood, onEdit, onDelete, getMoodIcon, getMoodColor }) => {
  return (
    <div className={`p-6 ${getMoodColor(mood.rating)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getMoodIcon(mood.rating)}
          <div className="ml-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900 mr-2">
                {mood.rating}/10
              </span>
              <span className="text-sm text-gray-500">
                {new Date(mood.date).toLocaleDateString()}
              </span>
            </div>
            {mood.notes && (
              <p className="text-gray-700 mt-1">{mood.notes}</p>
            )}
            {mood.tags && mood.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {mood.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-white bg-opacity-50 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Mood Form Component
const MoodForm = ({ mood, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    rating: mood?.rating || 5,
    notes: mood?.notes || '',
    tags: mood?.tags || [],
    date: mood?.date ? new Date(mood.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  })
  const [newTag, setNewTag] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      date: new Date(formData.date).toISOString()
    }
    onSave(data)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const getMoodDescription = (rating) => {
    if (rating >= 9) return 'Excellent'
    if (rating >= 7) return 'Good'
    if (rating >= 5) return 'Okay'
    if (rating >= 3) return 'Not great'
    return 'Terrible'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {mood ? 'Edit Mood Entry' : 'Log Your Mood'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling? ({formData.rating}/10 - {getMoodDescription(formData.rating)})
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (Terrible)</span>
                <span>10 (Excellent)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows="3"
                placeholder="What's on your mind?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Add a tag (e.g., happy, stressed)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-pink-100 text-pink-600 rounded-md hover:bg-pink-200"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-pink-100 text-pink-600 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-pink-400 hover:text-pink-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg"
              >
                {mood ? 'Update Mood' : 'Log Mood'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Moods
