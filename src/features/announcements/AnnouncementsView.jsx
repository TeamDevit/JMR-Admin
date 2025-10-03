import React, { useState, useMemo, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Send, BookOpen, Filter } from 'lucide-react'; 
import api from "../../utils/api"; 

const AnnouncementsView = ({ userRole, courses = [] }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [courseToSend, setCourseToSend] = useState('all'); 
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [filterCourseId, setFilterCourseId] = useState('all');

    const fetchAnnouncements = useCallback(async () => {
        if (!userRole) return;

        setLoading(true);
        try {
            const response = await api.get('/promotion/notifications/all'); 
            
            if (Array.isArray(response.data)) {
                setAnnouncements(response.data);
            } else {
                setAnnouncements([]);
            }
        } catch (error) {
            console.error("Announcement fetch failed:", error);
            toast.error("Could not load announcements from the server.");
        } finally {
            setLoading(false);
        }
    }, [userRole]);

    const handleAddAnnouncement = useCallback(async (newAnnouncementData) => {
        const payload = {
            title: newAnnouncementData.title,
            message: newAnnouncementData.content, 
            courseId: newAnnouncementData.courseId === 'all' ? null : newAnnouncementData.courseId,
        };

        try {
            const response = await api.post('/promotion/notifications/create', payload);

            if (response.status === 201 || response.status === 200) {
                toast.success('Announcement sent successfully!');
                await fetchAnnouncements(); 
                return true;
            }
            
            toast.error('Failed to create announcement.');
            return false;

        } catch (error) {
            console.error("Announcement creation failed:", error);
            toast.error(error.response?.data?.message || 'Failed to send announcement');
            return false;
        }
    }, [fetchAnnouncements]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
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
    
    const getCourseName = useCallback((courseId) => {
        if (!courseId || courseId === 'all') {
            return 'All Courses'; 
        }
        
        const course = courses.find(c => c._id === courseId.toString()); 
        return course ? `${course.name} (${course.code})` : 'Unknown Course'; 
    }, [courses]);

    const filteredAnnouncements = useMemo(() => {
        if (filterCourseId === 'all') {
            return announcements;
        }

        return announcements.filter(announcement => {
            const annCourseId = announcement.courseId?.toString() || 'all';
            
            if (annCourseId === filterCourseId) {
                return true;
            }

            if (filterCourseId === 'global' && annCourseId === 'all') {
                return true;
            }

            return false;
        });
    }, [announcements, filterCourseId]);

    const filterOptions = useMemo(() => [
        { _id: 'all', name: 'All Announcements', code: '' },
        { _id: 'global', name: 'Global Announcements', code: '' },
        ...courses
    ], [courses]);

    return (
        <div className="flex-1 p-8">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="w-full max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Announcements</h2>

                {userRole === 'admin' && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h3 className="text-xl font-semibold mb-4">Create New Announcement</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                                    placeholder="e.g., Important Update for All Students"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                    Content *
                                </label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows="4"
                                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                                    placeholder="Write your announcement here..."
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="course-select-send" className="block text-sm font-medium text-gray-700 mb-1">
                                    Send to Course
                                </label>
                                <select
                                    id="course-select-send"
                                    value={courseToSend} 
                                    onChange={(e) => setCourseToSend(e.target.value)} 
                                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                                >
                                    <option value="all">All Courses (Global Announcement)</option>
                                    {courses.length > 0 ? (
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
                            
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    <Send size={16} />
                                    <span>Send Announcement</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                            {filterCourseId === 'all' 
                                ? `All Announcements (${filteredAnnouncements.length})`
                                : `Filtered Announcements (${filteredAnnouncements.length})`
                            }
                        </h3>
                        
                        <div className="flex items-center space-x-2">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={filterCourseId}
                                onChange={(e) => setFilterCourseId(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {filterOptions.map(option => (
                                    <option key={option._id} value={option._id}>
                                        {option.name} {option.code ? `(${option.code})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-12 text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-lg">
                            <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-indigo-500" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <p className="text-sm">Loading announcements...</p>
                        </div>
                    ) : filteredAnnouncements.length > 0 ? (
                        filteredAnnouncements.map(announcement => (
                            <div key={announcement._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-lg font-semibold text-gray-900">{announcement.title}</h4>
                                    <div className="flex items-center space-x-2">
                                        {announcement.date && (
                                            <span className="text-sm text-gray-500">
                                                {new Date(announcement.date).toLocaleDateString()}
                                            </span>
                                        )}
                                        <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center whitespace-nowrap">
                                            <BookOpen size={12} className="mr-1"/>
                                            {getCourseName(announcement.courseId)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 whitespace-pre-wrap">
                                    {announcement.content || announcement.message}
                                </p> 
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                            <p className="text-lg">No announcements found</p>
                            <p className="text-sm mt-1">
                                {filterCourseId === 'all' 
                                    ? 'Create your first announcement above'
                                    : 'Try selecting a different filter'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsView;