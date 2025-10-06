import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    ListTree, ScrollText, Settings, ClipboardList, BrainCircuit, Handshake, BookOpen 
} from 'lucide-react';

// Import components from their new feature folders
import LoginPanel from "../components/LoginPanel";
import Sidebar from "../components/Sidebar";
import CoursesView from "../features/courses/CoursesView";
import CourseDashboard from "../features/courses/CourseDashboard";
import DaysView from "../features/courses/DaysView";
import InstructorsPanel from "../features/instructors/InstructorsPanel";
import StudentsPanel from "../features/students/StudentsPanel";
import StudentEnrollmentForm from "../features/students/StudentEnrollmentForm";
import MainDashboard from "../features/dashboard/AnalyticsDashboard";
import TransactionsView from "../features/transactions/TransactionsView";
import AnnouncementsView from "../features/announcements/AnnouncementsView";
import ReferralsView from "../features/referrals/ReferralsView";
import ModulesView from "../features/modules/ModulesView";
import ModuleFormView from "../features/modules/ModuleFormView";
import api from "../utils/api";
import AnalyticsDashboard from "../features/analytics/AnalyticsDashboard";

// Pages
import Avatars from "../pages/Avatars";
import StudentPanel from "../pages/StudentPanel";

const AdminDashboard = () => {
    // State management for navigation and data
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    
    // REMOVED: showAddCourseForm, setShowAddCourseForm (Unused state variables)
    // REMOVED: showEditModal, setShowEditModal (Unused state variables)
    // REMOVED: isEditing, setIsEditing (Unused state variables)
    
    const [userRole, setUserRole] = useState('admin');
    
    // Core data states - Initialized as empty arrays, relying solely on APIs
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [courses, setCourses] = useState([]);
    const [instructors, ] = useState([]);
    // REMOVED: setInstructors (The setter was unused, but the state variable 'instructors' is used.)
    const [students, ] = useState([]);
    // REMOVED: setStudents (The setter was unused, but the state variable 'students' is used.)
    const [announcements, setAnnouncements] = useState([]);
    const [transactions, ] = useState([]);
    // REMOVED: setTransactions (The setter was unused, but the state variable 'transactions' is used.)

    // Mock handleLogin/Logout (needed to prevent crashes)
    const handleLogin = (role) => setUserRole(role);
    const handleLogout = () => setUserRole(null);
    
    const handleAddCourse = async () => true;


    // ----------------------------------------------------------------------
    // 1. Course Fetching Logic 
    // ----------------------------------------------------------------------
    useEffect(() => {
        console.log("🔄 Fetching courses from API...",userRole);
        if (userRole) { 
            const fetchCourses = async () => {
                setLoadingCourses(true);
                try {
                    // NOTE: Removed 'api' import from unused variable list - it's used here.
                    const response = await api.get('/admincourses/get-course'); 
                    
                    let coursesArray = [];
                    
                    if (Array.isArray(response.data)) {
                        const mappedCourses = response.data.map((course) => ({
                            _id: course._id, 
                            name: course.course_name, 
                            code: course.slug || "No Code", 
                            description: course.description,
                        }));
                        
                        coursesArray = mappedCourses;
                    } 
                    console.log(`✅ Courses Loaded: ${coursesArray.length}`);
                    
                    setCourses(coursesArray);

                } catch (error) {
                    console.error("Course Fetch FAILED:", error);
                    toast.error("Could not load course data for admin panel.");
                } finally {
                    setLoadingCourses(false);
                }
            };
            fetchCourses();
        }
    }, [userRole]); 


    // ----------------------------------------------------------------------
    // 2. Announcement Fetching Function (With Debug)
    // ----------------------------------------------------------------------
    const fetchAnnouncements = async () => {
        console.log("🔄 Fetching announcements from API...");
        try {
            const response = await api.get('/promotion/notifications/all'); 
            
            // LOG: Check the raw response
            console.log("📦 Raw Announcement API Response:", response.data);
            
            if (Array.isArray(response.data)) {
                const mappedAnnouncements = response.data.map(announcement => ({
                    id: announcement._id,
                    title: announcement.title,
                    content: announcement.message, 
                    courseId: announcement.courseId || 'all',
                    date: announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'N/A'
                }));

                setAnnouncements(mappedAnnouncements);
                // LOG: Confirm data count
                console.log(`✅ Announcements Loaded: ${mappedAnnouncements.length}`);
            } else {
                 console.warn("⚠️ Announcement API did not return an array:", response.data);
            }
        } catch (error) {
            // FIX: Logging the full error object can help debug the 500 error
            console.error("Announcement Fetch FAILED:", error.response?.data || error.message, error); 
            setAnnouncements([]);
        }
    };

    // ----------------------------------------------------------------------
    // 3. EFFECT: Call fetchAnnouncements on load 
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (userRole) {
            fetchAnnouncements();
        }
    }, [userRole]);

    // ----------------------------------------------------------------------
    // 4. Announcement Handler 
    // ----------------------------------------------------------------------
    const handleAddAnnouncement = async ({ title, content, courseId }) => {
        const loadingToast = toast.loading(`Sending announcement...`);

        try {
            const response = await api.post('/promotion/notifications/create', { 
                title,
                message: content, 
                courseId 
            });
            
            await fetchAnnouncements(); 

            toast.success(response.data.message || "Announcement created successfully!", { id: loadingToast });
            return true; 

        } catch (error) {
            console.error("Announcement POST failed:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Failed to send announcement.';
            toast.error(errorMessage, { id: loadingToast });
            return false; 
        }
    };
    
    // View rendering logic
    const renderContent = () => {
        const viewsNeedingCourses = ['courses', 'announcements', 'enrollment', 'modules', 'module-form'];
        
        // CHECK: If the view needs courses AND (it's still loading OR it finished loading with no data)
        if (viewsNeedingCourses.includes(currentView)) {
            // Check 1: Show loading state if course fetch is ongoing
            if (loadingCourses) {
                return <div className="flex-1 p-8 text-center text-gray-500">Loading courses...</div>;
            } 
            
            // Check 2: If we are done loading (loadingCourses=false) AND the array is empty, 
            // show the 'no data' message for all dependent views.
            if (courses.length === 0) {
                 return <div className="flex-1 p-8 text-center text-gray-500">Course data is unavailable. Cannot fully render views like Announcements and Enrollment.</div>;
            }
        }
        
        switch (currentView) {
         case 'dashboard':
    return <MainDashboard 
        setSelectedCourse={setSelectedCourse} 
        setCurrentView={setCurrentView} 
    />;
            case 'courses':
                return <CoursesView 
                            courses={courses} 
                            handleAddCourse={handleAddCourse} 
                            setSelectedCourse={setSelectedCourse} 
                            setCurrentView={setCurrentView} 
                            userRole={userRole} 
                        />;
                        case 'analytics':
    return <AnalyticsDashboard />;
            case 'announcements':
                // Courses are guaranteed to be loaded here if we passed the checks above!
                return (
                    <AnnouncementsView
                        announcements={announcements}
                        handleAddAnnouncement={handleAddAnnouncement}
                        userRole={userRole}
                        courses={courses} 
                    />
                );
            case 'instructors':
                return <InstructorsPanel 
                            instructors={instructors} 
                            handleAddInstructor={() => {}} 
                            handleUpdateInstructor={() => {}} 
                            handleDeleteInstructor={() => {}} 
                        />;
            case 'students':
                return <StudentsPanel students={students} />;
            case 'enrollment':
                return <StudentEnrollmentForm courses={courses} instructors={instructors} />;
            case 'transactions':
                return <TransactionsView transactions={transactions} />;
            case 'referrals':
                return <ReferralsView instructors={instructors} />;
            case 'modules':
                return <ModulesView courses={courses} setCurrentView={setCurrentView} setSelectedModule={setSelectedModule} />;
            case 'module-form':
                return <ModuleFormView selectedModule={selectedModule} courses={courses} setCurrentView={setCurrentView} />;
            case 'course-dashboard':
                return <CourseDashboard course={selectedCourse} setCurrentView={setCurrentView} setSelectedDay={setSelectedDay} />;
            case 'day-view':
                return <DaysView day={selectedDay} setCurrentView={setCurrentView} />;
            case 'avatars':
                return <Avatars />;
            case 'student-panel':
                return <StudentPanel />;
            case 'settings':
                return <div className="p-8">Settings View</div>;
            default:
                return <div className="p-8">Welcome to the Admin Panel. Select a view from the sidebar.</div>;
        }
    };

    // Main render logic
    if (!userRole) {
        return <LoginPanel handleLogin={handleLogin} />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Toaster position="top-right" reverseOrder={false} />
            <Sidebar
                userRole={userRole}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleLogout={handleLogout}
            />
            {renderContent()}
        </div>
    );
};
export default AdminDashboard;