import React, { useState, useEffect } from 'react'
import ParagonHero from '../assets/1.png'
import NoticeHero from '../assets/2.png'
import ResultHero from '../assets/3.png'

function Hero() {
  const heroImages = [ParagonHero, NoticeHero, ResultHero];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    // Listen for hide/show events from navbar dropdown
    const handleHideHero = () => setIsVisible(false);
    const handleShowHero = () => setIsVisible(true);

    window.addEventListener('hideHero', handleHideHero);
    window.addEventListener('showHero', handleShowHero);

    return () => {
      clearInterval(interval);
      window.removeEventListener('hideHero', handleHideHero);
      window.removeEventListener('showHero', handleShowHero);
    };
  }, []);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full h-[250px] xs:h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] xl:h-[550px] 2xl:h-[600px] relative">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Hero ${index + 1}`}
            className="w-full h-full object-contain object-center bg-gray-100"
          />
        </div>
      ))}
      
      {/* Debug indicator */}
      <div className="absolute top-1 sm:top-2 md:top-3 lg:top-4 left-1 sm:left-2 md:left-3 lg:left-4 bg-black bg-opacity-50 text-white px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm md:text-base z-10">
        {currentImageIndex + 1} / {heroImages.length}
      </div>
      
      {/* Dots indicator */}
      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 md:space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-full transition-all duration-300 hover:scale-110 transform ${
              index === currentImageIndex ? 'bg-white shadow-lg' : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero