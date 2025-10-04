import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import api from '../../utils/api';

const Vocabulary = ({ courses }) => {  // Accept courses prop
    const { courseSlug, dayNumber } = useParams();
    const navigate = useNavigate();

    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [bgImage, setBgImage] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dayId, setDayId] = useState(null);

    const bgFileRef = useRef(null);
    const excelFileRef = useRef(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const res = await api.get("/characters/get-characters");
                if (Array.isArray(res.data)) {
                    setCharacters(res.data);
                    const defaultChar = res.data.find(c => c.is_default);
                    if (defaultChar) setSelectedCharacter(defaultChar._id);
                }
            } catch (error) {
                toast.error("Failed to load characters");
            }
        };
        fetchCharacters();
    }, []);
useEffect(() => {
    const fetchDayId = async () => {
        try {
            const course = courses.find(c => c.code === courseSlug);
            
            if (!course) {
                toast.error("Course not found");
                return;
            }

            const daysRes = await api.get(`/days/course-days/${course._id}`);
            
            // 🔍 DEBUG: See what the API actually returns
            console.log("Days API response:", daysRes.data);
            
            // Handle different response formats
            let daysArray = [];
            if (Array.isArray(daysRes.data)) {
                daysArray = daysRes.data;
            } else if (daysRes.data.days && Array.isArray(daysRes.data.days)) {
                daysArray = daysRes.data.days;
            } else if (daysRes.data.data && Array.isArray(daysRes.data.data)) {
                daysArray = daysRes.data.data;
            } else {
                console.error("Unexpected days response format:", daysRes.data);
                toast.error("Unexpected response format");
                return;
            }
            
            const day = daysArray.find(d => d.day_number === parseInt(dayNumber));
            
            if (!day) {
                toast.error("Day not found");
                return;
            }

            setDayId(day._id);
        } catch (error) {
            console.error("Error fetching day:", error);
            toast.error("Failed to load day information");
        }
    };

    if (courses.length > 0 && courseSlug && dayNumber) {
        fetchDayId();
    }
}, [courses, courseSlug, dayNumber]);
    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/templates/vocabulary_template.xlsx";
        link.download = "vocabulary_template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Template downloaded!");
    };

    const handleGenerate = async () => {
        if (!selectedCharacter) {
            toast.error("Please select a character");
            return;
        }
        if (!excelFile) {
            toast.error("Please upload a vocabulary spreadsheet");
            return;
        }
        if (!dayId) {
            toast.error("Day information not loaded");
            return;
        }

        setIsGenerating(true);
        const loadingToastId = toast.loading("Uploading vocabulary...");

        try {
            const formData = new FormData();
            const character = characters.find(c => c._id === selectedCharacter);
            
            formData.append('avatar_id', character.avatar_id);
            formData.append('voice_id', character.voice_id);
            formData.append('day_id', dayId);
            
            if (bgImage) {
                formData.append('image', bgImage);
            }
            
            formData.append('excel', excelFile);

            const response = await api.post('/modules/vocabulary/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(`✅ Vocabulary uploaded! ${response.data.count} items created.`, {
                id: loadingToastId
            });

            setSelectedCharacter(characters.find(c => c.is_default)?._id || "");
            setBgImage(null);
            setExcelFile(null);

        } catch (error) {
            console.error("Upload FAILED:", error);
            toast.error(error.response?.data?.error || "Failed to upload vocabulary", {
                id: loadingToastId
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        const xlsxFile = files.find(f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls'));
        
        if (xlsxFile) {
            setExcelFile(xlsxFile);
            toast.success("Excel file added");
        } else {
            toast.error("Only .xlsx or .xls files accepted");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition">
                        ← Back
                    </button>
                    <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-700 to-sky-900 text-white rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium">Download Template</span>
                    </button>
                </div>

                <h1 className="text-4xl font-bold text-gray-800 mb-8">Vocabulary Generator</h1>

                <div className="grid lg:grid-cols-2 gap-8">
                    
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-semibold mb-3">Select Character</h3>
                            <select
                                value={selectedCharacter}
                                onChange={(e) => setSelectedCharacter(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 outline-none"
                            >
                                <option value="">Choose a character...</option>
                                {characters.map(char => (
                                    <option key={char._id} value={char._id}>
                                        {char.name} {char.is_default ? '(Default)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-semibold mb-3">Background Image (Optional)</h3>
                            <input ref={bgFileRef} type="file" accept="image/*" onChange={(e) => setBgImage(e.target.files[0])} className="hidden" />
                            <div onClick={() => bgFileRef.current?.click()} className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition">
                                {bgImage ? (
                                    <p className="text-green-600">✓ {bgImage.name}</p>
                                ) : (
                                    <p className="text-gray-500">Click to upload image</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-3">Vocabulary Spreadsheet</h3>
                        <input ref={excelFileRef} type="file" accept=".xlsx,.xls" onChange={(e) => setExcelFile(e.target.files[0])} className="hidden" />
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => excelFileRef.current?.click()}
                            className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition ${
                                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                            }`}
                        >
                            {excelFile ? (
                                <p className="text-green-600 text-lg">✓ {excelFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-xl font-semibold text-gray-700">Drag & Drop Excel File</p>
                                    <p className="text-gray-500 mt-2">or click to browse</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !selectedCharacter || !excelFile || !dayId}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isGenerating ? "Generating..." : "Generate Vocabulary Videos"}
                    </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Day: {dayId ? <span className="text-green-600 font-semibold">Loaded</span> : <span className="text-yellow-600">Loading...</span>}
                </div>
            </div>
        </div>
    );
};

export default Vocabulary;