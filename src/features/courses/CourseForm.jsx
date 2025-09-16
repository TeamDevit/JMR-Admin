import React from "react";
import { XCircle, PlusCircle } from "lucide-react";
import { convertNumberToWords } from "../../utils/convertNumberToWords";
import { useNavigate } from "react-router-dom";

const CourseForm = ({
  
  setShowAddCourseForm,
  courseFormData = {}, // ✅ default empty object
  handleFormChange,
  handleAddCourse
}) => {
     const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Add New Course</h3>
          <button
            onClick={() => navigate("/courses")}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Code */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Course Code</label>
            <input
              type="text"
              name="code"
              value={courseFormData?.code || ""}
              onChange={handleFormChange}
              placeholder="e.g., ELM-101"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Course Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              name="name"
              value={courseFormData?.name || ""}
              onChange={handleFormChange}
              placeholder="e.g., English Language Mastery"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Original Price */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Original Price (INR)</label>
            <input
              type="number"
              name="originalPrice"
              value={courseFormData?.originalPrice || ""}
              onChange={handleFormChange}
              placeholder="e.g., 15000"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
            <input
              type="number"
              name="price"
              value={courseFormData?.price || ""}
              onChange={handleFormChange}
              placeholder="e.g., 12999"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {courseFormData?.price
                ? convertNumberToWords(courseFormData.price)
                : "Enter a price"}
            </p>
          </div>

          {/* Duration */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Duration (Weeks)</label>
            <input
              type="number"
              name="duration"
              value={courseFormData?.duration || ""}
              onChange={handleFormChange}
              placeholder="e.g., 8"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {courseFormData?.duration > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                This is a {courseFormData.duration * 7} day course.
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col mt-4">
          <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={courseFormData?.description || ""}
            onChange={handleFormChange}
            placeholder="Provide a brief description of the course."
            rows="3"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setShowAddCourseForm(false)}
            className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddCourse}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
