import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowRight, Rocket, Eye } from 'lucide-react';

const ModulesView = ({ 
  selectedCourse, 
  selectedDay, 
  moduleStates, 
  handleModuleToggle, 
  setSelectedModule, 
  setCurrentView, 
  handleGoBack 
}) => {
  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-7xl flex items-center justify-between mb-12">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowRight className="rotate-180" size={16} />
          <span>Change Day</span>
        </button>
        <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">Admin Dashboard</h1>
        <div className="w-24" />
      </div>

      <div className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Modules for: <span className="text-indigo-600">{selectedCourse.name}</span>
          <span className="text-gray-500 mx-2">/</span>
          <span className="text-indigo-600">{selectedDay}</span>
        </h2>
      </div>

      <div className="w-full max-w-7xl flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleStates.map((module, index) => {
          const Icon = module.icon;
          const isCompleted = module.status === 'Active';

          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between shadow-sm
                hover:ring-2 hover:ring-indigo-500 transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => {
                setSelectedModule(module);
                setCurrentView('module-form');
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="p-3 mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-2">{module.title}</h3>
                </div>
                <label className="flex items-center cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isCompleted}
                    onChange={() => handleModuleToggle(module.title)}
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}>
                    <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 transform ${isCompleted ? "translate-x-6" : "translate-x-0"} shadow-md`}></div>
                  </div>
                </label>
              </div>

              <p className="text-sm text-gray-600 mt-4 leading-relaxed flex-grow">
                {module.content}
              </p>
              <div className="mt-6 flex items-center text-sm font-medium">
                <span className={`h-2.5 w-2.5 rounded-full mr-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className={`${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>{isCompleted ? "Completed" : "In Progress"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-7xl flex items-center justify-center gap-6 mt-12">
        <button
          onClick={() => toast.success("Content for the selected day is now live!")}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          <Rocket size={18} className="inline-block mr-2" />
          Go Live
        </button>
        <button
          onClick={() => toast.success("Preview loaded!")}
          className="px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          <Eye size={18} className="inline-block mr-2" />
          Preview
        </button>
      </div>
    </div>
  );
};

export default ModulesView;