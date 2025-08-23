import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';



const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code and new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const sendResetEmail = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }

    setLoading(true);

    try {
  const response = await fetch(`/api/send-password-reset-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      toast.success('Password reset email sent! Please check your inbox.', {
        position: 'top-right',
        autoClose: 5000
      });

      setStep(2);
    } catch (err) {
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!code || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          code, 
          newPassword 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      toast.success('Password reset successfully! You can now log in with your new password.', {
        position: 'top-right',
        autoClose: 5000
      });

      setResetSuccess(true);
    } catch (err) {
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md text-center">
          <div className="mb-4 sm:mb-6">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            <Link
              to="/StudentLogin"
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 inline-block text-sm sm:text-base"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Forgot Password</h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            {step === 1 
              ? "Enter your email address to receive a password reset code"
              : "Enter the code sent to your email and your new password"
            }
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={sendResetEmail} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-sm sm:text-base"
                placeholder="Enter your email address"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition duration-300 text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Code'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Reset Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-center text-xl sm:text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
                required
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1 px-1">
                Enter the 6-digit code sent to {email}
              </p>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-sm sm:text-base"
                placeholder="Enter new password"
                minLength="6"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-sm sm:text-base"
                placeholder="Confirm new password"
                minLength="6"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-500 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 text-sm sm:text-base"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition duration-300 text-sm sm:text-base"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white mr-2"></div>
                    Resetting...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 sm:mt-6 text-center">
          <Link
            to="/StudentLogin"
            className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 text-sm sm:text-base"
          >
            Back to Login
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
