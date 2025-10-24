import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { apiService } from '../services/api'

const LoginForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const data = await apiService.login(formData)

      // Store token in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Redirect to dashboard or home page
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left Side - Monk Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20"></div>
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-6xl">🧘</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-amber-400">MonkPoint</h2>
            <p className="text-xl text-gray-300 mb-8">Find your inner peace through mindful habits</p>
            <div className="space-y-4 text-left max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="text-gray-300">Track your spiritual journey</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="text-gray-300">Cultivate mindful habits</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="text-gray-300">Achieve inner balance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-500 mb-2">MonkPoint</h1>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center space-x-3 bg-white text-gray-900 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <span className="text-lg">G</span>
              <span>Continue with Google</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-3 bg-white text-gray-900 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <span className="text-lg">🐙</span>
              <span>Continue with GitHub</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-3 bg-white text-gray-900 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <span className="text-lg">🍎</span>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-sm text-amber-500 hover:text-amber-400"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-amber-500 hover:text-amber-400 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm

