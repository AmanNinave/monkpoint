import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Navigation from './components/Navigation'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Goals from './pages/Goals'
import Moods from './pages/Moods'
import Settings from './pages/Settings'

// Auth Layout Component
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {children}
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <Router>
      <Routes>
        {/* Protected Routes with Layout */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/habits" 
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Habits />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/goals" 
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Goals />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/moods" 
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Moods />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Settings />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <LoginForm />
              </AuthLayout>
            )
          } 
        />
        
        <Route 
          path="/register" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <RegisterForm />
              </AuthLayout>
            )
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
