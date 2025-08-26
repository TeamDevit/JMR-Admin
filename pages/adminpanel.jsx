import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ListTree, BarChart, ScrollText, Settings, ClipboardList, Rocket, Eye } from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedDay = location.state?.selectedDay || "Unknown Day";

  // State to manage the card selection toggles
  const [cardToggles, setCardToggles] = useState(Array(5).fill(false));

  // Array of card data, now including an icon component for each
  const cards = [
    { title: "Vocabulary", content: "Manage and update vocabulary lists.", path: "/vocabulary", icon: ListTree },
    { title: "Analytics", content: "Analyze user engagement and performance.", path: "/sentence", icon: BarChart },
    { title: "Activity Logs", content: "View and filter recent system activities.", path: "/practice", icon: ScrollText },
    { title: "Settings", content: "Adjust system configuration and preferences.", path: "/settings", icon: Settings },
    { title: "Content", content: "Manage and organize content assets.", path: "/content", icon: ClipboardList },
  ];

  // Handler for the top-right toggle switch
  const handleToggleChange = (index) => {
    const newToggles = [...cardToggles];
    newToggles[index] = !newToggles[index];
    setCardToggles(newToggles);
  };

  // Handler for card clicks, navigating to the specified path
  const handleCardClick = (index) => {
    navigate(cards[index].path);
  };

  // Handler for the 'Go Live' button, now always enabled
  const handleGoLive = () => {
    toast.success("Content is now live!");
  };

  // Handler for the 'Preview' button, now always enabled
  const handlePreview = () => {
    toast.success("Preview loaded!");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8 flex flex-col items-center font-inter">
      <Toaster position="top-right" />

      {/* Top Header with Go Back and Day */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-10">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow-lg hover:bg-gray-400 transition-colors duration-200"
        >
          ⬅ Go Back
        </button>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-800 text-center flex-1">
          {selectedDay}
        </h1>
        <div className="w-24" /> {/* Spacer div */}
      </div>

      {/* Cards Grid */}
      <div className="w-full max-w-6xl flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => {
          const Icon = card.icon; // Get the icon component from the card data
          return (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              className="bg-white rounded-3xl border border-gray-200 p-8 flex flex-col items-center text-center relative
                         shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
            >
              {/* Top-right toggle (Kept as requested) */}
              <label
                className="absolute top-4 right-4 flex items-center cursor-pointer select-none"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={cardToggles[index]}
                  onChange={() => handleToggleChange(index)}
                />
                <div
                  className={`relative w-12 h-6 rounded-full transition-all duration-300
                             ${cardToggles[index] ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gray-300"}`}
                >
                  <div
                    className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full
                               transition-all duration-300 transform
                               ${cardToggles[index] ? "translate-x-6" : "translate-x-0"} shadow`}
                  ></div>
                </div>
              </label>

              {/* Card Icon */}
              <div className="text-purple-600 mb-6 transition-transform duration-300 group-hover:scale-110">
                <Icon size={48} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h2>
              <p className="text-gray-600 leading-relaxed">{card.content}</p>

              {/* Bottom-left "Completed" status indicator */}
              <div
                className={`absolute bottom-4 left-4 flex items-center justify-center h-8 px-4 rounded-full transition-all duration-300 ease-in-out
                           ${cardToggles[index] ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}
              >
                {cardToggles[index] ? (
                  <span className="font-semibold text-sm">Completed</span>
                ) : (
                  <span className="font-semibold text-sm">In Progress</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Buttons */}
      <div className="w-full max-w-6xl flex items-center justify-center gap-6 mt-10">
        <button
          onClick={handleGoLive}
          className={`
            px-[3em] py-[1.3em] text-[12px] uppercase tracking-[2.5px] font-medium
            rounded-[45px] shadow-lg transition-all duration-300
            flex items-center justify-center outline-none gap-2
            bg-green-500 text-white hover:bg-green-600 hover:shadow-[0px_15px_20px_rgba(46,229,157,0.4)] hover:-translate-y-[7px] active:-translate-y-[1px] cursor-pointer
          `}
        >
          <Rocket size={18} />
          Go Live
        </button>

        <button
          onClick={handlePreview}
          className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-colors duration-200
                      bg-gray-700 hover:bg-gray-800 text-white font-semibold`}
        >
          <Eye size={18} />
          Preview
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
