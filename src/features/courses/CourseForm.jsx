import React, { useState, useEffect } from 'react';
import { XCircle, Upload, GraduationCap, Users, PlusCircle } from 'lucide-react';
import { convertNumberToWords } from '../../utils/convertNumberToWords';
import { useNavigate } from 'react-router-dom';

const CourseForm = ({
  courseFormData = {},
  handleFormChange,
  handleAddCourse,
  handleUpdateCourse,
  onClose,
  isEditing
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(courseFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData(courseFormData);
    if (courseFormData.image) {
      setImagePreview(courseFormData.image);
    } else {
      setImagePreview(null);
    }
  }, [courseFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("File size exceeds 5MB limit.");
      return;
    }
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdateCourse(formData);
    } else {
      handleAddCourse(formData);
    }
    onClose();
  };

  const calculateDiscount = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount) || 0;
    if (price <= 0 || discount <= 0 || discount >= price) return "0%";
    return `${Math.round(((price - discount) / price) * 100)}%`;
  };
  
  const handleCancel = () => {
    onClose();
    if (!isEditing) navigate('/courses');
  };

  const handleSave = () => {
    if (isEditing) {
      handleUpdateCourse(formData);
    } else {
      handleAddCourse(formData);
    }
    onClose();
  };

  const renderPrice = () => {
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discount);
    if (discount > 0 && discount < price) {
      return (
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">₹{discount.toLocaleString('en-IN')}</span>
          <span className="text-sm text-gray-500 line-through ml-2">₹{price.toLocaleString('en-IN')}</span>
        </div>
      );
    }
    return <span className="text-2xl font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>;
  };


  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl relative flex flex-col md:flex-row">
        {/* Left Column: Form */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              {isEditing ? 'Edit Course' : 'Add New Course'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Course Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">Course Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Original Price (INR)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  placeholder="e.g., 15000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Final Price after discount (INR)</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount || ''}
                  onChange={handleChange}
                  placeholder="e.g., 12999"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.discount ? convertNumberToWords(formData.discount) : "Enter a final price"}
                </p>
              </div>
              <div>
                <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700">Duration (in days)</label>
                <input
                  type="number"
                  id="durationDays"
                  name="durationDays"
                  value={formData.durationDays || ''}
                  onChange={handleChange}
                  placeholder="e.g., 90"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Course Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {imageFile && (
                  <p className="text-xs text-gray-500 mt-1">File size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                )}
              </div>
            </div>

            <div className="flex flex-col mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Provide a brief description of the course."
                rows="3"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {isEditing ? 'Save Changes' : 'Add Course'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Preview */}
        <div className="hidden md:flex flex-1 flex-col p-8 bg-gray-50 border-l border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Course Card Preview</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Course Preview" className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  <PlusCircle size={48} />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">{formData.name || 'Course Name'}</h4>
                    <p className="text-xs text-gray-400">Code: {formData.code || 'CODE'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{formData.description || 'A brief description of the course.'}</p>
                
                <div className="mt-3 flex flex-wrap items-center text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <span>Price:</span>
                    <span className="font-bold text-gray-700 ml-1">
                      {renderPrice()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span>Duration:</span>
                    <span className="font-bold text-gray-700 ml-1">
                      {formData.durationDays || '0'} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
