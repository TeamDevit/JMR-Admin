// src/pages/Vocabulary/Vocabulary.jsx

import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Download, X, Loader2 } from "lucide-react";
import api from "../../utils/api";

const Vocabulary = ({ courses }) => {
    const { courseSlug, dayNumber } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [bgImage, setBgImage] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dayId, setDayId] = useState(null);
    const [moduleId, setModuleId] = useState(null);

    // 🆕 Video preview + modal states
    const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const bgFileRef = useRef(null);
    const excelFileRef = useRef(null);
    const selectedModule = location.state?.selectedModule;

    // Current character memo
    const currentCharacter = React.useMemo(
        () => characters.find((c) => c._id === selectedCharacter),
        [selectedCharacter, characters]
    );

    // 1. Fetch Characters
    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const res = await api.get("/characters/get-characters");
                if (Array.isArray(res.data)) {
                    setCharacters(res.data);
                    const defaultChar = res.data.find((c) => c.is_default);
                    if (defaultChar) setSelectedCharacter(defaultChar._id);
                }
            } catch (error) {
                toast.error("Failed to load characters");
            }
        };
        fetchCharacters();
    }, []);

    // 2. Fetch Day ID
    useEffect(() => {
        const fetchDayId = async () => {
            try {
                const course = courses.find((c) => c.code === courseSlug);
                if (!course) {
                    toast.error("Course not found");
                    return;
                }

                const daysRes = await api.get(`/days/course-days/${course._id}`);
                const daysArray = Array.isArray(daysRes.data)
                    ? daysRes.data
                    : daysRes.data.days || daysRes.data.data || [];

                const day = daysArray.find((d) => d.day_number === parseInt(dayNumber));
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

    // 3. Setup Module
    useEffect(() => {
        const setupModule = async () => {
            if (!dayId) return;

            try {
                if (selectedModule && selectedModule.type === "vocabulary") {
                    setModuleId(selectedModule._id);
                    return;
                }

                let moduleRes = await api.get(`/modules?day_id=${dayId}&type=vocabulary`);

                if (!moduleRes.data || moduleRes.data.length === 0) {
                    const course = courses.find((c) => c.code === courseSlug);
                    const createRes = await api.post("/modules", {
                        course_id: course._id,
                        day_id: dayId,
                        type: "vocabulary",
                        item_ids: [],
                    });
                    setModuleId(createRes.data._id);
                } else {
                    setModuleId(moduleRes.data[0]._id);
                }
            } catch (error) {
                console.error("❌ Module setup error:", error);
                toast.error("Failed to initialize module");
            }
        };

        setupModule();
    }, [dayId, courses, courseSlug, selectedModule]);

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
        setPreviewVideoUrl(null); // Clear previous preview
        const loadingToastId = toast.loading("Generating vocabulary videos...", { duration: Infinity });

        try {
            const formData = new FormData();
            const character = currentCharacter;

            formData.append("avatar_id", character.avatar_id);
            formData.append("voice_id", character.voice_id);
            formData.append("day_id", dayId);

            if (bgImage) {
                formData.append("image", bgImage);
            }

            formData.append("excel", excelFile);

            const response = await api.post("/modules/vocabulary/bulk-upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 300000, // 5 minutes timeout
            });

            // Extract the first video URL from the response data
            let firstVideoUrl = null;
            if (response.data?.data && Array.isArray(response.data.data)) {
                const firstItem = response.data.data.find(item => item.video_url || item.video_url1);
                if (firstItem) {
                    firstVideoUrl = firstItem.video_url || firstItem.video_url1;
                }
            }

            if (firstVideoUrl) {
                setPreviewVideoUrl(firstVideoUrl);
                toast.success("✅ Videos generated! Preview the first one below.", { id: loadingToastId });
            } else {
                toast.success("✅ Upload complete, but no video URLs were found.", { id: loadingToastId });
            }

            setBgImage(null);
            setExcelFile(null);
            if (excelFileRef.current) excelFileRef.current.value = null;
            if (bgFileRef.current) bgFileRef.current.value = null;

        } catch (error) {
            console.error("❌ Upload Error Object:", error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Upload failed. Check console for details.";

            toast.error(errorMessage, { id: loadingToastId, duration: 5000 });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleBackToModules = () => {
        navigate(-1);
    };

    // 🔹 Download video
    const handleDownloadVideo = () => {
        if (!previewVideoUrl) return;
        const link = document.createElement("a");
        link.href = previewVideoUrl;
        link.download = "vocabulary_preview.mp4";
        link.click();
    };

    // 🔹 Modal toggle
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const moduleIdDisplay = moduleId ? (
        <span className="text-green-600 font-semibold">Ready</span>
    ) : (
        <span className="text-yellow-600 font-semibold">⏳ Loading...</span>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleBackToModules}
                        className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Modules
                    </button>
                    <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-700 to-sky-900 text-white rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
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
                                disabled={isGenerating}
                            >
                                <option value="">Choose a character...</option>
                                {characters.map((char) => (
                                    <option key={char._id} value={char._id}>
                                        {char.name} {char.is_default ? "(Default)" : ""}
                                    </option>
                                ))}
                            </select>
                            {currentCharacter && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <p className="text-sm font-medium text-gray-700">Selected Avatar Details:</p>
                                    <p className="text-lg font-bold text-blue-800">{currentCharacter.name}</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-semibold mb-3">Background Image (Optional)</h3>
                            <input
                                ref={bgFileRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setBgImage(e.target.files[0])}
                                className="hidden"
                                disabled={isGenerating}
                            />
                            <div
                                onClick={() => !isGenerating && bgFileRef.current?.click()}
                                className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition ${!isGenerating
                                        ? "cursor-pointer hover:border-blue-400"
                                        : "opacity-50 cursor-not-allowed"
                                    }`}
                            >
                                {bgImage ? (
                                    <p className="text-green-600 font-medium">✓ {bgImage.name}</p>
                                ) : (
                                    <p className="text-gray-500">Click to upload image</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-3">Vocabulary Spreadsheet</h3>
                        <input
                            ref={excelFileRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => setExcelFile(e.target.files[0])}
                            className="hidden"
                            disabled={isGenerating}
                        />
                        <div
                            onClick={() => !isGenerating && excelFileRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${isGenerating
                                    ? "opacity-50 cursor-not-allowed border-gray-200"
                                    : "border-gray-300 hover:border-blue-400 cursor-pointer"
                                }`}
                        >
                            {excelFile ? (
                                <p className="text-green-600 text-lg font-medium">✓ {excelFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-xl font-semibold text-gray-700">Click here to upload Excel file</p>
                                    <p className="text-gray-500 mt-2">or drag and drop</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !selectedCharacter || !excelFile || !dayId}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5 text-white" />
                                Generating Videos...
                            </span>
                        ) : (
                            "Generate Vocabulary Videos"
                        )}
                    </button>
                </div>

                <div className="mt-4 text-center text-sm">
                    Day: {dayId ? (
                        <span className="text-green-600 font-semibold">✓ Loaded</span>
                    ) : (
                        <span className="text-yellow-600 font-semibold">⏳ Loading...</span>
                    )}
                    {moduleId && <span className="mx-2">•</span>}
                    {moduleId && <span className="text-green-600 font-semibold">Module Ready</span>}
                </div>

                {/* 🎬 Compact Preview Bar */}
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

                {/* 🎥 Video Modal */}
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
                                onClick={(e) => e.stopPropagation()}
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

export default Vocabulary;