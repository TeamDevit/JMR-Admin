import React from "react"; 
import { useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { FaFileDownload } from "react-icons/fa";


const Practice = () => {
  const navigate = useNavigate();
  
    const handleGenerate = () => {
      alert("Generate clicked!"); // replace with your actual logic
    };
  
    const handleDownloadTemplate = () => {
      alert("Download Template clicked!"); // replace with actual download logic
    };
  
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8 font-sans relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)} // go back to previous page
          className="self-start mb-4 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg shadow-md
                     hover:bg-blue-600 transition-colors duration-200"
        >
          ← back  
        </button>
  
        {/* Header */}
        <div className="w-full max-w-6xl relative flex items-center justify-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center">
           Practice Page
          </h1>
  
          {/* Download Template button top-right */}
  
  
  <button
    onClick={handleDownloadTemplate}
    className="absolute top-0 right-0 flex items-center gap-2 text-[#090909] px-7 py-3 text-lg rounded-md bg-[#e8e8e8] border border-[#e8e8e8] 
               shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] 
               transition-all duration-300 cursor-pointer 
               hover:border-white active:shadow-[4px_4px_12px_#c5c5c5,-4px_-4px_12px_#ffffff]"
  >
    <FaFileDownload size={20} />
    Download Template 
  </button>
  
        </div>
  
        <p className="text-gray-700 text-lg max-w-3xl text-center mb-8">
          This is your vocabulary page. You can add content, forms, or interactive elements here
          without the sidebar showing.
        </p>
  
        {/* File Upload Form */}
        <form className="flex items-center justify-center w-full mb-8">
          <label
            htmlFor="file"
            className="cursor-pointer bg-gray-800 w-full max-w-4xl px-20 py-16 rounded-[40px] border-2 border-gray-500 border-dashed
                       shadow-[0px_0px_200px_-50px_rgba(0,0,0,0.5)] text-gray-200 flex flex-col items-center justify-center gap-4 mx-4"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <svg viewBox="0 0 640 512" className="h-20 mb-6 fill-gray-500">
                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
              </svg>
              <p className="text-lg">Drag and Drop</p>
              <p className="text-lg">or</p>
              <span className="bg-gray-500 px-6 py-2 rounded-lg text-gray-200 text-lg transition-colors duration-300 hover:bg-gray-400 hover:text-white">
                Browse file
              </span>
            </div>
            <input id="file" type="file" className="hidden" />
          </label>
        </form>
  
        {/* Generate button below file upload */}
        <button
          onClick={handleGenerate}
          className="px-[8em] py-[1.3em] text-[12px] uppercase tracking-[2.5px] font-medium text-black
                     bg-white border-none rounded-[45px] shadow-[0px_8px_15px_rgba(0,0,0,0.1)]
                     transition-all duration-300 cursor-pointer outline-none
                     flex items-center gap-2
                     hover:bg-[#8b33ad] hover:shadow-[0px_15px_20px_#8b33ad61]
                     hover:text-white hover:-translate-y-[7px] active:-translate-y-[1px]"
        >
          <BsStars size={20} />
          Generate
        </button>
      </div>
    );
}

export default Practice
