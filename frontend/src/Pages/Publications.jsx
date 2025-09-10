import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Components/Spinner';
import Navbar from '../Components/Navbar.jsx';
import Hero from '../Components/Hero.jsx';
import Footer from '../Components/Footer.jsx';

const BACKEND_URL = import.meta.env.VITE_HTTPURLBackend;

const Publications = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ Title: '', Description: '', ImageName: '' });
  const [imageFile, setImageFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      try {
        const res = await fetch(`${BACKEND_URL}/admin/Publication`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
        });
        const contentType = res.headers.get('content-type');
        if (!res.ok) throw new Error('Failed to fetch publications');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setPublications(data);
        } else {
          const text = await res.text();
          throw new Error('Unexpected response: ' + text.slice(0, 100));
        }
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
      let res, updatedPub;
      const form = new FormData();
      form.append('Title', formData.Title);
      form.append('Description', formData.Description);
      if (imageFile) form.append('Image', imageFile);
      if (editId) {
        // Update existing
        res = await fetch(`${BACKEND_URL}/admin/Publication/${editId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) throw new Error('Failed to update publication');
        updatedPub = await res.json();
        setPublications(publications.map(pub => (pub._id === editId ? updatedPub : pub)));
      } else {
        // Create new
        res = await fetch(`${BACKEND_URL}/admin/Publication`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) throw new Error('Failed to create publication');
        const newPub = await res.json();
        setPublications([newPub, ...publications]);
      }
      setShowForm(false);
      setFormData({ Title: '', Description: '', ImageName: '' });
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
      const res = await fetch(`${BACKEND_URL}/admin/Publication/${editId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete publication');
      setPublications(publications.filter(pub => pub._id !== editId));
      setShowForm(false);
      setFormData({ Title: '', Description: '', ImageName: '' });
      setEditId(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCardClick = async (pub) => {
    if (isAdmin) {
      // Admin click - open edit form
      setShowForm(true);
      setEditId(pub._id);
      
      // Create a File object from the existing image to populate the file input
      if (pub.ImageURL) {
        try {
          const response = await fetch(`${BACKEND_URL}/uploads/Publications/${pub.ImageURL.replace(/^.*[\\/]/, '')}`);
          const blob = await response.blob();
          const file = new File([blob], pub.ImageURL.replace(/^.*[\\/]/, ''), { type: blob.type });
          setImageFile(file);
        } catch (error) {
          console.error('Error loading current image:', error);
          setImageFile(null);
        }
      } else {
        setImageFile(null);
      }
      
      setFormData({
        Title: pub.Title,
        Description: pub.Description,
        ImageName: pub.ImageURL ? pub.ImageURL.replace(/^.*[\\/]/, '') : '',
      });
    } else {
      // Regular user click - show popup
      setSelectedPublication(pub);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPublication(null);
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
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 my-4 sm:my-6 lg:my-8'>Publications</h1>
        </div>
        {isAdmin && (
          <button 
            className='px-4 py-2 sm:px-5 sm:py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm sm:text-base font-medium transition-colors duration-200 w-full sm:w-auto' 
            onClick={() => {
              setShowForm(true);
              setFormData({ Title: '', Description: '', ImageName: '' });
              setImageFile(null);
              setEditId(null);
            }}
          >
            Create Publication
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className='w-full max-w-xs sm:max-w-xl lg:max-w-2xl mx-4 sm:mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md mt-4 sm:mt-6 mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800'>{editId ? 'Edit Publication' : 'Create Publication'}</h2>
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
                placeholder='Enter publication title'
              />
            </div>
            <div>
              <label className='block mb-2 font-medium text-sm sm:text-base text-gray-700'>Description</label>
              <textarea 
                name='Description' 
                value={formData.Description} 
                onChange={handleFormChange} 
                required 
                rows="4"
                className='w-full border border-gray-300 px-3 py-2 sm:py-2.5 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical'
                placeholder='Enter publication description'
              />
            </div>
            <div>
              <label className='block mb-2 font-medium text-sm sm:text-base text-gray-700'>Image</label>
              <input 
                type='file' 
                name='Image' 
                accept='image/*' 
                onChange={handleFormChange} 
                {...(!editId ? { required: true } : {})}
                className='w-full border border-gray-300 px-3 py-2 rounded-md text-sm sm:text-base file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
              />
              
              {/* Show image preview */}
              {imageFile && (
                <div className='mt-4 p-3 sm:p-4 border-2 border-blue-200 rounded-lg bg-blue-50'>
                  <p className='text-sm font-medium mb-3 text-blue-800'>Selected Image:</p>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
                    <img 
                      src={URL.createObjectURL(imageFile)}
                      alt='Selected'
                      className='w-20 h-20 sm:w-24 sm:h-24 object-contain border rounded mx-auto sm:mx-0'
                    />
                    <div className='text-center sm:text-left'>
                      <p className='text-sm font-medium text-gray-700 break-all'>{imageFile.name}</p>
                      <p className='text-xs text-gray-500'>File size: {(imageFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
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
                onClick={() => { setShowForm(false); setEditId(null); setImageFile(null); }} 
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
        <div className='text-center my-8 px-4'>
          <div className='text-red-600 text-sm sm:text-base bg-red-50 p-4 rounded-lg border border-red-200 max-w-md mx-auto'>
            Error: {error}
          </div>
        </div>
      ) : (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
            {publications.length === 0 ? (
              <div className='col-span-full text-center text-gray-500 py-12'>
                <div className='text-4xl sm:text-5xl mb-4'>📚</div>
                <p className='text-base sm:text-lg'>No publications found.</p>
              </div>
            ) : (
              publications.map(pub => (
                <div
                  key={pub._id || pub.id}
                  className='border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden'
                  onClick={() => handleCardClick(pub)}
                >
                  <div className='aspect-[3/4] overflow-hidden'>
                    <img
                      src={
                        pub.ImageURL
                          ? pub.ImageURL.startsWith('http')
                            ? pub.ImageURL
                            : `${BACKEND_URL}/uploads/publications/${pub.ImageURL}`
                          : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxMzAiIHk9IjE4MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGRkZGIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgo8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik00IDJBMiAyIDAgMCAwIDIgNHYxNmEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0ySDR6Ii8+CjxwYXRoIGZpbGw9IiM5Q0EzQUYiIGQ9Ik02IDhoMTJ2Mkg2VjhaLTIgMTJoMTJ2Mkg2VjEyWi0yIDEyaDJ2Mkg2VjEyWm02IDBINnYySDE2SDE2VjEyWm0tNiAwaDJWMkg2VjEyeiIvPgo8L3N2Zz4KPC9zdmc+'}
                      alt={pub.Title || 'Publication Image'}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      onError={e => { 
                        e.target.onerror = null; 
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxMzAiIHk9IjE4MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGRkZGIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgo8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik00IDJBMiAyIDAgMCAwIDIgNHYxNmEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0ySDR6Ii8+CjxwYXRoIGZpbGw9IiM5Q0EzQUYiIGQ9Ik02IDhoMTJ2Mkg2VjhaLTIgMTJoMTJ2Mkg2VjEyWi0yIDEyaDJ2Mkg2VjEyWm02IDBINnYySDE2SDE2VjEyWm0tNiAwaDJWMkg2VjEyeiIvPgo8L3N2Zz4KPC9zdmc+'; 
                      }}
                    />
                  </div>
                  <div className='p-3 sm:p-4'>
                    <h3 className='text-sm sm:text-base lg:text-lg font-semibold mb-2 text-gray-800 line-clamp-2 leading-tight'>{pub.Title}</h3>
                    <p className='text-xs sm:text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-300'>
                      {isAdmin ? 'Click to edit' : 'Click to view details'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <Footer />
      {/* Publication Details Popup */}
      {showPopup && selectedPublication && (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg max-w-xs sm:max-w-md lg:max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border'>
            <div className='flex justify-between items-center p-4 sm:p-6 border-b bg-gray-50'>
              <h2 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 pr-4 leading-tight'>{selectedPublication.Title}</h2>
              <button
                onClick={closePopup}
                className='text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl font-bold hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 transition-colors duration-200'
              >
                ×
              </button>
            </div>
            
            <div className='p-4 sm:p-6 overflow-y-auto max-h-[60vh]'>
              {selectedPublication.ImageURL && (
                <div className='mb-4 sm:mb-6'>
                  <img
                    src={
                      selectedPublication.ImageURL
                        ? selectedPublication.ImageURL.startsWith('http')
                          ? selectedPublication.ImageURL
                          : `${BACKEND_URL}/uploads/publications/${selectedPublication.ImageURL}`
                        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxMzAiIHk9IjE4MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGRkZGIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgo8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik00IDJBMiAyIDAgMCAwIDIgNHYxNmEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0ySDR6Ii8+CjxwYXRoIGZpbGw9IiM5Q0EzQUYiIGQ9Ik02IDhoMTJ2Mkg2VjhaLTIgMTJoMTJ2Mkg2VjEyWi0yIDEyaDJ2Mkg2VjEyWm02IDBINnYySDE2SDE2VjEyWm0tNiAwaDJWMkg2VjEyeiIvPgo8L3N2Zz4KPC9zdmc+'}
                    alt={selectedPublication.Title}
                    className='w-full max-w-md mx-auto rounded-lg shadow-md'
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxMzAiIHk9IjE4MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGRkZGIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgo8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik00IDJBMiAyIDAgMCAwIDIgNHYxNmEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0ySDR6Ii8+CjxwYXRoIGZpbGw9IiM5Q0EzQUYiIGQ9Ik02IDhoMTJ2Mkg2VjhaLTIgMTJoMTJ2Mkg2VjEyWi0yIDEyaDJ2Mkg2VjEyWm02IDBINnYySDE2SDE2VjEyWm0tNiAwaDJWMkg2VjEyeiIvPgo8L3N2Zz4KPC9zdmc+';
                    }}
                  />
                </div>
              )}
              <div>
                <h3 className='text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800'>Description</h3>
                <p className='text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line'>
                  {selectedPublication.Description}
                </p>
              </div>
            </div>
            
            <div className='flex justify-end p-4 sm:p-6 border-t bg-gray-50'>
              <button
                onClick={closePopup}
                className='px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Publications
