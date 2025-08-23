import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar.jsx';
import Hero from '../Components/Hero.jsx';
import Footer from '../Components/Footer.jsx';

const StudentProfile = () => {
  const { id } = useParams(); // For admin access with student ID
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Admin viewing a specific student profile
      fetchStudentById(id);
    } else {
      // Student viewing their own profile
      loadStudentFromStorage();
    }
  }, [id, navigate]);

  const fetchStudentById = async (studentId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      if (!token || !isAdmin) {
        navigate('/AdminSignIn');
        return;
      }

      const response = await axios.get(`/api/admin/Admin/Student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setStudent(response.data);
      setIsAdminView(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load student data');
      setLoading(false);
    }
  };

  const loadStudentFromStorage = () => {
    // Check if student is logged in with proper JWT token
    const studentData = localStorage.getItem('studentData');
    const studentToken = localStorage.getItem('studentToken');
    const userType = localStorage.getItem('userType');
    
    if (!studentData || !studentToken || userType !== 'student') {
      navigate('/StudentLogin');
      return;
    }

    try {
      const parsedStudent = JSON.parse(studentData);
      setStudent(parsedStudent);
      setIsAdminView(false);
    } catch (error) {
      console.error('Error parsing student data:', error);
      localStorage.removeItem('studentData');
      localStorage.removeItem('studentToken');
      localStorage.removeItem('userType');
      navigate('/StudentLogin');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handlePhotoUpload = async () => {
    if (!selectedPhoto) {
      setError('Please select a photo to upload.');
      return;
    }

    setUploadingPhoto(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('Image', selectedPhoto);
      
      const studentToken = localStorage.getItem('studentToken');

      const response = await fetch(`/api/admin/Student/photo/${student._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${studentToken}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload photo');
      }

      const data = await response.json();
      
      // Update student data in state and localStorage
      const updatedStudent = data.student;
      setStudent(updatedStudent);
      localStorage.setItem('studentData', JSON.stringify(updatedStudent));
      
      setSuccess('Photo updated successfully!');
      setShowPhotoUpload(false);
      setSelectedPhoto(null);
      setPhotoPreview(null);
      
      // Refresh navbar by triggering a re-render
      window.dispatchEvent(new Event('studentPhotoUpdated'));

    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUpdating(true);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setUpdating(false);
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setUpdating(false);
      return;
    }

    try {
      const studentToken = localStorage.getItem('studentToken');
      
      const response = await fetch(`/api/admin/Student/password/${student._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      setSuccess('Password updated successfully! You will be logged out in 3 seconds...');
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);

      // Log out after 3 seconds
      setTimeout(() => {
        localStorage.removeItem('studentData');
        navigate('/StudentLogin');
        window.location.reload(); // Refresh to update navbar
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-b-2 mx-auto" style={{ borderColor: '#0088ce' }}></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0088ce' }}>
              Student Profile
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              {!isAdminView && (
                <>
                  <button
                    onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-white font-medium text-sm sm:text-base rounded-lg hover:opacity-90 transition-all duration-200 min-h-[44px]"
                    style={{ backgroundColor: '#28a745' }}
                  >
                    {showPhotoUpload ? 'Cancel' : 'Update Photo'}
                  </button>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-white font-medium text-sm sm:text-base rounded-lg hover:opacity-90 transition-all duration-200 min-h-[44px]"
                    style={{ backgroundColor: '#0088ce' }}
                  >
                    {showPasswordForm ? 'Cancel' : 'Change Password'}
                  </button>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <div className="flex items-start">
                <span className="text-red-500 mr-2 mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              <div className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✅</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Photo Upload Form */}
          {showPhotoUpload && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Update Profile Photo
              </h2>
              
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                {/* Current Photo */}
                <div className="text-center flex-shrink-0">
                  <p className="text-sm text-gray-600 mb-2">Current Photo</p>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-300 mx-auto">
                    <img
                      src={student.ProfilePicture ? student.ProfilePicture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                      alt="Current Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="flex-1 w-full">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select New Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  {/* Photo Preview */}
                  {photoPreview && (
                    <div className="mb-4 text-center lg:text-left">
                      <p className="text-sm text-gray-600 mb-2">Preview</p>
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-green-300 mx-auto lg:mx-0">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePhotoUpload}
                    disabled={uploadingPhoto || !selectedPhoto}
                    className="w-full py-2 sm:py-3 px-4 text-white font-medium text-sm sm:text-base rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[44px]"
                    style={{ backgroundColor: '#28a745' }}
                  >
                    {uploadingPhoto ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      'Upload Photo'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Password Change Form */}
          {showPasswordForm && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    autoComplete="current-password"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    autoComplete="new-password"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    autoComplete="new-password"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2 sm:py-3 px-4 text-white font-medium text-sm sm:text-base rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[44px]"
                  style={{ backgroundColor: '#0088ce' }}
                >
                  {updating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Student Details (Read-only) */}
          <div className="space-y-6 sm:space-y-8">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bangla Name
                  </label>
                  <input
                    type="text"
                    value={student.BanglaName || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Name
                  </label>
                  <input
                    type="text"
                    value={student.EnglishName || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Name (Bangla)
                  </label>
                  <input
                    type="text"
                    value={student.FatherName || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Name (Bangla)
                  </label>
                  <input
                    type="text"
                    value={student.MotherName || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={student.DateOfBirth ? new Date(student.DateOfBirth).toLocaleDateString() : ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={student.Gender || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={student.ContactNumber || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guardian Contact Number
                  </label>
                  <input
                    type="text"
                    value={student.GuardianContactNumber || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={student.Email || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Address Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Present Address
                  </label>
                  <textarea
                    value={student.PresentAddress || ''}
                    readOnly
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permanent Address
                  </label>
                  <textarea
                    value={student.PermanentAddress || ''}
                    readOnly
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Educational Information - SSC Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Educational Information - SSC
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={student.SchoolName || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SSC Board
                  </label>
                  <input
                    type="text"
                    value={student.SSCBoard || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SSC Group
                  </label>
                  <input
                    type="text"
                    value={student.SSCGroup || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SSC Year of Pass
                  </label>
                  <input
                    type="text"
                    value={student.SSCYearPass || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SSC GPA
                  </label>
                  <input
                    type="text"
                    value={student.SSCGPA || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SSC Grade
                  </label>
                  <input
                    type="text"
                    value={student.SSCGrade || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SSC Roll Number
                  </label>
                  <input
                    type="text"
                    value={student.SSCRollNumber || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SSC Registration Number
                  </label>
                  <input
                    type="text"
                    value={student.SSCRegistrationNumber || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Educational Information - HSC Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Educational Information - HSC
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College Name
                  </label>
                  <input
                    type="text"
                    value={student.CollegeName || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSC Board
                  </label>
                  <input
                    type="text"
                    value={student.HSCBoard || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSC Group
                  </label>
                  <input
                    type="text"
                    value={student.HSCGroup || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSC Year of Pass
                  </label>
                  <input
                    type="text"
                    value={student.HSCYearPass || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSC GPA
                  </label>
                  <input
                    type="text"
                    value={student.HSCGPA || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSC Grade
                  </label>
                  <input
                    type="text"
                    value={student.HSCGrade || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSC Roll Number
                  </label>
                  <input
                    type="text"
                    value={student.HSCRollNumber || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSC Registration Number
                  </label>
                  <input
                    type="text"
                    value={student.HSCRegistrationNumber || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Course Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#0088ce' }}>
                Course Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Course
                  </label>
                  <input
                    type="text"
                    value={student.SelectedCourse || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={student.BranchName || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <input
                    type="text"
                    value={student.Status || ''}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms Accepted
                  </label>
                  <input
                    type="text"
                    value={student.TermsAccepted ? 'Yes' : 'No'}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentProfile;
