import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import api from '../../utils/api';

const Practice = ({ courses }) => {
    const { courseSlug, dayNumber } = useParams();
    const navigate = useNavigate();

    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [excelFile, setExcelFile] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dayId, setDayId] = useState(null);

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
                
                let daysArray = [];
                if (Array.isArray(daysRes.data)) {
                    daysArray = daysRes.data;
                } else if (daysRes.data.days) {
                    daysArray = daysRes.data.days;
                } else if (daysRes.data.data) {
                    daysArray = daysRes.data.data;
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
        link.href = "/templates/practice_sentences_template.xlsx"; 
        link.download = "practice_sentences_template.xlsx";
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
            toast.error("Please upload practice spreadsheet");
            return;
        }
        if (!dayId) {
            toast.error("Day information not loaded");
            return;
        }

        setIsGenerating(true);
        const loadingToastId = toast.loading("Uploading practice items...");

        try {
            const formData = new FormData();
            const character = characters.find(c => c._id === selectedCharacter);
            
            formData.append('day_id', dayId);
            formData.append('avatar_id', character.avatar_id);
            formData.append('voice_id', character.voice_id);
            formData.append('excel', excelFile);

            const response = await api.post('/modules/practice/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(`✅ Practice uploaded! ${response.data.count} items created`, {
                id: loadingToastId
            });

            setSelectedCharacter(characters.find(c => c.is_default)?._id || "");
            setExcelFile(null);

        } catch (error) {
            toast.error(error.response?.data?.error || "Upload failed", {
                id: loadingToastId
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <Toaster position="top-right" />
            <div className="max-w-5xl mx-auto">
                
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
                
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Practice Generator</h1>

                <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
                    <h3 className="text-lg font-semibold mb-3">Select Character</h3>
                    <select
                        value={selectedCharacter}
                        onChange={(e) => setSelectedCharacter(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 outline-none"
                    >
                        <option value="">Choose character...</option>
                        {characters.map(char => (
                            <option key={char._id} value={char._id}>
                                {char.name} {char.is_default ? '(Default)' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
                    <h3 className="text-lg font-semibold mb-3">Practice Spreadsheet</h3>
                    <input ref={excelFileRef} type="file" accept=".xlsx,.xls" onChange={(e) => setExcelFile(e.target.files[0])} className="hidden" />
                    <div
                        onClick={() => excelFileRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed rounded-xl p-12 text-center border-gray-300 hover:border-blue-400 transition"
                    >
                        {excelFile ? (
                            <p className="text-green-600 text-lg">✓ {excelFile.name}</p>
                        ) : (
                            <p className="text-xl font-semibold text-gray-700">Click to upload Excel</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !selectedCharacter || !excelFile || !dayId}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isGenerating ? "Generating..." : "Generate Practice"}
                    </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Day: {dayId ? <span className="text-green-600 font-semibold">Loaded</span> : <span className="text-yellow-600">Loading...</span>}
                </div>
            </div>
        </div>
    );
};

export default Practice;