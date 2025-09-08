import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';

const VerifyEmail = () => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    // Check for token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setLoading(true);
      fetch(`/api/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setVerified(true);
            setTimeout(() => navigate('/'), 2000);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        {!verified ? (
          <>
            <p className="mb-6">You have been sent an email. Please check your inbox at <span className="font-semibold">{email}</span> and click the verification link.</p>
            <p className="mt-4 text-gray-500">Waiting for you to verify...</p>
            {loading && <p className="text-blue-500">Verifying...</p>}
          </>
        ) : (
          <p className="text-green-600 text-xl font-semibold">Email Verified! Redirecting to home...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
