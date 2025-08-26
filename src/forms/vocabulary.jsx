import React from "react"; 
import { useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { FaFileDownload } from "react-icons/fa";

const Vocabulary = () => {
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
        onClick={() => navigate(-1)} 
        className="self-start mb-4 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg shadow-md
                   hover:bg-blue-600 transition-colors duration-200"
      >
        ← back  
      </button>

      {/* Header */}
      <div className="w-full max-w-6xl relative flex items-center justify-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          Vocabulary Page
        </h1>

        {/* Download Template button */}
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

      {/* Upload Section divided in 2 parts */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 mb-8">
        
        {/* Left Part: Input + Upload File */}
        <div className="flex flex-col items-start justify-start bg-white rounded-[20px] shadow-md p-6 w-full md:w-1/2 gap-6">
          
          {/* Avatar Id input with heading */}
          <div className="w-full">
            <h3 className="text-left font-semibold text-gray-700 mb-2">Avatar Id</h3>
            <input
              type="text"
              placeholder="Enter Avatar Id"
              className="w-full h-10 pl-3 rounded-[10px] border-2 border-transparent bg-[#c3c3c3] outline-none transition-all duration-500 
                         hover:border-[#a8b3bd] hover:bg-white hover:shadow-[0_0_0_7px_rgba(74,157,236,0.2)] 
                         focus:border-[#a8b3bd  ] focus:bg-white focus:shadow-[0_0_0_7px_rgba(74,157,236,0.2)]"
            />
          </div>

          {/* Background Images upload with heading */}
          <div className="w-full">
            <h3 className="text-left font-semibold text-gray-700 mb-2">Background Images</h3>
            <label
              htmlFor="fileLeft"
              className="h-[150px] w-full flex flex-col gap-5 cursor-pointer items-center justify-center 
                         border-2 border-dashed border-gray-300 bg-white p-6 rounded-[10px] 
                         shadow-[0px_48px_35px_-48px_rgba(0,0,0,0.1)]"
            >
              {/* Icon */}
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-16 fill-gray-600"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                  />
                </svg>
              </div>

              {/* Text */}
              <div className="flex items-center justify-center">
                <span className="font-normal text-gray-600">Click to upload image</span>
              </div>

              {/* Hidden file input */}
              <input type="file" id="fileLeft" className="hidden" />
            </label>
          </div>
        </div>

        {/* Right Part: Drag and Drop */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <label
            htmlFor="fileInputRight"
            className="cursor-pointer bg-gray-800 w-full px-20 py-16 rounded-[40px] border-2 border-gray-500 border-dashed
                       shadow-[0px_0px_200px_-50px_rgba(0,0,0,0.5)] text-gray-200 flex flex-col items-center justify-center gap-4"
          >
            <svg viewBox="0 0 640 512" className="h-20 mb-6 fill-gray-500">
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
            </svg>
            <p className="text-lg">Drag and Drop</p>
            <p className="text-lg">or</p>
            <span className="bg-gray-500 px-6 py-2 rounded-lg text-gray-200 text-lg transition-colors duration-300 hover:bg-gray-400 hover:text-white">
              Browse file
            </span>
            <input id="fileInputRight" type="file" className="hidden" />
          </label>
        </div>
      </div>

      {/* Generate button */}
      <button
    onClick={handleGenerate}
    className="self-start px-[7em] py-[1.3em] text-[12px] uppercase tracking-[2.5px] font-medium text-black
               bg-sky-400 border-none rounded-[45px] shadow-[0px_8px_15px_rgba(0,0,0,0.1)]
               transition-all duration-300 cursor-pointer outline-none
               flex items-center gap-2
               hover:bg-[#317ca8] hover:shadow-[0px_15px_20px_#317ca861]
               hover:text-white hover:-translate-y-[7px] active:-translate-y-[1px]"
  >
    <BsStars size={20} />
    Generate
  </button>
    </div>
  );
};

export default Vocabulary;
