import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">আমাদের বৈশিষ্ট্য</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">যা আমাদের অন্যদের থেকে আলাদা করে তোলে</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">👨‍🏫</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight">দক্ষ শিক্ষকমণ্ডলী</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">অভিজ্ঞ ও যোগ্য শিক্ষকগণ যারা শিক্ষার্থীদের সফলতার জন্য নিবেদিত</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">📖</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight">মানসম্পন্ন উপকরণ</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">কার্যকর শিক্ষার জন্য সম্পূর্ণ অধ্যয়ন উপকরণ ও সম্পদ</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">🏗️</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight">আধুনিক অবকাঠামো</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">অত্যাধুনিক সুবিধা ও আধুনিক শিক্ষা উপকরণ</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">📊</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight">নিয়মিত মূল্যায়ন</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">শিক্ষার্থীদের উন্নতির জন্য ক্রমাগত মূল্যায়ন ও পরামর্শ</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">🎯</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight">ব্যক্তিগত যত্ন</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">প্রতিটি শিক্ষার্থীর শক্তি ও দুর্বলতার প্রতি বিশেষ মনোযোগ</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">💡</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight">উদ্ভাবনী পদ্ধতি</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">আধুনিক শিক্ষা কৌশল ও ইন্টারেক্টিভ শিক্ষা পদ্ধতি</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
