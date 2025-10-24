import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()
  
  return (
    <div className="fixed top-4 right-4 z-10">
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex space-x-2">
          <Link
            to="/login"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/login'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/register'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navigation

