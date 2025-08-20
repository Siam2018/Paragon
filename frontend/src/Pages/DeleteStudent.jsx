import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import Spinner from '../Components/Spinner.jsx';



const DeleteStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

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
      
      setStudent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load student data');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem('jwtToken');
  await axios.delete(`/api/admin/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Navigate back to student list with success message
      navigate('/StudentList', { 
        state: { 
          message: 'Student deleted successfully',
          type: 'success'
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student');
      setDeleting(false);
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

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Student Not Found</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">The student you're looking for doesn't exist.</p>
            <Link
              to="/StudentList"
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Student List
            </Link>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Delete Student</h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">
                Permanently remove student from system
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Warning Header */}
          <div className="bg-red-50 border-b border-red-200 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-start sm:items-center">
              <AlertTriangle className="w-6 sm:w-8 h-6 sm:h-8 text-red-600 mr-2 sm:mr-3 mt-1 sm:mt-0 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-red-800">Warning: This action cannot be undone</h2>
                <p className="text-red-700 text-xs sm:text-sm mt-1">
                  You are about to permanently delete this student's record and all associated data.
                </p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Student Information</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Profile Picture */}
                <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full overflow-hidden border-4 border-gray-200 flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={student.ProfilePicture ? `${BACKEND_URL}${student.ProfilePicture}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Student Details */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600">English Name</label>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">{student.EnglishName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600">Bangla Name</label>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">{student.BanglaName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm sm:text-base text-gray-900 break-all">{student.Email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm sm:text-base text-gray-900">{student.ContactNumber}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600">Course</label>
                    <p className="text-sm sm:text-base text-gray-900 break-words">{student.SelectedCourse}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600">Branch</label>
                    <p className="text-sm sm:text-base text-gray-900 break-words">{student.BranchName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.Status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.Status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600">Registration Date</label>
                    <p className="text-sm sm:text-base text-gray-900">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {/* Confirmation Section */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Confirm Deletion</h4>
              <p className="text-red-700 text-xs sm:text-sm mb-3 sm:mb-4">
                Please confirm that you want to delete <strong>{student.EnglishName}</strong>'s record. 
                This will permanently remove:
              </p>
              <ul className="text-red-700 text-xs sm:text-sm space-y-1 mb-4 sm:mb-6 ml-4 list-disc">
                <li>All personal and academic information</li>
                <li>Contact details and addresses</li>
                <li>Educational records (SSC/HSC data)</li>
                <li>Course enrollment information</li>
                <li>Profile picture and associated files</li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Trash2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  {deleting ? 'Deleting...' : 'Yes, Delete Student'}
                </button>
                
                <Link
                  to="/StudentList"
                  className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm sm:text-base"
                >
                  <X className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeleteStudent;
