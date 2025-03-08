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

  // Minimum swipe/drag distance (in px)
  const minSwipeDistance = 50

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
  }

  // Touch event handlers
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

  // Mouse event handlers
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

  // Add global mouse up handler to handle cases where mouse is released outside the slider
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

  // Calculate transform based on current index and drag offset
  const getTransform = () => {
    const baseTransform = -currentIndex * 100
    const dragPercent = (dragOffset / (sliderRef.current?.offsetWidth || 1)) * 100
    return `translateX(${baseTransform + dragPercent}%)`
  }

  // Example usage in the component itself
  const demoSlides = slides || [
    <div
      key="slide1"
      className="bg-blue-500 h-64 md:h-80 flex flex-col items-center justify-center text-white text-2xl font-bold"
    >
      <span>Slide 1</span>
      <span className="text-sm mt-2">Arrastra para navegar</span>
    </div>,
    <div
      key="slide2"
      className="bg-green-500 h-64 md:h-80 flex flex-col items-center justify-center text-white text-2xl font-bold"
    >
      <span>Slide 2</span>
      <span className="text-sm mt-2">Arrastra para navegar</span>
    </div>,
    <div
      key="slide3"
      className="bg-red-500 h-64 md:h-80 flex flex-col items-center justify-center text-white text-2xl font-bold"
    >
      <span>Slide 3</span>
      <span className="text-sm mt-2">Arrastra para navegar</span>
    </div>,
    <div
      key="slide4"
      className="bg-purple-500 h-64 md:h-80 flex flex-col items-center justify-center text-white text-2xl font-bold"
    >
      <span>Slide 4</span>
      <span className="text-sm mt-2">Arrastra para navegar</span>
    </div>,
  ]

  return (
    <div
      className={cn("bg-white mt-4 relative w-full max-w-xl mx-auto overflow-hidden rounded-sm select-none", className)}
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

      {/* Navigation buttons - only show when not dragging */}
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

      {/* Indicators */}
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

// Example usage
export function SliderDemo() {
  return (
    <div className="p-4 md:p-8 w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Responsive Slider</h1>
      <p className="text-center mb-4 text-gray-500">Desliza con el dedo en móvil o arrastra con el mouse</p>
      <ResponsiveSlider className="shadow-lg" />
    </div>
  )
}

