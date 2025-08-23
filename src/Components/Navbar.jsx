import { useState, useEffect, useRef } from 'react'
import ParagonLogo from '../assets/ParagonLogo2.png'
import { Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [count, setCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Check if student is logged in
    const studentData = localStorage.getItem('studentData');
    const studentToken = localStorage.getItem('studentToken');
    const userType = localStorage.getItem('userType');
    
    if (studentData && studentToken && userType === 'student') {
      try {
        setStudent(JSON.parse(studentData));
      } catch (error) {
        console.error('Error parsing student data:', error);
        localStorage.removeItem('studentData');
        localStorage.removeItem('studentToken');
        localStorage.removeItem('userType');
      }
    }

    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    const adminToken = localStorage.getItem('jwtToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminUserType = localStorage.getItem('userType');
    
    if (adminData && adminToken && isAdmin && adminUserType === 'admin') {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userType');
      }
    }

    // Listen for photo updates
    const handlePhotoUpdate = () => {
      const updatedStudentData = localStorage.getItem('studentData');
      const studentToken = localStorage.getItem('studentToken');
      const userType = localStorage.getItem('userType');
      
      if (updatedStudentData && studentToken && userType === 'student') {
        try {
          setStudent(JSON.parse(updatedStudentData));
        } catch (error) {
          console.error('Error parsing updated student data:', error);
        }
      }
    };

    // Click outside handler to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        // Show hero again when dropdown closes
        window.dispatchEvent(new CustomEvent('showHero'));
      }
    };

    window.addEventListener('studentPhotoUpdated', handlePhotoUpdate);
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('studentPhotoUpdated', handlePhotoUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (student) {
      // Student logout
      localStorage.removeItem('studentData');
      localStorage.removeItem('studentToken');
      localStorage.removeItem('userType');
      setStudent(null);
    } else if (admin) {
      // Admin logout
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('admin');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userType');
      setAdmin(null);
    }
    setShowDropdown(false);
    setIsOpen(false); // Close mobile menu
    // Show hero again when user logs out
    window.dispatchEvent(new CustomEvent('showHero'));
    navigate('/');
  };

  const handleLogin = () => {
    setIsOpen(false); // Close mobile menu
    navigate('/StudentLogin');
  };

  const handleProfileClick = () => {
    setIsOpen(false); // Close mobile menu
    navigate('/StudentProfile');
  };

  const handleAdminHomeClick = () => {
    setIsOpen(false); // Close mobile menu
    navigate('/AdminHome');
  };

  return (
    <nav className="shadow-md fixed top-0 left-0 right-0 w-full z-[100] bg-black/30 backdrop-blur-md">
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 relative">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-12 lg:gap-4 xl:gap-6">
          {/* Logo - spans 2 columns on large screens */}
          <a href="/" className="cursor-pointer lg:justify-self-start lg:col-span-2 xl:col-span-2 flex-shrink-0">
            <img
              src={ParagonLogo}
              alt="Paragon Logo"
              className="w-[70px] sm:w-[80px] md:w-[90px] lg:w-[100px] xl:w-[110px] h-auto rounded-lg"
            />
          </a>

          {/* Hamburger Menu Button (mobile) */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-white focus:outline-none p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Full Menu - spans 6 columns on large screens, positioned left */}
          <ul
            className={`flex-col lg:flex-row lg:flex lg:items-center lg:justify-start absolute lg:static top-14 sm:top-16 md:top-18 left-0 w-full lg:w-auto lg:bg-transparent transition-all duration-300 ease-in overflow-visible lg:justify-self-start lg:col-span-6 xl:col-span-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-5 shadow-lg lg:shadow-none rounded-b-lg lg:rounded-none ${
              isOpen ? 'flex' : 'hidden'
            }`}
            style={{backgroundColor: isOpen ? 'rgba(0, 136, 206, 0.95)' : 'transparent'}}
          >
          { [
            { label: 'হোম', path: '/' },
            { label: 'কোর্স', path: '/Courses' },
            { label: 'খ ইউনিট', path: '/BUnit' },
            { label: 'গ ইউনিট', path: '/CUnit' },
            { label: 'রেজাল্ট', path: '/Results' },
            { label: 'পাবলিকেশন্স', path: '/Publications' },
            { label: 'নোটিশ', path: '/Notices' },
            { label: 'আরো', path: '/More' }
          ].map((item, index) => (
            <li key={index} className="w-full lg:w-auto">
              <Link 
                to={item.path} 
                className="text-white text-base sm:text-lg lg:text-base xl:text-lg px-3 sm:px-4 lg:px-4 xl:px-5 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 hover:bg-gradient-to-t from-sky-600 to-sky-400 cursor-pointer transition-all duration-200 relative group text-center rounded-lg lg:rounded-xl flex items-center justify-center w-full lg:w-auto whitespace-nowrap active:bg-sky-700 mx-1 sm:mx-1.5 lg:mx-0 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Mobile User Controls */}
          <li className="lg:hidden w-full mt-3 sm:mt-4">
            <div className="mx-3 sm:mx-4 px-3 sm:px-4 py-3 sm:py-4 bg-sky-700/90 rounded-lg border-t-2 sm:border-t-4 border-sky-300">
              {admin ? (
                /* Admin is logged in - Mobile */
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="text-white text-sm sm:text-base font-medium text-center mb-1">
                    Admin Panel
                  </div>
                  <button 
                    onClick={handleAdminHomeClick}
                    className="text-black text-sm sm:text-base font-medium px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-white rounded-lg bg-green-300 hover:bg-green-400 transition-colors w-full max-w-[200px] sm:max-w-[220px] active:bg-green-500"
                  >
                    Home
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="text-black text-sm sm:text-base font-medium px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-white rounded-lg bg-red-300 hover:bg-red-400 transition-colors w-full max-w-[200px] sm:max-w-[220px] active:bg-red-500"
                  >
                    Logout
                  </button>
                </div>
              ) : student ? (
                /* Student is logged in - Mobile */
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 sm:border-4 border-white cursor-pointer hover:border-yellow-300 transition-colors shadow-xl bg-white p-1"
                    onClick={handleProfileClick}
                  >
                    <img
                      src={student.ProfilePicture ? student.ProfilePicture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="text-white text-sm sm:text-base font-semibold text-center mb-1 px-2">
                    {student.EnglishName}
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 w-full">
                    <button 
                      onClick={handleProfileClick}
                      className="text-black text-sm sm:text-base font-medium px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-white rounded-lg bg-blue-300 hover:bg-blue-400 transition-colors w-full max-w-[200px] sm:max-w-[220px] mx-auto active:bg-blue-500"
                    >
                      Go to Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="text-black text-sm sm:text-base font-medium px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-white rounded-lg bg-red-300 hover:bg-red-400 transition-colors w-full max-w-[200px] sm:max-w-[220px] mx-auto active:bg-red-500"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                /* No one is logged in - Mobile */
                <div className="flex justify-center">
                  <button 
                    onClick={handleLogin}
                    className="text-black text-sm sm:text-base font-medium px-5 sm:px-6 py-2 sm:py-2.5 border-2 border-white rounded-lg bg-sky-300 hover:bg-sky-400 transition-colors max-w-[200px] sm:max-w-[220px] active:bg-sky-500"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </li>

        </ul>

        {/* User Controls - spans 4 columns on large screens */}
        <div className="hidden lg:flex lg:justify-self-end lg:col-span-4 xl:col-span-4">
          {admin ? (
            /* Admin is logged in */
            <div className="flex items-center gap-2 xl:gap-3">
              <button 
                onClick={() => navigate('/AdminHome')}
                className="text-black text-sm xl:text-base whitespace-nowrap px-3 xl:px-4 py-1.5 xl:py-2 border-white border rounded-lg shadow-lg bg-green-300 hover:bg-gradient-to-t from-green-500 to-green-300 transition-all duration-200 hover:scale-105"
              >
                Admin Home
              </button>
              <button 
                onClick={handleLogout}
                className="text-black text-sm xl:text-base whitespace-nowrap px-3 xl:px-4 py-1.5 xl:py-2 border-white border rounded-lg shadow-lg bg-red-300 hover:bg-gradient-to-t from-red-500 to-red-300 transition-all duration-200 hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : student ? (
            /* Student is logged in */
            <div className="flex items-center gap-2 xl:gap-3 relative group">
              <div 
                className="w-8 h-8 xl:w-10 xl:h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer hover:border-yellow-300 transition-colors shadow-md"
              >
                <img
                  src={student.ProfilePicture ? student.ProfilePicture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 xl:w-52 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 xl:p-4">
                  <div className="text-gray-800 font-semibold text-sm xl:text-base mb-2 border-b border-gray-100 pb-2 truncate">
                    {student.EnglishName}
                  </div>
                  <button 
                    onClick={() => navigate('/StudentProfile')}
                    className="w-full text-left px-3 py-2 text-sm xl:text-base text-gray-700 hover:bg-blue-50 rounded-lg transition-colors mb-1 flex items-center gap-2"
                  >
                    <User size={16} />
                    Go to Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm xl:text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* No one is logged in */
            <button 
              onClick={handleLogin}
              className="text-black text-sm xl:text-base whitespace-nowrap px-4 xl:px-5 py-1.5 xl:py-2 border-white border rounded-lg shadow-lg bg-sky-300 hover:bg-gradient-to-t from-sky-500 to-sky-300 transition-all duration-200 hover:scale-105"
            >
              Login
            </button>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar
