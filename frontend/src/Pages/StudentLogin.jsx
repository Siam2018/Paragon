import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import paragonlogo from '../assets/ParagonLogo2-Photoroom2.png';
import { ToastContainer, toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_HTTPURLBackend;

const StudentLogin = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/admin/Student/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();

            // Store JWT token and student data in localStorage
            localStorage.setItem('studentToken', data.token);
            localStorage.setItem('studentData', JSON.stringify(data.student));
            localStorage.setItem('userType', 'student');

            toast.success('Login successful!', {
                position: 'top-right',
                autoClose: 3000
            });

            // Navigate to home page or dashboard
            setTimeout(() => {
                navigate('/');
                // Reload the page to update navbar
                window.location.reload();
            }, 1500);

        } catch (err) {
            toast.error(err.message, {
                position: 'top-right',
                autoClose: 5000
            });
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />

            <div className="flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16">
                <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg">
                    <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                        <div className="text-center mb-6 sm:mb-8">
                            <img
                                alt="Paragon Coaching Center"
                                src={paragonlogo}
                                className="h-8 sm:h-10 lg:h-12 mx-auto mb-4 sm:mb-6"
                            />
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#0088ce' }}>
                                Student Login
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">
                                Access your student dashboard
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                <div className="flex items-center">
                                    <span className="text-red-500 mr-2">⚠️</span>
                                    {error}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 sm:py-4 px-4 text-white font-medium text-sm sm:text-base rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
                                style={{ backgroundColor: '#0088ce' }}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                                        Signing In...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            <div className="text-center">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm hover:underline transition-all duration-200 hover:text-blue-700"
                                    style={{ color: '#0088ce' }}
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </form>

                        <div className="mt-6 sm:mt-8 text-center">
                            <div className="relative mb-4 sm:mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                                </div>
                            </div>
                            
                            <Link
                                to="/Admission"
                                className="inline-block w-full py-3 sm:py-4 px-4 text-center font-medium text-sm sm:text-base rounded-lg border-2 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
                                style={{
                                    color: '#0088ce',
                                    borderColor: '#0088ce'
                                }}
                            >
                                Create New Account
                            </Link>

                            <div className="mt-4 text-xs sm:text-sm text-gray-500">
                                <p>New students can register by creating an account</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Additional Help Section */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Need Help?</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3">
                                Contact our support team for assistance with your account
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 text-xs">
                                <span className="text-gray-500">📞 Support: +88 01234-567890</span>
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <span className="text-gray-500">📧 help@paragon.edu.bd</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastClassName="text-sm"
            />
        </div>
    );
};

export default StudentLogin;
