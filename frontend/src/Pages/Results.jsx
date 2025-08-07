
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import Navbar from '../Components/Navbar.jsx';
import Hero from '../Components/Hero.jsx';
import Footer from '../Components/Footer.jsx';

const BACKEND_URL = import.meta.env.VITE_HTTPURLBackend;

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ Title: '', Description: '', ImageName: '' });
  const [imageFile, setImageFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      try {
        const res = await fetch(`${BACKEND_URL}/admin/Result`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
        });
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        setResults(data);
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
      let res, updatedResult;
      const form = new FormData();`r`n      form.append('Title', formData.Title || '');`r`n      form.append('Description', formData.Description || '');`r`n      if (imageFile) form.append('Image', imageFile);`r`n      form.append('Description', formData.Description);`r`n      if (imageFile) form.append('Image', imageFile);
      if (editId) {
        // Update existing
        res = await fetch(`${BACKEND_URL}/admin/Result/${editId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) throw new Error('Failed to update result');
        updatedResult = await res.json();
        setResults(results.map(r => (r._id === editId ? updatedResult : r)));
      } else {
        // Create new
        res = await fetch(`${BACKEND_URL}/admin/Result`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) throw new Error('Failed to create result');
        const newResult = await res.json();
        setResults([newResult, ...results]);
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
      const res = await fetch(`${BACKEND_URL}/admin/Result/${editId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete result');
      setResults(results.filter(r => r._id !== editId));
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
    <div className='bg-blue-50 min-h-screen'>
      <Navbar />
      <Hero />
      <div className='flex flex-col sm:flex-row justify-center items-center gap-y-3 sm:gap-y-4 gap-x-2 sm:gap-x-4 mt-4 mb-4 px-4 sm:px-6'>
        <button 
          onClick={() => navigate(-1)}
          className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]'
        >
          ← Back
        </button>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl my-4 sm:my-6 lg:my-8 text-center w-full font-bold text-gray-800'>Results</h1>
        {isAdmin && (
          <button className='w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base min-h-[44px]' onClick={() => {
            setShowForm(true);
            setFormData({ Title: '', Description: '', ImageName: '' });
            setEditId(null);
          }}>Create Result</button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 sm:static sm:bg-transparent sm:p-0'>
          <div className='w-full max-w-xs sm:max-w-lg mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-lg sm:shadow-md max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left'>{editId ? 'Edit Result' : 'Create Result'}</h2>
            <form onSubmit={handleFormSubmit} className='space-y-4'>
              <div>
                <label className='block mb-2 font-medium text-sm sm:text-base'>Image</label>
                <input 
                  type='file' 
                  name='Image' 
                  accept='image/*' 
                  onChange={handleFormChange} 
                  className='w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  required 
                />
                {imageFile && (
                  <div className='mt-4'>
                    <p className='text-sm font-medium mb-2'>Image Preview:</p>
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt='Preview'
                      className='w-full max-w-xs mx-auto rounded-md border'
                    />
                  </div>
                )}
              </div>
              {formError && <div className='text-red-600 text-sm bg-red-50 p-3 rounded-md'>{formError}</div>}
              <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                <button 
                  type='submit' 
                  disabled={formLoading} 
                  className='flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base min-h-[44px]'
                >
                  {formLoading ? (editId ? 'Updating...' : 'Submitting...') : (editId ? 'Update' : 'Submit')}
                </button>
                {editId && (
                  <button 
                    type='button' 
                    onClick={handleDelete} 
                    disabled={formLoading} 
                    className='flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base min-h-[44px]'
                  >
                    {formLoading ? 'Deleting...' : 'Delete'}
                  </button>
                )}
                <button 
                  type='button' 
                  onClick={() => { setShowForm(false); setEditId(null); setImageFile(null); }} 
                  className='flex-1 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200 text-sm sm:text-base min-h-[44px]'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className='text-red-600 text-center my-8'>Error: {error}</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mx-4 sm:mx-6 lg:mx-8 px-2 sm:px-4 lg:px-[5%] pb-8'>
          {results.length === 0 ? (
            <div className='col-span-full text-center text-gray-500 py-12'>
              <div className='text-4xl sm:text-5xl mb-4'>📊</div>
              <p className='text-lg sm:text-xl mb-2'>No results found</p>
              <p className='text-sm sm:text-base text-gray-400'>Results will appear here when they are uploaded</p>
            </div>
          ) : (
            results.map(result => (
              <div
                key={result._id || result.id}
                className={`border border-gray-200 rounded-lg shadow-sm hover:shadow-md bg-white flex flex-col transition-all duration-200 overflow-hidden ${
                  isAdmin ? 'cursor-pointer hover:border-blue-300 hover:scale-[1.02]' : ''
                }`}
                onClick={isAdmin ? () => {
                  setShowForm(true);
                  setEditId(result._id);
                  setFormData({
                    Title: result.Title,
                    Description: result.Description,
                    ImageName: result.ImageURL ? result.ImageURL.replace(/^.*[\\/]/, '') : '',
                  });
                } : undefined}
              >
                <div className='aspect-[4/3] overflow-hidden'>
                  <img
                    src={result.ImageURL ? `${BACKEND_URL}/uploads/Results/${result.ImageURL.replace(/^.*[\\/]/, '')}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxODAiIHk9IjEwMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGRkZGIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgo8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJhMTAgMTAgMCAwIDAgMTAgMTBBMTAgMTAgMCAwIDAgMTIgMlptMCAxOGE4IDggMCAxIDEgOC04QTggOCAwIDAgMSAxMiAyMFptMS4zLTEyYTEuMyAxLjMgMCAwIDAtMi42IDBjMCAuNy41IDEuMyAxLjMgMS4zaDFWMTZhMSAxIDAgMCAwIDItMXYtNGMwLS43LS42LTEuMy0xLjMtMS4zWm0wIDEwYTEuMyAxLjMgMCAxIDAgMC0yLjZBMS4zIDEuMyAwIDAgMCAxMy4zIDE4WiIvPgo8L3N2Zz4KPC9zdmc+'}
                    alt={result.Title || 'Result Image'}
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                    onError={e => { 
                      e.target.onerror = null; 
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxODAiIHk9IjEwMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGRkZGIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgo8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJhMTAgMTAgMCAwIDAgMTAgMTBBMTAgMTAgMCAwIDAgMTIgMlptMCAxOGE4IDggMCAxIDEgOC04QTggOCAwIDAgMSAxMiAyMFptMS4zLTEyYTEuMyAxLjMgMCAwIDAtMi42IDBjMCAuNy41IDEuMyAxLjMgMS4zaDFWMTZhMSAxIDAgMCAwIDItMXYtNGMwLS43LS42LTEuMy0xLjMtMS4zWm0wIDEwYTEuMyAxLjMgMCAxIDAgMC0yLjZBMS4zIDEuMyAwIDAgMCAxMy4zIDE4WiIvPgo8L3N2Zz4KPC9zdmc+'; 
                    }}
                  />
                </div>
                <div className='p-4 flex-1 flex flex-col'>
                  <h3 className='text-lg sm:text-xl font-semibold mb-2 text-gray-800 line-clamp-2'>{result.Title}</h3>
                  <p className='text-gray-600 text-sm sm:text-base text-center flex-1 line-clamp-3'>{result.Description}</p>
                  {isAdmin && (
                    <div className='mt-3 pt-3 border-t border-gray-100'>
                      <p className='text-xs text-blue-600 text-center font-medium'>Click to edit</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}
export default Results;
