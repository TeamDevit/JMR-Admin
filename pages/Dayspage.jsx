import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

const Dayspage = () => {
  const navigate = useNavigate();
  const [days, setDays] = useState(["Day 1", "Day 2", "Day 3"]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDayClick = (day) => {
    navigate("/adminpanel", { state: { selectedDay: day } });
  };

  const handleAddDay = () => {
    const newDay = `Day ${days.length + 1}`;
    setDays([...days, newDay]);
    navigate("/adminpanel", { state: { selectedDay: newDay } });
  };

  const filteredDays = days.filter(day =>
    day.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
          Days <span className="text-blue-600">Timeline</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">Select a day to view or edit its content.</p>
      </div>

      <div className="w-full max-w-lg mb-8 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for a day..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-lg rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-6 p-4">
        {filteredDays.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(day)}
            className="flex items-center justify-center w-36 h-36 bg-white border-2 border-gray-200 rounded-3xl cursor-pointer
                       shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1
                       hover:border-blue-500 hover:scale-105"
          >
            <div className="text-2xl font-semibold text-gray-700">{day}</div>
          </div>
        ))}
        <button
          onClick={handleAddDay}
          className="flex items-center justify-center w-36 h-36 bg-gray-100 border-2 border-dashed border-gray-300 rounded-3xl
                     text-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                     hover:border-blue-500 hover:text-blue-500 hover:scale-105"
          aria-label="Add a new day"
        >
          <Plus size={48} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default Dayspage;