import React from 'react';

const AboutSection = () => {
  return (
    <section className="pt-12 sm:pt-16 lg:pt-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">আমাদের সম্পর্কে</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
            Paragon Mymensingh – মানবিক ও ব্যবসায় শিক্ষার্থীদের জন্য এক বিশ্বস্ত কোচিং প্রতিষ্ঠান
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 p-4 sm:p-6 lg:pb-8 rounded-lg mb-6 sm:mb-8">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg px-2">
              Paragon Mymensingh ময়মনসিংহের অন্যতম জনপ্রিয় ও অভিজ্ঞ বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির কোচিং সেন্টার, যা মূলত মানবিক (খ ইউনিট) ও ব্যবসায় (গ ইউনিট) শাখার শিক্ষার্থীদের জন্য উচ্চ মানসম্পন্ন কোর্স পরিচালনা করে। দুই দশকেরও বেশি সময় ধরে সফলভাবে পরিচালিত এই প্রতিষ্ঠানটি শিক্ষার্থীদের শুধু বিশ্ববিদ্যালয়ে ভর্তি নয়, বরং সঠিক পথে প্রস্তুতির একটি নির্ভরযোগ্য অংশীদার হিসেবে কাজ করছে।
            </p>
          </div>
          
          <button 
            onClick={() => window.location.href = '/about'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 lg:px-10 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base lg:text-lg w-full sm:w-auto"
          >
            আরও পড়ুন
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
