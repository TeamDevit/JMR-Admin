import React, { useState, useEffect } from "react";
import { XCircle, PlusCircle, Play, ArrowLeft } from "lucide-react";
import { convertNumberToWords } from "../../utils/convertNumberToWords";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";

const CourseForm = ({ allUsers = [] }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const location = useLocation();
  const isEditing = !!courseId;
  
  // Check for duplicate data first, then edit data, then an empty object
  const initialData = location.state?.duplicateData || location.state?.courseData || {};

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    image: "",
    price: "",
    discount: "",
    durationDays: "",
    learningObjectives: "",
    courseIncludes: "",
    instructorId: "",
    ...initialData,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.thumbnail || null); // Use thumbnail for editing/duplicating

  // You can keep this useEffect to handle cases where state is updated
  // or a direct link is used for editing.
  useEffect(() => {
    // This useEffect will re-sync the form with new props/state if they change
    // after the initial render.
    if (location.state?.courseData) {
      setFormData(prev => ({ ...prev, ...location.state.courseData }));
      setImagePreview(location.state.courseData.thumbnail || null);
    } else if (location.state?.duplicateData) {
      // Handle the case where the component is already mounted
      // and we navigate to a new duplicate
      setFormData(prev => ({ ...prev, ...location.state.duplicateData }));
      setImagePreview(location.state.duplicateData.thumbnail || null);
    }
  }, [location.state]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleBack = () => {
    navigate("/courses");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.instructorId) {
      toast.error("Please fill Course Name, Course Code, and Instructor.");
      return;
    }

    const payload = {
      course_name: formData.name,
      slug: formData.code,
      instructor_id: formData.instructorId,
      ...(formData.description && { description: formData.description }),
      ...(formData.image && { thumbnail_url: formData.image }),
      ...(formData.price && { mrp: formData.price }),
      ...(formData.discount && { final_price: formData.discount }),
      ...(formData.durationDays && { no_of_days: formData.durationDays }),
      ...(formData.learningObjectives && {
        learning_objectives: formData.learningObjectives,
      }),
      ...(formData.courseIncludes && {
        course_includes: formData.courseIncludes,
      }),
    };

    try {
      if (isEditing) {
        // Handle editing logic
        // await api.put(`/admincourses/update-course/${courseId}`, payload);
        toast.success("Course updated successfully!");
      } else {
        // Handle creating a new course (or duplicating)
        await api.post("/admincourses/create-course", payload);
        toast.success("Course added successfully!");
      }
      navigate("/courses");
    } catch (err) {
      console.error("API call failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Failed to save course.");
    }
  };

  const selectedInstructor =
    allUsers.find((user) => user._id === formData.instructorId)?.name ||
    "Select Instructor";

  const renderPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount) || 0;
    if (discount > 0 && discount < price) {
      return (
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">
            ₹{discount.toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-gray-500 line-through ml-2">
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className="ml-4 text-green-600 font-medium">
            Save {Math.round(((price - discount) / price) * 100)}%
          </span>
        </div>
      );
    }
    return (
      <span className="text-2xl font-bold text-gray-900">
        ₹{price.toLocaleString("en-IN")}
      </span>
    );
  };

  return (
    <div className="flex-1 p-8">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl relative flex flex-col md:flex-row mx-auto">
        {/* Left Column: Form */}
        <div className="flex-1 p-8 overflow-y-auto">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Courses</span>
          </button>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              {isEditing ? "Edit Course" : "Add New Course"}
            </h3>
            {isEditing && (
              <button onClick={handleBack} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Course Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                />
              </div>
              {/* Course Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Course Code *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                />
              </div>
              {/* Original Price (optional) */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Original Price (INR)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleChange}
                  placeholder="e.g., 15000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
              </div>
              {/* Final Price (optional) */}
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                  Final Price after discount (INR)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount || ""}
                  onChange={handleChange}
                  placeholder="e.g., 12999"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.discount
                    ? convertNumberToWords(formData.discount)
                    : "Enter a final price (optional)"}
                </p>
              </div>
              {/* Duration (optional) */}
              <div>
                <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700">
                  Duration (in days)
                </label>
                <input
                  type="number"
                  id="durationDays"
                  name="durationDays"
                  value={formData.durationDays || ""}
                  onChange={handleChange}
                  placeholder="e.g., 90"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
              </div>
              {/* Instructor (required) */}
              <div>
                <label htmlFor="instructorId" className="block text-sm font-medium text-gray-700">
                  Instructor Name *
                </label>
                <select
                  id="instructorId"
                  name="instructorId"
                  value={formData.instructorId || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                >
                  <option value="" disabled>
                    Select a user as Instructor
                  </option>
                  {allUsers.length === 0 ? (
                    <option disabled>Loading users...</option>
                  ) : (
                    allUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))
                  )}
                </select>
              </div>
              {/* Course Image (optional) */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Course Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {imageFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    File size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>

            {/* Optional Textareas */}
            <div className="flex flex-col mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Provide a brief description of the course."
                rows="3"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col mt-4">
              <label htmlFor="learningObjectives" className="block text-sm font-medium text-gray-700 mb-1">
                What you'll learn (comma separated)
              </label>
              <textarea
                id="learningObjectives"
                name="learningObjectives"
                value={formData.learningObjectives || ""}
                onChange={handleChange}
                placeholder="e.g., Master JavaScript, Build a full-stack app"
                rows="3"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col mt-4">
              <label htmlFor="courseIncludes" className="block text-sm font-medium text-gray-700 mb-1">
                This course includes (comma separated)
              </label>
              <textarea
                id="courseIncludes"
                name="courseIncludes"
                value={formData.courseIncludes || ""}
                onChange={handleChange}
                placeholder="e.g., On-demand video, Lifetime access, Certificate"
                rows="3"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {isEditing ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Preview */}
        <div className="hidden md:flex flex-1 flex-col p-8 bg-gray-50 border-l border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Course Card Preview</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Course Preview" className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  <PlusCircle size={48} />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">
                      {formData.name || "Course Name"}
                    </h4>
                    <p className="text-xs text-gray-400">Code: {formData.code || "CODE"}</p>
                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      Instructor: {selectedInstructor}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {formData.description || "A brief description of the course."}
                </p>
                <div className="mt-3 flex flex-wrap items-center text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <span>Price:</span>
                    <span className="font-bold text-gray-700 ml-1">{renderPrice()}</span>
                  </div>
                  <div className="flex items-center">
                    <span>Duration:</span>
                    <span className="font-bold text-gray-700 ml-1">
                      {formData.durationDays || "0"} days
                    </span>
                  </div>
                </div>
                {formData.learningObjectives && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold mb-2">What you'll learn</h4>
                    <ul className="text-sm list-disc list-inside text-gray-600 space-y-1">
                      {formData.learningObjectives.split(",").map((item, index) => (
                        <li key={index}>{item.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {formData.courseIncludes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold mb-2">This course includes</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {formData.courseIncludes.split(",").map((item, index) => (
                        <li key={index} className="flex items-center">
                          <Play className="h-4 w-4 text-blue-600 mr-2" />
                          {item.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;