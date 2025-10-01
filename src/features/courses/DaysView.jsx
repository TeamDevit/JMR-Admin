import React, { useState, useEffect } from "react";
import { ArrowRight, Search, Plus, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api"; // Ensure this is your Axios instance

const DaysView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCourse = location.state?.course; // Get the course data from navigation state

  // --- State for fetched data and loading status ---
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [daySearchTerm, setDaySearchTerm] = useState("");

  // Safety check for selectedCourse
  if (!selectedCourse) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No course selected. Please go back and select a course.</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // --- Fetch days from the backend ---
const fetchDays = async () => {
  try {
    setLoading(true);
    setError(null);
    // This is the correct path that your backend recognizes
    const response = await api.get(`/course-days/${selectedCourse.id}`);
    setDays(response.data.days);
  } catch (err) {
    // ... (error handling)
  } finally {
    setLoading(false);
  }
};

  // Run the fetch call when the component mounts or the course ID changes
  useEffect(() => {
    if (selectedCourse?.id) {
      fetchDays();
    }
  }, [selectedCourse?.id]);

  const filteredDays = days.filter(day =>
    day.day_number.toString().includes(daySearchTerm) // Filter by day number
  );

  const handleDayClick = (day) => {
    // Navigate to the modules page, passing the day ID and course data in state
    navigate(`/courses/${selectedCourse.id}/days/${day._id}`, { state: { selectedCourse, selectedDay: day } });
  };

  const handleAddDay = () => {
    // This function will now require a backend call to create a new day
    // For now, you can navigate to a form or modal to handle day creation
    // The previous implementation was just adding to the local state
    // You'll need a new API call: api.post('/days', { course_id: selectedCourse.id, day_number: days.length + 1 })
    console.log("Add new day logic here, including API call.");
  };

  // --- Loading / Error UI ---
  if (loading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-2" />
        <p className="text-lg text-gray-700">Loading days...</p>
      </div>
    );
  }

  if (error && days.length === 0) {
    return (
      <div className="flex-1 p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg m-8">
        <p className="font-semibold text-lg">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* ... (rest of your JSX) ... */}
      <div className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* ➕ Add New Day / Module Card */}
        <div
          onClick={handleAddDay}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-400 rounded-lg bg-white hover:bg-indigo-50 cursor-pointer transition-all duration-300"
        >
          <Plus size={32} className="text-indigo-600 mb-2" />
          <span className="text-indigo-600 font-semibold">Add Day</span>
        </div>

        {filteredDays.length > 0 ? (
          filteredDays.map((day, index) => {
            const dayData = day; // Use real data from the fetched 'day' object
            const totalModules = dayData.modules?.length || 0; // assuming 'modules' is populated
            const enabledModules = totalModules; // You'll need a way to determine enabled status

            const isLive = dayData.is_published;
            const progressPercentage = (enabledModules / totalModules) * 100;

            return (
              <div
                key={dayData._id}
                onClick={() => handleDayClick(dayData)}
                className="relative bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between items-center shadow-sm hover:ring-2 hover:ring-indigo-500 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-md"
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {isLive ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-200">
                      LIVE
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full border border-gray-200">
                      DRAFT
                    </span>
                  )}
                </div>

                {/* Day Number Circle */}
                <div className="p-3 mb-3 w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-lg">
                  {dayData.day_number}
                </div>

                {/* Day Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Day {dayData.day_number}</h3>

                {/* Module Status */}
                <div className="w-full text-center space-y-3">
                  <div className="text-sm text-gray-600">
                    Modules:{" "}
                    <span className="font-semibold text-indigo-600">
                      {enabledModules}/{totalModules}
                    </span>{" "}
                    enabled
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg">No days found for this course.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaysView;