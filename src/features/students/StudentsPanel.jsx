import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Trash2, FileDown } from 'lucide-react';

// Mock data to pre-populate the component
const MOCK_COURSES = [
  { code: 'CS101', name: 'Intro to Programming' },
  { code: 'MATH201', name: 'Calculus I' },
  { code: 'PHYS305', name: 'Quantum Mechanics' },
  { code: 'HIST110', name: 'World History' },
];

const MOCK_STUDENTS = [
  {
    id: 's1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    courses: ['CS101', 'MATH201'],
    progress: 75,
    grade: 'A-',
  },
  {
    id: 's2',
    name: 'Bob Smith',
    email: 'bob.s@example.com',
    courses: ['PHYS305'],
    progress: 40,
    grade: 'C+',
  },
  {
    id: 's3',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    courses: ['HIST110', 'CS101'],
    progress: 92,
    grade: 'A',
  },
  {
    id: 's4',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    courses: [], // No courses for this student
    progress: 0,
    grade: 'N/A',
  },
];

const StudentsPanel = ({
  userRole = 'admin', // Changed default role for demo purposes
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const handleDeleteStudent = (studentId) => {
    setStudents(students.filter((s) => s.id !== studentId));
    toast.success('Student deleted successfully!');
  };

  const handleExport = () => {
    if (!students.length) {
      toast.error('No student data to export!');
      return;
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Student Name,Email Address,Enrolled Courses,Progress,Grade',
        ...students.map(
          (s) =>
            `"${s.name}","${s.email}","${s.courses?.join(', ') || ''}",${
              s.progress || 0
            },"${s.grade || ''}"`
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

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-7xl flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Student Management
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
          >
            <FileDown size={16} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.courses?.map((courseCode) => {
                        const course = MOCK_COURSES.find(
                          (c) => c.code === courseCode
                        );
                        return course ? (
                          <span
                            key={courseCode}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-2"
                          >
                            {course.name}
                          </span>
                        ) : null;
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${student.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {student.progress || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.grade || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {userRole === 'admin' && (
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsPanel;