import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Search, PlusCircle } from 'lucide-react';

const InstructorsPanel = ({ instructors, handleAddInstructor, handleDeleteInstructor }) => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [userFormData, setUserFormData] = useState({ 
    name: '', 
    email: '', 
    designation: '', 
    loginEnabled: true, 
    role: 'instructor',
    coursesCreated: 0
  });
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!userFormData.name || !userFormData.email) {
      toast.error("Employee Name and Email are required.");
      return;
    }
    
    handleAddInstructor(userFormData);
    setUserFormData({ name: '', email: '', designation: '', loginEnabled: true, role: 'instructor', coursesCreated: 0 });
    setShowAddUserForm(false);
  };

  const filteredUsers = instructors.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-7xl flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">User Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Employee Name"
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
          >
            <PlusCircle size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {showAddUserForm && (
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg mb-8 mx-auto">
          <h3 className="text-xl font-semibold mb-4">Add New User</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="user-name" className="text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input
                  id="user-name"
                  type="text"
                  name="name"
                  value={userFormData.name}
                  onChange={handleFormChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="user-email" className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="user-email"
                  type="email"
                  name="email"
                  value={userFormData.email}
                  onChange={handleFormChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="user-designation" className="text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  id="user-designation"
                  type="text"
                  name="designation"
                  value={userFormData.designation}
                  onChange={handleFormChange}
                  placeholder="e.g., Senior Instructor, Course Creator"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="user-role" className="text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  id="user-role"
                  name="role"
                  value={userFormData.role}
                  onChange={handleFormChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <input
                  id="login-access"
                  type="checkbox"
                  name="loginEnabled"
                  checked={userFormData.loginEnabled}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="login-access" className="text-sm font-medium text-gray-700">Login Access</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddUserForm(false)}
                className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save User
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
                  Employee Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Access
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.designation || 'Not specified'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.loginEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.loginEnabled ? 'LOGIN ENABLED' : 'LOGIN DISABLED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'super-admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'super-admin' ? 'SUPER ADMIN' : 
                         user.role === 'admin' ? 'ADMIN' : 'INSTRUCTOR'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.coursesCreated || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">Edit Employee</button>
                      <button onClick={() => handleDeleteInstructor(user.email)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
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