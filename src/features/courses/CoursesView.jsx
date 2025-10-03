import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Search, PlusCircle, Pencil, Copy, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const CoursesView = ({ userRole }) => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [courseSearchTerm, setCourseSearchTerm] = useState("");

  // --- Fetch courses from backend ---
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admincourses/get-course");
      if (Array.isArray(response.data)) {
        const mappedCourses = response.data.map((course) => ({
          id: course._id,
          name: course.course_name,
          code: course.slug || "",
          slug: course.slug,
          description: course.description,
          durationDays: course.no_of_days,
          price: course.mrp,
          discount: course.final_price,
          studentsEnrolled: course.enrollments,
          thumbnail: course.thumbnail_url,
          promoVideo: course.promo_video_url,
          isPublished: course.is_published,
          level: course.level,
          ratings: course.ratings,
        }));
        setCourses(mappedCourses);
      } else {
        setCourses([]);
        console.error("Unexpected response:", response.data);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to fetch courses. Check your backend and network.");
      toast.error("Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- Navigation Handlers ---
  const handleOpenAddForm = () => {
    navigate("/courseform");
  };

  const handleEditCourse = (course) => {
    // Navigate to the edit page, passing the course ID in the URL
    navigate(`/courseform/edit/${course.id}`, { state: { courseData: course } });
  };

  const handleDuplicateCourse = (course) => {
    // Create a shallow copy with modified name and code
    const duplicateData = {
      ...course,
      name: course.name ? `${course.name} (Copy)` : "",
      code: course.code ? `${course.code}-copy` : "",
      slug: course.slug ? `${course.slug}-copy` : "",
      isPublished: false, // optional: make duplicate unpublished by default
    };

    // Navigate to CourseForm with pre-filled duplicate data
    navigate(`/courseform`, { state: { duplicateData } });
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name?.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const handleCourseClick = (course) => {
    navigate(`/courses/${course.slug}`, { state: { course } });
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-2" />
        <p className="text-lg text-gray-700">Loading courses...</p>
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
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-7xl flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">
          Courses Dashboard
        </h1>
      </div>

      <div className="w-full max-w-7xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Courses ({courses.length})
        </h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:ring-2 hover:ring-indigo-500 transition cursor-pointer flex flex-col"
            >
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={`${course.name} thumbnail`}
                  className="w-full h-40 object-cover rounded-md mb-4 border border-gray-200"
                />
              )}
              <div className="flex justify-between items-start flex-grow">
                <div>
                  <h3 className="text-xl font-semibold">{course.name}</h3>
                  <p className="text-sm text-gray-500">Code: {course.code}</p>
                </div>
                {userRole === "admin" && (
                  <div className="flex space-x-2 mt-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleEditCourse(course)}>
                      <Pencil size={18} className="text-gray-500 hover:text-indigo-600" />
                    </button>
                    <button onClick={() => handleDuplicateCourse(course)}>
                      <Copy size={18} className="text-gray-500 hover:text-indigo-600" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-2 flex-grow">{course.description}</p>
              <div className="mt-4 flex justify-between text-sm pt-4 border-t border-gray-100">
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
