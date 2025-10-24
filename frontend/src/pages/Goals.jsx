import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Target, 
  Calendar, 
  TrendingUp, 
  Edit, 
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { apiService } from '../services/api'

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    // Prevent duplicate calls while already fetching
    if (isFetching) {
      console.log('🔄 Goals data already being fetched, skipping duplicate call')
      return
    }
    
    try {
      setIsFetching(true)
      setLoading(true)
      const data = await apiService.request('/goals')
      setGoals(data.goals)
    } catch (err) {
      setError('Failed to load goals')
      console.error('Goals error:', err)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  const handleCreateGoal = async (goalData) => {
    try {
      const data = await apiService.request('/goals', {
        method: 'POST',
        body: JSON.stringify(goalData)
      })
      setGoals([data.goal, ...goals])
      setShowCreateForm(false)
    } catch (err) {
      setError('Failed to create goal')
      console.error('Create goal error:', err)
    }
  }

  const handleUpdateGoal = async (id, goalData) => {
    try {
      const data = await apiService.request(`/goals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(goalData)
      })
      setGoals(goals.map(g => g.id === id ? data.goal : g))
      setEditingGoal(null)
    } catch (err) {
      setError('Failed to update goal')
      console.error('Update goal error:', err)
    }
  }

  const handleDeleteGoal = async (id) => {
    if (!confirm('Are you sure you want to delete this goal?')) return
    
    try {
      await apiService.request(`/goals/${id}`, { method: 'DELETE' })
      setGoals(goals.filter(g => g.id !== id))
    } catch (err) {
      setError('Failed to delete goal')
      console.error('Delete goal error:', err)
    }
  }

  const handleUpdateProgress = async (id, currentValue) => {
    try {
      const data = await apiService.request(`/goals/${id}/progress`, {
        method: 'PATCH',
        body: JSON.stringify({ currentValue })
      })
      setGoals(goals.map(g => g.id === id ? data.goal : g))
    } catch (err) {
      setError('Failed to update progress')
      console.error('Update progress error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'ACTIVE': return 'text-blue-600 bg-blue-100'
      case 'PAUSED': return 'text-yellow-600 bg-yellow-100'
      case 'CANCELLED': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'ACTIVE': return <TrendingUp className="w-4 h-4" />
      case 'PAUSED': return <Clock className="w-4 h-4" />
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sacred Intentions</h1>
          <p className="text-gray-600 mt-2">Set mindful goals for your spiritual journey</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Intention
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => setEditingGoal(goal)}
              onDelete={() => handleDeleteGoal(goal.id)}
              onUpdateProgress={(value) => handleUpdateProgress(goal.id, value)}
              statusColor={getStatusColor(goal.status)}
              statusIcon={getStatusIcon(goal.status)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-500 mb-4">Start setting goals to achieve your dreams</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Create/Edit Goal Modal */}
      {(showCreateForm || editingGoal) && (
        <GoalForm
          goal={editingGoal}
          onSave={editingGoal ? 
            (data) => handleUpdateGoal(editingGoal.id, data) : 
            handleCreateGoal
          }
          onClose={() => {
            setShowCreateForm(false)
            setEditingGoal(null)
          }}
        />
      )}
    </div>
  )
}

// Goal Card Component
const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress, statusColor, statusIcon }) => {
  const [showProgressForm, setShowProgressForm] = useState(false)
  const [progressValue, setProgressValue] = useState(goal.currentValue.toString())

  const handleUpdateProgress = (e) => {
    e.preventDefault()
    const value = parseFloat(progressValue)
    if (!isNaN(value)) {
      onUpdateProgress(value)
      setShowProgressForm(false)
    }
  }

  const progressPercentage = goal.targetValue ? 
    Math.min((goal.currentValue / goal.targetValue) * 100, 100) : 0

  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && goal.status === 'ACTIVE'

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${isOverdue ? 'border-red-200' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${statusColor}`}>
            {statusIcon}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {goal.status}
            </span>
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

      {/* Description */}
      {goal.description && (
        <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
      )}

      {/* Progress */}
      {goal.targetValue && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{goal.currentValue}/{goal.targetValue} {goal.unit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(progressPercentage)}% complete
          </p>
        </div>
      )}

      {/* Deadline */}
      {goal.deadline && (
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
          {isOverdue && (
            <span className="ml-2 text-red-600 font-medium">Overdue!</span>
          )}
        </div>
      )}

      {/* Update Progress Button */}
      {goal.status === 'ACTIVE' && goal.targetValue && (
        <div>
          {!showProgressForm ? (
            <button
              onClick={() => setShowProgressForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Update Progress
            </button>
          ) : (
            <form onSubmit={handleUpdateProgress} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Progress ({goal.unit})
                </label>
                <input
                  type="number"
                  value={progressValue}
                  onChange={(e) => setProgressValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current value"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowProgressForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

// Goal Form Component
const GoalForm = ({ goal, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    targetValue: goal?.targetValue || '',
    unit: goal?.unit || '',
    deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
    status: goal?.status || 'ACTIVE'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      targetValue: formData.targetValue ? parseFloat(formData.targetValue) : null,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
    }
    onSave(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Lose 10 pounds"
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
                rows="3"
                placeholder="Describe your goal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="10"
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
                  placeholder="pounds"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {goal && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PAUSED">Paused</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                {goal ? 'Update Goal' : 'Create Goal'}
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

export default Goals
