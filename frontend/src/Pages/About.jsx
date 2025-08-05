import React from 'react';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';

const About = () => {
  return (
    <div className='bg-blue-50 min-h-screen'>
      <Navbar />
      
      <section className="pt-16 pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 px-2">Paragon Mymensingh পরিচিতি</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
              Paragon Mymensingh – মানবিক ও ব্যবসায় শিক্ষার্থীদের জন্য এক বিশ্বস্ত কোচিং প্রতিষ্ঠান
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto mb-8 sm:mb-12 px-2 sm:px-0">
            <div className="bg-blue-50 p-4 sm:p-6 lg:p-8 rounded-lg mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                Paragon Mymensingh ময়মনসিংহের অন্যতম জনপ্রিয় ও অভিজ্ঞ বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির কোচিং সেন্টার, যা মূলত মানবিক (খ ইউনিট) ও ব্যবসায় (গ ইউনিট) শাখার শিক্ষার্থীদের জন্য উচ্চ মানসম্পন্ন কোর্স পরিচালনা করে। দুই দশকেরও বেশি সময় ধরে সফলভাবে পরিচালিত এই প্রতিষ্ঠানটি শিক্ষার্থীদের শুধু বিশ্ববিদ্যালয়ে ভর্তি নয়, বরং সঠিক পথে প্রস্তুতির একটি নির্ভরযোগ্য অংশীদার হিসেবে কাজ করছে।
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Paragon এমন একটি পরিবেশ তৈরি করেছে, যেখানে একাডেমিক গাইডলাইন, মানসিক প্রস্তুতি ও ব্যক্তিগত মনোযোগ—সবকিছুর সমন্বয় ঘটে।
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">আমাদের শিক্ষকবৃন্দ</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Paragon-এর অন্যতম বড় শক্তি হলো এর অভিজ্ঞ শিক্ষকবৃন্দ, যাঁরা ঢাকা বিশ্ববিদ্যালয়সহ দেশের বিভিন্ন উচ্চশিক্ষা প্রতিষ্ঠান থেকে পাস করা অথবা অধ্যয়নরত, পরীক্ষায় অভিজ্ঞ ও শিক্ষাদানে দক্ষ।
                </p>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">বিশেষ সুবিধা</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  প্রতিটি ব্যাচে সীমিত সংখ্যক শিক্ষার্থী রাখা হয় যাতে প্রত্যেকের প্রতি পর্যাপ্ত মনোযোগ দেওয়া যায়। শুধুমাত্র খ ও গ ইউনিট এর ওপর ভিত্তি করে তৈরি করা হয় ক্লাস রুটিন, লেকচার শীট ও প্রশ্নব্যাংক।
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 sm:p-6 lg:p-8 rounded-lg mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Special Batch কার্যক্রম</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                প্রতিষ্ঠানটি "Special Batch" নামে একটি বিশেষ কার্যক্রম পরিচালনা করে থাকে, যেখানে নির্বাচিত শিক্ষার্থীদের জন্য অতিরিক্ত সুবিধা ও নিবিড় পরিচর্যা নিশ্চিত করা হয়।
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                শিক্ষার্থীদের জন্য রয়েছে ডেমনস্ট্রেশন ক্লাস, মাইক্রো লেকচার, হ্যান্ডনোট এবং গাইড শীট। ভর্তি মৌসুমে ছাড় সুবিধা দিয়ে থাকে যাতে আর্থিকভাবে অসচ্ছল কিন্তু মেধাবী শিক্ষার্থীরা উপকৃত হতে পারে।
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 sm:p-6 lg:p-8 rounded-lg mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">প্রযুক্তিনির্ভর শিক্ষা</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Paragon Mymensingh সময়োপযোগী ও প্রযুক্তিনির্ভর শিক্ষায়ও অগ্রণী। প্রয়োজন অনুযায়ী অনলাইন ক্লাসের (Zoom বা Google Meet) মাধ্যমে ক্লাস পরিচালনা করে থাকে, যাতে দূরবর্তী শিক্ষার্থীরাও একই মানের শিক্ষা পায়। সামাজিক যোগাযোগমাধ্যমে নিয়মিত লেকচার ক্লিপ, শিক্ষক ও ছাত্রদের মতামত, সফলতার গল্প ও ক্লাস আপডেট প্রকাশ করা হয়।
              </p>
            </div>
            
            <div className="text-center bg-blue-100 p-4 sm:p-6 lg:p-8 rounded-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">আমাদের লক্ষ্য</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                এই কোচিং সেন্টারটি কেবল একজন পরীক্ষার্থীর প্রস্তুতির স্থান নয়, বরং একটি স্বপ্ন পূরণের কেন্দ্র। এখানে যে শিক্ষার্থীরা ভর্তি হয়, তারা শুধু বিশ্ববিদ্যালয়ে স্থান পাওয়ার জন্যই নয়, বরং নিজের দক্ষতা, আত্মবিশ্বাস ও মানসিক শক্তি তৈরি করতেও এগিয়ে যায়।
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                Paragon Mymensingh দৃঢ়ভাবে বিশ্বাস করে, সঠিক পরিকল্পনা, আন্তরিক গাইডলাইন ও একাগ্রতার মাধ্যমেই একজন শিক্ষার্থী তার কাঙ্ক্ষিত বিশ্ববিদ্যালয়ে পৌঁছাতে পারে। এটি শুধুই কোচিং নয়—এটি ভবিষ্যতের ভিত্তি নির্মাণের এক বাস্তব রূপান্তর।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* আমাদের কথা Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">সুপ্রিয় শিক্ষার্থীবৃন্দ</h3>
              
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  Paragon এর পক্ষ থেকে তোমাদের জন্য শুভকামনা। শিক্ষার্থীদের জন্য যা কিছু সুন্দর ও কল্যাণকর তার সাথে Paragon এর সহযোগী সহযোগিতা। সময়ের প্রয়োজনে প্রয়োজনীয় উদ্যোগে Paragon সর্বদাই শিক্ষার্থীদের সাথে সুদৃঢ় মিশিলে, নিষ্ঠাচ্ছ এবং নীতিবাচ্ছ মিশিলে। তাই ধারাবাহিকভাবে Paragon তোমাদের পাশে থাকবে।
                </p>
                
                <p>
                  শিক্ষার প্রতিটি পদে প্রতিযোগিতার মাধ্যমে এক একেকটি বাধার পাহাড় পেরিয়ে তোমাদের জীবনের সফলতার সিঁড়িতে উঠতে হবে। সেখানে তোমাদের সামনে অসংখ্য কঠোরতর প্রতিযোগিতাপূর্ণ একটি পরীক্ষা যার নাম 'বিশ্ববিদ্যালয় ভর্তি'। আর এ যুদ্ধে নিজেকে যোগ্য যোদ্ধা হিসেবে তৈরি করার পূর্বশর্ত হচ্ছে অধ্যবসায় ও সঠিক পরিকল্পনা সঠিক নির্দেশনার জন্য সঠিক কোচিং প্রতিষ্টানকে বেছে নেওয়া।
                </p>
                
                <p>
                  সৃষ্টিকর্তার পর আমাদের সাথে Paragon-ই হতে পারে তোমাদের একমাত্র প্রেরণার রোল তোমাদের সহযোগিতা করবে এবং গড়ে তুলবে অগ্রসর এক জাতি হিসেবে। কেননা 'বুলেটপ্রুফ' শিক্ষার মানে আমাদের আস্থা ও সেবায়-এই প্রজন্মের প্রজন্মের অগ্রসর জাতি হিসেবে গড়ে তুলতে Paragon তোমাদের পাশে থাকবে।
                </p>
                
                <p>
                  বিশ্ববিদ্যালয় ভর্তি পরীক্ষার প্রতিযোগিতায় তোমাদের সফলতা অর্জনে Paragon এর সঠিক পদ নির্দেশনা, নিয়মিত ক্লাস, পরীক্ষার প্রস্তুতি, মডেল টেস্ট, সঠিক পরিকল্পনা, তথ্যবহুল বই ও তথ্যবহুল ক্লাসসমূহ তোমাদের সফলতার সিঁড়িতে উঠতে সাহায্য করবে। তাই প্রধানত কোচিং সেন্টার হিসেবে পরবর্তী বড় পরীক্ষার্থীদের সঠিক পদ নির্দেশন হিসেবে Paragon আজ সর্বক্ষেত্রে সমাদৃত।
                </p>
              </div>
              
              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                  তোমাদের বিশ্ববিদ্যালয় ভর্তি পরীক্ষার ভবিষ্যৎ সাফল্য কামনায় ...
                </p>
                <p className="text-lg sm:text-xl font-bold text-blue-700 mb-1">Paragon পরিবার</p>
                <p className="text-base sm:text-lg text-gray-600">ময়মনসিংহ শাখা</p>
              </div>
            </div>
            
            {/* Inspirational Quote */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg text-center">
              <div className="max-w-4xl mx-auto">
                <div className="text-4xl sm:text-5xl lg:text-6xl text-orange-500 mb-2 sm:mb-4">"</div>
                <p className="text-base sm:text-lg font-medium text-gray-800 italic leading-relaxed px-2">
                  সফলতার গল্প পড়ো না কারণ তা থেকে তুমি শুধু মজা পাবে, ব্যর্থতার গল্প পড়ো কারণ তা থেকে তুমি সফলতার কিছু শিখতে পারবে।
                </p>
                <div className="text-4xl sm:text-5xl lg:text-6xl text-orange-500 mt-2 sm:mt-4 rotate-180">"</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
