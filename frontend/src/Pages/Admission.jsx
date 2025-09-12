import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import paragonlogo from '../assets/ParagonLogo2-Photoroom2.png';
import { ToastContainer, toast } from 'react-toastify';

// Backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_HTTPURLBackend;

const Admission = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    BanglaName: '',
    EnglishName: '',
    FatherName: '',
    MotherName: '',
    DateOfBirth: '',
    Gender: '',

    // Contact Information
    ContactNumber: '',
    GuardianContactNumber: '',
    Email: '',
    Password: '',

    // Address Information
    PresentAddress: '',
    PermanentAddress: '',

    // Educational Information (SSC)
    SchoolName: '',
    SSCBoard: '',
    SSCGroup: '',
    SSCYearPass: '',
    SSCGPA: '',
    SSCGrade: '',
    SSCRollNumber: '',
    SSCRegistrationNumber: '',

    // Educational Information (HSC)
    CollegeName: '',
    HSCBoard: '',
    HSCGroup: '',
    HSCYearPass: '',
    HSCGPA: '',
    HSCGrade: '',
    HSCRollNumber: '',
    HSCRegistrationNumber: '',

    // Course Selection
    SelectedCourse: '',
    BranchName: '',

    // Terms
    TermsAccepted: false
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [emailVerification, setEmailVerification] = useState({
    sent: false,
    code: '',
    verified: false,
    loading: false
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Personal Information
    if (!formData.BanglaName.trim()) {
      errors.BanglaName = 'Bangla name is required';
    }
    if (!formData.EnglishName.trim()) {
      errors.EnglishName = 'English name is required';
    }
    if (!formData.FatherName.trim()) {
      errors.FatherName = "Father's name is required";
    }
    if (!formData.MotherName.trim()) {
      errors.MotherName = "Mother's name is required";
    }
    if (!formData.DateOfBirth) {
      errors.DateOfBirth = 'Date of birth is required';
    }
    if (!formData.Gender) {
      errors.Gender = 'Gender is required';
    }

    // Contact Information
    if (!formData.ContactNumber.trim()) {
      errors.ContactNumber = 'Contact number is required';
    }
    if (!formData.Email.trim()) {
      errors.Email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      errors.Email = 'Please enter a valid email address';
    }
    if (!formData.Password.trim()) {
      errors.Password = 'Password is required';
    } else if (formData.Password.length < 6) {
      errors.Password = 'Password must be at least 6 characters long';
    }

    // Address Information
    if (!formData.PresentAddress.trim()) {
      errors.PresentAddress = 'Present address is required';
    }
    if (!formData.PermanentAddress.trim()) {
      errors.PermanentAddress = 'Permanent address is required';
    }

    // SSC Information
    if (!formData.SchoolName.trim()) {
      errors.SchoolName = 'School name is required';
    }
    if (!formData.SSCBoard) {
      errors.SSCBoard = 'SSC board is required';
    }
    if (!formData.SSCGroup) {
      errors.SSCGroup = 'SSC group is required';
    }
    if (!formData.SSCYearPass) {
      errors.SSCYearPass = 'SSC year of pass is required';
    }
    if (!formData.SSCGPA.trim()) {
      errors.SSCGPA = 'SSC GPA is required';
    }
    if (!formData.SSCGrade) {
      errors.SSCGrade = 'SSC grade is required';
    }
    if (!formData.SSCRollNumber.trim()) {
      errors.SSCRollNumber = 'SSC roll number is required';
    }
    if (!formData.SSCRegistrationNumber.trim()) {
      errors.SSCRegistrationNumber = 'SSC registration number is required';
    }

    // HSC Information
    if (!formData.CollegeName.trim()) {
      errors.CollegeName = 'College name is required';
    }
    if (!formData.HSCGroup) {
      errors.HSCGroup = 'HSC group is required';
    }
    if (!formData.HSCYearPass) {
      errors.HSCYearPass = 'HSC year of pass is required';
    }
    if (!formData.HSCRollNumber.trim()) {
      errors.HSCRollNumber = 'HSC roll number is required';
    }

    // Course Information
    if (!formData.SelectedCourse.trim()) {
      errors.SelectedCourse = 'Selected course is required';
    }
    if (!formData.BranchName.trim()) {
      errors.BranchName = 'Branch name is required';
    }

    // Terms and Conditions
    if (!formData.TermsAccepted) {
      errors.TermsAccepted = 'You must accept the terms and conditions';
    }

    // Email Verification
    if (!emailVerification.verified) {
      errors.emailVerification = 'Please verify your email address first';
    }

    return errors;
  };

  const scrollToFirstError = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                    document.querySelector(`#${firstErrorField}`) ||
                    document.querySelector('.error-section');
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      element.focus();
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedPhoto(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select a valid image file.');
      }
    }
  };

  const sendVerificationEmail = async () => {
    if (!formData.Email) {
      toast.error('Please enter your email address first', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }

    setEmailVerification(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${BACKEND_URL}/admin/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.Email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send verification email');
      }

      setEmailVerification(prev => ({ 
        ...prev, 
        sent: true, 
        loading: false 
      }));

      toast.success('Verification email sent! Please check your inbox.', {
        position: 'top-right',
        autoClose: 5000
      });
    } catch (err) {
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 5000
      });
      setEmailVerification(prev => ({ ...prev, loading: false }));
    }
  };

  const verifyEmailCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }

    setEmailVerification(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${BACKEND_URL}/admin/verify-email-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.Email, 
          code: verificationCode 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid verification code');
      }

      setEmailVerification(prev => ({ 
        ...prev, 
        verified: true, 
        loading: false 
      }));

      toast.success('Email verified successfully!', {
        position: 'top-right',
        autoClose: 5000
      });
    } catch (err) {
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 5000
      });
      setEmailVerification(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      scrollToFirstError(errors);
      
      // Show toast for first error
      const firstErrorMessage = Object.values(errors)[0];
      toast.error(firstErrorMessage, {
        position: 'top-right',
        autoClose: 5000
      });
      
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/admin/Student/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      setSuccess(true);
      
      toast.success('Registration successful! Welcome to Paragon Coaching Center!', {
        position: 'top-right',
        autoClose: 5000
      });

      // If photo was selected, upload it
      if (selectedPhoto && data._id) {
        try {
          const photoFormData = new FormData();
          photoFormData.append('Image', selectedPhoto);

          await fetch(`${BACKEND_URL}/admin/Student/photo/${data._id}`, {
            method: 'PUT',
            body: photoFormData,
          });
        } catch (photoError) {
          console.error('Photo upload failed:', photoError);
          // Don't show error for photo upload failure during registration
        }
      }

      // Reset form
      setFormData({
        // Personal Information
        BanglaName: '',
        EnglishName: '',
        FatherName: '',
        MotherName: '',
        DateOfBirth: '',
        Gender: '',

        // Contact Information
        ContactNumber: '',
        GuardianContactNumber: '',
        Email: '',
        Password: '',

        // Address Information
        PresentAddress: '',
        PermanentAddress: '',

        // Educational Information (SSC)
        SchoolName: '',
        SSCBoard: '',
        SSCGroup: '',
        SSCYearPass: '',
        SSCGPA: '',
        SSCGrade: '',
        SSCRollNumber: '',
        SSCRegistrationNumber: '',

        // Educational Information (HSC)
        CollegeName: '',
        HSCBoard: '',
        HSCGroup: '',
        HSCYearPass: '',
        HSCGPA: '',
        HSCGrade: '',
        HSCRollNumber: '',
        HSCRegistrationNumber: '',

        // Course Selection
        SelectedCourse: '',
        BranchName: '',

        // Terms
        TermsAccepted: false
      });
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setEmailVerification({
        sent: false,
        code: '',
        verified: false,
        loading: false
      });
      setVerificationCode('');

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

  // Error display component
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (
      <p className="text-red-500 text-sm mt-1 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    );
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <div className="mb-4 sm:mb-6">
              <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>
              Registration Successful!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
              Your registration has been submitted successfully. You can now log in to your student portal.
            </p>
            <Link
              to="/StudentLogin"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-white font-medium rounded-md hover:opacity-90 transition duration-200"
              style={{ backgroundColor: '#0088ce' }}
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <img
            alt="Your Company"
            src={paragonlogo}
            className="h-8 sm:h-10 justify-center mx-auto mb-3 sm:mb-4"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#0088ce' }}>
            Student Registration Form
          </h1>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Verification Error */}
            {validationErrors.emailVerification && (
              <div className="p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.emailVerification}
              </div>
            )}

            {/* Personal Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Name in Bangla <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="BanglaName"
                    value={formData.BanglaName}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.BanglaName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  />
                  <ErrorMessage error={validationErrors.BanglaName} />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Name in English <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="EnglishName"
                    value={formData.EnglishName}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.EnglishName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  />
                  <ErrorMessage error={validationErrors.EnglishName} />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Father's Name (Bangla) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="FatherName"
                    value={formData.FatherName}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.FatherName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  />
                  <ErrorMessage error={validationErrors.FatherName} />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Mother's Name (Bangla) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="MotherName"
                    value={formData.MotherName}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.MotherName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  />
                  <ErrorMessage error={validationErrors.MotherName} />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="DateOfBirth"
                    value={formData.DateOfBirth}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.DateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  />
                  <ErrorMessage error={validationErrors.DateOfBirth} />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.Gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ErrorMessage error={validationErrors.Gender} />
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="flex-1 w-full">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Select Profile Photo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, GIF (Max size: 5MB)
                  </p>
                </div>

                {/* Photo Preview */}
                {photoPreview && (
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Preview</p>
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-green-300 mx-auto">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="ContactNumber"
                    value={formData.ContactNumber}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.ContactNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  />
                  <ErrorMessage error={validationErrors.ContactNumber} />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Guardian Contact Number
                  </label>
                  <input
                    type="tel"
                    name="GuardianContactNumber"
                    value={formData.GuardianContactNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>
                Address Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Present Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="PresentAddress"
                    value={formData.PresentAddress}
                    onChange={handleChange}
                    required
                    rows="3"
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.PresentAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  />
                  <ErrorMessage error={validationErrors.PresentAddress} />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Permanent Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="PermanentAddress"
                    value={formData.PermanentAddress}
                    onChange={handleChange}
                    required
                    rows="3"
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.PermanentAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  />
                  <ErrorMessage error={validationErrors.PermanentAddress} />
                </div>
              </div>
            </div>

            {/* Educational Information - SSC Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>
                Educational Information - SSC
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="SchoolName"
                    value={formData.SchoolName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    SSC Board <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="SSCBoard"
                    value={formData.SSCBoard}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Board</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSC Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="SSCGroup"
                    value={formData.SSCGroup}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Group</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSC Year of Pass <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="SSCYearPass"
                    value={formData.SSCYearPass}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Year</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSC GPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="SSCGPA"
                    value={formData.SSCGPA}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSC Grade <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="SSCGrade"
                    value={formData.SSCGrade}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSC Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="SSCRollNumber"
                    value={formData.SSCRollNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSC Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="SSCRegistrationNumber"
                    value={formData.SSCRegistrationNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  />
                </div>
              </div>
            </div>

            {/* Educational Information - HSC Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Educational Information - HSC
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="CollegeName"
                    value={formData.CollegeName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HSC Board <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="HSCBoard"
                    value={formData.HSCBoard}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Board</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HSC Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="HSCGroup"
                    value={formData.HSCGroup}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Group</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HSC Year of Pass <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="HSCYearPass"
                    value={formData.HSCYearPass}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Year</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HSC GPA
                  </label>
                  <input
                    type="text"
                    name="HSCGPA"
                    value={formData.HSCGPA}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HSC Grade
                  </label>
                  <select
                    name="HSCGrade"
                    value={formData.HSCGrade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HSC Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="HSCRollNumber"
                    value={formData.HSCRollNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HSC Registration Number
                  </label>
                  <input
                    type="text"
                    name="HSCRegistrationNumber"
                    value={formData.HSCRegistrationNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#0088ce' }}
                  />
                </div>
              </div>
            </div>

            {/* Course Selection Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Course Selection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="SelectedCourse"
                    value={formData.SelectedCourse}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.SelectedCourse ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="">Select Course</option>
                    <option value="B Unit">খ ইউনিট (B Unit)</option>
                    <option value="C Unit">গ ইউনিট (C Unit)</option>
                  </select>
                  <ErrorMessage error={validationErrors.SelectedCourse} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="BranchName"
                    value={formData.BranchName}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.BranchName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  >
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                  <ErrorMessage error={validationErrors.BranchName} />
                </div>
              </div>
            </div>

            {/* Login Credentials Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>
                Login Credentials
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      required
                      className={`flex-1 px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                        validationErrors.Email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ focusRingColor: '#0088ce' }}
                      disabled={emailVerification.verified}
                    />
                    {!emailVerification.verified && (
                      <button
                        type="button"
                        onClick={sendVerificationEmail}
                        disabled={emailVerification.loading || !formData.Email}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 whitespace-nowrap"
                      >
                        {emailVerification.loading ? 'Sending...' : emailVerification.sent ? 'Resend' : 'Verify'}
                      </button>
                    )}
                    {emailVerification.verified && (
                      <div className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-md">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs sm:text-sm">Verified</span>
                      </div>
                    )}
                  </div>
                  <ErrorMessage error={validationErrors.Email} />
                  {emailVerification.sent && !emailVerification.verified && (
                    <div className="mt-2">
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                        Enter Verification Code
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{ focusRingColor: '#0088ce' }}
                          maxLength="6"
                        />
                        <button
                          type="button"
                          onClick={verifyEmailCode}
                          disabled={emailVerification.loading || !verificationCode}
                          className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        >
                          {emailVerification.loading ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Check your email for the verification code. It may take a few minutes to arrive.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      validationErrors.Password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ focusRingColor: '#0088ce' }}
                  />
                  <ErrorMessage error={validationErrors.Password} />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5 mt-1">
                <input
                  id="terms"
                  name="TermsAccepted"
                  type="checkbox"
                  checked={formData.TermsAccepted}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                    validationErrors.TermsAccepted ? 'border-red-500' : ''
                  }`}
                />
              </div>
              <div className="text-sm sm:text-base">
                <label htmlFor="terms" className="text-gray-700">
                  I accept the <span className="text-red-500">*</span>{' '}
                  <span style={{ color: '#0088ce' }} className="underline cursor-pointer">
                    terms and conditions
                  </span>
                </label>
                <ErrorMessage error={validationErrors.TermsAccepted} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 px-4 text-sm sm:text-base text-white font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              style={{ backgroundColor: '#0088ce' }}
            >
              {loading ? 'Registering...' : 'Register Student'}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Admission;
