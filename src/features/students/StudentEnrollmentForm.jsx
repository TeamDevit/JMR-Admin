import React, { useState } from 'react';
import { Download, Upload, FileCheck2 } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";

const StudentEnrollmentForm = ({ courses = [], handleBulkEnrollment }) => {
  const [file, setFile] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file || !selectedCourse) {
      toast.error("Please select a file and a course.");
      return;
    }
    // Mock processing
    const mockStudentsData = [{ name: 'Test Student 1' }, { name: 'Test Student 2' }];
    handleBulkEnrollment(mockStudentsData, selectedCourse);
    setFile(null);
    setSelectedCourse('');
    toast.success("Student data uploaded successfully!");
  };
  
  const handleDownloadTemplate = () => {
    const templateContent = `"Student Name","Email Address","Progress","Grade"
"John Doe","john@example.com",0,0
"Jane Smith","jane@example.com",0,0`;

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "student_enrollment_template.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Enrollment template downloaded!");
    }
  };

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Bulk Student Enrollment</h2>
        
        {/* Download + Course Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Enroll Multiple Students</h3>
          <p className="text-gray-600 mb-4">
            To enroll a large group of students, download the template, fill it with student data, and upload it below.
          </p>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
            >
              <Download size={16} />
              <span>Download Template</span>
            </button>
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">Enroll in Course:</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              >
                <option value="">Select a Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.code}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Upload Completed Student List</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
              <Upload size={16} />
              <span>{file ? file.name : "Choose File"}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".csv"
              />
            </label>
            <button
              onClick={handleUpload}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              <FileCheck2 size={16} />
              <span>Upload Student Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollmentForm;
