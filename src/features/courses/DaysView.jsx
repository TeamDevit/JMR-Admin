import React, { useState, useEffect } from "react";
import { ArrowRight, Search, Plus, Loader2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

const DaysView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseSlug } = useParams();
  const selectedCourse = location.state?.course;

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
      const response = await api.get(`/course-days/${selectedCourse.id}`);
      setDays(response.data.days);
    } catch (err) {
      console.error("Failed to fetch days:", err);
      setError(err.response?.data?.message || "Failed to fetch days.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse?.id) {
      fetchDays();
    }
  }, [selectedCourse?.id]);

  const filteredDays = days.filter(day =>
    day.day_number.toString().includes(daySearchTerm)
  );

  const handleDayClick = (day) => {
    // MODIFICATION: Use day.day_number for the URL, but pass the full day object in state
    navigate(`/courses/${courseSlug}/days/${day.day_number}`, { state: { selectedCourse, selectedDay: day } });
  };

  const handleAddDay = async () => {
    try {
      const newDayNumber = days.length + 1;
      await api.post("/course-days", {
        course_id: selectedCourse.id,
        day_number: newDayNumber,
      });
      fetchDays();
    } catch (err) {
      console.error("Failed to add new day:", err);
    }
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
      <div className="w-full max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedCourse.name}</h1>
        <p className="text-gray-600">Showing days for this course. Total days: <span className="font-semibold">{selectedCourse.durationDays}</span></p>
      </div>

      <div className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* ➕ Add New Day Card */}
     

        {filteredDays.length > 0 ? (
          filteredDays.map((day, index) => {
            const dayData = day;
            const totalModules = dayData.modules?.length || 0;
            const enabledModules = totalModules;

            const isLive = dayData.is_published;
            const progressPercentage = totalModules > 0 ? (enabledModules / totalModules) * 100 : 0;

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