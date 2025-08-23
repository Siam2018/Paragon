import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import Hero from '../Components/Hero.jsx';
import Footer from '../Components/Footer.jsx';

const CUnit = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="text-3xl sm:text-4xl lg:text-5xl">📖</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 text-center">গ ইউনিট (C Unit)</h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">মানবিক বিভাগের জন্য বিশেষভাবে ডিজাইন করা কোর্স</p>
        </div>

        {/* Course Details Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <span className="text-xl sm:text-2xl">📚</span>
            কোর্স বিবরণ
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">কোর্সের বৈশিষ্ট্য:</h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  অভিজ্ঞ শিক্ষকমণ্ডলী
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  নিয়মিত ক্লাস ও পরীক্ষা
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  আধুনিক শিক্ষা পদ্ধতি
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  মানবিক শিক্ষার সকল বিষয়
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">কোর্সের মেয়াদ:</h3>
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                <p className="text-purple-700 font-semibold text-base sm:text-lg">১২ মাস</p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">সম্পূর্ণ সিলেবাস কভার</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex flex-col sm:flex-row items-center sm:items-start gap-2">
              <span className="text-lg sm:text-xl lg:text-2xl">📊</span>
              বিষয়ভিত্তিক ক্লাস ও পরীক্ষার তালিকা
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="table-auto border border-gray-300 w-full text-center">
                <thead className="bg-purple-200">
                  <tr>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-xs sm:text-sm">বিষয়</th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-xs sm:text-sm">Class সংখ্যা</th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-xs sm:text-sm">Class Test</th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-xs sm:text-sm">Weekly Review Test</th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-xs sm:text-sm">Monthly Test</th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-xs sm:text-sm">Exclusive Test</th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-xs sm:text-sm">Model Test</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-800 text-xs sm:text-sm">বাংলা</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৮ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-800 text-xs sm:text-sm">ইংরেজি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৮ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-800 text-xs sm:text-sm">হিসাব বিজ্ঞান</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৮ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-800 text-xs sm:text-sm">ব্যবস্থাপনা</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৮ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-800 text-xs sm:text-sm">মার্কেটিং</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৮ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">৪ টি</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">১২ টি</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Course Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-4">
              <span className="text-xl sm:text-2xl">📖</span>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 text-center sm:text-left">গ ইউনিট (মানবিক বিভাগ)</h3>
            </div>
            
            <div className="flex items-start gap-2 mb-4 sm:mb-6">
              <span className="text-base sm:text-lg mt-1">🧠</span>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                মানবিক বিভাগের শিক্ষার্থীদের জন্য বিশেষভাবে প্রস্তুত করা কোর্স। 
                বাংলা, ইংরেজি, হিসাব বিজ্ঞান, ব্যবস্থাপনা ও মার্কেটিং বিষয়ে সম্পূর্ণ প্রস্তুতি।
              </p>
            </div>

            {/* Course Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="text-center bg-purple-50 rounded-lg p-2 sm:p-3">
                <div className="text-purple-600 font-bold text-lg sm:text-xl">৬০</div>
                <div className="text-gray-600 text-xs sm:text-sm">মোট ক্লাস</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-2 sm:p-3">
                <div className="text-green-600 font-bold text-lg sm:text-xl">৬০</div>
                <div className="text-gray-600 text-xs sm:text-sm">ক্লাস টেস্ট</div>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-2 sm:p-3">
                <div className="text-blue-600 font-bold text-lg sm:text-xl">৪০</div>
                <div className="text-gray-600 text-xs sm:text-sm">সাপ্তাহিক টেস্ট</div>
              </div>
              <div className="text-center bg-orange-50 rounded-lg p-2 sm:p-3">
                <div className="text-orange-600 font-bold text-lg sm:text-xl">৬০</div>
                <div className="text-gray-600 text-xs sm:text-sm">মডেল টেস্ট</div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/Admission')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 sm:py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>🎓</span>
              Admission Now
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CUnit;
