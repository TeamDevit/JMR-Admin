import React, { useState } from 'react';
import { Download, Upload, FileCheck2 } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";

// =========================================================
// 1. HELPER FUNCTION: Course Name/Code (Extracted from AnnouncementsView)
// =========================================================
const getCourseDisplay = (courseId, courses) => {
    if (!courseId) return 'Select a Course';
    
    // Normalize ID for comparison (important for MongoDB ObjectIds)
    const normalizedCourseId = courseId.toString(); 
    
    const course = Array.isArray(courses) 
        ? courses.find(c => c._id === normalizedCourseId) 
        : null; 
    
    return course ? `${course.name} (${course.code})` : 'Unknown Course'; 
};

// =========================================================
// 2. DROPDOWN COMPONENT (Extracted and Reused Logic)
// =========================================================
const CourseSelectDropdown = ({ courses, selectedCourse, setSelectedCourse, isDisabled = false }) => (
    <div className="flex items-center space-x-2 w-full">
        <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">Enroll in Course:</label>
        <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={isDisabled || !Array.isArray(courses) || courses.length === 0}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 disabled:bg-gray-50 disabled:text-gray-500"
        >
            <option value="">
                {Array.isArray(courses) && courses.length > 0 ? "Select a Course" : "No courses available"}
            </option>
            {Array.isArray(courses) && courses.map(course => (
                <option key={course._id || course.code} value={course._id}>
                    {course.name} ({course.code})
                </option>
            ))}
        </select>
    </div>
);


// =========================================================
// 3. MAIN COMPONENT (Updated to use Prop)
// =========================================================
const StudentEnrollmentForm = ({ courses = [], handleBulkEnrollment }) => {
    // NOTE: The prop 'courses' is now used for the dropdown options.
    const [file, setFile] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !selectedCourse) {
            toast.error("Please select a file and a course.");
            return;
        }

        setIsUploading(true);

        // --- MOCK API/PROCESSING LOGIC ---
        // In a real app, you'd send the file and selectedCourse ID to your backend API here.
        // const formData = new FormData();
        // formData.append('courseId', selectedCourse);
        // formData.append('csvFile', file);
        // await api.post('/enrollment/bulk-upload', formData); 
        
        // Mock processing (Replace with actual API/File handling)
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        const mockStudentsData = [{ name: 'Test Student 1' }, { name: 'Test Student 2' }];
        
        try {
            // After successful backend processing, call the parent handler
            handleBulkEnrollment(mockStudentsData, selectedCourse); 
            toast.success(`Enrollment for ${getCourseDisplay(selectedCourse, courses)} started!`);
            
            // Clear state on successful upload
            setFile(null);
            setSelectedCourse('');

        } catch (error) {
             toast.error(error.message || "Bulk enrollment failed on the server.");
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDownloadTemplate = () => {
        const templateContent = `"Student Name","Email Address","Phone Number","Password"
"John Doe","john@example.com",9876543210,john123
"Jane Smith","jane@example.com",1234567890,jane123`;

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
                        
                        {/* REUSED DROPDOWN COMPONENT */}
                        <CourseSelectDropdown
                            courses={courses}
                            selectedCourse={selectedCourse}
                            setSelectedCourse={setSelectedCourse}
                            isDisabled={isUploading}
                        />
                    </div>
                </div>

                {/* File Upload */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Upload Completed Student List</h3>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
                            <Upload size={16} />
                            <span>{file ? file.name : "Choose .CSV File"}</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".csv"
                                disabled={isUploading}
                            />
                        </label>
                        <button
                            onClick={handleUpload}
                            disabled={!selectedCourse || !file || isUploading}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-400"
                        >
                            {isUploading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <FileCheck2 size={16} />
                            )}
                            <span>{isUploading ? "Processing..." : "Upload Student Data"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentEnrollmentForm;