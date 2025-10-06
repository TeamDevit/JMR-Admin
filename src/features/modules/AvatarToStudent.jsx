import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Download, X } from 'lucide-react'; // Import icons for play, download, and close

const AvatarToStudent = ({ courses }) => {
    const { courseSlug, dayNumber } = useParams();
    const navigate = useNavigate();

    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [bgImage, setBgImage] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dayId, setDayId] = useState(null);
    const [moduleId, setModuleId] = useState(null);
    const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 🆕 State for the video modal

    const bgFileRef = useRef(null);
    const excelFileRef = useRef(null);

    const currentCharacter = useMemo(() => {
        return characters.find(c => c._id === selectedCharacter);
    }, [selectedCharacter, characters]);

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
        const fetchDayAndModules = async () => {
            try {
                const course = courses.find(c => c.code === courseSlug);
                if (!course) {
                    toast.error("Course not found");
                    return;
                }
                const daysRes = await api.get(`/days/course-days/${course._id}`);
                const daysArray = Array.isArray(daysRes.data) ? daysRes.data : daysRes.data.days || daysRes.data.data || [];
                const day = daysArray.find(d => d.day_number === parseInt(dayNumber));
                if (!day) {
                    toast.error("Day not found");
                    return;
                }
                setDayId(day._id);
                const modulesRes = await api.get(`/modules/${course._id}/${day._id}`);
                const avatarStudentModule = modulesRes.data.find(m => m.type === 'avatar_student');
                if (!avatarStudentModule) {
                    toast.error("Avatar-Student module not found for this day");
                    return;
                }
                setModuleId(avatarStudentModule._id);
            } catch (error) {
                console.error("Error fetching day or modules:", error);
                toast.error("Failed to load day or module information");
            }
        };

        if (courses.length > 0 && courseSlug && dayNumber) {
            fetchDayAndModules();
        }
    }, [courses, courseSlug, dayNumber]);

    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/templates/avatar_student_template.xlsx";
        link.download = "avatar_student_template.xlsx";
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
        if (!dayId || !moduleId) {
            toast.error("Day or module information not loaded yet");
            return;
        }

        setIsGenerating(true);
        const loadingToastId = toast.loading("Uploading Avatar-Student conversations... This may take a while. Please do not close this window.", { duration: Infinity });

        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("Request timed out after 5 minutes. The server may be busy or the file is too large."));
            }, 300000);
        });

        try {
            const formData = new FormData();
            const character = currentCharacter;
            formData.append('day_id', dayId);
            formData.append('module_id', moduleId);
            formData.append('avatar_id', character.avatar_id);
            formData.append('voice_id', character.voice_id);
            formData.append('excel', excelFile);
            if (bgImage) formData.append('image', bgImage);

            const apiRequestPromise = api.post('/modules/avatar-student/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 300000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            });

            const response = await Promise.race([apiRequestPromise, timeoutPromise]);

            toast.success(`✅ Conversations uploaded! ${response.data.count || response.data.message || 'items'} processed`, {
                id: loadingToastId
            });

            // Find the first video URL from the nested data
            let firstVideoUrl = null;
            if (response.data.data && Array.isArray(response.data.data)) {
                for (const conversationSet of response.data.data) {
                    if (conversationSet.conversation && Array.isArray(conversationSet.conversation)) {
                        const avatarVideo = conversationSet.conversation.find(item => item.speaker === 'avatar' && item.videoUrl);
                        if (avatarVideo) {
                            firstVideoUrl = avatarVideo.videoUrl;
                            break;
                        }
                    }
                }
            }

            if (firstVideoUrl) {
                setPreviewVideoUrl(firstVideoUrl);
                toast.success("🎬 Video ready for preview!");
            } else {
                toast.error("Could not find a video URL in the response.");
            }

            setSelectedCharacter(characters.find(c => c.is_default)?._id || "");
            setBgImage(null);
            setExcelFile(null);
            if (bgFileRef.current) bgFileRef.current.value = "";
            if (excelFileRef.current) excelFileRef.current.value = "";

        } catch (error) {
            console.error("Upload Error:", error);
            const errorMessage = error.message.includes("timeout")
                                     ? error.message
                                     : error.response?.data?.error
                                     || error.response?.data?.message
                                     || "Upload failed. Check console for details.";
            
            toast.error(errorMessage, {
                id: loadingToastId
            });
        } finally {
            setIsGenerating(false);
            if (loadingToastId) {
                toast.dismiss(loadingToastId);
            }
        }
    };

    const handleDownloadVideo = () => {
        if (!previewVideoUrl) return;
        const link = document.createElement("a");
        link.href = previewVideoUrl;
        link.download = "avatar_student_preview.mp4";
        link.click();
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    let dayStatus;
    if (dayId && moduleId) {
        dayStatus = <span className="text-green-600 font-semibold">Loaded (Day: {dayId.substring(0, 8)}..., Module: {moduleId.substring(0, 8)}...)</span>;
    } else if (dayNumber) {
        dayStatus = <span className="text-yellow-600">Loading Day {dayNumber} and Modules...</span>;
    } else {
        dayStatus = <span className="text-red-600">Waiting for Course context.</span>;
    }

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
                
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Avatar to Student Conversation Bulk Uploader</h1>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                1. Select Character
                            </h3>
                            <select
                                value={selectedCharacter}
                                onChange={(e) => setSelectedCharacter(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 outline-none transition duration-150 ease-in-out"
                            >
                                <option value="">Choose character...</option>
                                {characters.map(char => (
                                    <option key={char._id} value={char._id}>
                                        {char.name} {char.is_default ? '(Default)' : ''}
                                    </option>
                                ))}
                            </select>
                            
                            {currentCharacter && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <p className="text-sm font-medium text-gray-700">Selected Avatar Details:</p>
                                    <p className="text-lg font-bold text-blue-800">{currentCharacter.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Avatar ID: {currentCharacter.avatar_id} | Voice ID: {currentCharacter.voice_id}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                3. Background Image (Optional)
                            </h3>
                            <input ref={bgFileRef} type="file" accept="image/*" onChange={(e) => setBgImage(e.target.files[0])} className="hidden" />
                            <div onClick={() => bgFileRef.current?.click()} className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition duration-150 ease-in-out">
                                {bgImage ? (
                                    <p className="text-green-600 font-medium truncate">✓ {bgImage.name}</p>
                                ) : (
                                    <p className="text-gray-500">Click to upload custom background image</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-1.5a1.5 1.5 0 013 0V17m-3 0h6m-3 0v4m0 0l-4-4m4 4l4-4m-9-3V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2v-8m2-3h14" /></svg>
                            2. Upload Conversation Spreadsheet
                        </h3>
                        <input ref={excelFileRef} type="file" accept=".xlsx,.xls" onChange={(e) => setExcelFile(e.target.files[0])} className="hidden" />
                        <div
                            onClick={() => excelFileRef.current?.click()}
                            className="flex-grow cursor-pointer border-2 border-dashed rounded-2xl p-12 flex items-center justify-center border-gray-300 hover:border-purple-400 transition duration-150 ease-in-out"
                        >
                            {excelFile ? (
                                <p className="text-green-600 text-lg font-semibold truncate">✓ {excelFile.name}</p>
                            ) : (
                                <p className="text-xl font-semibold text-gray-700">Click here to upload Excel file</p>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">Must be a **.xlsx** file containing student/avatar dialogue and options.</p>
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !selectedCharacter || !excelFile || !dayId || !moduleId}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-3">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Processing Upload...
                            </div>
                        ) : "Generate Conversations"}
                    </button>
                </div>

                <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-inner text-center text-sm text-gray-600">
                    **Context Check:** Day ID Status for Course **{courseSlug}** / Day **{dayNumber}**: {dayStatus}
                </div>

                {/* 🆕 Smaller preview bar and modal */}
                <AnimatePresence>
                    {previewVideoUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-12 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between transition-transform duration-300"
                        >
                            <div className="flex items-center space-x-4">
                                <PlayCircle className="text-blue-500" size={24} />
                                <p className="font-semibold text-gray-700">Video Generated Successfully!</p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleOpenModal}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition flex items-center gap-2"
                                >
                                    <PlayCircle size={20} /> View Video
                                </button>
                                <button
                                    onClick={handleDownloadVideo}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition flex items-center gap-2"
                                >
                                    <Download size={20} /> Download
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 🆕 Video Modal Overlay */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                            onClick={handleCloseModal}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="relative w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
                            >
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
                                >
                                    <X size={32} />
                                </button>
                                <video
                                    src={previewVideoUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-auto"
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AvatarToStudent;