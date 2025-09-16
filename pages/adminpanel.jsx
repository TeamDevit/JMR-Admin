import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BsStars } from "react-icons/bs";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedDay = location.state?.selectedDay || "Unknown Day";

  const [cardToggles, setCardToggles] = useState(Array(5).fill(false));
  const [isGenerated, setIsGenerated] = useState(false);

  const cards = [
    { title: "Card 1", content: "Overview of system status.", path: "/vocabulary" },
    { title: "Card 2", content: "User analytics and engagement.", path: "/sentence" },
    { title: "Card 3", content: "Recent activity logs.", path: "/practice" },
    { title: "Card 4", content: "Configuration settings.", path: "/settings" },
    { title: "Card 5", content: "Content management tools.", path: "/content" },
  ];

  const handleToggleChange = (index) => {
    const newToggles = [...cardToggles];
    newToggles[index] = !newToggles[index];
    setCardToggles(newToggles);
  };

  const handleCardClick = (index) => {
    navigate(cards[index].path);
  };

  const handleGenerate = () => {
    setIsGenerated(true);
    toast.success("Generated successfully!");
  };

  const handleGoLive = () => {
    if (!isGenerated) {
      toast.error("Generate to enable this option");
      return;
    }
    toast.success("Go Live clicked!");
  };

  const handlePreview = () => {
    if (!isGenerated) {
      toast.error("Generate to enable this option");
      return;
    }
    toast.success("Preview clicked!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <Toaster position="top-right" />

      {/* Top Header with Go Back */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-10">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md 
                     hover:bg-gray-400 transition-colors duration-200"
        >
          ⬅ Go Back
        </button>
        <h1 className="text-4xl font-extrabold text-gray-800 text-center flex-1">
          {selectedDay}
        </h1>
        <div className="w-24" />
      </div>

      {/* Cards */}
      <div className="w-full max-w-6xl flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center relative 
                       hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
          >
            {/* Original Toggle at top-right */}
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
                           ${cardToggles[index] ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div
                  className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full 
                             transition-all duration-300 transform 
                             ${cardToggles[index] ? "translate-x-6" : "translate-x-0"} shadow`}
                ></div>
              </div>
            </label>

            {/* Neumorphic Checkbox at bottom-left */}
            <label
              className="absolute bottom-4 left-4 flex items-center cursor-pointer select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={cardToggles[index]}
                onChange={() => handleToggleChange(index)}
                className="absolute opacity-0 w-0 h-0"
              />

              <div
                className={`relative w-6 h-6 rounded-full transition-all duration-400 
                  shadow-[inset_0.07em_0.07em_0.12em_#b3b3b3,inset_-0.07em_-0.07em_0.12em_#ffffff]
                  ${cardToggles[index] 
                    ? "bg-green-600 shadow-[inset_-0.07em_-0.07em_0.12em_#008300,inset_0.07em_0.07em_0.12em_#9ef99e,0.05em_0.05em_0.1em_-0.05em_#7a7a7a]" 
                    : "bg-gray-300"} 
                `}
              >
                {cardToggles[index] && (
                  <span
                    className="absolute left-1/2 top-1/2 w-1 h-2 border-white border-r-2 border-b-2 
                               transform -translate-x-1/2 -translate-y-1/2 rotate-45"
                  ></span>
                )}
              </div>
            </label>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h2>
            <p className="text-gray-600 leading-relaxed">{card.content}</p>
          </div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="w-full max-w-6xl flex items-center justify-between mt-10">
        

        {/* Right side: Go Live & Preview */}
        <div className="flex gap-4">
          <button
            onClick={handleGoLive}
            disabled={!isGenerated}
            className={`
              px-[3em] py-[1.3em] text-[12px] uppercase tracking-[2.5px] font-medium 
              rounded-[45px] shadow-[0px_8px_15px_rgba(0,0,0,0.1)] transition-all duration-300 
              flex items-center justify-center outline-none
              ${isGenerated 
                ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-[0px_15px_20px_rgba(46,229,157,0.4)] hover:-translate-y-[7px] active:-translate-y-[1px] cursor-pointer" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Go Live
          </button>

          <button
            onClick={handlePreview}
            disabled={!isGenerated}
            className={`px-6 py-3 rounded-full shadow-md transition-colors duration-200 
                        ${isGenerated ? "bg-gray-700 hover:bg-gray-800 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
