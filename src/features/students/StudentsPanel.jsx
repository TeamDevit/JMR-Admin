import React, { useState, useEffect, useCallback } from 'react';

// --- Mocking External Libraries for Single-File React Environment ---

// Simple toast mock since external library 'react-hot-toast' is assumed but cannot be guaranteed
const toast = {
  success: (msg) => console.log('TOAST SUCCESS:', msg),
  error: (msg) => console.error('TOAST ERROR:', msg),
};
const Toaster = () => <div className="hidden"></div>; // Placeholder

// Icon components (lucide-react replacement with inline SVGs)
const Search = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const Trash2 = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>
);
const FileDown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17l-3 3-3-3"></path><path d="M12 10v10"></path><path d="M20 19a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6"></path></svg>
);
const Loader2 = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
);
const X = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const Eye = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

// Mocking the API response structure you provided
const mockApiResponse = {
    count: 2,
    users: [
        {
            _id: "68ca81ba7dae674320079112",
            name: "John Smith",
            email: "john.smith@example.com",
            current_day: 5,
            is_active: true,
            email_verified: true,
            courses: [
                {
                    course_id: "68ca81bc7dae674320079116",
                    course_name: "English Fluency for Job Interviews",
                    current_day: 5,
                    completion_percentage: 17,
                    is_active: true
                },
                {
                    course_id: "68d6ac21b46dd904b8e94396",
                    course_name: "English Fluency for Spoken Tutorials",
                    current_day: 1,
                    completion_percentage: 3,
                    is_active: true
                },
                {
                    course_id: "68dcf72fdaee526035e5f5f5",
                    course_name: "English Fluency for Interviews",
                    current_day: 1,
                    completion_percentage: 0,
                    is_active: true
                },
                {
                    course_id: "68dd0841de029c4b588ce382",
                    course_name: "ds G  ",
                    current_day: 1,
                    completion_percentage: 0,
                    is_active: true
                }
            ]
        },
        {
            _id: "68deafc16a8f4658315d4186",
            name: "SHAIK KABEER",
            email: "shaikkabeerahmed786@gmail.com",
            current_day: 1,
            is_active: true,
            email_verified: false,
            courses: []
        },
        {
            _id: "68deafc16a8f4658315d4187",
            name: "Alice Johnson",
            email: "alice.j@corp.com",
            current_day: 15,
            is_active: false,
            email_verified: true,
            courses: [
                 {
                    course_id: "68ca81bc7dae674320079116",
                    course_name: "Advanced Python for Data Science",
                    current_day: 15,
                    completion_percentage: 50,
                    is_active: false
                }
            ]
        }
    ]
};

// Mock API function to simulate network delay and return the mocked data
const mockApi = {
    get: (url) => new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Mock API call to ${url}`);
            resolve({ data: mockApiResponse });
        }, 1000); // Simulate network delay
    }),
};

// --- Course Details Modal Component ---

const CourseDetailsModal = ({ student, onClose }) => {
    if (!student) return null;

    const { name, email, courses } = student;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-indigo-700">Course Details: {name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
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

                {/* Footer */}
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
  const [selectedStudent, setSelectedStudent] = useState(null); // State for modal

  // --- API Functions ---
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using mockApi instead of imported api
      const response = await mockApi.get('/api/v1/users'); 
      const usersData = response.data.users; // Accessing the 'users' array

      const fetchedStudents = usersData.map(user => {
        // New fields derived from the provided structure
        const noOfCourses = user.courses ? user.courses.length : 0;
        
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.email_verified,
          currentDayOverall: user.current_day,
          noOfCourses: noOfCourses,
          courses: user.courses || [], // Store full course list for modal
          isActive: user.is_active,
        };
      });

      setStudents(fetchedStudents);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load student data. Please check the mock API status.");
      setLoading(false);
      toast.error("Failed to load student data.");
    }
  }, []);

  const handleDeleteStudent = (studentId) => {
    // Deleting logic should be implemented here
    toast.error(`Attempting to delete student ID: ${studentId}. (Delete functionality is not implemented in mock API.)`);
  };

  const handleExport = () => {
    if (!students.length) {
      toast.error('No student data to export!');
      return;
    }

    // Updated CSV content to match the new fetched fields
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        // Column Headers
        'Student Name,Email Address,Email Verified,Active Status,Current Day (Overall),No. of Courses',
        // Data Rows
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
        <p className="text-xs mt-2">Check console for API error details.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Course Details Modal */}
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
                    
                    {/* Student Name */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name || 'N/A'}
                    </td>
                    
                    {/* Email Address */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.email || 'N/A'}
                    </td>
                    
                    {/* Email Verified */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {student.emailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>

                    {/* Overall Current Day */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      Day {student.currentDayOverall || 0}
                    </td>

                    {/* No. of Courses */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {student.noOfCourses}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      
                       {/* View Details Button */}
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
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-lg text-gray-500"
                  >
                    No students found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto mt-4 text-xs text-gray-500 p-2">
        Total Students: {students.length} (Displaying {filteredStudents.length} filtered results).
        Note: The data is currently mocked based on the provided JSON structure.
      </div>
    </div>
  );
};

export default StudentsPanel;
