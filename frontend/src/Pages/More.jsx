import Navbar from '../Components/Navbar';
const More = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className=" sm:pt-24 lg:pt-28 sm:pb-8 lg:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center sm:mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">প্রসপেক্টাস</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">আমাদের প্রতিষ্ঠানের বিস্তারিত তথ্য</p>
          </div>

          {/* PDF Viewer Container */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] xl:aspect-[4/5] w-full">
              <iframe
                src="/Prospectus.pdf"
                className="w-full h-full border-none"
                title="Prospectus PDF"
                loading="lazy"
              />
            </div>
            
            {/* Fallback message for mobile */}
            <div className="block sm:hidden bg-blue-50 border-t border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                মোবাইলে PDF দেখতে সমস্যা হলে 
                <a 
                  href="/Prospectus.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 font-semibold underline hover:text-blue-600"
                >
                  এখানে ক্লিক করুন
                </a>
              </p>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center mt-6 sm:mt-8">
            <a
              href="/Prospectus.pdf"
              download="Paragon_Prospectus.pdf"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 lg:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base lg:text-lg"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ডাউনলোড করুন
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default More
