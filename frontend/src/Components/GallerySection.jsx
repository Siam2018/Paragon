import React from 'react';

// const BACKEND_URL = import.meta.env.VITE_HTTPURLBackend;

const GallerySection = () => {

// List your local images here (place them in public/gallery/)
const localImages = [
  { src: '/gallery/gallery1.jpg', alt: 'Campus' },
  { src: '/gallery/gallery2.jpg', alt: 'Classroom' },
  { src: '/gallery/gallery3.jpg', alt: 'Library' },
  { src: '/gallery/gallery4.jpg', alt: 'Laboratory' },
  { src: '/gallery/gallery5.jpg', alt: 'Events' },
  { src: '/gallery/gallery6.jpg', alt: 'Graduation' }
];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">ফটো গ্যালারি</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">আমাদের প্রাণবন্ত ক্যাম্পাস জীবনের ঝলক</p>
        </div>
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {localImages.map((img, index) => (
            <div key={index} className="bg-gray-200 h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden group shadow-md hover:shadow-lg transition-shadow duration-300">
              <img 
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 group-hover:scale-110" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/gallery/no-image.png'; // Add a no-image.png in public/gallery/
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <a href="/Gallery" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-300">
            সম্পূর্ণ গ্যালারি দেখুন
          </a>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
