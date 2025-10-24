import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Heart, Lightbulb, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService';

const AIInsights = () => {
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await aiService.getInsights();
      setInsights(response.insights);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch AI insights');
      console.error('Error fetching insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleRefresh = () => {
    fetchInsights();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-2">Personalized guidance from your AI companion</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-amber-600 animate-pulse" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Analyzing your journey...</p>
                <p className="text-gray-500">Your AI companion is gathering insights</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5">⚠️</div>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Insights Content */}
      {insights && !isLoading && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Personalized Insights</h2>
                <p className="text-amber-100">
                  {lastUpdated && `Last updated: ${lastUpdated.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {insights}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionCard
          icon={TrendingUp}
          title="Habit Analysis"
          description="Get detailed insights about your habit patterns"
          action={() => {/* Implement habit analysis */}}
        />
        <QuickActionCard
          icon={Target}
          title="Goal Setting"
          description="AI-powered goal recommendations"
          action={() => {/* Implement goal suggestions */}}
        />
        <QuickActionCard
          icon={Heart}
          title="Mood Tracking"
          description="Analyze your emotional patterns"
          action={() => {/* Implement mood analysis */}}
        />
        <QuickActionCard
          icon={Lightbulb}
          title="Habit Suggestions"
          description="Discover new habits for your journey"
          action={() => {/* Implement habit suggestions */}}
        />
        <QuickActionCard
          icon={Brain}
          title="Coaching Session"
          description="Get personalized coaching"
          action={() => {/* Implement coaching */}}
        />
        <QuickActionCard
          icon={RefreshCw}
          title="Motivation"
          description="Get inspired with personalized messages"
          action={() => {/* Implement motivation */}}
        />
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 text-blue-600 mt-0.5">💡</div>
          <div>
            <h3 className="font-medium text-blue-900">Pro Tip</h3>
            <p className="text-blue-700 text-sm mt-1">
              Use the chatbot in the bottom-right corner for real-time conversations with your AI companion. 
              Ask questions, get instant advice, or request specific analyses of your progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ icon: Icon, title, description, action }) => {
  return (
    <button
      onClick={action}
      className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default AIInsights;
