import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { 
  FaUsers, 
  FaBook, 
  FaFileAlt, 
  FaTrophy, 
  FaCamera, 
  FaNewspaper, 
  FaUserPlus 
} from 'react-icons/fa';
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx';

const AdminHome = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Check for JWT token and admin authentication
    const token = localStorage.getItem('jwtToken');
    const adminData = localStorage.getItem('admin');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!token || !isAdmin) {
      navigate('/AdminSignIn');
      return;
    }
    
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, [navigate]);

  const cardData = [
    {
      title: "Student Management",
      description: "View, add, edit, and delete student records",
      icon: "👥",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      link: "/StudentList",
      stats: "Manage all student data"
    },
    {
      title: "Course Management", 
      description: "Manage courses, subjects, and curriculum",
      icon: "📚",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      link: "/Courses",
      stats: "Course administration"
    },
    {
      title: "Notice Board",
      description: "Create and manage notices and announcements",
      icon: "📄",
      color: "bg-yellow-500", 
      hoverColor: "hover:bg-yellow-600",
      link: "/Notices",
      stats: "Communication center"
    },
    {
      title: "Results Management",
      description: "Upload and manage student results",
      icon: "🏆",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600", 
      link: "/Results",
      stats: "Academic results"
    },
    {
      title: "Publication Management",
      description: "Manage publications, magazines, and documents",
      icon: "📰",
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      link: "/Publications",
      stats: "Media & publications"
    },
    {
      title: "Admin Management",
      description: "Add new administrators and manage admins",
      icon: "👤",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      link: "/AdminRegister",
      stats: "Admin control panel"
    }
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              {admin && (
                <p className="text-base sm:text-lg text-gray-600 mt-1">
                  Welcome back, {admin.FullName || admin.Email}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs sm:text-sm text-gray-500">
                Last login: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {cardData.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="group transform transition-all duration-300 hover:scale-105"
            >
              <div className={`${card.color} ${card.hoverColor} rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-white transition-all duration-300 group-hover:shadow-xl min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center`}>
                    <span className="text-2xl sm:text-3xl lg:text-4xl">{card.icon}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm opacity-75">{card.stats}</div>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 group-hover:text-gray-100 transition-colors duration-300">
                    {card.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm lg:text-base opacity-90 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm lg:text-base font-medium group-hover:text-gray-100 transition-colors duration-300">
                  <span>Manage →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminHome
