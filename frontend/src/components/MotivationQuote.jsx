import React, { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

const MotivationQuote = () => {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')

  const quotes = [
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain"
    },
    {
      text: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson"
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins"
    },
    {
      text: "Small steps every day lead to big results.",
      author: "Unknown"
    },
    {
      text: "Consistency is the mother of mastery.",
      author: "Robin Sharma"
    },
    {
      text: "You don't have to be great to get started, but you have to get started to be great.",
      author: "Les Brown"
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
    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <blockquote className="text-lg font-medium mb-2">
            "{quote}"
          </blockquote>
          <cite className="text-sm opacity-90">— {author}</cite>
        </div>
        <button
          onClick={getRandomQuote}
          className="ml-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          title="Get new quote"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default MotivationQuote
