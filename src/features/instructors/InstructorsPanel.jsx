const API = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== '')
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') // remove trailing slash
  : 'http://localhost:3000'; // fallback to backend URL for local devconst getToken = () => localStorage.getItem('adminToken');
  const getToken = () => {
  return localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
};
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Search, PlusCircle, Pencil, Trash2, Loader2, XCircle } from 'lucide-react';

// --- Utility Function to Handle API Responses Safely ---

/**
 * Checks response status and safely attempts to parse JSON,
 * preventing 'Unexpected end of JSON input' on empty error bodies.
 * @param {Response} response The fetch Response object.
 * @returns {Promise<Object>} The parsed JSON data or an empty object.
 * @throws {Error} An error with a specific message from the server or a generic message.
 */
const safeResponseHandler = async (response) => {
    // Check if the response status is 400 or higher
    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        
        // If the server sent a JSON error object, read it
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            // Throw the specific backend error message, or a generic one
            throw new Error(errorData.error || errorData.message || `Server Error (${response.status})`);
        } 
        // If the response is NOT JSON (i.e., empty body, HTML, or plain text)
        else {
            throw new Error(`Request failed with status ${response.status}. Please check backend logs for details.`);
        }
    }
    
    // For successful responses, attempt to parse JSON
    try {
        return await response.json();
    } catch (e) {
        // This handles successful 204 No Content or responses with empty bodies
        return {}; 
    }
};

// --- AddEditUserForm Component ---
const AddEditUserForm = ({ user, onSubmit, onClose, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        role: 'instructor',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.username || '',
                email: user.email || '',
                mobile: user.mobile || '',
                designation: user.designation || '',
                role: user.role || 'instructor',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.mobile) {
            toast.error('Full Name, Email, and Mobile are required.');
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                >
                    <XCircle size={24} />
                </button>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {user ? 'Edit User' : 'Add New User'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            disabled={!!user || isLoading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="e.g., 9876543210"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                            type="text"
                            id="designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="e.g., Senior Instructor"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            disabled={isLoading}
                        >
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {!user && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-sm text-blue-800">
                                A temporary password will be sent to the provided email address.
                            </p>
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 size={16} className="animate-spin mr-2" />}
                            <span>{user ? 'Save Changes' : 'Add User'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ------------------------------------

// --- InstructorsPanel Component ---
const InstructorsPanel = ({ userRole = "admin" }) => {
    const [admins, setAdmins] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFormLoading, setIsFormLoading] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

  const fetchAdmins = async ({ signal } = {}) => {
  setIsLoading(true);
  try {
    const token = getToken();
    if (!token) {
      toast.error('Not authenticated. Please login.');
      setAdmins([]);
      return;
    }

    const response = await fetch(`${API}/api/v1/admin/admins`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      signal
    });

    const payload = await safeResponseHandler(response);
    // Accept different shapes: array | { admins: [...] } | { data: [...] }
    const adminsList = Array.isArray(payload) ? payload : (payload.admins || payload.data || []);
    setAdmins(adminsList);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('fetchAdmins aborted');
    } else {
      toast.error(error.message || 'Failed to load users');
      console.error(error);
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleAddUser = async (formData) => {
  setIsFormLoading(true);
  try {
    const token = getToken();
    if (!token) {
      toast.error('Not authenticated. Please login.');
      return;
    }

    const response = await fetch(`${API}/api/v1/admin/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        designation: formData.designation,
        role: formData.role,
        permissions: formData.role === 'admin'
            ? ['create_content', 'edit_content', 'delete_content', 'manage_users', 'view_analytics']
            : ['create_content', 'edit_content', 'view_analytics']
      })
    });

    const result = await safeResponseHandler(response);
    const createdAdmin = result.admin || result.data || result;

    if (createdAdmin && createdAdmin._id) {
      // optimistic add for snappy UI
      setAdmins(prev => [createdAdmin, ...prev]);
    } else {
      await fetchAdmins();
    }

    toast.success(`${formData.role === 'admin' ? 'Admin' : 'Instructor'} created! Password sent to ${formData.email}`);
    setIsFormOpen(false);
    setUserToEdit(null);
  } catch (error) {
    toast.error(error.message || 'Failed to create user');
    console.error(error);
  } finally {
    setIsFormLoading(false);
  }
};


  const handleUpdateUser = async (formData) => {
  if (!userToEdit) return;
  setIsFormLoading(true);
  try {
    const token = getToken();
    if (!token) {
      toast.error('Not authenticated. Please login.');
      return;
    }

    const response = await fetch(`${API}/api/v1/admin/admins/${userToEdit._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: formData.name,
        mobile: formData.mobile,
        designation: formData.designation,
        role: formData.role,
        permissions: formData.role === 'admin'
            ? ['create_content', 'edit_content', 'delete_content', 'manage_users', 'view_analytics']
            : ['create_content', 'edit_content', 'view_analytics']
      })
    });

    const payload = await safeResponseHandler(response);
    // If backend returns the updated admin, update locally, otherwise refresh list
    const updatedAdmin = payload.admin || payload.data || payload;
    if (updatedAdmin && updatedAdmin._id) {
      setAdmins(prev => prev.map(a => (a._id === updatedAdmin._id ? updatedAdmin : a)));
    } else {
      await fetchAdmins();
    }

    toast.success('User updated successfully!');
    setIsFormOpen(false);
    setUserToEdit(null);
  } catch (error) {
    toast.error(error.message || 'Failed to update user');
    console.error(error);
  } finally {
    setIsFormLoading(false);
  }
};


const handleDeleteUser = async (adminId) => {
  if (!window.confirm('Are you sure you want to delete this user?')) return;
  try {
    const token = getToken();
    if (!token) {
      toast.error('Not authenticated. Please login.');
      return;
    }

    const url = `${API}/api/v1/admin/admins/${adminId}`;
    console.log('Deleting user:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Show raw status for debugging
    console.log('DELETE response status:', response.status, response.statusText);

    // Try to read text if JSON parsing will fail
    const contentType = response.headers.get('content-type') || '';
    let body;
    if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }
    console.log('DELETE response body:', body);

    // Use safeResponseHandler for normal flow, but with fallback
    if (!response.ok) {
      const msg = (body && body.error) ? body.error : (typeof body === 'string' ? body : `Server returned ${response.status}`);
      throw new Error(msg || 'Delete failed');
    }

    // success
    setAdmins(prev => prev.filter(a => a._id !== adminId));
    toast.success('User deleted successfully!');
  } catch (error) {
    console.error('Delete error:', error);
    toast.error(`Unable to delete user: ${error.message}`);
  }
};

    const handleSubmit = (formData) => {
        if (userToEdit) {
            handleUpdateUser(formData);
        } else {
            handleAddUser(formData);
        }
    };

    const filteredUsers = admins.filter(admin =>
        admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 p-8">
            <Toaster position="top-right" />

            <div className="w-full max-w-7xl flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">User Management</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    {userRole === 'admin' && (
                        <button
                            onClick={() => {
                                setUserToEdit(null);
                                setIsFormOpen(true);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                        >
                            <PlusCircle size={16} />
                            <span>Add User</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full max-w-7xl">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                                {userRole === 'admin' && (
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center">
                                        <Loader2 className="animate-spin mx-auto text-indigo-600" size={32} />
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((admin) => (
                                    <tr key={admin._id}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{admin.username}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{admin.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{admin.mobile || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{admin.designation || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                                                admin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {admin.is_active ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                                                admin.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {admin.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'}
                                        </td>
                                        {userRole === 'admin' && (
                                            <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setUserToEdit(admin);
                                                        setIsFormOpen(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 inline-block"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(admin._id)}
                                                    className="text-red-600 hover:text-red-900 inline-block"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        )}
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

            {isFormOpen && (
                <AddEditUserForm
                    user={userToEdit}
                    onSubmit={handleSubmit}
                    onClose={() => {
                        setIsFormOpen(false);
                        setUserToEdit(null);
                    }}
                    isLoading={isFormLoading}
                />
            )}
        </div>
    );
};

export default InstructorsPanel;