import React, { useState, useEffect, useRef } from 'react'
import { RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react'
import { quotesService } from '../services/quotesService'
import { motion, AnimatePresence } from 'framer-motion'

const MotivationQuote = () => {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [index, setIndex] = useState(0)
  const intervalRef = useRef(null)

  const getRandomQuote = async (forceRefresh = false) => {
    try {
      const quoteData = await quotesService.getRandomQuote(forceRefresh)
      setQuote(quoteData.text)
      setAuthor(quoteData.author)
    } catch (err) {
      console.error('Error fetching quote:', err)
      setError('Failed to load quote')
      const fallbackQuote = quotesService.getFallbackQuote()
      setQuote(fallbackQuote.text)
      setAuthor(fallbackQuote.author)
    }
  }

  useEffect(() => {
    const init = async () => {
      await getRandomQuote(true)
      setLoading(false)
      intervalRef.current = setInterval(() => {
        setIndex((prev) => prev + 1)
        getRandomQuote(true)
      }, 5000)
    }
    init()
    return () => clearInterval(intervalRef.current)
  }, [])

  const handlePrev = () => {
    clearInterval(intervalRef.current)
    setIndex((prev) => prev - 1)
    getRandomQuote(true)
  }

  const handleNext = () => {
    clearInterval(intervalRef.current)
    setIndex((prev) => prev + 1)
    getRandomQuote(true)
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-500 text-white border-b border-orange-400 shadow-sm px-6 py-2 flex items-center justify-between overflow-hidden">
      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        className="p-1.5 hover:bg-white/10 transition-colors rounded"
        title="Previous"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Quote Section */}
      <div className="flex-1 text-center px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin mb-1"></div>
            <span className="text-xs opacity-80">Loading wisdom...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <blockquote className="text-sm md:text-base font-medium leading-snug mb-0.5">
                “{quote}”
              </blockquote>
              <cite className="text-xs md:text-sm opacity-90">— {author}</cite>
              {error && <div className="text-yellow-200 text-xs mt-1">(Offline mode)</div>}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        className="p-1.5 hover:bg-white/10 transition-colors rounded"
        title="Next"
      >
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Refresh Button */}
      {!loading && (
        <button
          onClick={() => getRandomQuote(true)}
          title="Refresh quote"
          className="ml-3 p-1.5 hover:bg-white/10 transition-colors rounded"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default MotivationQuote
