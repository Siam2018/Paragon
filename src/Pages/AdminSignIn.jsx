import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar.jsx'
import paragonlogo from '../assets/ParagonLogo2-Photoroom2.png'
import {ToastContainer, toast} from 'react-toastify'



const AdminSignIn = () => {
  const navigate = useNavigate();
  const [signInInfo, setSignInInfo] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setSignInInfo({
      ...signInInfo,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Perform sign-in logic here
    if (!signInInfo.email || !signInInfo.password) {
      toast.error('Please fill in all fields!', {
        position: 'top-right',
        autoClose: 5000
      });
      setLoading(false);
      return;
    }
    try {
  const response = await fetch(`/api/auth/Admin/Signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({
              Email: signInInfo.email,
              Password: signInInfo.password,
            }),
      });
      const result = await response.json();
      const { token, admin } = result;
      if (response.ok) {
        toast.success('Sign-in successful!', {
          position: 'top-right',
          autoClose: 5000
        });
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('admin', JSON.stringify(admin));
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('userType', 'admin');
        setTimeout(() => {
          navigate('/AdminHome');
        }, 2000);
      } else if (result.message === 'Admin does not exist.') {
        toast.error('Admin does not exist!', {
          position: 'top-right',
          autoClose: 5000
        });
      } else if (result.message === 'Incorrect password.') {
        toast.error('Incorrect password!', {
          position: 'top-right',
          autoClose: 5000
        });
      } else if (result.error) {
        const errorMessage = result.error?.details?.[0]?.message || 'Sign-in failed!';
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000
        });
      } else {
        toast.error(result.message || 'Sign-in failed!', {
          position: 'top-right',
          autoClose: 5000
        });
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast.error('An error occurred during sign-in!', {
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
            Admin Portal
          </h1>
          <p className="text-center text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 px-2">
            Access the administrative dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={signInInfo.email}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: '#0088ce' }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={signInInfo.password}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: '#0088ce' }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 px-4 text-sm sm:text-base text-white font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              style={{ backgroundColor: '#0088ce' }}
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center space-y-3 sm:space-y-4">
            <div className="border-t border-gray-200 pt-3 sm:pt-4">
              <div className="text-xs text-gray-500 space-y-2">
                <p>Restricted access - Admin credentials required</p>
                <p>New admin accounts can only be created by existing administrators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  )
}

export default AdminSignIn
