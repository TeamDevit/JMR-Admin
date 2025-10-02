// src/features/announcements/AnnouncementsView.js

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Send, BookOpen, Filter } from 'lucide-react'; 
import api from "../../utils/api"; 

const AnnouncementsView = ({ 
    userRole, 
    courses = [],
}) => {
    // --- STATE MANAGEMENT ---
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [courseToSend, setCourseToSend] = useState('all'); 
    
    // Annoucements Data State
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false); 

    // State for filtering the displayed announcements
    const [filterCourseId, setFilterCourseId] = useState('all');

    // ----------------------------------------------------
    // Announcement Logic: Fetch
    // ----------------------------------------------------
    const fetchAnnouncements = useCallback(async () => {
        if (!userRole) return;

        setLoading(true);
        try {
            const response = await api.get('/promotion/notifications/all'); 
            
            if (Array.isArray(response.data)) {
                setAnnouncements(response.data);
                console.log(`✅ Announcements Loaded: ${response.data.length} in AnnouncementsView`);
            } else {
                setAnnouncements([]);
            }
        } catch (error) {
            console.error("Announcement Fetch FAILED:", error);
            toast.error("Could not load announcements from the server.");
        } finally {
            setLoading(false);
        }
    }, [userRole]);

    // ----------------------------------------------------
    // Announcement Logic: Add New
    // ----------------------------------------------------
    const handleAddAnnouncement = useCallback(async (newAnnouncementData) => {
        let courseIdToSend = newAnnouncementData.courseId;

        if (courseIdToSend === 'all') {
            courseIdToSend = null; 
        }
        
        // 🚀 CRITICAL DEBUGGING LOG 🚀
        console.log("SENDING PAYLOAD. Course ID:", courseIdToSend);
        
        const payload = {
            title: newAnnouncementData.title,
            message: newAnnouncementData.content, 
            courseId: courseIdToSend,
        };

        try {
            const response = await api.post('/promotion/notifications/create', payload);

            if (response.status === 201 || response.status === 200) {
                toast.success('Announcement sent successfully!');
                await fetchAnnouncements(); 
                return true;
            }
            
            toast.error('Failed to create announcement. Unexpected status.');
            return false;

        } catch (error) {
            console.error("Announcement Creation FAILED:", error);
            toast.error(`Error sending announcement: ${error.response?.data?.message || 'Server error'}`);
            return false;
        }
    }, [fetchAnnouncements]);

    // --- EFFECT TO RUN FETCH ---
    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]); 

    // --- COMPONENT HANDLER: Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !content) {
            toast.error('Title and content are required.');
            return;
        }
        
        const success = await handleAddAnnouncement({ 
            title, 
            content, 
            courseId: courseToSend
        }); 
        
        if (success) {
            setTitle('');
            setContent('');
            setCourseToSend('all'); 
        }
    };
    
    // Helper function to map courseId to Name (Crucial for MongoDB ObjectIds)
    const getCourseName = (courseId) => {
        if (!courseId || courseId === 'all') {
            return 'All Courses'; 
        }
        
        const normalizedCourseId = courseId.toString(); 
        
        const course = Array.isArray(courses) 
            ? courses.find(c => c._id === normalizedCourseId) 
            : null; 
        return course ? `${course.name} (${course.code})` : 'Unknown Course'; 
    };

    // Use useMemo for efficient filtering of the displayed list
    const filteredAnnouncements = useMemo(() => {
        if (filterCourseId === 'all') {
            return announcements;
        }

        return announcements.filter(announcement => {
            const annCourseIdRaw = announcement.courseId;
            let annCourseId = 'all'; 

            if (annCourseIdRaw) {
                annCourseId = annCourseIdRaw.toString(); 
            }
            
            if (annCourseId === filterCourseId) {
                return true;
            }

            if (filterCourseId === 'global') {
                return annCourseId === 'all';
            }

            return false;
        });
    }, [announcements, filterCourseId]);

    // Options for the Filter dropdown
    const allCoursesWithOptions = [
        { _id: 'all', name: 'All Announcements', code: '' },
        { _id: 'global', name: 'Global/System Announcements', code: '' },
        ...courses
    ];


    return (
        <div className="flex-1 p-8">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="w-full max-w-7xl">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Announcements</h2>

                {userRole === 'admin' && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h3 className="text-xl font-semibold mb-4">Create New Announcement</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* 1. TITLE INPUT */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                    placeholder="e.g., Important Update for All Students"
                                    required
                                />
                            </div>
                            
                            {/* 2. CONTENT TEXTAREA */}
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows="4"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                    placeholder="Write your announcement here..."
                                    required
                                ></textarea>
                            </div>
                            
                            {/* 3. COURSE DROPDOWN (Send To) */}
                            <div>
                                <label htmlFor="course-select-send" className="block text-sm font-medium text-gray-700">
                                    Send to Course
                                </label>
                                
                                <select
                                    id="course-select-send"
                                    value={courseToSend} 
                                    onChange={(e) => setCourseToSend(e.target.value)} 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                >
                                    <option value="all">All Courses (Global Announcement)</option>
                                    {Array.isArray(courses) && courses.length > 0 ? (
                                        courses.map(course => (
                                            <option key={course._id} value={course._id}>
                                                {course.name} ({course.code})
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No courses available</option>
                                    )}
                                </select>
                            </div>

                            {/* 🚀 DEBUGGING DISPLAY 🚀 */}
                            <div className={`text-sm p-3 rounded-md font-mono ${courseToSend === 'all' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
                                <strong>Debugging Check:</strong> Course ID selected is: <span className="font-bold">{courseToSend}</span>
                                {courseToSend !== 'all' && (
                                    <p className="mt-1 text-xs">This ID will be sent to the API. If it still goes to 'All', the issue is in the **backend validation** or the **`course._id` value** being mapped in `App.js`.</p>
                                )}
                            </div>
                            
                            {/* 4. SUBMIT BUTTON */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                >
                                    <Send size={16} />
                                    <span>Send Announcement</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* --- ALL ANNOUNCEMENTS DISPLAY --- */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                            Announcements List ({filteredAnnouncements.length})
                        </h3>
                        
                        {/* 5. COURSE DROPDOWN (Filter View) */}
                        <div className="flex items-center space-x-2">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={filterCourseId}
                                onChange={(e) => setFilterCourseId(e.target.value)}
                                className="p-2 border rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {allCoursesWithOptions.map(option => (
                                    <option key={option._id} value={option._id}>
                                        {option.name} {option.code ? `(${option.code})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* LOADING CHECK & ANNOUNCEMENT LIST */}
                    {loading ? (
                        <div className="text-center py-12 text-indigo-500 border border-indigo-100 rounded-lg">
                            <svg className="animate-spin h-5 w-5 mr-3 inline text-indigo-500" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching announcements...
                        </div>
                    ) : filteredAnnouncements.length > 0 ? (
                        filteredAnnouncements.map(announcement => (
                            <div key={announcement.id || announcement._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg font-semibold text-gray-900">{announcement.title}</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">{announcement.date || 'N/A'}</span> 
                                        <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center">
                                            <BookOpen size={12} className="mr-1"/>
                                            {getCourseName(announcement.courseId)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600">{announcement.content || announcement.message}</p> 
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
                            No announcements found for the selected filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsView;