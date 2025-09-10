import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import Navbar from '../Components/Navbar.jsx';
import Hero from '../Components/Hero.jsx';
import Footer from '../Components/Footer.jsx';

const BACKEND_URL = import.meta.env.VITE_HTTPURLBackend;

const Notices = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ Title: '', Description: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotices, setTotalNotices] = useState(0);
  const [allNotices, setAllNotices] = useState([]);
  const noticesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      try {
        const res = await fetch(`${BACKEND_URL}/admin/Notice`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
        });
        if (!res.ok) throw new Error('Failed to fetch notices');
        const data = await res.json();
        // Sort notices by creation date (newest first)
        const sortedNotices = data
          .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
        
        setAllNotices(sortedNotices);
        setTotalNotices(sortedNotices.length);
        
        // Set current page notices
        const startIndex = (currentPage - 1) * noticesPerPage;
        const endIndex = startIndex + noticesPerPage;
        setNotices(sortedNotices.slice(startIndex, endIndex));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setPdfFile(files[0]);
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
      let res, updatedNotice;
      const form = new FormData();
      form.append('Title', formData.Title);
      form.append('Description', formData.Description);
      if (pdfFile) form.append('PDF', pdfFile);
      
      if (editId) {
        // Update existing
        res = await fetch(`${BACKEND_URL}/admin/Notice/${editId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) throw new Error('Failed to update notice');
        updatedNotice = await res.json();
        // Update the notice in allNotices and re-sort
        const updatedAllNotices = allNotices.map(n => (n._id === editId ? updatedNotice : n))
          .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
        setAllNotices(updatedAllNotices);
        setTotalNotices(updatedAllNotices.length);
        
        // Update current page
        const startIndex = (currentPage - 1) * noticesPerPage;
        const endIndex = startIndex + noticesPerPage;
        setNotices(updatedAllNotices.slice(startIndex, endIndex));
      } else {
        // Create new
        res = await fetch(`${BACKEND_URL}/admin/Notice`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) throw new Error('Failed to create notice');
        const newNotice = await res.json();
        // Add new notice at the beginning
        const updatedAllNotices = [newNotice, ...allNotices];
        setAllNotices(updatedAllNotices);
        setTotalNotices(updatedAllNotices.length);
        
        // Reset to first page to show the new notice
        setCurrentPage(1);
        setNotices(updatedAllNotices.slice(0, noticesPerPage));
      }
      setShowForm(false);
      setFormData({ Title: '', Description: '' });
      setPdfFile(null);
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
      const res = await fetch(`${BACKEND_URL}/admin/Notice/${editId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete notice');
      const updatedAllNotices = allNotices.filter(n => n._id !== editId);
      setAllNotices(updatedAllNotices);
      setTotalNotices(updatedAllNotices.length);
      
      // Update current page notices
      const startIndex = (currentPage - 1) * noticesPerPage;
      const endIndex = startIndex + noticesPerPage;
      const currentPageNotices = updatedAllNotices.slice(startIndex, endIndex);
      
      // If current page is empty and not the first page, go to previous page
      if (currentPageNotices.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setNotices(currentPageNotices);
      }
      
      setShowForm(false);
      setFormData({ Title: '', Description: '' });
      setEditId(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className='bg-blue-50 min-h-screen'>
      <Navbar />
      <Hero />
      <div className='flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 mb-4 sm:mb-6 px-4'>
        <button 
          onClick={() => navigate(-1)}
          className='px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base font-medium transition-colors duration-200 w-full sm:w-auto justify-center'
        >
          ← Back
        </button>
        <div className='text-center flex-1'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 my-4 sm:my-6 lg:my-8'>Notices</h1>
          <p className='text-xs sm:text-sm text-gray-600 -mt-2 sm:-mt-4 lg:-mt-6 mb-2 sm:mb-4'>
            {totalNotices > 0 ? `Showing ${((currentPage - 1) * noticesPerPage) + 1}-${Math.min(currentPage * noticesPerPage, totalNotices)} of ${totalNotices}` : 'No notices found'}
          </p>
        </div>
        {isAdmin && (
          <button 
            className='px-4 py-2 sm:px-5 sm:py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm sm:text-base font-medium transition-colors duration-200 w-full sm:w-auto' 
            onClick={() => {
              setShowForm(true);
              setFormData({ Title: '', Description: '' });
              setPdfFile(null);
              setEditId(null);
            }}
          >
            Create Notice
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className='w-full max-w-xs sm:max-w-lg lg:max-w-2xl mx-4 sm:mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800'>{editId ? 'Edit Notice' : 'Create Notice'}</h2>
          <form onSubmit={handleFormSubmit} className='space-y-4 sm:space-y-6'>
            <div>
              <label className='block mb-2 font-medium text-sm sm:text-base text-gray-700'>Title</label>
              <input 
                type='text' 
                name='Title' 
                value={formData.Title} 
                onChange={handleFormChange} 
                required 
                className='w-full border border-gray-300 px-3 py-2 sm:py-2.5 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                placeholder='Enter notice title'
              />
            </div>
            <div>
              <label className='block mb-2 font-medium text-sm sm:text-base text-gray-700'>Description</label>
              <textarea 
                name='Description' 
                value={formData.Description} 
                onChange={handleFormChange} 
                required 
                rows="3"
                className='w-full border border-gray-300 px-3 py-2 sm:py-2.5 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical'
                placeholder='Enter notice description'
              />
            </div>
            <div>
              <label className='block mb-2 font-medium text-sm sm:text-base text-gray-700'>PDF File</label>
              <input 
                type='file' 
                name='PDF' 
                accept='application/pdf' 
                onChange={handleFormChange} 
                className='w-full border border-gray-300 px-3 py-2 rounded-md text-sm sm:text-base file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100' 
                required={!editId} 
              />
              {pdfFile && (
                <div className='mt-2 text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded'>
                  Selected: {pdfFile.name}
                </div>
              )}
            </div>
            {formError && <div className='text-red-600 text-sm sm:text-base bg-red-50 p-3 rounded-md border border-red-200'>{formError}</div>}
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4'>
              <button 
                type='submit' 
                disabled={formLoading} 
                className='px-4 py-2 sm:px-5 sm:py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 text-sm sm:text-base font-medium transition-colors duration-200 flex-1 sm:flex-none'
              >
                {formLoading ? (editId ? 'Updating...' : 'Submitting...') : (editId ? 'Update' : 'Submit')}
              </button>
              {editId && (
                <button 
                  type='button' 
                  onClick={handleDelete} 
                  className='px-4 py-2 sm:px-5 sm:py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm sm:text-base font-medium transition-colors duration-200 flex-1 sm:flex-none'
                >
                  Delete
                </button>
              )}
              <button 
                type='button' 
                onClick={() => { setShowForm(false); setEditId(null); setPdfFile(null); }} 
                className='px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 text-sm sm:text-base font-medium transition-colors duration-200 flex-1 sm:flex-none'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className='text-red-600 text-center my-8'>Error: {error}</div>
      ) : (
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8'>
          {notices.length === 0 ? (
            <div className='text-center text-gray-500 py-8 sm:py-12'>
              <div className='text-4xl sm:text-5xl mb-4'>📄</div>
              <p className='text-base sm:text-lg'>No notices found.</p>
            </div>
          ) : (
            <div className='space-y-3 sm:space-y-4'>
              {notices.map(notice => (
                <div
                  key={notice._id || notice.id}
                  className={`border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 ${isAdmin ? 'cursor-pointer hover:border-blue-300' : ''}`}
                  onClick={isAdmin ? () => {
                    setShowForm(true);
                    setEditId(notice._id);
                    setFormData({
                      Title: notice.Title || '',
                      Description: notice.Description || '',
                    });
                  } : undefined}
                >
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div className='flex-1 min-w-0 w-full sm:w-auto'>
                      <div className='flex items-start sm:items-center gap-3 sm:gap-4'>
                        <div className='text-red-600 text-xl sm:text-2xl flex-shrink-0 mt-1 sm:mt-0'>📄</div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight'>{notice.Title}</h3>
                          <p className='text-gray-600 text-sm sm:text-base leading-relaxed'>
                            <span className='block sm:hidden'>
                              {notice.Description.length > 80 
                                ? `${notice.Description.substring(0, 80)}...` 
                                : notice.Description}
                            </span>
                            <span className='hidden sm:block'>
                              {notice.Description.length > 150 
                                ? `${notice.Description.substring(0, 150)}...` 
                                : notice.Description}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {notice.PDFURL && (
                      <div className='w-full sm:w-auto sm:ml-4 sm:flex-shrink-0'>
                        <a 
                          href={`${BACKEND_URL}/uploads/notices/${notice.PDFURL}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className='block w-full sm:w-auto bg-sky-500 text-white py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base font-medium text-center'
                          onClick={(e) => e.stopPropagation()}
                        >
                          View PDF
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Pagination Controls */}
      {totalNotices > noticesPerPage && (
        <div className='flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8 mb-6 sm:mb-8 gap-3 sm:gap-2 px-4'>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors duration-200 w-full sm:w-auto ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 order-last sm:order-none mt-2 sm:mt-0'>
            {Array.from({ length: Math.ceil(totalNotices / noticesPerPage) }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors duration-200 ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalNotices / noticesPerPage)}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors duration-200 w-full sm:w-auto ${
              currentPage === Math.ceil(totalNotices / noticesPerPage)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default Notices;
