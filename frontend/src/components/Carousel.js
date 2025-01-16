import React, { useState } from 'react';

const Carousel = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= cards.length ? 0 : prevIndex + 1
    );
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[300px] py-8">
      <div className="relative h-full">
        <div className="flex items-center justify-center h-full">
          {cards.map((card, index) => {
            // Calculate the position relative to the current card
            let position = index - currentIndex;
            
            // Normalize position to handle wrapping
            if (position < -Math.floor(cards.length / 2)) {
              position += cards.length;
            }
            if (position > Math.floor(cards.length / 2)) {
              position -= cards.length;
            }
            
            // Calculate z-index and transform properties
            const zIndex = 100 - Math.abs(position);
            const offset = position * 120; // Increased spacing between cards
            const scale = Math.max(0.8, 1 - Math.abs(position) * 0.15);
            const opacity = Math.max(0.4, 1 - Math.abs(position) * 0.3);
            
            return (
              <div
                key={index}
                className="absolute w-[280px] transition-all duration-300 ease-in-out rounded-md shadow-lg bg-white"
                style={{
                  transform: `translateX(${offset}px) scale(${scale})`,
                  zIndex,
                  opacity,
                  left: '50%',
                  marginLeft: '-140px', // Half of the card width
                }}
              >
                {card}
              </div>
            );
          })}
        </div>
      </div>
      
      <button
        onClick={prevCard}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-[200]"
      >
        ←
      </button>
      <button
        onClick={nextCard}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-[200]"
      >
        →
      </button>
    </div>
  );
};

export default Carousel;