// src/features/modules/AvatarToStudent.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Download, Upload, Trash2, CheckCircle, Sparkles } from 'lucide-react';

// Import your custom excel converter and generic module service
import { excelFileToJSON } from '../../utils/excelConverter';
import { handleModuleAction } from '../../services/moduleService'; 


const AvatarToStudent = () => {
    const navigate = useNavigate();

    // State for the bulk upload section
    const [excelFile, setExcelFile] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // States for the other sections
    const [avatarId, setAvatarId] = useState("");
    const [bgImages, setBgImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [focusedInput, setFocusedInput] = useState("");
    const [progress, setProgress] = useState(0);
    const bgFileRef = useRef(null);
    
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
    
    const handleBack = () => {
        navigate(-1);
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/templates/avatar_student_template.xlsx";
        link.download = "avatar_student_template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Template downloaded successfully!");
    };
    
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.xlsx')) {
            setExcelFile(file);
            toast.success('File ready to upload!');
            try {
                const data = await excelFileToJSON(file);
                setExcelData(data);
                console.log("Converted JSON data ready to send:", data);
            } catch (error) {
                toast.error(error.message);
                setExcelFile(null);
                setExcelData(null);
            }
        } else {
            toast.error('Only .xlsx files are supported.');
            setExcelFile(null);
            setExcelData(null);
        }
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

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
             if (files[0].name.endsWith('.xlsx')) {
                setExcelFile(files[0]);
                toast.success('File ready to upload!');
                try {
                    const data = await excelFileToJSON(files[0]);
                    setExcelData(data);
                    console.log("Converted JSON data ready to send:", data);
                } catch (error) {
                    toast.error(error.message);
                    setExcelFile(null);
                    setExcelData(null);
                }
            } else {
                toast.error('Only .xlsx files are supported.');
                setExcelFile(null);
                setExcelData(null);
            }
        }
    };

    const handleGenerate = async () => {
        if (!excelData || excelData.length === 0) {
            toast.error("Please upload a valid Excel file first.");
            return;
        }

        setIsGenerating(true);
        try {
            for (const item of excelData) {
                await handleModuleAction('create', 'avatar-to-student', item);
            }
            toast.success(`Successfully uploaded ${excelData.length} records!`);
            setExcelFile(null);
            setExcelData(null);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Failed to upload data.";
            toast.error(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 font-inter">
            <Toaster />
            <div className="max-w-7xl mx-auto">
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
                        Avatar to Student Conversion
                    </h1>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Left Column - Avatar & Background */}
                    <div className="space-y-6">
                        {/* Avatar ID Section */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Sparkles className="text-blue-500 animate-pulse" />
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
                                        <CheckCircle className="text-green-500 animate-bounce" />
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
                                <Upload className="text-green-500" />
                                Background Images
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
                                    onChange={(e) => setBgImages(Array.from(e.target.files))}
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
                                        <Upload className="text-blue-600" />
                                    </div>
                                    <p className="text-gray-700 font-medium">Click to upload images</p>
                                    <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                                </div>
                                
                                {bgImages.length > 0 && 
                                    <div className="mt-4 space-y-2">
                                        {bgImages.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between text-sm text-gray-700 bg-gray-100 p-3 rounded-md">
                                                <span className="truncate">{file.name}</span>
                                                <button onClick={() => setBgImages(bgImages.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Bulk Upload via Excel */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bulk Upload via Excel</h2>
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
                
                {/* Single Generate Button for the whole form */}
                <div className="flex justify-center mb-8">
                    <div className="w-full max-w-md">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !excelData || excelData.length === 0}
                            className={`group relative w-full px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 overflow-hidden mb-4
                                         ${isGenerating || !excelData || excelData.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 active:translate-y-0'}`}
                        >
                            <div className="flex items-center justify-center gap-3 relative z-10">
                                {isGenerating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="group-hover:rotate-12 transition-transform" />
                                        <span>Generate & Upload</span>
                                    </>
                                )}
                            </div>
                            
                            {!isGenerating && excelData && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarToStudent;