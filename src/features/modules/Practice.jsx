// src/features/modules/Practice.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Download, Upload, Trash2, CheckCircle } from 'lucide-react';

// Import your custom excel converter and generic module service
import { excelFileToJSON } from '../../utils/excelConverter';
import { handleModuleAction } from '../../services/moduleService'; 


const Practice = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Used to get routing data

    // Get day data from navigation state (necessary for linking module content)
    const { selectedDay } = location.state || {};
    const dayId = selectedDay?.day_id || '65123abc1234def567890123';

    // State for the bulk upload section
    const [excelFile, setExcelFile] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleBack = () => {
        navigate(-1);
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/templates/practice_sentences_template.xlsx";
        link.download = "practice_sentences_template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Template downloaded successfully!");
    };

    const processFileAndSetState = async (file) => {
        if (!file || !file.name.endsWith('.xlsx')) {
            toast.error('Only .xlsx files are supported.');
            setExcelFile(null);
            setExcelData(null);
            return;
        }
        
        setExcelFile(file);
        try {
            // Pass dayId to the converter so each JSON object includes it
            const data = await excelFileToJSON(file, dayId);
            setExcelData(data);
            toast.success(`File processed successfully! ${data.length} records found.`);
        } catch (error) {
            toast.error(error.message);
            setExcelFile(null);
            setExcelData(null);
        }
    };
    
    const handleFileChange = (e) => {
        processFileAndSetState(e.target.files[0]);
    };

    const handleDragOver = (e) => {
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
            processFileAndSetState(files[0]);
        }
    };

    const handleUploadSentences = async () => {
        if (!excelData || excelData.length === 0) {
            toast.error("Please select and process a valid Excel file first.");
            return;
        }

        setIsUploading(true);
        try {
            // Loop through each item and send it individually
            for (const item of excelData) {
                // Use 'create' action and 'practice-sentence' module key
                await handleModuleAction('create', 'practice-sentence', item);
            }
            toast.success(`Successfully uploaded ${excelData.length} practice sentences!`);
            setExcelFile(null);
            setExcelData(null);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Failed to upload sentences.";
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };
    
    // File preview component
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
            <div className="max-w-4xl mx-auto">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleBack}
                        className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow hover:shadow-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <button
                        onClick={handleDownloadTemplate}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-700 to-sky-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-sky-900 hover:to-sky-950 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    >
                        <Download size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Download Template</span>
                    </button>
                </div>

                {/* Main Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-slate-800 bg-clip-text text-transparent mb-4 ">
                        Practice Sentence Upload
                    </h1>
                    <p className="text-gray-600">Bulk upload lesson content using the provided Excel template.</p>
                </div>

                {/* Bulk Upload Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Sentence Data</h2>
                    
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
                        <FilePreview file={excelFile} onRemove={() => { setExcelFile(null); setExcelData(null); }} />
                    )}
                    
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleUploadSentences}
                            disabled={isUploading || !excelData || excelData.length === 0}
                            className={`group relative w-full sm:w-auto px-12 py-3 rounded-xl font-semibold text-lg transition-all duration-300 overflow-hidden 
                                         ${isUploading || !excelData || excelData.length === 0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-teal-700 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-teal-800'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isUploading ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        <span>Upload Sentences ({excelData ? excelData.length : 0})</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Practice;