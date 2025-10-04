import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import api from '../../utils/api';

const Sentence = ({ courses }) => {
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
    
    const [uploadProgress, setUploadProgress] = useState({
        status: 'idle',
        message: '',
        itemsProcessed: 0,
        totalItems: 0,
        details: [],
        failures: []
    });

    const bgFileRef = useRef(null);
    const excelFileRef = useRef(null);
    const selectedModule = location.state?.selectedModule;

    // 1. Fetch Characters
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

    // 2. Fetch Day ID
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
                } else if (daysRes.data?.days) {
                    daysArray = daysRes.data.days;
                } else if (daysRes.data?.data) {
                    daysArray = daysRes.data.data;
                }
                
                const day = daysArray.find(d => d.day_number === parseInt(dayNumber, 10));
                
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
                console.log("🔧 Setting up Sentence module...");

                if (selectedModule && selectedModule.type === 'sentence') {
                    setModuleId(selectedModule._id);
                    console.log("✅ Using module from state:", selectedModule._id);
                    return;
                }

                let moduleRes = await api.get(`/modules?day_id=${dayId}&type=sentence`);

                if (!moduleRes.data || moduleRes.data.length === 0) {
                    console.log("Creating new sentence module...");
                    const course = courses.find((c) => c.code === courseSlug);
                    const createRes = await api.post("/modules", {
                        course_id: course._id,
                        day_id: dayId,
                        type: "sentence",
                        item_ids: [],
                    });
                    setModuleId(createRes.data._id);
                    console.log("✅ Module created:", createRes.data._id);
                } else {
                    setModuleId(moduleRes.data[0]._id);
                    console.log("✅ Module found:", moduleRes.data[0]._id);
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
        link.href = "/templates/sentence_template.xlsx";
        link.download = "sentence_template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Template downloaded!");
    };

    const updateModuleStatus = async () => {
        if (!moduleId) return;
        
        try {
            await api.patch(`/modules/${moduleId}`, {
                is_published: true
            });
            console.log("✅ Module status updated to published");
        } catch (error) {
            console.error("Failed to update module status:", error);
        }
    };
    
    const handleGenerate = async () => {
        if (!selectedCharacter) {
            toast.error("Please select a character");
            return;
        }
        if (!excelFile) {
            toast.error("Please upload sentence spreadsheet");
            return;
        }
        if (!moduleId) {
            toast.error("Module not ready. Please wait.");
            return;
        }

        setIsGenerating(true);
        setUploadProgress({
            status: 'uploading',
            message: 'Uploading Excel file...',
            itemsProcessed: 0,
            totalItems: 0,
            details: [],
            failures: []
        });

        try {
            const formData = new FormData();
            const character = characters.find(c => c._id === selectedCharacter);
            
            formData.append('module_id', moduleId);
            formData.append('avatar_id', character.avatar_id);
            formData.append('voice_id', character.voice_id);
            formData.append('excel', excelFile);
            if (bgImage) formData.append('image', bgImage);

            console.log("📤 Starting sentence upload...");
            console.log("Module ID:", moduleId);
            console.log("Avatar ID:", character.avatar_id);
            console.log("Voice ID:", character.voice_id);

            setUploadProgress(prev => ({
                ...prev,
                status: 'processing',
                message: 'Processing sentences and generating videos...'
            }));

            // 🔑 FIXED: Better error handling and response parsing
            const response = await api.post('/modules/sentence/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 300000 // 5 minutes timeout for long video generation
            });

            console.log("✅ Full Response:", response);
            console.log("✅ Response Data:", response.data);
            console.log("✅ Response Status:", response.status);

            // Handle both possible response structures
            let videosGenerated = 0;
            let totalItems = 0;
            let successItems = [];
            let failedItems = [];

            // Check if response has the expected structure
            if (response.data) {
                // New structure: summary object
                if (response.data.summary) {
                    videosGenerated = response.data.summary.successes || 0;
                    totalItems = response.data.summary.total_rows || 0;
                    successItems = response.data.successes || [];
                    failedItems = response.data.failures || [];
                }
                // Alternative structure: direct count
                else if (response.data.count !== undefined) {
                    totalItems = response.data.count || 0;
                    successItems = response.data.data || [];
                    videosGenerated = successItems.filter(item => item.video_url).length;
                    failedItems = [];
                }
                // Fallback: check if data is array
                else if (Array.isArray(response.data)) {
                    successItems = response.data;
                    totalItems = successItems.length;
                    videosGenerated = successItems.filter(item => item.video_url).length;
                    failedItems = [];
                }
            }

            console.log("📊 Processed Results:", {
                videosGenerated,
                totalItems,
                successCount: successItems.length,
                failureCount: failedItems.length
            });

            setUploadProgress({
                status: 'completed',
                message: `✅ Successfully processed ${totalItems} items. ${videosGenerated} videos generated!`,
                itemsProcessed: totalItems,
                totalItems: totalItems,
                details: successItems,
                failures: failedItems
            });

            // Update module status
            await updateModuleStatus();

            toast.success(
                `🎉 Upload Complete! ${videosGenerated}/${totalItems} videos generated.`,
                { duration: 6000 }
            );

            // Reset inputs
            setBgImage(null);
            setExcelFile(null);
            if (excelFileRef.current) excelFileRef.current.value = null;
            if (bgFileRef.current) bgFileRef.current.value = null;

        } catch (error) {
            console.error("❌ Upload Error Object:", error);
            console.error("❌ Error Response:", error.response);
            console.error("❌ Error Data:", error.response?.data);
            console.error("❌ Error Status:", error.response?.status);
            console.error("❌ Error Message:", error.message);
            
            // Check if it's actually a success disguised as error
            if (error.response?.status === 201 || error.response?.status === 200) {
                console.log("⚠️ Got success status but treated as error. Handling as success...");
                
                const responseData = error.response.data;
                let videosGenerated = 0;
                let totalItems = 0;
                
                if (responseData.summary) {
                    videosGenerated = responseData.summary.successes || 0;
                    totalItems = responseData.summary.total_rows || 0;
                } else if (responseData.count) {
                    totalItems = responseData.count || 0;
                    videosGenerated = responseData.data?.filter(item => item.video_url).length || 0;
                }

                setUploadProgress({
                    status: 'completed',
                    message: `✅ Upload successful! ${videosGenerated}/${totalItems} videos generated.`,
                    itemsProcessed: totalItems,
                    totalItems: totalItems,
                    details: responseData.successes || responseData.data || [],
                    failures: responseData.failures || []
                });

                toast.success(`✅ Upload completed! Check database for results.`, { duration: 5000 });
                
                // Reset inputs
                setBgImage(null);
                setExcelFile(null);
                if (excelFileRef.current) excelFileRef.current.value = null;
                if (bgFileRef.current) bgFileRef.current.value = null;
                
                setIsGenerating(false);
                return;
            }
            
            const errorMessage = error.response?.data?.error 
                || error.response?.data?.message 
                || error.message 
                || "Upload failed. Check console for details.";
            
            setUploadProgress({
                status: 'error',
                message: errorMessage,
                itemsProcessed: 0,
                totalItems: 0,
                details: [],
                failures: error.response?.data?.failures || []
            });

            toast.error(errorMessage, { duration: 5000 });
        } finally {
            setIsGenerating(false);
        }
    };

  const handleBackToModules = () => {
    navigate(-1);
};

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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Modules
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

                <h1 className="text-4xl font-bold text-gray-800 mb-8">Sentence Pronunciation Generator</h1>

                {uploadProgress.status !== 'idle' && (
                    <div className={`mb-6 p-6 rounded-xl ${
                        uploadProgress.status === 'completed' ? 'bg-green-50 border-2 border-green-300' :
                        uploadProgress.status === 'error' ? 'bg-red-50 border-2 border-red-300' :
                        'bg-blue-50 border-2 border-blue-300'
                    }`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className={`font-bold text-lg ${
                                uploadProgress.status === 'completed' ? 'text-green-700' :
                                uploadProgress.status === 'error' ? 'text-red-700' :
                                'text-blue-700'
                            }`}>
                                {uploadProgress.message}
                            </span>
                            {uploadProgress.status === 'processing' && (
                                <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full"></div>
                            )}
                            {uploadProgress.status === 'completed' && (
                                <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {uploadProgress.totalItems > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-500 ${
                                            uploadProgress.status === 'completed' ? 'bg-green-500' :
                                            uploadProgress.status === 'error' ? 'bg-red-500' :
                                            'bg-blue-500'
                                        }`}
                                        style={{ width: `${(uploadProgress.itemsProcessed / uploadProgress.totalItems) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                    {uploadProgress.itemsProcessed}/{uploadProgress.totalItems}
                                </span>
                            </div>
                        )}
                    </div>
                )}

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
                            <input ref={bgFileRef} type="file" accept="image/*" onChange={(e) => setBgImage(e.target.files[0])} className="hidden" disabled={isGenerating} />
                            <div onClick={() => !isGenerating && bgFileRef.current?.click()} className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition ${!isGenerating ? 'cursor-pointer hover:border-blue-400' : 'opacity-50 cursor-not-allowed'}`}>
                                {bgImage ? (
                                    <p className="text-green-600 font-medium">✓ {bgImage.name}</p>
                                ) : (
                                    <p className="text-gray-500">Click to upload image</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-3">Sentence Spreadsheet</h3>
                        <input ref={excelFileRef} type="file" accept=".xlsx,.xls" onChange={(e) => setExcelFile(e.target.files[0])} className="hidden" disabled={isGenerating} />
                        <div
                            onClick={() => !isGenerating && excelFileRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${!isGenerating ? 'cursor-pointer border-gray-300 hover:border-blue-400' : 'opacity-50 cursor-not-allowed border-gray-200'}`}
                        >
                            {excelFile ? (
                                <p className="text-green-600 text-lg font-medium">✓ {excelFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-xl font-semibold text-gray-700">Click to upload Excel</p>
                                    <p className="text-gray-500 mt-2">.xlsx or .xls</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !selectedCharacter || !excelFile || !moduleId}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                Generating Videos...
                            </span>
                        ) : (
                            "Generate Sentence Videos"
                        )}
                    </button>
                </div>

                <div className="mt-4 text-center text-sm">
                    Module Status: {moduleId ? (
                        <span className="text-green-600 font-semibold">✓ Ready</span>
                    ) : (
                        <span className="text-yellow-600 font-semibold">⏳ Loading...</span>
                    )}
                </div>

                {uploadProgress.details.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl border-2 border-green-200 p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                ✅ Successfully Generated Videos ({uploadProgress.details.length})
                            </h3>
                            <button
                                onClick={handleBackToModules}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                            >
                                View in Modules
                            </button>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {uploadProgress.details.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                            {index + 1}. {item.sentence || item.sentence_text}
                                        </p>
                                        <p className="text-xs text-green-600 mt-1 font-medium">
                                            ✅ Video generated successfully
                                        </p>
                                    </div>

                                  

                                    {item.video_url && (
                                        <a
                                            href={item.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Preview
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Failures if any */}
                {uploadProgress.failures && uploadProgress.failures.length > 0 && (
                    <div className="mt-6 bg-red-50 rounded-2xl border-2 border-red-200 p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-red-700 mb-4">
                            ⚠️ Failed Items ({uploadProgress.failures.length})
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {uploadProgress.failures.map((item, index) => (
                                <div key={index} className="p-3 bg-white rounded-lg border border-red-200">
                                    <p className="text-sm font-medium text-gray-800">
                                        Row {item.row}: {item.sentence || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-red-600 mt-1">
                                        {item.reason}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sentence;