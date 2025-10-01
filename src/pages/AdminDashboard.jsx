import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  ListTree, ScrollText, Settings, ClipboardList, BrainCircuit, Handshake
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
import MainDashboard from "../features/dashboard/MainDashboard";
import TransactionsView from "../features/transactions/TransactionsView";
import AnnouncementsView from "../features/announcements/AnnouncementsView";
import ReferralsView from "../features/referrals/ReferralsView";
import ModulesView from "../features/modules/ModulesView";
import ModuleFormView from "../features/modules/ModuleFormView";
import api from "../utils/api";
// Pages
import Avatars from "../pages/Avatars";
import StudentPanel from "../pages/StudentPanel";

const AdminDashboard = () => {
  // State management for navigation and data
  const [currentView, setCurrentView] = useState('login');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  // 🆕 NEW STATE FOR LOADING
  const [loadingCourses, setLoadingCourses] = useState(true);

  // 🆕 NEW STATE FOR REAL COURSES
  const [courses, setCourses] = useState([]);


  // Mock data for instructors, students, and transactions (keeping these for now)
  const [instructors, setInstructors] = useState([
    { id: 'instr-1', name: 'Jane Doe', email: 'jane@erus.com', mobile: '9876543210', loginEnabled: true, role: 'admin', referralCode: 'JANE10', referredStudents: 10, commissionEarned: 5000  },
    { id: 'instr-2', name: 'John Smith', email: 'john@erus.com', mobile: '9988776655', loginEnabled: true, role: 'instructor', referralCode: 'JOHN20', referredStudents: 25, commissionEarned: 12500  },
  ]);

  const [students, setStudents] = useState([
    { id: 'student-1', name: 'Alice Johnson', email: 'alice@student.com', courses: ['ELM-101'], progress: 75, grade: 92 },
    { id: 'student-2', name: 'Bob Williams', email: 'bob@student.com', courses: ['CS-201'], progress: 50, grade: 85 },
    { id: 'student-3', name: 'Charlie Brown', email: 'charlie@student.com', courses: ['ELM-101', 'DSF-301'], progress: 95, grade: 98 },
  ]);

  // ⚠️ Keep mock announcements for now
  const [announcements, setAnnouncements] = useState([
    { id: 'ann-1', title: 'Welcome to the new semester!', content: 'We are excited to have you all on board. Let the learning begin!', date: '2023-10-27' },
    { id: 'ann-2', title: 'Maintenance Window', content: 'Our servers will be down for maintenance on 2023-11-05 from 2AM to 4AM.', date: '2023-10-25' },
  ]);

  // New mock data for transactions
  const [transactions, setTransactions] = useState([
    { id: 'txn-1', courseName: 'English Language Mastery', studentName: 'Alice Johnson', amount: 12999, date: '2023-10-26', status: 'Completed', method: 'Razorpay' },
    { id: 'txn-2', courseName: 'Conversational Spanish', studentName: 'Bob Williams', amount: 9999, date: '2023-10-20', status: 'Completed', method: 'Razorpay' },
    { id: 'txn-3', courseName: 'Data Science Fundamentals', studentName: 'Charlie Brown', amount: 19999, date: '2023-10-15', status: 'Failed', method: 'Stripe' },
  ]);
  
  // ----------------------------------------------------------------------
  // 🔑 STEP 1: Implement Course Fetching (with Debugging Log)
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (userRole) { // Only fetch if logged in
      const fetchCourses = async () => {
        try {
          const response = await api.get('/get-course'); 
          
          // 🚨 DEBUG: Log the full response data here
          console.log("API Response for /get-course:", response.data);

          // Check if the response contains the new 'data' array structure
          if (response.data.success && Array.isArray(response.data.data)) {
            setCourses(response.data.data);
          } else {
            // Fallback if backend hasn't been updated to return {data: []} but just returns the array
                const coursesArray = Array.isArray(response.data) ? response.data : response.data.courses;
            setCourses(Array.isArray(coursesArray) ? coursesArray : []); 
            if (Array.isArray(coursesArray)) {
                // If it's an array, it might be the old format, no error needed.
            } else {
                toast.error("Course data format unexpected.");
            }
          }
        } catch (error) {
          console.error("Failed to fetch courses:", error);
          // 🚨 DEBUG: Log the error response
          console.error("Course Fetch Error Response:", error.response?.data);
          toast.error("Could not load course data for admin panel.");
        } finally {
          setLoadingCourses(false);
        }
      };
      fetchCourses();
    }
  }, [userRole]); // Rerun when user logs in

// ... (other handlers: handleAddInstructor, handleUpdateInstructor, handleDeleteInstructor, etc. - no changes)

  // ----------------------------------------------------------------------
  // 🔑 STEP 2: Update Announcement Handler to use the API (No change here, 
  // as this was already correct to return true/false)
  // ----------------------------------------------------------------------
  const handleAddAnnouncement = async ({ title, content, courseCode }) => {
    const loadingToast = toast.loading(`Sending announcement to ${courseCode === 'all' ? 'all courses' : courseCode}...`);

    try {
      // CRITICAL: Call the new backend notification endpoint
      const response = await api.post('/notifications/create', { 
        title,
        message: content, // Frontend's 'content' maps to backend's 'message'
        courseCode // Can be 'all' or a specific course code/slug
      });
      
      // Update mock state immediately (for visual feedback on the announcements list)
      const newId = `ann-${Date.now()}`;
      setAnnouncements(prev => [{ 
        id: newId, 
        title, 
        content, 
        date: new Date().toISOString().split('T')[0],
        courseCode 
      }, ...prev]); 

      toast.success(response.data.message || "Announcement created successfully!", { id: loadingToast });
      return true; // Indicate success for form reset

    } catch (error) {
      console.error("Announcement failed:", error);
      const errorMessage = error.response?.data?.message || 'Failed to send announcement.';
      toast.error(errorMessage, { id: loadingToast });
      return false; // Indicate failure
    }
  };

// ... (rest of the component logic - no changes)

  // View rendering logic
  const renderContent = () => {
    // ⚠️ Add loading check for courses
    if (loadingCourses && currentView !== 'login') {
      return <div className="flex-1 p-8 text-center text-gray-500">Loading courses...</div>;
    }
    
    switch (currentView) {
      case 'dashboard':
        return <MainDashboard courses={courses} setSelectedCourse={setSelectedCourse} setCurrentView={setCurrentView} userRole={userRole} />;
      // ... (other cases)
      case 'announcements':
        return (
          <AnnouncementsView
            announcements={announcements}
            handleAddAnnouncement={handleAddAnnouncement}
            userRole={userRole}
            // 🔑 STEP 3: PASS FETCHED COURSES TO AnnouncementsView
            courses={courses} 
          />
        );
      // ... (rest of the cases)
      default:
        return null;
    }
  };

  // Main render logic
  if (!userRole) {
    return <LoginPanel handleLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
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