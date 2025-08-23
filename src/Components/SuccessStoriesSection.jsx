import React, { useEffect, useState } from 'react';

const SuccessStoriesSection = () => {
  const [topResults, setTopResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopResults = async () => {
      try {
        const response = await fetch(`/api/result`);
        if (response.ok) {
          const allResults = await response.json();
          // Sort by marks in ascending order and take top 8
          const sortedResults = allResults
            .sort((a, b) => (a.marks || 0) - (b.marks || 0))
            .slice(0, 8);
          setTopResults(sortedResults);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        // Fallback to static data if API fails
        setTopResults([
          {
            ImageURL: "17th.jpeg",
            _id: "1"
          },
          {
            ImageURL: "18th.jpeg",
            _id: "2"
          },
          {
            ImageURL: "52th.jpeg",
            _id: "3"
          },
          {
            ImageURL: "66th.jpeg",
            _id: "4"
          },
          {
            ImageURL: "72th.jpeg",
            _id: "5"
          },
          {
            ImageURL: "78th.jpeg",
            _id: "6"
          },
          {
            ImageURL: "85th.jpeg",
            _id: "7"
          },
          {
            ImageURL: "96th.jpeg",
            _id: "8"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopResults();
  }, []);

  const bgColors = ["bg-blue-100", "bg-green-100", "bg-purple-100", "bg-yellow-100", "bg-red-100"];

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">শীর্ষ ফলাফল লোড হচ্ছে...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">আমাদের শীর্ষ ফলাফল</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">একাডেমিক অর্জনে উৎকর্ষতা</p>
        </div>
        <div className="overflow-hidden relative">
          <div className="flex animate-marquee" style={{gap: '1rem'}}>
            {[...topResults, ...topResults].map((result, index) => (
              <div key={`${result._id || index}-${Math.floor(index / topResults.length)}`} className="flex-shrink-0">
                {result.ImageURL ? (
                  <img
                    src={`/uploads/Results/${result.ImageURL}`}
                    alt={`Result ${index + 1}`}
                    className="w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onError={(e) => {
                      e.target.onerror = null;
                      // Try general uploads folder if Results folder fails
                      if (e.target.src.includes('/uploads/Results/')) {
                        e.target.src = `/uploads/${result.ImageURL}`;
                      } else {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxODAiIHk9IjE4MCIhd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGRkZGIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgo8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJhMTAgMTAgMCAwIDAgMTAgMTBBMTAgMTAgMCAwIDAgMTIgMlptMCAxOGE4IDggMCAxIDEgOC04QTggOCAwIDAgMSAxMiAyMFptMS4zLTEyYTEuMyAxLjMgMCAwIDAtMi42IDBjMCAuNy41IDEuMyAxLjMgMS4zaDFWMTZhMSAxIDAgMCAwIDItMXYtNGMwLS43LS42LTEuMy0xLjMtMS4zWm0wIDEwYTEuMyAxLjMgMCAxIDAgMC0yLjZBMS4zIDEuMyAwIDAgMCAxMy4zIDE4WiIvPgo8L3N2Zz4KPC9zdmc+';
                      }
                    }}
                  />
                ) : (
                  <div className="w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-sm sm:text-base text-gray-500 text-center px-4">কোন ফলাফল চিত্র নেই</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {topResults.length === 0 && (
          <div className="text-center text-gray-500">
            <p className="text-sm sm:text-base">এই মুহূর্তে কোন ফলাফল উপলব্ধ নেই।</p>
          </div>
        )}
        
        <div className="text-center mt-8 sm:mt-12">
          <button 
            onClick={() => window.location.href = '/results'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 sm:py-3 sm:px-6 lg:py-3 lg:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base lg:text-lg"
          >
            আরোও দেখুন
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-240px * 8 - 1rem * 7));
          }
        }
        
        @media (min-width: 640px) {
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-288px * 8 - 1rem * 7));
            }
          }
        }
        
        @media (min-width: 1024px) {
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-320px * 8 - 1rem * 7));
            }
          }
        }
        
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 639px) {
          .animate-marquee {
            animation: marquee 28s linear infinite;
          }
        }
      `}</style>
    </section>
  );
};

export default SuccessStoriesSection;
