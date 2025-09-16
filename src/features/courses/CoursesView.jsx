import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { Search, PlusCircle, GraduationCap, Users, Pencil, Copy, ArrowRight } from 'lucide-react';
import CourseForm from "./CourseForm";
import { convertNumberToWords } from '../../utils/convertNumberToWords';

const CoursesView = ({ 
  courses, 
  courseSearchTerm, 
  setCourseSearchTerm,
  showAddCourseForm,
  setShowAddCourseForm,
  courseFormData,
  handleFormChange,
  handleAddCourse,
  showEditModal,
  setShowEditModal,
  handleUpdateCourse,
  handleEditCourse,
  handleDuplicateCourse,
  setSelectedCourse,
  setCurrentView,
  userRole
}) => {
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Page Header */}
      <div className="w-full max-w-7xl flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Courses header + Search + Add Button */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Courses</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={courseSearchTerm}
              onChange={(e) => setCourseSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ✅ Add Course Button */}
          {userRole === 'admin' && (
            <button
              onClick={() => setShowAddCourseForm(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
            >
              <PlusCircle size={16} />
              <span>Add Course</span>
            </button>
          )}
        </div>
      </div>

      {/* ✅ Show CourseForm when add course is clicked */}
      {showAddCourseForm && (
        <CourseForm
          setShowAddCourseForm={setShowAddCourseForm}
          courseFormData={courseFormData}
          handleFormChange={handleFormChange}
          handleAddCourse={handleAddCourse}
        />
      )}

      {/* Course Cards Grid */}
      <div className="w-full max-w-7xl flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setCurrentView('days');
                }}
                className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between shadow-sm hover:ring-2 hover:ring-indigo-500 transition-all duration-300 ease-in-out cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="p-3 mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white">
                      <GraduationCap size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2">{course.name}</h3>
                    <p className="text-xs text-gray-400">Code: {course.code}</p>
                  </div>

                  {userRole === 'admin' && (
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
  onClick={() => {
    setShowAddCourseForm(true);
    handleEditCourse(course);
  }}
  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full transition-colors"
>
  <Pencil size={18} />
</button>

                      <button onClick={() => handleDuplicateCourse(course)} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full transition-colors">
                        <Copy size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mt-4 leading-relaxed flex-grow">{course.description}</p>

                <div className="mt-4 flex flex-wrap items-center text-sm text-gray-500">
                  <div className="flex items-center mr-4 mb-2">
                    <span className="mr-1">Price:</span>
                    {course.originalPrice && course.originalPrice > course.price ? (
                      <>
                        <span className="font-bold text-gray-400 line-through mr-1">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                        <span className="font-bold text-gray-700">₹{course.price.toLocaleString('en-IN')}</span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-700">₹{course.price.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex items-center mr-4 mb-2">
                    <span className="mr-1">Duration:</span>
                    <span className="font-bold text-gray-700">{course.duration} weeks</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Users size={16} className="text-indigo-500 mr-1" />
                    <span className="mr-1">Enrolled:</span>
                    <span className="font-bold text-gray-700">{course.studentsEnrolled}</span>
                  </div>
                </div>

                <div className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-md transition-colors pointer-events-none">
                  <span>Click to Select Course</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No courses found. Add a new one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesView;
