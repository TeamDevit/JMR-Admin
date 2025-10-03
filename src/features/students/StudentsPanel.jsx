import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileDown, Loader2, X, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../utils/api'; // Adjust path based on your structure

// --- Course Details Modal Component ---
const CourseDetailsModal = ({ student, onClose }) => {
    if (!student) return null;

    const { name, email, courses } = student;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-indigo-700">Course Details: {name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    <p className="mb-4 text-sm text-gray-600">Email: <span className="font-medium text-gray-800">{email}</span></p>

                    {courses.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-lg text-gray-500">This student is not currently enrolled in any courses.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {courses.map((course) => (
                                <div key={course.course_id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-semibold text-gray-900">{course.course_name}</h4>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${course.is_active ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'}`}>
                                            {course.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <p>
                                            <span className="font-medium">Day:</span> {course.current_day || 0}
                                        </p>
                                        <p>
                                            <span className="font-medium">Completion:</span> {course.completion_percentage || 0}%
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${course.completion_percentage || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Students Panel Component ---
const StudentsPanel = ({ userRole = 'admin' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch students from API
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/users');
      const usersData = response.data.users;

      const fetchedStudents = usersData.map(user => {
        const noOfCourses = user.courses ? user.courses.length : 0;
        
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.email_verified,
          currentDayOverall: user.current_day,
          noOfCourses: noOfCourses,
          courses: user.courses || [],
          isActive: user.is_active,
        };
      });

      setStudents(fetchedStudents);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load student data. Please check your API connection.");
      setLoading(false);
      toast.error("Failed to load student data.");
    }
  }, []);

  const handleExport = () => {
    if (!students.length) {
      toast.error('No student data to export!');
      return;
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Student Name,Email Address,Email Verified,Active Status,Current Day (Overall),No. of Courses',
        ...students.map(
          (s) =>
            `"${s.name}","${s.email}","${s.emailVerified ? 'Yes' : 'No'}","${s.isActive ? 'Active' : 'Inactive'}","${s.currentDayOverall}","${s.noOfCourses}"`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'students_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Student report exported successfully!');
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-2" />
        <p className="text-lg text-gray-700">Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg m-8">
        <p className="font-semibold text-lg">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />

      <CourseDetailsModal 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">
          Student Management Dashboard
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative shadow-sm rounded-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-shadow"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <FileDown size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Overall Day
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  No. of Courses
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {student.emailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      Day {student.currentDayOverall || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {student.noOfCourses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className={`text-indigo-600 hover:text-indigo-900 transition-colors flex items-center justify-end space-x-1 ${student.noOfCourses === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={student.noOfCourses === 0}
                        title={student.noOfCourses === 0 ? "No courses to view" : "View Course Details"}
                      >
                        <Eye size={16} />
                        <span className="text-xs font-semibold uppercase">View Course Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-lg text-gray-500">
                    No students found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto mt-4 text-xs text-gray-500 p-2">
        Total Students: {students.length} (Displaying {filteredStudents.length} filtered results)
      </div>
    </div>
  );
};

export default StudentsPanel;