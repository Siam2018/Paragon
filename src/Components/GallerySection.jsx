
const GallerySection = () => {
  const images = [
  { imageURL: '../assets/Gallery/1.jpeg', title: 'Title 1', alt: 'Alt text 1' },
  { imageURL: '../assets/Gallery/2.jpeg', title: 'Title 2', alt: 'Alt text 2' },
  { imageURL: '../assets/Gallery/3.jpeg', title: 'Title 3', alt: 'Alt text 3' },
  { imageURL: '../assets/Gallery/4.jpeg', title: 'Title 4', alt: 'Alt text 4' },
  { imageURL: '../assets/Gallery/5.jpeg', title: 'Title 5', alt: 'Alt text 5' },
  { imageURL: '../assets/Gallery/6.jpeg', title: 'Title 6', alt: 'Alt text 6' },
];
  const loading = false;
  const error = null;

  // Fallback placeholder images if no images are available
  const placeholderImages = [
    { title: 'ক্যাম্পাস', alt: 'Campus' },
    { title: 'ক্লাসরুম', alt: 'Classroom' },
    { title: 'লাইব্রেরি', alt: 'Library' },
    { title: 'ল্যাবরেটরি', alt: 'Laboratory' },
    { title: 'ইভেন্ট', alt: 'Events' },
    { title: 'গ্র্যাজুয়েশন', alt: 'Graduation' }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">ফটো গ্যালারি</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">আমাদের প্রাণবন্ত ক্যাম্পাস জীবনের ঝলক</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mb-6 sm:mb-8">
            <p className="text-sm sm:text-base">{error}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.length > 0 ? (
            // Display actual gallery images
            images.map((image, index) => (
              <div key={image._id || index} className="bg-gray-200 h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden group shadow-md hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={`/uploads/gallery/${image.imageURL}`} 
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 group-hover:scale-110" 
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x300?text=Image+${index}`;
                  }}
                />
              </div>
            ))
          ) : !loading && !error ? (
            // Display placeholder images if no gallery images exist
            placeholderImages.map((placeholder, index) => (
              <div key={index} className="bg-gray-200 h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={`https://via.placeholder.com/400x300?text=${encodeURIComponent(placeholder.title)}`} 
                  alt={placeholder.alt} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                />
              </div>
            ))
          ) : null}
        </div>

        {images.length === 0 && !loading && !error && (
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">গ্যালারিতে এই মুহূর্তে কোনো ছবি নেই। শীঘ্রই নতুন ছবি যোগ করা হবে।</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
