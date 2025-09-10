import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { XCircle } from 'lucide-react';

const AddEditStudentForm = ({ student, courses, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    courses: [],
    progress: 0,
    grade: 0,
  });
  const isEditing = !!student?.id;

  useEffect(() => {
    if (student) {
      setFormData({
        id: student.id || '',
        name: student.name || '',
        email: student.email || '',
        courses: student.courses || [],
        progress: student.progress || 0,
        grade: student.grade || 0,
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'courses') {
      const selectedCourses = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, courses: selectedCourses }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Student Name and Email are required.');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Student Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              disabled={isEditing}
              required
            />
          </div>
          <div>
            <label htmlFor="courses" className="block text-sm font-medium text-gray-700">Enroll in Courses</label>
            <select
              id="courses"
              name="courses"
              multiple
              value={formData.courses}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            >
              {courses.map(course => (
                <option key={course.id} value={course.code}>{course.name} ({course.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700">Progress (%)</label>
            <input
              type="number"
              id="progress"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Final Grade</label>
            <input
              type="number"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {isEditing ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddEditStudentForm;
