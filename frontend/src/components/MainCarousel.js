'use client'

import React, { useRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const cards = [
  { id: 1, title: 'Card 1', content: 'Content for card 1' },
  { id: 2, title: 'Card 2', content: 'Content for card 2' },
  { id: 3, title: 'Card 3', content: 'Content for card 3' },
  { id: 4, title: 'Card 4', content: 'Content for card 4' },
  { id: 5, title: 'Card 5', content: 'Content for card 5' },
]

const getItemsPerPage = (width) => {
  if (width >= 1024) return 4; // Large screens
  if (width >= 768) return 3; // Medium screens
  if (width >= 640) return 2; // Small screens
  return 1; // Extra small screens
}

export default function ModernCarousel() {
  const carouselRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        setItemsPerPage(getItemsPerPage(carouselRef.current.offsetWidth))
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollToCard = (index) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / itemsPerPage
      carouselRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth',
      })
    }
  }

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - itemsPerPage)
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  const handleNext = () => {
    const newIndex = Math.min(cards.length - itemsPerPage, currentIndex + itemsPerPage)
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 5000) // Auto-play every 5 seconds

    return () => clearInterval(interval)
  }, [currentIndex, itemsPerPage])

  return (
    <div className="relative w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Productos</h1>
      <div
        ref={carouselRef}
        className="flex overflow-x-hidden snap-x snap-mandatory"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 snap-start p-2"
          >
            <div className="bg-white shadow-lg rounded-sm p-4 h-full">
              <h2 className="text-xl font-bold mb-2">{card.title}</h2>
              <p className="text-sm">{card.content}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md"
        aria-label="Previous cards"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md"
        aria-label="Next cards"
        disabled={currentIndex >= cards.length - itemsPerPage}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}

