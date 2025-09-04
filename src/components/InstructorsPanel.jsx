import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PlusCircle, Search } from 'lucide-react';

const InstructorsPanel = ({ instructors, handleAddInstructor, handleDeleteInstructor }) => {
  const [showAddInstructorForm, setShowAddInstructorForm] = useState(false);
  const [instructorFormData, setInstructorFormData] = useState({ name: '', email: '', mobile: '', loginEnabled: true });
  const [instructorSearchTerm, setInstructorSearchTerm] = useState('');

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInstructorFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!instructorFormData.name || !instructorFormData.email) {
      toast.error("Name and Email are required.");
      return;
    }
    handleAddInstructor(instructorFormData);
    setInstructorFormData({ name: '', email: '', mobile: '', loginEnabled: true });
    setShowAddInstructorForm(false);
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(instructorSearchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(instructorSearchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-7xl flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Instructors Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search instructors..."
              value={instructorSearchTerm}
              onChange={(e) => setInstructorSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowAddInstructorForm(!showAddInstructorForm)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
          >
            <PlusCircle size={16} />
            <span>Add Instructor</span>
          </button>
        </div>
      </div>

      {showAddInstructorForm && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mb-8 mx-auto">
          <h3 className="text-xl font-semibold mb-4">Add New Instructor</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="instructor-name" className="text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
                <input
                  id="instructor-name"
                  type="text"
                  name="name"
                  value={instructorFormData.name}
                  onChange={handleFormChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="instructor-email" className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="instructor-email"
                  type="email"
                  name="email"
                  value={instructorFormData.email}
                  onChange={handleFormChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="instructor-mobile" className="text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  id="instructor-mobile"
                  type="tel"
                  name="mobile"
                  value={instructorFormData.mobile}
                  onChange={handleFormChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <input
                  id="login-access"
                  type="checkbox"
                  name="loginEnabled"
                  checked={instructorFormData.loginEnabled}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="login-access" className="text-sm font-medium text-gray-700">Login Access</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddInstructorForm(false)}
                className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save Instructor
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Access
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstructors.length > 0 ? (
                filteredInstructors.map((instructor, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{instructor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${instructor.loginEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {instructor.loginEnabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDeleteInstructor(instructor.email)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No instructors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorsPanel;
