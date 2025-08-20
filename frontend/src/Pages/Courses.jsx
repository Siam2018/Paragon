
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import Navbar from '../Components/Navbar.jsx';
import Hero from '../Components/Hero.jsx';
import Footer from '../Components/Footer.jsx';



const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    Title: '', 
    Description: '', 
    ImageName: '', 
    regularClass: '', 
    classTest: '', 
    WeeklyReviewTest: '', 
    MonthlyTest: '', 
    ExclusiveTest: '', 
    modelTest: '', 
    price: '' 
  });
  const [imageFile, setImageFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [editId, setEditId] = useState(null);

  // Function to get specific icon based on course title
  const getCourseIcon = (courseTitle) => {
    if (courseTitle && courseTitle.includes("খ ইউনিট")) {
      return "💼";
    } else if (courseTitle && courseTitle.includes("গ ইউনিট")) {
      return "📖";
    } else if (courseTitle && courseTitle.includes("সাধারণ জ্ঞান")) {
      return "🧠";
    }
    return "📚";
  };

  // Function to handle course navigation
  const handleCourseNavigation = (courseTitle) => {
    if (courseTitle && courseTitle.includes("খ ইউনিট")) {
      // Navigate to খ ইউনিট page
      navigate('/BUnit');
    } else if (courseTitle && courseTitle.includes("গ ইউনিট")) {
      // Navigate to গ ইউনিট page
      navigate('/CUnit');
    } else if (courseTitle && courseTitle.includes("সাধারণ জ্ঞান")) {
      // Navigate to admission page
      navigate('/Admission');
    } else {
      // Default fallback - go to admission page
      navigate('/Admission');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      try {
  const res = await fetch(`/api/course`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
        });
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setImageFile(files[0]);
      setFormData({ ...formData, ImageName: files[0]?.name || '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem('jwtToken');
    try {
      let res, updatedCourse;
      const form = new FormData();
      form.append('Title', formData.Title);
      form.append('Description', formData.Description);
      form.append('regularClass', formData.regularClass);
      form.append('classTest', formData.classTest);
      form.append('WeeklyReviewTest', formData.WeeklyReviewTest);
      form.append('MonthlyTest', formData.MonthlyTest);
      form.append('ExclusiveTest', formData.ExclusiveTest);
      form.append('modelTest', formData.modelTest);
      form.append('price', formData.price);
      if (imageFile) form.append('Image', imageFile);
      if (editId) {
        // Update existing
  res = await fetch(`/api/course/${editId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) throw new Error('Failed to update course');
        updatedCourse = await res.json();
        setCourses(courses.map(c => (c._id === editId ? updatedCourse : c)));
      } else {
        // Create new
  res = await fetch(`/api/course`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) throw new Error('Failed to create course');
        const newCourse = await res.json();
        setCourses([newCourse, ...courses]);
      }
      setShowForm(false);
      setFormData({ 
        Title: '', 
        Description: '', 
        ImageName: '', 
        regularClass: '', 
        classTest: '', 
        WeeklyReviewTest: '', 
        MonthlyTest: '', 
        ExclusiveTest: '', 
        modelTest: '', 
        price: '' 
      });
      setImageFile(null);
      setEditId(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editId) return;
    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem('jwtToken');
    try {
  const res = await fetch(`/api/course/${editId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete course');
      setCourses(courses.filter(c => c._id !== editId));
      setShowForm(false);
      setFormData({ Title: '', Description: '', ImageName: '' });
      setEditId(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <Navbar />
      <Hero />
      
      {/* Header Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <div className='relative mb-6 sm:mb-8'>
          {/* Back Button - Positioned absolutely to the left on larger screens, stacked on mobile */}
          <div className='flex flex-col space-y-4 sm:space-y-0 sm:relative'>
            <button 
              onClick={() => navigate(-1)}
              className='sm:absolute sm:left-0 sm:top-1/2 sm:transform sm:-translate-y-1/2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base w-full sm:w-auto'
            >
              ← Back
            </button>
            
            {/* Centered Title Section */}
            <div className='text-center sm:px-24'>
              <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800'>আমাদের সকল কোর্স</h1>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <p className='text-sm sm:text-base lg:text-lg text-gray-600'>প্যারাগন কোচিং সেন্টারের সম্পূর্ণ কোর্স</p>
              </div>
            </div>

            {/* Admin Create Button - Positioned absolutely to the right on larger screens, full width on mobile */}
            {isAdmin && (
              <button 
                className='sm:absolute sm:right-0 sm:top-1/2 sm:transform sm:-translate-y-1/2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto' 
                onClick={() => {
                  setShowForm(true);
                  setFormData({ 
                    Title: '', 
                    Description: '', 
                    ImageName: '', 
                    regularClass: '', 
                    classTest: '', 
                    WeeklyReviewTest: '', 
                    MonthlyTest: '', 
                    ExclusiveTest: '', 
                    modelTest: '', 
                    price: '' 
                  });
                  setEditId(null);
                }}
              >
                <span>📚</span>
                + Create Course
              </button>
            )}
          </div>
        </div>
      </div>

      {isAdmin && showForm && (
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8'>
          <div className='bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8'>
            <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center'>
              {editId ? 'কোর্স সম্পাদনা করুন' : 'নতুন কোর্স তৈরি করুন'}
            </h2>
            <form onSubmit={handleFormSubmit} className='space-y-4 sm:space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>কোর্সের নাম</label>
                  <input 
                    type='text' 
                    name='Title' 
                    value={formData.Title} 
                    onChange={handleFormChange} 
                    required 
                    className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base'
                    placeholder='কোর্সের নাম লিখুন'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>মূল্য (টাকা)</label>
                  <input 
                    type='number' 
                    name='price' 
                    value={formData.price} 
                    onChange={handleFormChange} 
                    className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base' 
                    placeholder='৫০০০' 
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>কোর্স বিবরণ</label>
                <textarea 
                  name='Description' 
                  value={formData.Description} 
                  onChange={handleFormChange} 
                  required 
                  rows={4}
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base'
                  placeholder='কোর্স সম্পর্কে বিস্তারিত তথ্য লিখুন'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>কোর্সের ছবি</label>
                <input 
                  type='file' 
                  name='Image' 
                  onChange={handleFormChange} 
                  accept="image/*" 
                  required={!editId} 
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base'
                />
                {imageFile && (
                  <div className='mt-4 flex justify-center'>
                    <img src={URL.createObjectURL(imageFile)} alt='Preview' className='w-32 sm:w-48 h-20 sm:h-32 object-cover rounded-lg border-2 border-gray-200'/>
                  </div>
                )}
              </div>

              <div className='bg-gray-50 rounded-xl p-4 sm:p-6'>
                <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4'>কোর্সের বিস্তারিত তথ্য</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>নিয়মিত ক্লাস</label>
                    <input 
                      type='number' 
                      name='regularClass' 
                      value={formData.regularClass} 
                      onChange={handleFormChange} 
                      className='w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm' 
                      placeholder='৩০' 
                      min="0"
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>ক্লাস টেস্ট</label>
                    <input 
                      type='number' 
                      name='classTest' 
                      value={formData.classTest} 
                      onChange={handleFormChange} 
                      className='w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm' 
                      placeholder='১০' 
                      min="0"
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>সাপ্তাহিক পরীক্ষা</label>
                    <input 
                      type='number' 
                      name='WeeklyReviewTest' 
                      value={formData.WeeklyReviewTest} 
                      onChange={handleFormChange} 
                      className='w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm' 
                      placeholder='৫' 
                      min="0"
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>মাসিক পরীক্ষা</label>
                    <input 
                      type='number' 
                      name='MonthlyTest' 
                      value={formData.MonthlyTest} 
                      onChange={handleFormChange} 
                      className='w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm' 
                      placeholder='২' 
                      min="0"
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>বিশেষ পরীক্ষা</label>
                    <input 
                      type='number' 
                      name='ExclusiveTest' 
                      value={formData.ExclusiveTest} 
                      onChange={handleFormChange} 
                      className='w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm' 
                      placeholder='৩' 
                      min="0"
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>মডেল টেস্ট</label>
                    <input 
                      type='number' 
                      name='modelTest' 
                      value={formData.modelTest} 
                      onChange={handleFormChange} 
                      className='w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm' 
                      placeholder='৪' 
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <div className='bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm'>
                  {formError}
                </div>
              )}
              
              <div className='flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center'>
                <button 
                  type='submit' 
                  disabled={formLoading} 
                  className='px-6 sm:px-8 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold text-sm sm:text-base'
                >
                  {formLoading ? (editId ? 'আপডেট হচ্ছে...' : 'তৈরি হচ্ছে...') : (editId ? 'আপডেট করুন' : 'তৈরি করুন')}
                </button>
                {editId && (
                  <button 
                    type='button' 
                    onClick={handleDelete} 
                    disabled={formLoading}
                    className='px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold text-sm sm:text-base'
                  >
                    {formLoading ? 'মুছে ফেলা হচ্ছে...' : 'মুছে ফেলুন'}
                  </button>
                )}
                <button 
                  type='button' 
                  onClick={() => { setShowForm(false); setEditId(null); setImageFile(null); }} 
                  className='px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold text-sm sm:text-base'
                >
                  বাতিল করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
          <div className='text-center'>
            <Spinner />
            <p className='text-base sm:text-lg text-gray-600 mt-4'>কোর্স তথ্য লোড হচ্ছে...</p>
          </div>
        </div>
      ) : error ? (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
          <div className='text-center'>
            <div className='text-base sm:text-lg text-red-600'>Error: {error}</div>
          </div>
        </div>
      ) : (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            {courses.length === 0 ? (
              <div className='col-span-full text-center py-12 sm:py-16'>
                <div className='text-gray-500 text-base sm:text-lg'>কোন কোর্স পাওয়া যায়নি।</div>
                {isAdmin && (
                  <button 
                    onClick={() => {
                      setShowForm(true);
                      setFormData({ 
                        Title: '', 
                        Description: '', 
                        ImageName: '', 
                        regularClass: '', 
                        classTest: '', 
                        WeeklyReviewTest: '', 
                        MonthlyTest: '', 
                        ExclusiveTest: '', 
                        modelTest: '', 
                        price: '' 
                      });
                      setEditId(null);
                    }}
                    className='mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base'
                  >
                    কোর্স তৈরি করুন
                  </button>
                )}
              </div>
            ) : (
              courses.map(course => (
                <div
                  key={course._id || course.id}
                  className='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer'
                  onClick={isAdmin ? () => {
                    setShowForm(true);
                    setEditId(course._id);
                    setFormData({
                      Title: course.Title || '',
                      Description: course.Description || '',
                      ImageName: course.ImageURL ? course.ImageURL.replace(/^.*[\\/]/, '') : '',
                      regularClass: course.RegularClass || '',
                      classTest: course.ClassTest || '',
                      WeeklyReviewTest: course.WeeklyReviewTest || '',
                      MonthlyTest: course.MonthlyTest || '',
                      ExclusiveTest: course.ExclusiveTest || '',
                      modelTest: course.ModelTest || '',
                      price: course.Price || ''
                    });
                  } : undefined}
                >
                  {/* Course Header */}
                  <div className='bg-gradient-to-r from-blue-100 to-purple-100 px-4 sm:px-6 py-3 sm:py-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-2xl sm:text-3xl lg:text-4xl'>{getCourseIcon(course.Title)}</span>
                      </div>
                      {course.Price > 0 && (
                        <span className='bg-blue-400 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center gap-1'>
                          <span>💰</span>
                          ৳{course.Price}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Course Image */}
                  <div className='relative'>
                    <img
                      src={course.ImageURL ? `${BACKEND_URL}/uploads/courses/${course.ImageURL.replace(/^.*[\\/]/, '')}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xODUgMTIwSDIxNVYxMzBIMTg1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyBmaWxsPSIjOUNBM0FGIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIGNsYXNzPSJ3LTYgaC02Ij4KICA8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0yMS4xMjEgMy4yMTMgMi44MjggMi44MjdMNiAyNC4wM2wtNC4wMy0uMDM5IDIuODI4LTIuODI4TDIxLjEyMSAzLjIxM1oiLz4KICA8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0xOSAxMS0xNSAxNSIvPgo8L3N2Zz4KPC9zdmc+'}
                      alt={course.Title || 'Course Image'}
                      className='w-full h-40 sm:h-48 object-cover'
                      onError={e => { 
                        e.target.onerror = null; 
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxODAiIHk9IjEwMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGRkZGIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0yLjI1IDMuNzVhLjc1Ljc1IDAgMCAwLS43NS43NXYxNi41YS43NS43NSAwIDAgMCAuNzUuNzVoMTkuNWEuNzUuNzUgMCAwIDAgLjc1LS43NVY0LjVhLjc1Ljc1IDAgMCAwLS43NS0uNzVIOC4yNUw2IDIuMjVIMi4yNVoiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4='; 
                      }}
                    />
                    {isAdmin && (
                      <div className='absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs'>
                        Admin
                      </div>
                    )}
                  </div>
                  
                  {/* Course Content */}
                  <div className='p-4 sm:p-6'>
                    <div className='flex items-center gap-2 mb-3'>
                      <span className='text-lg sm:text-xl'>{getCourseIcon(course.Title)}</span>
                      <h3 className='text-base sm:text-lg lg:text-xl font-bold text-gray-800 leading-tight'>{course.Title}</h3>
                    </div>
                    
                    
                    {/* Course Details */}
                    {(course.RegularClass || course.ClassTest || course.WeeklyReviewTest || course.MonthlyTest || course.ExclusiveTest || course.ModelTest) && (
                      <div className='space-y-2 mb-4 sm:mb-6'>
                        {course.RegularClass > 0 && (
                          <div className='flex justify-between items-center text-xs sm:text-sm'>
                            <span className='text-gray-600 flex items-center gap-1 sm:gap-2'>
                              <span className='text-blue-500'>📅</span>
                              নিয়মিত ক্লাস:
                            </span>
                            <span className='font-semibold text-gray-800'>{course.RegularClass}টি</span>
                          </div>
                        )}
                        {course.ClassTest > 0 && (
                          <div className='flex justify-between items-center text-xs sm:text-sm'>
                            <span className='text-gray-600 flex items-center gap-1 sm:gap-2'>
                              <span className='text-green-500'>📝</span>
                              ক্লাস টেস্ট:
                            </span>
                            <span className='font-semibold text-gray-800'>{course.ClassTest}টি</span>
                          </div>
                        )}
                        {course.WeeklyReviewTest > 0 && (
                          <div className='flex justify-between items-center text-xs sm:text-sm'>
                            <span className='text-gray-600 flex items-center gap-1 sm:gap-2'>
                              <span className='text-purple-500'>📊</span>
                              সাপ্তাহিক পরীক্ষা:
                            </span>
                            <span className='font-semibold text-gray-800'>{course.WeeklyReviewTest}টি</span>
                          </div>
                        )}
                        {course.MonthlyTest > 0 && (
                          <div className='flex justify-between items-center text-xs sm:text-sm'>
                            <span className='text-gray-600 flex items-center gap-1 sm:gap-2'>
                              <span className='text-orange-500'>📋</span>
                              মাসিক পরীক্ষা:
                            </span>
                            <span className='font-semibold text-gray-800'>{course.MonthlyTest}টি</span>
                          </div>
                        )}
                        {course.ExclusiveTest > 0 && (
                          <div className='flex justify-between items-center text-xs sm:text-sm'>
                            <span className='text-gray-600 flex items-center gap-1 sm:gap-2'>
                              <span className='text-red-500'>⭐</span>
                              বিশেষ পরীক্ষা:
                            </span>
                            <span className='font-semibold text-gray-800'>{course.ExclusiveTest}টি</span>
                          </div>
                        )}
                        {course.ModelTest > 0 && (
                          <div className='flex justify-between items-center text-xs sm:text-sm'>
                            <span className='text-gray-600 flex items-center gap-1 sm:gap-2'>
                              <span className='text-indigo-500'>🎯</span>
                              মডেল টেস্ট:
                            </span>
                            <span className='font-semibold text-gray-800'>{course.ModelTest}টি</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <button 
                      className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base'
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAdmin) {
                          // Admin edit functionality
                          setShowForm(true);
                          setEditId(course._id);
                          setFormData({
                            Title: course.Title || '',
                            Description: course.Description || '',
                            ImageName: course.ImageURL ? course.ImageURL.replace(/^.*[\\/]/, '') : '',
                            regularClass: course.RegularClass || '',
                            classTest: course.ClassTest || '',
                            WeeklyReviewTest: course.WeeklyReviewTest || '',
                            MonthlyTest: course.MonthlyTest || '',
                            ExclusiveTest: course.ExclusiveTest || '',
                            modelTest: course.ModelTest || '',
                            price: course.Price || ''
                          });
                        } else {
                          // Regular user navigation
                          handleCourseNavigation(course.Title);
                        }
                      }}
                    >
                      {isAdmin ? 'সম্পাদনা করুন' : 'ভর্তি হন'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Courses
