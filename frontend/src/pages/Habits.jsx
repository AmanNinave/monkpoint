import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Target, 
  Calendar, 
  TrendingUp, 
  Edit, 
  Trash2,
  CheckCircle,
  Circle,
  Clock
} from 'lucide-react'
import { apiService } from '../services/api'

const Habits = () => {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    // Prevent duplicate calls while already fetching
    if (isFetching) {
      console.log('🔄 Habits data already being fetched, skipping duplicate call')
      return
    }
    
    try {
      setIsFetching(true)
      setLoading(true)
      const data = await apiService.request('/habits')
      setHabits(data.habits)
    } catch (err) {
      setError('Failed to load habits')
      console.error('Habits error:', err)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  const handleCreateHabit = async (habitData) => {
    try {
      const data = await apiService.request('/habits', {
        method: 'POST',
        body: JSON.stringify(habitData)
      })
      setHabits([data.habit, ...habits])
      setShowCreateForm(false)
    } catch (err) {
      setError('Failed to create habit')
      console.error('Create habit error:', err)
    }
  }

  const handleUpdateHabit = async (id, habitData) => {
    try {
      const data = await apiService.request(`/habits/${id}`, {
        method: 'PUT',
        body: JSON.stringify(habitData)
      })
      setHabits(habits.map(h => h.id === id ? data.habit : h))
      setEditingHabit(null)
    } catch (err) {
      setError('Failed to update habit')
      console.error('Update habit error:', err)
    }
  }

  const handleDeleteHabit = async (id) => {
    if (!confirm('Are you sure you want to delete this habit?')) return
    
    try {
      await apiService.request(`/habits/${id}`, { method: 'DELETE' })
      setHabits(habits.filter(h => h.id !== id))
    } catch (err) {
      setError('Failed to delete habit')
      console.error('Delete habit error:', err)
    }
  }

  const handleLogEntry = async (habitId, entryData) => {
    try {
      const data = await apiService.request(`/habits/${habitId}/entries`, {
        method: 'POST',
        body: JSON.stringify(entryData)
      })
      // Refresh habits to update streak data
      fetchHabits()
    } catch (err) {
      setError('Failed to log habit entry')
      console.error('Log entry error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sacred Practices</h1>
          <p className="text-gray-600 mt-2">Cultivate mindful habits for inner peace and growth</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Practice
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Habits Grid */}
      {habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={() => setEditingHabit(habit)}
              onDelete={() => handleDeleteHabit(habit.id)}
              onLogEntry={(entryData) => handleLogEntry(habit.id, entryData)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No practices yet</h3>
          <p className="text-gray-500 mb-4">Begin your journey of mindful living</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
          >
            Start Your First Practice
          </button>
        </div>
      )}

      {/* Create/Edit Habit Modal */}
      {(showCreateForm || editingHabit) && (
        <HabitForm
          habit={editingHabit}
          onSave={editingHabit ? 
            (data) => handleUpdateHabit(editingHabit.id, data) : 
            handleCreateHabit
          }
          onClose={() => {
            setShowCreateForm(false)
            setEditingHabit(null)
          }}
        />
      )}
    </div>
  )
}

// Habit Card Component
const HabitCard = ({ habit, onEdit, onDelete, onLogEntry }) => {
  const [showLogForm, setShowLogForm] = useState(false)
  const [entryValue, setEntryValue] = useState('')
  const [entryNotes, setEntryNotes] = useState('')
  const [entryMood, setEntryMood] = useState(5)

  const handleLogEntry = (e) => {
    e.preventDefault()
    const data = {
      value: habit.targetValue ? parseFloat(entryValue) : null,
      notes: entryNotes,
      mood: entryMood
    }
    onLogEntry(data)
    setShowLogForm(false)
    setEntryValue('')
    setEntryNotes('')
    setEntryMood(5)
  }

  const hasEntryToday = habit.entries && habit.entries.length > 0 && 
    new Date(habit.entries[0].date).toDateString() === new Date().toDateString()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{habit.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
            {habit.description && (
              <p className="text-sm text-gray-500">{habit.description}</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {habit.streaks?.[0]?.current || 0}
          </p>
          <p className="text-sm text-gray-500">Current Streak</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {habit.streaks?.[0]?.longest || 0}
          </p>
          <p className="text-sm text-gray-500">Best Streak</p>
        </div>
      </div>

      {/* Target Value */}
      {habit.targetValue && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">
            Target: {habit.targetValue} {habit.unit}
          </p>
        </div>
      )}

      {/* Today's Status */}
      <div className="mb-4">
        {hasEntryToday ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Completed today</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-400">
            <Circle className="w-5 h-5 mr-2" />
            <span>Not completed today</span>
          </div>
        )}
      </div>

      {/* Log Entry Button */}
      {!hasEntryToday && (
        <button
          onClick={() => setShowLogForm(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
        >
          Log Entry
        </button>
      )}

      {/* Log Entry Form */}
      {showLogForm && (
        <form onSubmit={handleLogEntry} className="mt-4 space-y-3">
          {habit.targetValue && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value ({habit.unit})
              </label>
              <input
                type="number"
                value={entryValue}
                onChange={(e) => setEntryValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={`Enter ${habit.unit}`}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={entryNotes}
              onChange={(e) => setEntryNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="2"
              placeholder="How did it go?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mood (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={entryMood}
              onChange={(e) => setEntryMood(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span className="font-medium">{entryMood}</span>
              <span>10</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
            >
              Log Entry
            </button>
            <button
              type="button"
              onClick={() => setShowLogForm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// Habit Form Component
const HabitForm = ({ habit, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    frequency: habit?.frequency || 'DAILY',
    targetValue: habit?.targetValue || '',
    unit: habit?.unit || '',
    icon: habit?.icon || '🎯',
    color: habit?.color || '#3B82F6'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      targetValue: formData.targetValue ? parseInt(formData.targetValue) : null
    }
    onSave(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {habit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Habit Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Drink Water"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="2"
                placeholder="Describe your habit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="glasses"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="💧"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                {habit ? 'Update Habit' : 'Create Habit'}
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

export default Habits
