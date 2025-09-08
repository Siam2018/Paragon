import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import paragonlogo from '../assets/ParagonLogo2-Photoroom2.png';
import { ToastContainer, toast } from 'react-toastify';

// Backend URL from environment variable


const Admission = () => {
  const [formData, setFormData] = useState({
    BanglaName: '',
    EnglishName: '',
    FatherName: '',
    MotherName: '',
    DateOfBirth: '',
    Gender: '',
    ProfilePicture: '',
    ContactNumber: '',
    GuardianContactNumber: '',
    PresentAddress: '',
    PermanentAddress: '',
    SchoolName: '',
    SSCBoard: '',
    SSCGroup: '',
    SSCYearPass: '',
    SSCGPA: '',
    SSCGrade: '',
    SSCRollNumber: '',
    SSCRegistrationNumber: '',
    CollegeName: '',
    HSCBoard: '',
    HSCGroup: '',
    HSCYearPass: '',
    HSCGPA: '',
    HSCGrade: '',
    HSCRollNumber: '',
    HSCRegistrationNumber: '',
    SelectedCourse: '',
    BranchName: '',
    Email: '',
    Password: '',
    TermsAccepted: false
  });
  const navigate = useNavigate();

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [emailVerification, setEmailVerification] = useState({
    verified: false,
    loading: false
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
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
  // Validation logic moved to its own function
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
      // Removed element.focus() so all errors are visible
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
      const response = await fetch(`/api/send-verification-email`, {
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
        loading: false,
        verified: true // Assume verified after link click
      }));
      toast.success('Verification email sent! Please check your inbox and click the link to verify.', {
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
  // Only browser validation
  navigate('/verify-email', { state: { email: formData.Email } });
  }

  // Error display component
  // ...existing code...

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
            {/* Personal Information Section */}
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Name in Bangla <span style={{color:'red'}}>*</span></label>
                <input type="text" name="BanglaName" value={formData.BanglaName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Name in English <span style={{color:'red'}}>*</span></label>
                <input type="text" name="EnglishName" value={formData.EnglishName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Father's Name <span style={{color:'red'}}>*</span></label>
                <input type="text" name="FatherName" value={formData.FatherName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Mother's Name <span style={{color:'red'}}>*</span></label>
                <input type="text" name="MotherName" value={formData.MotherName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Date of Birth <span style={{color:'red'}}>*</span></label>
                <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Gender <span style={{color:'red'}}>*</span></label>
                <select name="Gender" value={formData.Gender} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Profile Picture <span style={{color:'red'}}>*</span></label>
                <input type="file" accept="image/*" onChange={handlePhotoSelect} required className="block w-full text-xs sm:text-sm text-gray-500" />
              </div>
            </div>
            {/* Contact Information Section */}
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Contact Number <span style={{color:'red'}}>*</span></label>
                <input type="tel" name="ContactNumber" value={formData.ContactNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Guardian Contact Number <span style={{color:'red'}}>*</span></label>
                <input type="tel" name="GuardianContactNumber" value={formData.GuardianContactNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            {/* Address Information Section */}
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>Address Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Present Address <span style={{color:'red'}}>*</span></label>
                <textarea name="PresentAddress" value={formData.PresentAddress} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Permanent Address <span style={{color:'red'}}>*</span></label>
                <textarea name="PermanentAddress" value={formData.PermanentAddress} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            {/* SSC Information Section */}
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>Educational Information - SSC</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">School Name <span style={{color:'red'}}>*</span></label>
                <input type="text" name="SchoolName" value={formData.SchoolName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SSC Board <span style={{color:'red'}}>*</span></label>
                <select name="SSCBoard" value={formData.SSCBoard} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">SSC Group <span style={{color:'red'}}>*</span></label>
                <select name="SSCGroup" value={formData.SSCGroup} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                  <option value="">Select Group</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SSC Year of Pass <span style={{color:'red'}}>*</span></label>
                <select name="SSCYearPass" value={formData.SSCYearPass} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">SSC GPA <span style={{color:'red'}}>*</span></label>
                <input type="text" name="SSCGPA" value={formData.SSCGPA} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SSC Grade <span style={{color:'red'}}>*</span></label>
                <select name="SSCGrade" value={formData.SSCGrade} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">SSC Roll Number <span style={{color:'red'}}>*</span></label>
                <input type="text" name="SSCRollNumber" value={formData.SSCRollNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SSC Registration Number <span style={{color:'red'}}>*</span></label>
                <input type="text" name="SSCRegistrationNumber" value={formData.SSCRegistrationNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            {/* HSC Information Section */}
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>Educational Information - HSC</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College Name <span style={{color:'red'}}>*</span></label>
                <input type="text" name="CollegeName" value={formData.CollegeName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HSC Group <span style={{color:'red'}}>*</span></label>
                <select name="HSCGroup" value={formData.HSCGroup} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                  <option value="">Select Group</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HSC Year of Pass <span style={{color:'red'}}>*</span></label>
                <select name="HSCYearPass" value={formData.HSCYearPass} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">HSC Roll Number <span style={{color:'red'}}>*</span></label>
                <input type="text" name="HSCRollNumber" value={formData.HSCRollNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            {/* Student Account & Course Selection Section */}
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#0088ce' }}>Course Selection & Account</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selected Course <span style={{color:'red'}}>*</span></label>
                <input type="text" name="SelectedCourse" value={formData.SelectedCourse} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name <span style={{color:'red'}}>*</span></label>
                <input type="text" name="BranchName" value={formData.BranchName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span style={{color:'red'}}>*</span></label>
                <input type="email" name="Email" value={formData.Email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span style={{color:'red'}}>*</span></label>
                <input type="password" name="Password" value={formData.Password} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="flex items-center mt-2">
                <input id="terms" name="TermsAccepted" type="checkbox" checked={formData.TermsAccepted} onChange={handleChange} required className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="terms" className="ml-2 text-gray-700">I accept the <span style={{ color: '#0088ce' }} className="underline cursor-pointer">terms and conditions</span> <span style={{color:'red'}}>*</span></label>
              </div>
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150">Submit</button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );

}
export default Admission;
