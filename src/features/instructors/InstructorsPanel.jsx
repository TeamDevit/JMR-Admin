import React, { useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { Search, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import AddEditUserForm from './AddEditUserForm';

const InstructorsPanel = ({ userRole = "admin" }) => {
  // ✅ Mock data (initial state)
  const [instructors, setInstructors] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      mobile: "9876543210",
      designation: "Senior Instructor",
      role: "instructor",
      loginEnabled: true,
      coursesCreated: 3,
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob@example.com",
      mobile: "9123456780",
      designation: "Admin Manager",
      role: "admin",
      loginEnabled: true,
      coursesCreated: 7,
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      mobile: "9988776655",
      designation: "Junior Instructor",
      role: "instructor",
      loginEnabled: false,
      coursesCreated: 1,
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // ✅ Add
  const handleAddInstructor = (newInstructor) => {
    setInstructors(prev => [
      ...prev,
      {
        ...newInstructor,
        id: Date.now(),
        loginEnabled: true,
        coursesCreated: 0,
      }
    ]);
    toast.success("Instructor added!");
  };

  // ✅ Update
  const handleUpdateInstructor = (updatedUser) => {
    setInstructors(prev =>
      prev.map(user => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user))
    );
    toast.success("Instructor updated!");
  };

  // ✅ Delete
  const handleDeleteInstructor = (id) => {
    setInstructors(prev => prev.filter(user => user.id !== id));
    toast.success("Instructor deleted!");
  };

  // ✅ Handle form submit (decides add/update)
  const handleSubmit = (formData) => {
    if (userToEdit) {
      handleUpdateInstructor(formData);
    } else {
      handleAddInstructor(formData);
    }
    setIsFormOpen(false);
    setUserToEdit(null);
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };

  // ✅ Safe filtering
  const filteredUsers = instructors.filter(user =>
    user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
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
          {userRole === 'admin' && (
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
            >
              <PlusCircle size={16} />
              <span>Add User</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Login Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.mobile}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.designation}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        user.loginEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.loginEnabled ? 'LOGIN ENABLED' : 'LOGIN DISABLED'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.coursesCreated}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      {userRole === 'admin' && (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteInstructor(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Form */}
      {isFormOpen && (
        <AddEditUserForm
          user={userToEdit}
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default InstructorsPanel;
