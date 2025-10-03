import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'; 

// --- Mock API function for demonstration (Used for Generation Logic) ---
import { handleModuleAction } from '../../services/moduleService'; // Adjust path as needed

// ---------------------------------------------


const Vocabulary = () => {
    // --- STATE MANAGEMENT (All defined in the outer scope) ---
    const [avatarId, setAvatarId] = useState("");
    const [bgImages, setBgImages] = useState([]);
    const [dragDropFiles, setDragDropFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false); // ✅ Correctly defined here
    const [isGenerating, setIsGenerating] = useState(false);
    const [focusedInput, setFocusedInput] = useState("");
    
    const bgFileRef = useRef(null);
    const dragDropRef = useRef(null);
    const fileInputRef = useRef(null);

    // --- ICON COMPONENTS ---
    // (Omitted for brevity, assumed correct from your input)
    // ... (StarIcon, CheckIcon, UploadIcon, ArrowLeftIcon, DownloadIcon, CloseIcon, SparklesIcon)

    // --- Custom Icons as SVG components (Included for completeness) ---
    const StarIcon = () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
    const CheckIcon = () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    );
    const UploadIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    );
    const ArrowLeftIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    );
    const DownloadIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
    const CloseIcon = () => (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
    const SparklesIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    );

    const navigate = useNavigate();

    // --- HANDLERS ---
    const handleBack = () => {
        navigate(-1);
    };

const handleGenerate = async () => {
    if (!avatarId.trim()) {
        toast.error("Please enter an Avatar ID.");
        return;
    }
    if (dragDropFiles.length === 0) {
        toast.error("Please upload a vocabulary spreadsheet.");
        return;
    }
    
    setIsGenerating(true);
    const loadingToastId = toast.loading("Uploading and processing vocabulary..."); 
    
    try {
        const formData = new FormData();
        
        // ✅ FIXED: Use correct field names that match backend
        formData.append('avatar_id', avatarId.trim());
        
        // ✅ Only one image (backend expects single image)
        if (bgImages.length > 0) {
            formData.append('image', bgImages[0]); // Backend expects 'image', not 'bgImages'
        }
        
        // ✅ Only one excel file (backend expects single excel)
        if (dragDropFiles.length > 0) {
            formData.append('excel', dragDropFiles[0]); // Backend expects 'excel', not 'vocabularyFiles'
        }
        
        // Make direct API call (not using moduleService since that doesn't match your backend)
        const response = await api.post('/modules/bulk-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        toast.success(`✅ Vocabulary uploaded! ${response.data.count} items created.`, { 
            id: loadingToastId 
        });
        
        // Clear form
        setAvatarId('');
        setBgImages([]);
        setDragDropFiles([]);
        
    } catch (error) {
        console.error("Upload FAILED:", error);
        toast.error(error.response?.data?.error || "Failed to upload vocabulary", { 
            id: loadingToastId 
        });
    } finally {
        setIsGenerating(false);
    }
};
    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/templates/vocabulary_template.xlsx";
        link.download = "vocabulary_template.xlsx"; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Template download started!");
    };

    const handleBgImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setBgImages(prev => [...prev, ...files]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const xlsxFiles = files.filter(file => 
                file.name.endsWith('.xlsx') || 
                file.name.endsWith('.xls')
            );

            if(xlsxFiles.length > 0) {
                setDragDropFiles(prev => [...prev, ...xlsxFiles]);
                toast.success(`${xlsxFiles.length} spreadsheet file(s) added.`);
            } else {
                toast.error("Only .xlsx or .xls files are accepted for vocabulary.");
            }
            
            const dropArea = e.currentTarget;
            dropArea.classList.add('bg-green-100', 'border-green-400');
            setTimeout(() => {
                dropArea.classList.remove('bg-green-100', 'border-green-400');
            }, 1000);
        }
    };

    const handleDragDropFileSelect = (e) => {
        const files = Array.from(e.target.files);
        
        const xlsxFiles = files.filter(file => 
            file.name.endsWith('.xlsx') || 
            file.name.endsWith('.xls')
        );

        if(xlsxFiles.length > 0) {
            setDragDropFiles(prev => [...prev, ...xlsxFiles]);
            toast.success(`${xlsxFiles.length} spreadsheet file(s) added.`);
        } else {
            if (files.length > 0) {
                toast.error("Only .xlsx or .xls files are accepted for vocabulary.");
            }
        }
    };

    const removeFile = (index, type) => {
        if (type === 'bg') {
            setBgImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setDragDropFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    // --- INNER COMPONENTS (MUST NOT USE isDragging, which is in the parent scope) ---
    const FilePreview = ({ files, type }) => (
        <div className="mt-3 space-y-2">
            {files.map((file, index) => (
                <div 
                    key={index} 
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border hover:bg-gray-100 transition-colors duration-200"
                >
                    <div className="flex items-center space-x-2">
                        <CheckIcon className="text-green-500" />
                        <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                        <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                    </div>
                    <button
                        onClick={() => removeFile(index, type)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-100"
                        aria-label="Remove file"
                    >
                        <CloseIcon />
                    </button>
                </div>
            ))}
        </div>
    );

    // --- EFFECTS ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setFocusedInput('avatar');
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

    // Helper to determine button disabled state
    const isButtonDisabled = isGenerating || !avatarId.trim() || dragDropFiles.length === 0;

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 font-inter">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="max-w-7xl mx-auto">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleBack}
                        className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm 
                            border border-gray-200 rounded-xl shadow hover:shadow-md 
                            text-gray-700 hover:text-gray-900 hover:bg-gray-100 
                            transition-all duration-300"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <button
                        onClick={handleDownloadTemplate}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-700 to-sky-900
                            text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                            hover:from-sky-900 hover:to-sky-950 hover:-translate-y-0.5
                            active:translate-y-0 active:scale-95"
                    >
                        <DownloadIcon className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Download Template</span>
                    </button>
                </div>

                {/* Main Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-slate-800
                            bg-clip-text text-transparent mb-4 ">
                        Vocabulary Video Generator
                    </h1>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    
                    {/* Left Column - Avatar & Background */}
                    <div className="space-y-6">
                        {/* Avatar ID Section */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <SparklesIcon className="text-blue-500 animate-pulse" />
                                Avatar Configuration
                            </h3>
                            
                            <div className="relative">
                                <input
                                    type="text"
                                    value={avatarId}
                                    onChange={(e) => setAvatarId(e.target.value)}
                                    onFocus={() => setFocusedInput('avatar')}
                                    onBlur={() => setFocusedInput('')}
                                    placeholder="Enter your unique Avatar ID"
                                    className={`w-full h-14 px-4 rounded-xl border-2 bg-white/50 backdrop-blur-sm
                                        outline-none transition-all duration-300 text-gray-800 font-medium
                                        placeholder-gray-500 ${
                                            focusedInput === 'avatar'
                                                ? 'border-blue-400 bg-white shadow-lg shadow-blue-100 scale-[1.02]'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-white/70'
                                        }`}
                                />
                                {avatarId && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <CheckIcon className="text-green-500 animate-bounce" />
                                    </div>
                                )}
                            </div>
                            
                            {avatarId && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-fadeIn">
                                    <p className="text-sm text-blue-700">
                                        Avatar ID set to: <span className="font-semibold">{avatarId}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Background Images Section */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <UploadIcon className="text-green-500" />
                                Background Images (Optional)
                                {bgImages.length > 0 && (
                                    <span className="ml-auto text-sm font-normal text-gray-500">
                                        {bgImages.length} file{bgImages.length !== 1 ? 's' : ''} selected
                                    </span>
                                )}
                            </h3>
                            
                            <div className="relative">
                                <input
                                    ref={bgFileRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleBgImageUpload}
                                    className="hidden"
                                />
                                
                                <div
                                    onClick={() => bgFileRef.current?.click()}
                                    className="group cursor-pointer h-40 border-2 border-dashed border-gray-300
                                        rounded-xl bg-gradient-to-br from-gray-50 to-blue-50
                                        hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400
                                        transition-all duration-300 flex flex-col items-center justify-center
                                        hover:shadow-lg hover:scale-[1.02] active:scale-100"
                                >
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3
                                            group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                                        <UploadIcon className="text-blue-600" />
                                    </div>
                                    <p className="text-gray-700 font-medium">Click to upload images</p>
                                    <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                                </div>
                                
                                {bgImages.length > 0 && <FilePreview files={bgImages} type="bg" />}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Drag & Drop (XLSX) */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <UploadIcon className="text-purple-500" />
                            Vocabulary Spreadsheet (.xlsx)
                            {dragDropFiles.length > 0 && (
                                <span className="ml-auto text-sm font-normal text-gray-500">
                                    {dragDropFiles.length} file{dragDropFiles.length !== 1 ? 's' : ''} selected
                                </span>
                            )}
                        </h3>
                        
                        <input
                            ref={dragDropRef}
                            type="file"
                            multiple
                            accept=".xlsx,.xls"
                            onChange={handleDragDropFileSelect}
                            className="hidden"
                        />
                        
                        <div
                            ref={fileInputRef}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => dragDropRef.current?.click()}
                            className={`group cursor-pointer h-80 border-2 border-dashed rounded-2xl
                                transition-all duration-300 flex flex-col items-center justify-center
                                ${isDragging // ✅ isDragging state is correctly used here
                                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                                    : 'border-gray-300 bg-gradient-to-br from-slate-800 to-gray-900 hover:from-slate-700 hover:to-gray-800'
                                }`}
                        >
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all
                                    ${isDragging ? 'bg-blue-200 scale-110' : 'bg-gray-700 group-hover:bg-gray-600'}`}>
                                <svg viewBox="0 0 640 512" className={`h-10 transition-all ${isDragging ? 'fill-blue-600' : 'fill-gray-300'}`}>
                                    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
                                </svg>
                            </div>
                            
                            <div className="text-center">
                                <p className={`text-xl font-semibold mb-2 ${isDragging ? 'text-blue-700' : 'text-gray-200'}`}>
                                    {isDragging ? 'Drop your spreadsheet here' : 'Drag & Drop XLSX File'}
                                </p>
                                <p className={`mb-4 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`}>or</p>
                                <span className={`px-6 py-3 rounded-xl font-medium transition-all
                                        ${isDragging 
                                            ? 'bg-blue-600 text-white scale-110' 
                                            : 'bg-gray-600 text-gray-200 group-hover:bg-gray-500 group-hover:text-white'
                                        }`}>
                                    Browse Files
                                </span>
                            </div>
                        </div>
                        
                        {/* THIS LINE IS WHERE THE ERROR OCCURRED IF isDragging WAS USED INSIDE FilePreview */}
                        {dragDropFiles.length > 0 && <FilePreview files={dragDropFiles} type="drag" />}
                    </div>
                </div>

                {/* Generate Button with Progress */}
                <div className="flex justify-center mb-8">
                    <div className="w-full max-w-md">
                        <button
                            onClick={handleGenerate}
                            disabled={isButtonDisabled}
                            className={`group relative w-full px-12 py-4 rounded-2xl font-semibold text-lg
                                transition-all duration-300 overflow-hidden mb-4
                                ${isButtonDisabled
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 active:translate-y-0'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-3 relative z-10">
                                {isGenerating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <StarIcon className="group-hover:rotate-12 transition-transform" />
                                        <span>Generate Video</span>
                                    </>
                                )}
                            </div>
                            
                            {!isGenerating && avatarId.trim() && dragDropFiles.length > 0 && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                                        -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Vocabulary;