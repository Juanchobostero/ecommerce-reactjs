import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Simple utility function to combine class names
const cn = (...classes) => classes.filter(Boolean).join(" ")

export default function ResponsiveSlider({ slides, className }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const sliderRef = useRef(null)

  const minSwipeDistance = 50

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
  }

  const onTouchStart = (e) => {
    setIsDragging(true)
    setDragStartX(e.targetTouches[0].clientX)
    setDragOffset(0)
  }

  const onTouchMove = (e) => {
    if (!isDragging) return

    const currentX = e.targetTouches[0].clientX
    const diff = currentX - dragStartX
    setDragOffset(diff)
  }

  const onTouchEnd = () => {
    if (!isDragging) return

    setIsDragging(false)

    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }

    setDragOffset(0)
  }

  const onMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragOffset(0)
  }

  const onMouseMove = (e) => {
    if (!isDragging) return

    const currentX = e.clientX
    const diff = currentX - dragStartX
    setDragOffset(diff)
  }

  const onMouseUp = () => {
    if (!isDragging) return

    setIsDragging(false)

    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }

    setDragOffset(0)
  }

  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      setDragOffset(0)
    }
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        setDragOffset(0)
      }
    }

    window.addEventListener("mouseup", handleGlobalMouseUp)

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging])

  const getTransform = () => {
    const baseTransform = -currentIndex * 100
    const dragPercent = (dragOffset / (sliderRef.current?.offsetWidth || 1)) * 100
    return `translateX(${baseTransform + dragPercent}%)`
  }

  const demoSlides = slides || [
    <div
      key="slide1"
      className="w-full bg-blue-500 bg-opacity-50 flex flex-col items-center justify-center text-white text-lg font-bold rounded-md shadow-md transition-all duration-300"
    >
      <div className="w-full h-40 md:h-48 flex items-center justify-center">
        <img
          src="https://via.placeholder.com/300x150" // Reemplaza con la URL de tu imagen
          alt="Slide 1"
          className="max-w-full h-auto object-contain rounded-md"
        />
      </div>
      <span className="text-sm mt-2">Arrastra para navegar</span>
    </div>,
    <div
      key="slide2"
      className="bg-green-500 bg-opacity-50 flex flex-col items-center justify-center text-white text-lg font-bold rounded-md shadow-md transition-all duration-300"
    >
      <div className="w-full h-40 md:h-48 flex items-center justify-center">
        <img
          src="https://via.placeholder.com/300x150" // Reemplaza con la URL de tu imagen
          alt="Slide 2"
          className="max-w-full h-auto object-contain rounded-md"
        />
      </div>
      <span className="text-sm mt-2">Arrastra para navegar</span>
    </div>,
    <div
      key="slide3"
      className="bg-red-500 bg-opacity-50 flex flex-col items-center justify-center text-white text-lg font-bold rounded-md shadow-md transition-all duration-300"
    >
      <div className="w-full h-40 md:h-48 flex items-center justify-center">
        <img
          src="https://via.placeholder.com/300x150" // Reemplaza con la URL de tu imagen
          alt="Slide 3"
          className="max-w-full h-auto object-contain rounded-md"
        />
      </div>
      <span className="text-sm mt-2">Arrastra para navegar</span>
    </div>,
    <div
      key="slide4"
      className="bg-purple-500 bg-opacity-50 flex flex-col items-center justify-center text-white text-lg font-bold rounded-md shadow-md transition-all duration-300"
    >
      <div className="w-full h-40 md:h-48 flex items-center justify-center">
        <img
          src="https://via.placeholder.com/300x150" // Reemplaza con la URL de tu imagen
          alt="Slide 4"
          className="max-w-full h-auto object-contain rounded-md"
        />
      </div>
      <span className="text-sm mt-2">Arrastra para navegar</span>
    </div>,
  ]

  return (
    <div
      className={cn("bg-white mt-4 relative w-full max-w-md mx-auto overflow-hidden rounded-md select-none", className)}
      ref={sliderRef}
    >
      <div
        className={cn("flex h-full", isDragging ? "transition-none" : "transition-transform duration-300 ease-out")}
        style={{ transform: getTransform() }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {demoSlides.map((slide, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            {slide}
          </div>
        ))}
      </div>

      {!isDragging && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md z-10"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md z-10"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {demoSlides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              currentIndex === index ? "bg-white" : "bg-white/50",
            )}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

