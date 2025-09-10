import React from "react";

// This will read all images from public/gallery/ and show them all
// In a real app, you would fetch the list from the backend, but here we hardcode for demo
const galleryImages = [
  // Add all your image filenames here
  "gallery1.jpg",
  "gallery2.jpg",
  "gallery3.jpg",
  "gallery4.jpg",
  "gallery5.jpg",
  "gallery6.jpg",
  // Add more as needed
];

const Gallery = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">সম্পূর্ণ গ্যালারি</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">সব ছবি একসাথে দেখুন</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="bg-gray-200 h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden group shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src={`/gallery/${img}`}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 group-hover:scale-110"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '/gallery/no-image.png';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
