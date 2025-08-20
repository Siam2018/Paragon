import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import axios from 'axios';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import Spinner from '../Components/Spinner.jsx';



const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
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
    Status: 'Active'
  });

  useEffect(() => {
    // Check for JWT token
    const token = localStorage.getItem('jwtToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!token || !isAdmin) {
      navigate('/AdminSignIn');
      return;
    }

    // Fetch student data
    fetchStudentData();
  }, [id, navigate]);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
  const response = await axios.get(`/api/admin/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const student = response.data;
      
      // Format date for input field
      const formattedDate = student.DateOfBirth 
        ? new Date(student.DateOfBirth).toISOString().split('T')[0] 
        : '';
      
      setFormData({
        ...student,
        DateOfBirth: formattedDate
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load student data');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('jwtToken');
  await axios.put(`/api/admin/student/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/StudentList');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-8 sm:py-12 px-4">
          <Spinner />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <div className="mb-4 sm:mb-6">
              <svg className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-green-600">
              Student Updated Successfully!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              The student information has been updated successfully.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/StudentList"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Back to Student List
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Student</h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">
                Update student information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-600">
            Student Information
          </h2>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-600">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Name in Bangla
                  </label>
                  <input
                    type="text"
                    name="BanglaName"
                    value={formData.BanglaName}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Name in English
                  </label>
                  <input
                    type="text"
                    name="EnglishName"
                    value={formData.EnglishName}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    name="FatherName"
                    value={formData.FatherName}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    name="MotherName"
                    value={formData.MotherName}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="DateOfBirth"
                    value={formData.DateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-600">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="ContactNumber"
                    value={formData.ContactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Guardian Contact Number
                  </label>
                  <input
                    type="tel"
                    name="GuardianContactNumber"
                    value={formData.GuardianContactNumber}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-600">
                Course Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Selected Course
                  </label>
                  <input
                    type="text"
                    name="SelectedCourse"
                    value={formData.SelectedCourse}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="BranchName"
                    value={formData.BranchName}
                    onChange={handleChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <Save className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              <Link
                to="/StudentList"
                className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm sm:text-base"
              >
                <X className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditStudent;
