import React from "react";
import { ArrowRight, Search } from 'lucide-react';

const DaysView = ({ 
  selectedCourse, 
  daySearchTerm, 
  setDaySearchTerm, 
  setSelectedDay, 
  setCurrentView, 
  handleGoBack 
}) => {
  // Safety check for selectedCourse
  if (!selectedCourse) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No course selected. Please go back and select a course.</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const duration = selectedCourse.duration || 8;
  const days = Array.from({ length: duration * 7 }, (_, i) => `Day ${i + 1}`);
  
  const filteredDays = days.filter(day =>
    day.toLowerCase().includes((daySearchTerm || "").toLowerCase())
  );

  const handleDayClick = (day) => {
    if (setSelectedDay && setCurrentView) {
      setSelectedDay(day);
      setCurrentView('modules');
    }
  };

  // Function to get realistic day data - replace this with real data later
  const getDayData = (dayIndex) => {
    const totalModules = 6;
    // More realistic progression - early days have fewer modules
    const enabledModules = Math.min(totalModules, Math.max(0, Math.floor(dayIndex / 7) + Math.floor(Math.random() * 3) + 1));
    // Go Live status - only if enough modules enabled
    const hasGoneLive = enabledModules >= 4 && Math.random() > 0.3;
    
    return {
      totalModules,
      enabledModules,
      isLive: hasGoneLive
    };
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between mb-12">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowRight className="rotate-180" size={16} />
          <span>Change Course</span>
        </button>
        <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">Admin Dashboard</h1>
        <div className="w-24" />
      </div>

      {/* Course Title and Search */}
      <div className="w-full max-w-7xl mx-auto mb-12 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-700">
          Select a day for: <span className="text-indigo-600">{selectedCourse.name}</span>
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search days..."
            value={daySearchTerm || ""}
            onChange={(e) => setDaySearchTerm && setDaySearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Days Grid */}
      <div className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredDays.length > 0 ? (
          filteredDays.map((day, index) => {
            // Get realistic data for this day
            const dayData = getDayData(index);
            const { totalModules, enabledModules, isLive } = dayData;
            const progressPercentage = (enabledModules / totalModules) * 100;
            
            return (
              <div
                key={`${day}-${index}`}
                onClick={() => handleDayClick(day)}
                className="relative bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between items-center shadow-sm hover:ring-2 hover:ring-indigo-500 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-md"
              >
                {/* Status Badge - Top Corner */}
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
                  {index + 1}
                </div>
                
                {/* Day Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{day}</h3>
                
                {/* Module Status Section */}
                <div className="w-full text-center space-y-3">
                  {/* Module Count */}
                  <div className="text-sm text-gray-600">
                    Modules: <span className="font-semibold text-indigo-600">{enabledModules}/{totalModules}</span> enabled
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
            <p className="text-lg">No matching days found.</p>
            {daySearchTerm && (
              <p className="text-sm mt-2">Try adjusting your search term.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DaysView;