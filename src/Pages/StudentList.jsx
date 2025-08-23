import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Spinner from '../Components/Spinner';
import {Link, useNavigate} from 'react-router-dom';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineAddBox , MdOutlineDelete} from 'react-icons/md';
import { ArrowLeft, Search, User } from 'lucide-react';
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx';

const StudentList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check for JWT token
    const token = localStorage.getItem('jwtToken');
    const adminData = localStorage.getItem('admin');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!token || !isAdmin) {
      navigate('/AdminSignIn');
      return;
    }
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
    setLoading(true);
    axios.get(`/api/admin/Admin/Student/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setLoading(false);
      });

    // Cleanup function to avoid memory leaks
    return () => {
      setUsers([]);
      setFilteredUsers([]);
      setLoading(false);
    };
  }, [navigate]);

  // Search functionality
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.EnglishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.BanglaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.ContactNumber.includes(searchTerm) ||
        user.SelectedCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.BranchName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4'>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Link 
                to="/AdminHome"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Student Management</h1>
                {admin && (
                  <p className='text-sm sm:text-lg text-gray-600 mt-1'>
                    Manage all student records and information
                  </p>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center'>
              <div className="relative flex-1 sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Link 
                to='/Admission'
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                <MdOutlineAddBox className='text-lg sm:text-xl mr-2' />
                Add New Student
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className='w-full'>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>No</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Photo</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>English Name</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Bangla Name</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Phone</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Course</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Branch</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>SSC GPA</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>HSC GPA</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(filteredUsers || []).map((user, index) => (
                      <tr key={user._id} className='hover:bg-gray-50 transition-colors'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {index + 1}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                            <img
                              src={user.ProfilePicture ? user.ProfilePicture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {user.EnglishName}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {user.BanglaName}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {user.Email}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {user.ContactNumber}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {user.SelectedCourse}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {user.BranchName}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {user.SSCGPA}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {user.HSCGPA || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.Status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.Status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex space-x-3'>
                            <Link 
                              to={'/StudentProfile/'+user._id}
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="View Details"
                            >
                              <BsInfoCircle className='text-xl' />
                            </Link>
                            <Link 
                              to={'/students/edit/'+user._id}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors"
                              title="Edit Student"
                            >
                              <AiOutlineEdit className='text-xl' />
                            </Link>
                            <Link 
                              to={'/students/delete/'+user._id}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete Student"
                            >
                              <MdOutlineDelete className='text-xl' />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {(filteredUsers || []).map((user, index) => (
                <div key={user._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        <img
                          src={user.ProfilePicture ? user.ProfilePicture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{user.EnglishName}</h3>
                        <p className="text-sm text-gray-600 truncate">{user.BanglaName}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                          user.Status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          #{index + 1} • {user.Status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600 truncate">{user.Email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-600">{user.ContactNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Course:</span>
                      <p className="text-gray-600">{user.SelectedCourse}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Branch:</span>
                      <p className="text-gray-600">{user.BranchName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">SSC GPA:</span>
                      <p className="text-gray-600">{user.SSCGPA}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">HSC GPA:</span>
                      <p className="text-gray-600">{user.HSCGPA || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-3 border-t border-gray-100">
                    <Link 
                      to={'/StudentProfile/'+user._id}
                      className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <BsInfoCircle className='text-lg mr-1' />
                      <span className="text-sm">View</span>
                    </Link>
                    <Link 
                      to={'/students/edit/'+user._id}
                      className="flex items-center px-3 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit Student"
                    >
                      <AiOutlineEdit className='text-lg mr-1' />
                      <span className="text-sm">Edit</span>
                    </Link>
                    <Link 
                      to={'/students/delete/'+user._id}
                      className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Student"
                    >
                      <MdOutlineDelete className='text-lg mr-1' />
                      <span className="text-sm">Delete</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredUsers.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow-lg text-center py-12 px-4">
                {searchTerm ? (
                  <div>
                    <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="text-gray-500 text-lg mb-2">No students found</div>
                    <div className="text-gray-400 text-sm mb-4">
                      No students match your search "{searchTerm}"
                    </div>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div>
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="text-gray-500 text-lg mb-2">No students found</div>
                    <Link 
                      to="/Admission"
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MdOutlineAddBox className="mr-2" />
                      Add First Student
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Search Results Summary */}
            {searchTerm && filteredUsers.length > 0 && (
              <div className="mt-4 px-4 sm:px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-700">
                  Found {filteredUsers.length} student{filteredUsers.length !== 1 ? 's' : ''} matching "{searchTerm}"
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default StudentList;
