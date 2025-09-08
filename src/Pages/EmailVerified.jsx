import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EmailVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      return;
    }
    fetch('/api/verify-email?token=' + token)
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Email verified.') {
          setStatus('success');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [navigate, location.search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'verifying' && <><h1 className="text-2xl font-bold mb-4">Verifying Email...</h1><p className="mt-4 text-gray-500">Please wait while we verify your email.</p></>}
      {status === 'success' && <><h1 className="text-2xl font-bold mb-4 text-green-600">Email Verified!</h1><p className="mb-2">Your email has been successfully verified.</p><p className="mt-4 text-gray-500">Redirecting to home page...</p></>}
      {status === 'error' && <><h1 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h1><p className="mb-2">The verification link is invalid or expired.</p></>}
    </div>
  );
};

export default EmailVerified;
