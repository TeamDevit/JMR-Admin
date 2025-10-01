// src/features/modules/Quiz.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Download, Upload, Trash2, CheckCircle } from 'lucide-react';

// Import your custom excel converter and generic module service
import { excelFileToJSON } from '../../utils/excelConverter';
import { handleModuleAction } from '../../services/moduleService'; 


const Quiz = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get course and day data from navigation state
    const { selectedDay } = location.state || {};
    const dayId = selectedDay?.day_id || '65123abc1234def567890123';

    // State for the bulk upload section (for a single file)
    const [excelFile, setExcelFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleBack = () => {
        navigate(-1);
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/templates/quiz_template.xlsx";
        link.download = "quiz_template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Template downloaded successfully!");
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
            if (files[0].name.endsWith('.xlsx')) {
                setExcelFile(files[0]);
                toast.success('File ready to upload!');
            } else {
                toast.error('Only .xlsx files are supported.');
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.xlsx')) {
            setExcelFile(file);
            toast.success('File ready to upload!');
        } else {
            toast.error('Only .xlsx files are supported.');
            setExcelFile(null);
        }
    };

    const handleUploadExcel = async () => {
        if (!excelFile) {
            toast.error('Please select an Excel file to upload.');
            return;
        }

        try {
            const quizzesToUpload = await excelFileToJSON(excelFile, dayId);
            
            // Log the correctly formatted JSON payload
            console.log("Payload sent to API:", quizzesToUpload);

            // Post to the new endpoint
            await handleModuleAction('createBulk', 'quiz', quizzesToUpload);
            setExcelFile(null);
            toast.success("Quizzes uploaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload quizzes. Please check the file format.");
        }
    };
    
    // File preview component for a single file
    const FilePreview = ({ file, onRemove }) => (
        <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-700 bg-green-50 p-3 rounded-md">
                <span className="truncate">{file.name}</span>
                <button onClick={onRemove} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 font-inter">
            <Toaster />
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
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                </div>

                {/* Main Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-slate-800 bg-clip-text text-transparent mb-4 ">
                        Quiz
                    </h1>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Bulk Upload Quizzes */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300 col-span-2">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bulk Upload Quizzes via Excel</h2>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={handleDownloadTemplate}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                            >
                                <Download size={16} />
                                <span>Download Template</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleUploadExcel}
                                disabled={!excelFile}
                                className={`flex items-center space-x-2 px-4 py-2 text-sm text-white rounded-md transition-colors duration-200
                                         ${excelFile ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                <Upload size={16} />
                                <span>Upload Quizzes</span>
                            </button>
                        </div>
                        
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`group cursor-pointer h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-4 transition-colors duration-300
                                         ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                        >
                            <Upload size={32} className={`mb-2 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <p className={`font-medium ${isDragging ? 'text-indigo-700' : 'text-gray-700'}`}>
                                {isDragging ? 'Drop your file here' : 'Drag & drop your .xlsx file here, or click to select'}
                            </p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".xlsx"
                                className="hidden"
                            />
                        </div>
                        {excelFile && (
                            <FilePreview file={excelFile} onRemove={() => setExcelFile(null)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;