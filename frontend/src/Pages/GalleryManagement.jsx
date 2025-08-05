import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Edit, Trash2, Eye, Plus, X, Image as ImageIcon } from 'lucide-react';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import { toast, ToastContainer } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_HTTPURLBackend;

const GalleryManagement = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Check authentication
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

    fetchImages();
  }, [navigate]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/gallery`);
      const data = await response.json();
      
      if (data.success) {
        setImages(data.data);
      } else {
        toast.error('Failed to fetch gallery images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Error fetching gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile && !selectedImage) {
      toast.error('Please select an image');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      formDataToSend.append('isActive', formData.isActive);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const url = selectedImage 
        ? `${BACKEND_URL}/api/gallery/${selectedImage._id}`
        : `${BACKEND_URL}/api/gallery`;
      
      const method = selectedImage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(selectedImage ? 'Image updated successfully' : 'Image uploaded successfully');
        fetchImages();
        resetForm();
        setShowUploadModal(false);
        setShowEditModal(false);
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/gallery/${imageId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Image deleted successfully');
        fetchImages();
      } else {
        toast.error(data.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setFormData({
      isActive: image.isActive
    });
    setPreviewUrl(`${BACKEND_URL}/uploads/gallery/${image.imageURL}`);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      isActive: true
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedImage(null);
  };

  const closeModals = () => {
    setShowUploadModal(false);
    setShowEditModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b m-4 sm:m-6 lg:m-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">
                Manage photos for the website gallery
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={16} className="sm:w-5 sm:h-5" />
              Add New Image
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading && !showUploadModal && !showEditModal ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {images.map((image) => (
              <div key={image._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-12 relative">
                  <img
                    src={`${BACKEND_URL}/uploads/gallery/${image.imageURL}`}
                    alt={image.title}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  {!image.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">Inactive</span>
                    </div>
                  )}
                </div>
                
                <div className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                        image.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {image.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(image.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleEdit(image)}
                        className="p-1.5 sm:p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit Status"
                      >
                        <Edit size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        className="p-1.5 sm:p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <ImageIcon size={36} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No images found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">Start by uploading your first gallery image</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Upload Image
            </button>
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      {(showUploadModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-bold">
                {selectedImage ? 'Edit Image Status' : 'Upload New Image'}
              </h2>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Image Upload/Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-40 sm:h-48 object-cover rounded"
                        />
                        {!selectedImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewUrl(null);
                              setSelectedFile(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={36} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to select image</p>
                      </div>
                    )}
                    {!selectedImage && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required={!selectedImage}
                      />
                    )}
                  </div>
                </div>

                {/* Status Field */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-4">
                      Image Status
                    </label>
                    <div className="flex items-center justify-center gap-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="text-sm text-gray-900 font-medium">
                        Active (visible on homepage)
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 px-2">
                      {formData.isActive 
                        ? 'This image will be shown on the homepage gallery' 
                        : 'This image will be hidden from the homepage but kept in the system'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm sm:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
                >
                  {loading ? 'Saving...' : (selectedImage ? 'Update' : 'Upload')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default GalleryManagement;
