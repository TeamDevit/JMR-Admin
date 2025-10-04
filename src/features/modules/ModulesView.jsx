import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowRight, Rocket, Eye, ListTree, BrainCircuit, ScrollText, Handshake, ClipboardList, Settings, Loader2 } from 'lucide-react';
import { useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
import api from "../../utils/api";

const MODULE_CONFIG = {
    'vocabulary': { title: "Vocabulary", icon: ListTree, path: "vocabulary", content: "Manage and update vocabulary lists." },
    'sentence': { title: "Sentence Pronunciation", icon: BrainCircuit, path: "sentence", content: "Manage and update Sentence Pronunciation." },
    'practice': { title: "Practice Speaking", icon: ScrollText, path: "practice", content: "Manage and update Practice Speaking." },
    'avatar_student': { title: "Conversation-Avatar to Student", icon: Handshake, path: "avatartostudent", content: "Manage and update Conversation-Avatar to Student." },
    'student_avatar': { title: "Conversation-Student To Avatar", icon: ClipboardList, path: "studenttoavatar", content: "Manage and update Conversation-Student To Avatar." },
    'quiz': { title: "Quiz", icon: Settings, path: "quiz", content: "Manage and update Quiz." },
};

const ModulesView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseSlug, dayNumber } = useParams();
    
    const selectedCourse = location.state?.selectedCourse;
    const selectedDay = location.state?.selectedDay; 

    const [modules, setModules] = useState([]);
    const [dayId, setDayId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDayIdAndModules = async () => {
        if (!selectedCourse || !dayNumber) {
            setError("Missing course data or day number in URL.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            let currentDayId;

            if (selectedDay?.day_number === parseInt(dayNumber)) {
                currentDayId = selectedDay._id;
                setDayId(currentDayId);
            } else {
                const dayResponse = await api.get(`/course-day-by-number/${selectedCourse.id}/${dayNumber}`);
                currentDayId = dayResponse.data._id;
                setDayId(currentDayId);
            }

            const modulesResponse = await api.get(`/modules/${selectedCourse.id}/${currentDayId}`);
            
            const mappedModules = modulesResponse.data.map(backendModule => {
                const config = MODULE_CONFIG[backendModule.type] || { 
                    title: "Unknown Module Type", 
                    icon: Settings, 
                    path: backendModule.type || 'unknown',
                    content: "Module type not recognized. Check backend schema."
                };

                // Determine status based on backend data
                let moduleStatus = "Draft";
                let isToggleEnabled = true;
                
                if (backendModule.status === 'generating') {
                    moduleStatus = "Generating";
                    isToggleEnabled = false; // Disable toggle while generating
                } else if (backendModule.is_published) {
                    moduleStatus = "Active";
                } else {
                    moduleStatus = "Draft";
                }

                return {
                    ...config,
                    _id: backendModule._id,
                    status: moduleStatus,
                    isToggleEnabled: isToggleEnabled,
                    content: backendModule.description || config.content, 
                    backendData: backendModule, 
                };
            });
            
            setModules(mappedModules);
        } catch (err) {
            console.error("Failed to fetch day or modules:", err);
            if (err.response?.status === 404) {
                setModules([]);
                setError("No modules found for this day.");
            } else {
                setError("Unable to load modules. Check API connection and server logs.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDayIdAndModules();
    }, [selectedCourse, dayNumber]);

    // Auto-refresh when returning from a module route
    useEffect(() => {
        // Refresh modules when coming back from a child route
        if (location.pathname === `/courses/${courseSlug}/day/${dayNumber}`) {
            fetchDayIdAndModules();
        }
    }, [location.pathname]);
    
    const handleModuleToggle = async (moduleId, currentStatus) => {
        try {
            const newPublishedStatus = currentStatus !== "Active";
            
            await api.patch(`/modules/${moduleId}`, {
                is_published: newPublishedStatus
            });

            // Refresh modules to show updated status
            fetchDayIdAndModules();
            
            toast.success(newPublishedStatus ? "Module published!" : "Module unpublished!");
        } catch (error) {
            console.error("Toggle error:", error);
            toast.error("Failed to update module status");
        }
    };

    const handleGoBack = () => {
        navigate(`/courses/${courseSlug}`, { state: { course: selectedCourse } });
    };

    if (loading) {
        return (
            <div className="flex-1 p-8 flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-2" />
                <p className="text-lg text-gray-700">Loading modules...</p>
            </div>
        );
    }
    
    return (
        <div className="flex-1 p-8">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="w-full max-w-7xl flex items-center justify-between mb-12">
                <button
                    onClick={handleGoBack}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                    <ArrowRight className="rotate-180" size={16} />
                    <span>Change Day</span>
                </button>
                <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">Admin Dashboard</h1>
                <div className="w-24" />
            </div>

            <div className="w-full max-w-7xl mb-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Modules for: <span className="text-indigo-600">{selectedCourse?.name || 'Loading...'}</span>
                    <span className="text-gray-500 mx-2">/</span>
                    <span className="text-indigo-600">Day {dayNumber}</span>
                </h2>
                {error && modules.length === 0 && (
                    <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-sm">{error}</div>
                )}
            </div>

            <div className="w-full max-w-7xl flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.length > 0 ? (
                    modules.map((module) => {
                        const Icon = module.icon;
                        const isCompleted = module.status === 'Active';
                        const isGenerating = module.status === 'Generating';

                        return (
                            <div
                                key={module._id}
                                className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between shadow-sm
                                            hover:ring-2 hover:ring-indigo-500 transition-all duration-300 ease-in-out cursor-pointer"
                                onClick={() => navigate(module.path, { state: { selectedCourse, selectedDay, selectedModule: module.backendData } })}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col">
                                        <div className="p-3 mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white">
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mt-2">{module.title}</h3>
                                    </div>
                                    
                                    {/* Toggle or Generating indicator */}
                                    {isGenerating ? (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                            <span className="text-xs font-medium text-blue-600">Generating</span>
                                        </div>
                                    ) : (
                                        <label
                                            className={`flex items-center select-none ${module.isToggleEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isCompleted}
                                                disabled={!module.isToggleEnabled}
                                                onChange={() => module.isToggleEnabled && handleModuleToggle(module._id, module.status)}
                                            />
                                            <div
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    isCompleted ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                            >
                                                <div
                                                    className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 transform ${
                                                        isCompleted ? "translate-x-6" : "translate-x-0"
                                                    } shadow-md`}
                                                ></div>
                                            </div>
                                        </label>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 mt-4 leading-relaxed flex-grow">
                                    {module.content}
                                </p>
                                
                                <div className="mt-6 flex items-center text-sm font-medium">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full mr-2 ${
                                            isGenerating ? "bg-blue-500 animate-pulse" :
                                            isCompleted ? "bg-green-500" : "bg-gray-400"
                                        }`}
                                    ></span>
                                    <span className={`${
                                        isGenerating ? "text-blue-600" :
                                        isCompleted ? "text-green-600" : "text-gray-500"
                                    }`}>
                                        {module.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !loading && <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                        <p className="text-lg">No modules found for this day.</p>
                        <p className="text-sm mt-2">Start adding content to this day!</p>
                    </div>
                )}
            </div>

            <div className="w-full max-w-7xl flex items-center justify-center gap-6 mt-12">
                <button
                    onClick={() => toast.success("Content for the selected day is now live!")}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
                >
                    <Rocket size={18} className="inline-block mr-2" />
                    Go Live
                </button>
                <button
                    onClick={() => toast.success("Preview loaded!")}
                    className="px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-200"
                >
                    <Eye size={18} className="inline-block mr-2" />
                    Preview
                </button>
            </div>
            
            <Outlet />

        </div>
    );
};

export default ModulesView;