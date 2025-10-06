// src/pages/StudentToAvatar/StudentToAvatar.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Download, X, Loader2 } from "lucide-react";
import api from "../../utils/api"; // ✅ uses actual backend API utility

const StudentToAvatar = ({ courses }) => {
    const { courseSlug, dayNumber } = useParams();
    const navigate = useNavigate();

    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [bgImage, setBgImage] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [moduleId, setModuleId] = useState(null);

    // New state to store fetched conversations
    const [conversations, setConversations] = useState([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);

    // 🆕 Video preview + modal states
    const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const bgFileRef = useRef(null);
    const excelFileRef = useRef(null);

    // Current character memo
    const currentCharacter = useMemo(
        () => characters.find((c) => c._id === selectedCharacter),
        [selectedCharacter, characters]
    );

    // 🔹 Fetch available characters
    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const res = await api.get("/characters/get-characters");
                if (Array.isArray(res.data)) {
                    setCharacters(res.data);
                    const defaultChar = res.data.find((c) => c.is_default);
                    if (defaultChar) setSelectedCharacter(defaultChar._id);
                }
            } catch {
                toast.error("Failed to load characters");
            }
        };
        fetchCharacters();
    }, []);

    // 🔹 Fetch existing conversations for preview (NEW)
   // 🔹 Fetch existing conversations for preview (NEW)
useEffect(() => {
    const fetchConversations = async () => {
        setIsLoadingConversations(true);
        try {
            // Find the day_id
            const course = courses.find((c) => c.code === courseSlug);
            if (!course) {
                setIsLoadingConversations(false);
                return;
            }
            const daysRes = await api.get(`/days/course-days/${course._id}`);
            const daysArray = Array.isArray(daysRes.data) ? daysRes.data : daysRes.data.days || daysRes.data.data || [];
            const day = daysArray.find(d => d.day_number === parseInt(dayNumber));

            // NEW: Log the day object and its ID for debugging
            console.log("Day found:", day);
            if (day) {
                console.log("Day ID:", day._id);
            }
            // End of new code

            // Check if day exists before making the API call
            if (!day) {
                console.error("Day not found, cannot fetch conversations.");
                setIsLoadingConversations(false);
                return;
            }
            
            // Fetch conversations for the specific day
            const res = await api.get(`/modules/day-student-avatar/${day._id}`);
            setConversations(res.data);
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            setConversations([]);
        } finally {
            setIsLoadingConversations(false);
        }
    };

    if (courseSlug && dayNumber && courses && courses.length > 0) {
        fetchConversations();
    }
}, [courseSlug, dayNumber, courses]);
    // 🔹 Setup course/day/module IDs
    useEffect(() => {
        const setupModule = async () => {
            try {
                // Find course by code/slug from the 'courses' prop (to get course_id)
                const course = courses.find((c) => c.code === courseSlug);

                if (!course) {
                    toast.error("Course not found! Check URL slug or courses prop.");
                    return;
                }

                const course_id = course._id;

                // Fetch ALL days for the course and filter locally.
                const daysRes = await api.get(`/days/course-days/${course_id}`);
                const daysArray = Array.isArray(daysRes.data)
                    ? daysRes.data
                    : daysRes.data.days || daysRes.data.data || [];

                const day = daysArray.find(d => d.day_number === parseInt(dayNumber));

                if (!day) {
                    toast.error(`Day ${dayNumber} not found for this course!`);
                    return;
                }

                const day_id = day._id;

                // Change the API call to match an existing backend route.
                // Get all modules for the course/day and filter locally by type.
                const moduleRes = await api.get(`/modules/${course_id}/${day_id}`);
                const allModules = moduleRes.data;

                // Find the specific module for 'student_avatar'
                const studentAvatarModule = allModules.find(m => m.type === 'student_avatar');

                if (!studentAvatarModule) {
                    // If module doesn't exist, create it
                    const newModuleRes = await api.post("/modules", {
                        course_id,
                        day_id,
                        type: "student_avatar",
                        item_ids: [],
                    });
                    setModuleId(newModuleRes.data._id);
                } else {
                    // If module exists, use its ID
                    setModuleId(studentAvatarModule._id);
                }
            } catch (error) {
                console.error("Module setup error:", error);
                toast.error("Failed to initialize module");
            }
        };

        if (courses && courses.length > 0 && courseSlug && dayNumber) {
            setupModule();
        }
    }, [courses, courseSlug, dayNumber]);

    // 🔹 Template download
    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/templates/student_avatar_template.xlsx";
        link.download = "student_avatar_template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Template downloaded!");
    };

    // 🔹 Upload + Generate logic
    const handleGenerate = async () => {
        if (!selectedCharacter) return toast.error("Please select a character");
        if (!excelFile) return toast.error("Please upload spreadsheet");
        if (!moduleId) return toast.error("Module not ready");

        setIsGenerating(true);
        const loadingToastId = toast.loading(
            "Uploading Student-Avatar conversations... Please wait.",
            { duration: Infinity }
        );

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error("Timeout: Upload took too long.")),
                300000
            )
        );

        try {
            const character = currentCharacter;
            const formData = new FormData();
            formData.append("module_id", moduleId);
            formData.append("avatar_id", character.avatar_id);
            formData.append("voice_id", character.voice_id);
            formData.append("excel", excelFile);
            if (bgImage) formData.append("image", bgImage);

            const apiRequestPromise = api.post(
                "/modules/student-avatar/bulk-upload",
                formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 300000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }
            );

            const response = await Promise.race([apiRequestPromise, timeoutPromise]);

            toast.success("✅ Conversations uploaded!", { id: loadingToastId });

            // 🧩 Extract first avatar video URL for preview
            let firstVideoUrl = null;
            if (response.data?.data && Array.isArray(response.data.data)) {
                for (const set of response.data.data) {
                    if (Array.isArray(set.conversation)) {
                        const avatarVid = set.conversation.find(
                            (item) => item.speaker === "avatar" && item.videoUrl
                        );
                        if (avatarVid) {
                            firstVideoUrl = avatarVid.videoUrl;
                            break;
                        }
                    }
                }
            }

            if (firstVideoUrl) {
                setPreviewVideoUrl(firstVideoUrl);
                toast.success("🎬 Video ready for preview!");
            } else {
                toast.error("No video URL found in response.");
            }

            // Reset file inputs
            setExcelFile(null);
            setBgImage(null);
            if (excelFileRef.current) excelFileRef.current.value = "";
            if (bgFileRef.current) bgFileRef.current.value = "";
        } catch (error) {
            console.error("Upload Error:", error);
            const msg =
                error.message.includes("timeout") ||
                error.response?.data?.message ||
                "Upload failed.";
            toast.error(msg, { id: loadingToastId });
        } finally {
            toast.dismiss(loadingToastId);
            setIsGenerating(false);
        }
    };

    // 🔹 Download video
    const handleDownloadVideo = () => {
        if (!previewVideoUrl) return;
        const link = document.createElement("a");
        link.href = previewVideoUrl;
        link.download = "student_avatar_preview.mp4";
        link.click();
    };

    // 🔹 Modal toggle
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const moduleIdDisplay = moduleId ? (
        <span className="text-green-600 font-semibold">
            Ready (ID: {moduleId.substring(0, 8)}…)
        </span>
    ) : (
        <span className="text-yellow-600">Loading...</span>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-700 to-sky-900 text-white rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
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

                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    Student to Avatar Conversation Bulk Uploader
                </h1>

                {/* Upload Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Character + Background */}
                    <div className="space-y-6">
                        {/* Character Select */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg
                                    className="w-6 h-6 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                1. Select Character
                            </h3>
                            <select
                                value={selectedCharacter}
                                onChange={(e) => setSelectedCharacter(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 outline-none"
                            >
                                <option value="">Choose character...</option>
                                {characters.map((char) => (
                                    <option key={char._id} value={char._id}>
                                        {char.name} {char.is_default ? "(Default)" : ""}
                                    </option>
                                ))}
                            </select>

                            {currentCharacter && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <p className="text-sm font-medium text-gray-700">
                                        Selected Avatar Details:
                                    </p>
                                    <p className="text-lg font-bold text-blue-800">
                                        {currentCharacter.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Avatar ID: {currentCharacter.avatar_id} | Voice ID:{" "}
                                        {currentCharacter.voice_id}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Background */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg
                                    className="w-6 h-6 text-indigo-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                3. Background Image (Optional)
                            </h3>
                            <input
                                ref={bgFileRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setBgImage(e.target.files[0])}
                                className="hidden"
                            />
                            <div
                                onClick={() => bgFileRef.current?.click()}
                                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition"
                            >
                                {bgImage ? (
                                    <p className="text-green-600">✓ {bgImage.name}</p>
                                ) : (
                                    <p className="text-gray-500">
                                        Click to upload custom background image
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Excel Upload */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg
                                className="w-6 h-6 text-purple-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 17v-1.5a1.5 1.5 0 013 0V17m-3 0h6m-3 0v4m0 0l-4-4m4 4l4-4m-9-3V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2v-8m2-3h14"
                                />
                            </svg>
                            2. Upload Conversation Spreadsheet
                        </h3>
                        <input
                            ref={excelFileRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => setExcelFile(e.target.files[0])}
                            className="hidden"
                        />
                        <div
                            onClick={() => excelFileRef.current?.click()}
                            className="flex-grow cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center border-gray-300 hover:border-purple-400 transition"
                        >
                            {excelFile ? (
                                <p className="text-green-600 text-lg">✓ {excelFile.name}</p>
                            ) : (
                                <p className="text-xl font-semibold text-gray-700">
                                    Click here to upload Excel file
                                </p>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Must be a <strong>.xlsx</strong> file containing dialogue and
                            options.
                        </p>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !selectedCharacter || !excelFile || !moduleId}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition transform duration-200"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="animate-spin h-5 w-5 text-white" />
                                Processing Upload...
                            </div>
                        ) : (
                            "Generate Conversations"
                        )}
                    </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Module: {moduleIdDisplay}
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
                                <p className="font-semibold text-gray-700">
                                    Video Generated Successfully!
                                </p>
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

                {/* Conversations Preview Section (NEW) */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Existing Conversations for Day {dayNumber}
                    </h2>
                    {isLoadingConversations ? (
                        <div className="flex items-center justify-center py-10 text-gray-500">
                            <Loader2 className="animate-spin h-8 w-8 mr-3" />
                            Loading conversations...
                        </div>
                    ) : conversations.length > 0 ? (
                        <div className="space-y-6">
                            {conversations.map((conv) => (
                                <div key={conv._id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                                    <h3 className="text-lg font-bold text-blue-800 mb-2">{conv.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{conv.scenario_description}</p>
                                    <ul className="space-y-2">
                                        {conv.conversation.map((turn, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-3 ${turn.speaker === 'avatar' ? 'bg-purple-500' : 'bg-green-500'}`}>
                                                    {turn.speaker.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="flex-1 text-gray-700">{turn.sentence}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
                            No conversations found for this day. Upload a spreadsheet to create some.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default StudentToAvatar;