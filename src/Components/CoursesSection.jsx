import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CoursesSection = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the specific courses we want to display with their styling
  const courseStyles = {
    "খ ইউনিট (ব্যবসায় শিক্ষা)": {
      icon: "💼",
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    "গ ইউনিট (মানবিক বিভাগ)": {
      icon: "📖",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    "সাধারণ জ্ঞান": {
      icon: "🧠",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    }
  };

  const getStyleForCourse = (courseTitle) => {
    const matchingKey = Object.keys(courseStyles).find(key => 
      courseTitle && courseTitle.includes(key)
    );
    return courseStyles[matchingKey] || {
      icon: "📚",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600"
    };
  };

  const handleCourseNavigation = (courseTitle) => {
    if (courseTitle && courseTitle.includes("খ ইউনিট (ব্যবসায় শিক্ষা)")) {
      // Navigate to খ ইউনিট page
      navigate('/BUnit');
    } else if (courseTitle && courseTitle.includes("গ ইউনিট (মানবিক বিভাগ)")) {
      // Navigate to গ ইউনিট page
      navigate('/CUnit');
    } else if (courseTitle && courseTitle.includes("সাধারণ জ্ঞান")) {
      // Navigate to admission page
      navigate('/Admission');
    } else {
      // Default fallback - go to admission page
      navigate('/Admission');
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        
  const response = await fetch(`/api/course`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        
        // Filter for only the courses we want to display
        const targetCourseNames = Object.keys(courseStyles);
        const filteredCourses = data.filter(course => 
          targetCourseNames.some(targetName => 
            course.Title && course.Title.includes(targetName)
          )
        ).slice(0, 3); // Limit to 3 courses
        
        setCourses(filteredCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-base sm:text-lg lg:text-xl text-gray-600">কোর্স তথ্য লোড হচ্ছে...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-base sm:text-lg lg:text-xl text-red-600">কোর্স তথ্য লোড করতে সমস্যা হয়েছে</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">আমাদের কোর্স সমূহ</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
            প্যারাগন কোচিং সেন্টারে রয়েছে বিভিন্ন ধরনের কোর্স যা আপনার শিক্ষাগত লক্ষ্য অর্জনে সহায়তা করবে
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course) => {
            const style = getStyleForCourse(course.Title);
            
            return (
              <div key={course._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                {/* Course Header */}
                <div className={`${style.bgColor} px-4 sm:px-6 py-3 sm:py-4`}>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl">{style.icon}</span>
                    <span className={`${style.textColor} text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 bg-white rounded-full`}>
                      ১২ মাস
                    </span>
                  </div>
                </div>
                
                {/* Course Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight">{course.Title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">{course.Description}</p>
                  
                  {/* Course Details from Database */}
                  <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                    {course.RegularClass > 0 && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">নিয়মিত ক্লাস:</span>
                        <span className="font-semibold text-gray-800">{course.RegularClass}টি</span>
                      </div>
                    )}
                    {course.ClassTest > 0 && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">ক্লাস টেস্ট:</span>
                        <span className="font-semibold text-gray-800">{course.ClassTest}টি</span>
                      </div>
                    )}
                    {course.WeeklyReviewTest > 0 && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">সাপ্তাহিক পরীক্ষা:</span>
                        <span className="font-semibold text-gray-800">{course.WeeklyReviewTest}টি</span>
                      </div>
                    )}
                    {course.MonthlyTest > 0 && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">মাসিক পরীক্ষা:</span>
                        <span className="font-semibold text-gray-800">{course.MonthlyTest}টি</span>
                      </div>
                    )}
                    {course.ExclusiveTest > 0 && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">বিশেষ পরীক্ষা:</span>
                        <span className="font-semibold text-gray-800">{course.ExclusiveTest}টি</span>
                      </div>
                    )}
                    {course.ModelTest > 0 && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">মডেল টেস্ট:</span>
                        <span className="font-semibold text-gray-800">{course.ModelTest}টি</span>
                      </div>
                    )}
                    {course.Price > 0 && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">মাসিক ফি:</span>
                        <span className="font-bold text-green-600">৳{course.Price}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => handleCourseNavigation(course.Title)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base active:scale-95"
                  >
                    ভর্তি হন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
