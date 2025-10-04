import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import api from '../../utils/api';

const StudentToAvatar = () => {
    const { courseSlug, dayNumber } = useParams();
    const navigate = useNavigate();

    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [bgImage, setBgImage] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [moduleId, setModuleId] = useState(null);

    const bgFileRef = useRef(null);
    const excelFileRef = useRef(null);

    // Fetch characters
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

    // Setup module
    useEffect(() => {
        const setupModule = async () => {
            try {
                const courseRes = await api.get(`/admincourses/course/${courseSlug}`);
                const course_id = courseRes.data._id;
                
                const dayRes = await api.get(`/admincourses/course/${course_id}/day/${dayNumber}`);
                const day_id = dayRes.data._id;
                
                let moduleRes = await api.get(`/modules?day_id=${day_id}&type=student_avatar`);
                
                if (!moduleRes.data || moduleRes.data.length === 0) {
                    moduleRes = await api.post('/modules', {
                        course_id,
                        day_id,
                        type: 'student_avatar',
                        item_ids: []
                    });
                    setModuleId(moduleRes.data._id);
                } else {
                    setModuleId(moduleRes.data[0]._id);
                }
            } catch (error) {
                toast.error("Failed to initialize module");
            }
        };

        if (courseSlug && dayNumber) {
            setupModule();
        }
    }, [courseSlug, dayNumber]);

    // ⭐ NEW HANDLER
    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/templates/student_avatar_template.xlsx";
        link.download = "student_avatar_template.xlsx";
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
            toast.error("Please upload spreadsheet");
            return;
        }
        if (!moduleId) {
            toast.error("Module not ready");
            return;
        }

        setIsGenerating(true);
        const loadingToastId = toast.loading("Uploading Avatar-Student conversations...");

        try {
            const formData = new FormData();
            const character = characters.find(c => c._id === selectedCharacter);
            
            formData.append('module_id', moduleId);
            formData.append('avatar_id', character.avatar_id);
            formData.append('voice_id', character.voice_id);
            formData.append('excel', excelFile);
            if (bgImage) formData.append('image', bgImage);

            const response = await api.post('/modules/student-avatar/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(`✅ Conversations uploaded! ${response.data.count} items created`, {
                id: loadingToastId
            });

            setSelectedCharacter(characters.find(c => c.is_default)?._id || "");
            setBgImage(null);
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
            <div className="max-w-7xl mx-auto">
                
                {/* ⭐ NEW HEADER SECTION */}
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
                
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Student to Avatar Conversation</h1>

                <div className="grid lg:grid-cols-2 gap-8">
                    
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
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
                        <h3 className="text-lg font-semibold mb-3">Conversation Spreadsheet</h3>
                        <input ref={excelFileRef} type="file" accept=".xlsx,.xls" onChange={(e) => setExcelFile(e.target.files[0])} className="hidden" />
                        <div
                            onClick={() => excelFileRef.current?.click()}
                            className="cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center border-gray-300 hover:border-blue-400 transition"
                        >
                            {excelFile ? (
                                <p className="text-green-600 text-lg">✓ {excelFile.name}</p>
                            ) : (
                                <p className="text-xl font-semibold text-gray-700">Click to upload Excel</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !selectedCharacter || !excelFile || !moduleId}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isGenerating ? "Generating..." : "Generate Conversations"}
                    </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Module: {moduleId ? <span className="text-green-600 font-semibold">Ready</span> : <span className="text-yellow-600">Loading...</span>}
                </div>
            </div>
        </div>
    );
};

export default StudentToAvatar;