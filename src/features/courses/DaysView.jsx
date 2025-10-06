import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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

  if (!selectedCourse) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No course selected. Please go back and select a course.</p>
          <button
            onClick={() => navigate('-1')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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

  const handleDayClick = (day) => {
    navigate(`/courses/${courseSlug}/days/${day.day_number}`, { 
      state: { selectedCourse, selectedDay: day } 
    });
  };

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

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedCourse.name}</h1>
        <p className="text-gray-600">
          Total days: <span className="font-semibold">{selectedCourse.durationDays}</span>
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {days.length > 0 ? (
          days.map((day) => {
            const isLive = day.is_published;

            return (
              <div
                key={day._id}
                onClick={() => handleDayClick(day)}
                className="relative bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between items-center shadow-sm hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer hover:shadow-md"
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {isLive ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-200">
                      LIVE
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                      DRAFT
                    </span>
                  )}
                </div>

                {/* Day Number Circle */}
                <div className="p-3 mb-3 w-16 h-16 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-2xl">
                  {day.day_number}
                </div>

                {/* Day Title */}
                <h3 className="text-xl font-semibold text-gray-900 text-center">
                  Day {day.day_number}
                </h3>
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