import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar.jsx'
import paragonlogo from '../assets/ParagonLogo2-Photoroom2.png'
import {ToastContainer, toast} from 'react-toastify'

const AdminRegister = () => {
  const navigate = useNavigate();
  const [registerInfo, setRegisterInfo] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated admin
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!token || !isAdmin) {
      toast.error('Only authenticated admins can create new admin accounts!', {
        position: 'top-right',
        autoClose: 5000
      });
      navigate('/AdminSignIn');
      return;
    }
  }, [navigate]);
  const handleChange = (e) => {
    setRegisterInfo({
      ...registerInfo,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Perform registration logic here
    if (!registerInfo.fullName || !registerInfo.email || !registerInfo.password) {
      toast.error('Please fill in all fields!', {
        position: 'top-right',
        autoClose: 5000
      });
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`/api/auth/Admin/Register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          FullName: registerInfo.fullName,
          Email: registerInfo.email,
          Password: registerInfo.password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('New admin registered successfully!', {
          position: 'top-right',
          autoClose: 5000
        });
        setTimeout(() => {
          navigate('/AdminHome');
        }, 2000);
      } else if (result.message === 'Admin already exists.') {
        toast.error('Admin already exists!', {
          position: 'top-right',
          autoClose: 5000
        });
      } else if (result.error) {
        const errorMessage = result.error?.details?.[0]?.message || 'Registration failed!';
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000
        });
      } else {
        toast.error(result.message || 'Registration failed!', {
          position: 'top-right',
          autoClose: 5000
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('An error occurred during registration!', {
        position: 'top-right',
        autoClose: 5000
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10">
          <img
            alt="Paragon Logo"
            src={paragonlogo}
            className="h-8 sm:h-10 lg:h-12 justify-center mx-auto mb-4 sm:mb-6"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#0088ce' }}>
            Create New Admin
          </h1>
          <p className="text-center text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 px-2">
            Only authenticated administrators can create new admin accounts
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={registerInfo.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: '#0088ce' }}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={registerInfo.email}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: '#0088ce' }}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={registerInfo.password}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: '#0088ce' }}
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 px-4 text-sm sm:text-base text-white font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              style={{ backgroundColor: '#0088ce' }}
            >
              {loading ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center space-y-3 sm:space-y-4">
            <div className="border-t border-gray-200 pt-3 sm:pt-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                Need to manage existing admins?
              </p>
              <Link
                to="/AdminHome"
                className="inline-block w-full py-2 sm:py-3 px-4 text-sm sm:text-base text-center font-medium rounded-md border-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200"
                style={{
                  color: '#0088ce',
                  borderColor: '#0088ce',
                  backgroundColor: 'transparent'
                }}
              >
                Back to Dashboard
              </Link>
            </div>

            <div className="text-xs text-gray-500">
              <p>Admin accounts have full system access</p>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  )
}

export default AdminRegister
