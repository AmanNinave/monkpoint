import React, { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

const MotivationQuote = () => {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')

  const quotes = [
    {
      text: "The mind is everything. What you think you become.",
      author: "Buddha"
    },
    {
      text: "Peace comes from within. Do not seek it without.",
      author: "Buddha"
    },
    {
      text: "The present moment is the only time over which we have dominion.",
      author: "Thích Nhất Hạnh"
    },
    {
      text: "Happiness is not something ready made. It comes from your own actions.",
      author: "Dalai Lama"
    },
    {
      text: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu"
    },
    {
      text: "Be the change that you wish to see in the world.",
      author: "Mahatma Gandhi"
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "Simplicity is the ultimate sophistication.",
      author: "Leonardo da Vinci"
    },
    {
      text: "Every morning we are born again. What we do today matters most.",
      author: "Buddha"
    }
  ]

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    const selectedQuote = quotes[randomIndex]
    setQuote(selectedQuote.text)
    setAuthor(selectedQuote.author)
  }

  useEffect(() => {
    getRandomQuote()
  }, [])

  return (
    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧘</span>
            <div>
              <blockquote className="text-lg font-medium mb-2">
                "{quote}"
              </blockquote>
              <cite className="text-sm opacity-90">— {author}</cite>
            </div>
          </div>
        </div>
        <button
          onClick={getRandomQuote}
          className="ml-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          title="Get new wisdom"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default MotivationQuote
