import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ListTree, BarChart, ScrollText, Settings, ClipboardList, Rocket, Eye, BrainCircuit, Handshake, ArrowRight, XCircle } from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedDay = location.state?.selectedDay || "Unknown Day";

  const [cardToggles, setCardToggles] = useState(Array(6).fill(false));

  const cards = [
    { title: "Vocabulary", content: "Manage and update vocabulary lists.", path: "/vocabulary", icon: ListTree, status: "Active" },
    { title: "Sentence Pronunciation", content: "Analyze user engagement and performance.", path: "/sentence", icon: BrainCircuit, status: "Draft" },
    { title: "Practice Speaking", content: "View and filter recent system activities.", path: "/practice", icon: ScrollText, status: "Active" },
    { title: "Conversation-Avatar to Student", content: "Manage and organize content assets.", path: "/avatartostudent", icon: Handshake, status: "Draft" },
    { title: "Conversation-Student To Avatar", content: "Manage and organize content assets.", path: "/studenttoavatar", icon: ClipboardList, status: "Active" },
    { title: "Quiz", content: "Adjust system configuration and preferences.", path: "/quiz", icon: Settings, status: "Draft" },
  ];

  const handleToggleChange = (index) => {
    const newToggles = [...cardToggles];
    newToggles[index] = !newToggles[index];
    setCardToggles(newToggles);
    toast.success(`Module is now ${newToggles[index] ? 'Active' : 'Draft'}!`);
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleGoLive = () => {
    toast.success("Content for the selected day is now live!");
  };

  const handlePreview = () => {
    toast.success("Preview loaded!");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans flex flex-col items-center">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Top Header with Go Back and Day */}
      <div className="w-full max-w-7xl flex items-center justify-between mb-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowRight className="rotate-180" size={16} />
          <span>Go Back</span>
        </button>
        <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">
          Admin Dashboard
        </h1>
        <div className="w-24" />
      </div>
      
      {/* Day Selector */}
      <div className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Modules for: <span className="text-indigo-600">{selectedDay}</span>
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="w-full max-w-7xl flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isActive = cardToggles[index];

          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between shadow-sm
                hover:ring-2 hover:ring-indigo-500 transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => handleCardClick(card.path)}
            >
              {/* Card Header with Icon, Title, and Toggle */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  {/* Icon with circular background */}
                  <div className="p-3 mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-2">{card.title}</h3>
                </div>
                {/* Toggle Switch */}
                <label className="flex items-center cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isActive}
                    onChange={() => handleToggleChange(index)}
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isActive ? "bg-green-500" : "bg-gray-300"}`}>
                    <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 transform ${isActive ? "translate-x-6" : "translate-x-0"} shadow-md`}></div>
                  </div>
                </label>
              </div>

              {/* Card Content */}
              <p className="text-sm text-gray-600 mt-4 leading-relaxed flex-grow">
                {card.content}
              </p>

              {/* Status Indicator at the bottom */}
              <div className="mt-6 flex items-center text-sm font-medium">
                <span className={`h-2.5 w-2.5 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className={`${isActive ? 'text-green-600' : 'text-gray-500'}`}>{isActive ? "completed" : "in progress"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Buttons */}
      <div className="w-full max-w-7xl flex items-center justify-center gap-6 mt-12">
        <button
          onClick={handleGoLive}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          <Rocket size={18} className="inline-block mr-2" />
          Go Live
        </button>

        <button
          onClick={handlePreview}
          className="px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          <Eye size={18} className="inline-block mr-2" />
          Preview
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;