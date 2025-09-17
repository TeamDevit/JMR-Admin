import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Search, PlusCircle, GraduationCap, Users, Pencil, Copy, ArrowRight } from "lucide-react";
import CourseForm from "./CourseForm";
import { useNavigate } from "react-router-dom";

const CoursesView = ({ userRole }) => {
  const navigate = useNavigate();

  // ✅ Mock data state
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "React Basics",
      code: "REACT101",
      description: "Learn the fundamentals of React.js.",
      price: 15000,
      discount: 12999,
      durationDays: 90,
      studentsEnrolled: 200,
    },
  ]);

  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [courseFormData, setCourseFormData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  // ✅ Add new course
  const handleAddCourse = (newCourse) => {
    const courseWithId = { ...newCourse, id: Date.now(), studentsEnrolled: 0 };
    setCourses((prev) => [...prev, courseWithId]);
    toast.success("Course added successfully!");
    setShowAddCourseForm(false);
  };

  // ✅ Update existing course
  const handleUpdateCourse = (updatedCourse) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
    );
    toast.success("Course updated!");
    setShowEditModal(false);
  };

  // ✅ Edit course
  const handleEditCourse = (course) => {
    setCourseFormData(course);
    setShowEditModal(true);
  };

  // ✅ Duplicate course
  const handleDuplicateCourse = (course) => {
    const duplicated = { ...course, id: Date.now(), name: course.name + " (Copy)" };
    setCourses((prev) => [...prev, duplicated]);
    toast.success("Course duplicated!");
  };

  const handleOpenAddForm = () => {
    setCourseFormData({});
    setShowAddCourseForm(true);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name?.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="w-full max-w-7xl flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">
          Admin Dashboard
        </h1>
      </div>

      {/* Search + Add */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Courses</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={courseSearchTerm}
              onChange={(e) => setCourseSearchTerm(e.target.value)}
              className="pl-3 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {userRole === "admin" && (
            <button
              onClick={handleOpenAddForm}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
            >
              <PlusCircle size={16} />
              <span>Add Course</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Course Form */}
      {showAddCourseForm && (
        <CourseForm
          courseData={courseFormData}
          onClose={() => setShowAddCourseForm(false)}
          onSave={handleAddCourse}
          isEditing={false}
        />
      )}

      {/* Edit Course Form */}
      {showEditModal && (
        <CourseForm
          courseData={courseFormData}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateCourse}
          isEditing={true}
        />
      )}

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:ring-2 hover:ring-indigo-500 transition cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{course.name}</h3>
                  <p className="text-sm text-gray-500">Code: {course.code}</p>
                </div>
                {userRole === "admin" && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditCourse(course)}>
                      <Pencil size={18} className="text-gray-500 hover:text-indigo-600" />
                    </button>
                    <button onClick={() => handleDuplicateCourse(course)}>
                      <Copy size={18} className="text-gray-500 hover:text-indigo-600" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="font-bold">₹{course.discount || course.price}</span>
                <span>{course.durationDays} days</span>
                <span>{course.studentsEnrolled} students</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default CoursesView;
