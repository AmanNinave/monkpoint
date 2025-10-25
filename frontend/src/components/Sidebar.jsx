import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  Target, 
  TrendingUp, 
  Heart, 
  Settings, 
  LogOut, 
  User,
  ChevronDown,
  X,
  Brain,
  Calendar
} from 'lucide-react'

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navigationItems = [
    { name: 'Journey', path: '/dashboard', icon: Home },
    { name: 'Practices', path: '/habits', icon: Target },
    { name: 'Intentions', path: '/goals', icon: TrendingUp },
    { name: 'Reflection', path: '/moods', icon: Heart },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'AI Insights', path: '/ai-insights', icon: Brain },
  ]

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleLogout = () => {
    onLogout()
    setShowUserMenu(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white w-64">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-lg">🧘</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-amber-400">MonkPoint</h1>
            <p className="text-sm text-gray-400">Find your inner peace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                isActive(item.path)
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-700 p-4">
        {/* Settings Button */}
        <button
          onClick={() => handleNavigation('/settings')}
          className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors mb-2 ${
            isActive('/settings')
              ? 'bg-amber-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="p-2">
                <button
                  onClick={() => {
                    handleNavigation('/settings')
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
