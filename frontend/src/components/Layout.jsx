import React from 'react'
import Sidebar from './Sidebar'
import MotivationQuote from './MotivationQuote'
import Chatbot from './Chatbot'

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={onLogout} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Motivation Quote */}
        <header className="bg-white shadow-sm">
          <MotivationQuote />
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      {/* AI Chatbot - Only for logged in users */}
      <Chatbot />
    </div>
  )
}

export default Layout
