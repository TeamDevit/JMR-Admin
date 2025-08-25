import React from 'react'
import { useNavigate } from 'react-router-dom';


const Practice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8 font-sans">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)} // go back to previous page
        className="self-start mb-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md
                   hover:bg-blue-600 transition-colors duration-200"
      >
        ← Go Back
      </button>

      {/* Page content */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Practice Page</h1>

      <p className="text-gray-700 text-lg max-w-3xl text-center">
        This is your vocabulary page. You can add content, forms, or interactive elements here
        without the sidebar showing.
      </p>
    </div>
  );
}

export default Practice
