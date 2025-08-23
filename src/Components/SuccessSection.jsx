import React from 'react';

const SuccessSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">আমাদের সাফল্য</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">সংখ্যা যা আমাদের উৎকর্ষতার কথা বলে</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          <div className="text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-2 sm:mb-3 lg:mb-4 leading-tight">৫০০০+</div>
            <div className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">ভর্তিকৃত শিক্ষার্থী</div>
          </div>
          <div className="text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2 sm:mb-3 lg:mb-4 leading-tight">৯৫%</div>
            <div className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">সফলতার হার</div>
          </div>
          <div className="text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-2 sm:mb-3 lg:mb-4 leading-tight">৫০+</div>
            <div className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">দক্ষ শিক্ষক</div>
          </div>
          <div className="text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600 mb-2 sm:mb-3 lg:mb-4 leading-tight">১০+</div>
            <div className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">বছরের অভিজ্ঞতা</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessSection;
