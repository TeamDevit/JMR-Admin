import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Dayspage = () => {
  const navigate = useNavigate();
  const [days, setDays] = useState(["Day 1", "Day 2", "Day 3"]);

  const handleDayClick = (day) => {
    // Navigate to AdminPanel with selected day info
    navigate("/adminpanel", { state: { selectedDay: day } });
  };

  const handleAddDay = () => {
    const newDay = `Day ${days.length + 1}`;
    setDays([...days, newDay]);
    navigate("/adminpanel", { state: { selectedDay: newDay } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Select a Day
      </h1>

      <div className="flex flex-wrap gap-4 justify-center">
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(day)}
            className="px-6 py-3 bg-blue-500 text-white rounded-full cursor-pointer shadow-md 
                       hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            {day}
          </div>
        ))}

        <button
          onClick={handleAddDay}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white shadow-md 
                     hover:bg-green-600 transition-transform transform hover:scale-110"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default Dayspage;
