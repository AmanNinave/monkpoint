import React, { useState, useEffect } from 'react'
import { RefreshCw, Loader2 } from 'lucide-react'
import { quotesService } from '../services/quotesService'

const MotivationQuote = () => {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getRandomQuote = async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError('')
      console.log(`🌅 Fetching ${forceRefresh ? 'fresh' : 'cached'} quote from ZenQuotes API`)
      
      const quoteData = await quotesService.getRandomQuote(forceRefresh)
      setQuote(quoteData.text)
      setAuthor(quoteData.author)
    } catch (err) {
      console.error('Error fetching quote:', err)
      setError('Failed to load quote')
      // Fallback to static quote
      const fallbackQuote = quotesService.getFallbackQuote()
      setQuote(fallbackQuote.text)
      setAuthor(fallbackQuote.author)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRandomQuote(true) // Force fresh quote on page load
  }, [])

  return (
    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧘</span>
            <div>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span className="text-lg">Loading wisdom...</span>
                </div>
              ) : error ? (
                <div className="text-yellow-200">
                  <blockquote className="text-lg font-medium mb-2">
                    "{quote}"
                  </blockquote>
                  <cite className="text-sm opacity-90">— {author} (Offline)</cite>
                </div>
              ) : (
                <>
                  <blockquote className="text-lg font-medium mb-2">
                    "{quote}"
                  </blockquote>
                  <cite className="text-sm opacity-90">— {author}</cite>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => getRandomQuote(true)}
          disabled={loading}
          className="ml-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Get new wisdom"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}

export default MotivationQuote
