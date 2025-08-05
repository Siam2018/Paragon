import React from 'react';

const UniversitiesSection = () => {
  const universities = [
    {
      name: "University of Dhaka",
      url: "https://du.ac.bd/",
      image: "https://uccgroup.com.bd/uploads/uni_list/1.jpg"
    },
    {
      name: "University of Rajshahi",
      url: "https://www.ru.ac.bd/",
      image: "https://uccgroup.com.bd/uploads/uni_list/2.jpg"
    },
    {
      name: "Bangladesh Agricultural",
      url: "https://bau.edu.bd/",
      image: "https://uccgroup.com.bd/uploads/uni_list/3.jpg"
    },
    {
      name: "Engineering & Technology",
      url: "https://www.buet.ac.bd/web/",
      image: "https://uccgroup.com.bd/uploads/uni_list/4.jpg"
    },
    {
      name: "University of Chittagong",
      url: "https://cu.ac.bd/",
      image: "https://uccgroup.com.bd/uploads/uni_list/5.jpg"
    },
    {
      name: "Jahangirnagar University",
      url: "https://juniv.edu/",
      image: "https://uccgroup.com.bd/uploads/uni_list/6.jpg"
    },
    {
      name: "Islamic University",
      url: "https://iu.ac.bd/",
      image: "https://uccgroup.com.bd/uploads/uni_list/7.jpg"
    },
    {
      name: "Shahjalal University",
      url: "https://www.sust.edu/",
      image: "https://uccgroup.com.bd/uploads/uni_list/8.jpg"
    },
    {
      name: "Khulna University",
      url: "https://ku.ac.bd/",
      image: "https://uccgroup.com.bd/uploads/uni_list/9.jpg"
    },
    {
      name: "Open University",
      url: "https://bou.ac.bd/",
      image: "https://uccgroup.com.bd/uploads/uni_list/10.jpg"
    },
    {
      name: "BSM Medical University",
      url: "https://bsmmu.edu.bd/",
      image: "https://uccgroup.com.bd/uploads/uni_list/11.jpg"
    },
    {
      name: "BSMR Agricultural",
      url: "https://bsmrau.edu.bd/",
      image: "https://uccgroup.com.bd/uploads/uni_list/12.jpg"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">পাবলিক বিশ্ববিদ্যালয়ের তালিকা</h2>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0 leading-relaxed">শীর্ষ পাবলিক বিশ্ববিদ্যালয় যেখানে আমাদের শিক্ষার্থীরা ভর্তি হয়</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {universities.map((university, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 bg-white group">
              <a href={university.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="w-full h-16 sm:h-20 lg:h-24 flex items-center justify-center mb-2 sm:mb-3 bg-gray-50 rounded border border-gray-100 overflow-hidden group-hover:bg-blue-50 transition-colors duration-300">
                  <img 
                    src={university.image} 
                    alt={university.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNkZGQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VW5pdmVyc2l0eTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
                <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center leading-tight min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center px-1">
                  {university.name}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;
