import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

// Top-level components and layouts
import MainLayout from "./layouts/MainLayout";

// Feature-based imports
import CoursesView from "./features/courses/CoursesView";
import DaysView from "./features/courses/DaysView";
import ModulesView from "./features/modules/ModulesView";
import InstructorsPanel from "./features/instructors/InstructorsPanel";
import StudentsPanel from "./features/students/StudentsPanel";
import StudentEnrollmentForm from "./features/students/StudentEnrollmentForm";
import MainDashboard from "./features/dashboard/MainDashboard";
import TransactionsView from "./features/transactions/TransactionsView";
import AnnouncementsView from "./features/announcements/AnnouncementsView";
import ReferralsView from "./features/referrals/ReferralsView";
import CourseForm from "./features/courses/CourseForm";
import AccountPage from "./features/account/AccountPage";
import ModuleFormView from "./features/modules/ModuleFormView";
import api from "./utils/api";
//forms
import Vocabulary from "./features/modules/vocabulary";
import Sentence from "./features/modules/Sentence";
import Practice from "./features/modules/Practice";
import AvatarToStudent from "./features/modules/AvatarToStudent";
import StudentToAvatar from "./features/modules/StudentToAvatar";
import Quiz from "./features/modules/Quiz";
// Pages
import Avatars from "./pages/Avatars";

const API_USERS_URL = "http://localhost:3000/api/v1/users";

function App() {
  const [userRole, setUserRole] = useState("admin");
  const [users, setUsers] = useState([]); 

  // Function to fetch the list of all users
  useEffect(() => {
    const fetchUsers = async () => {
      console.log(`[Users Fetch] Attempting to fetch users from: ${API_USERS_URL}`); // 🟢 START
      try {
        const response = await fetch(API_USERS_URL);
        
        if (!response.ok) {
          // Log a network/server status error
          console.error(`[Users Fetch] HTTP Error: ${response.status} ${response.statusText}`); // 🔴 ERROR
          toast.error(`Failed to fetch users: Server responded with ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Log the complete response object structure
        console.log("[Users Fetch] Raw API Data Received:", data); 

        // IMPORTANT: Extract the 'users' array and check its content
        const usersArray = data.users || []; 
        setUsers(usersArray);
        
        if (usersArray.length === 0) {
            console.warn("[Users Fetch] SUCCESS - Fetched 0 users."); // 🟠 WARNING
            toast("User list loaded, but it is empty. Check your database.", {icon: '⚠️'});
        } else {
            console.log(`[Users Fetch] SUCCESS - Fetched ${usersArray.length} users. Example Name: ${usersArray[0].name}`); // 🟢 SUCCESS
            toast.success("Users list loaded successfully!");
        }

      } catch (error) {
        // Log a catastrophic error (network down, JSON parse fail, etc.)
        console.error("[Users Fetch] Catastrophic Error:", error.message); // 🔴 ERROR
        toast.error("Could not connect to user API or parse data.");
        setUsers([]);
      }
    };

    if (userRole === "admin") {
      fetchUsers();
    }
  }, [userRole]);

  const handleLogout = () => {
    setUserRole(null);
    toast.success("Logged out successfully!");
  };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

      {userRole ? (
        <div className="md:pl-64 min-h-screen bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={<MainLayout handleLogout={handleLogout} userRole={userRole} />}
            >
              <Route index element={<MainDashboard />} />
              <Route path="avatars" element={<Avatars />} />
              <Route path="courses" element={<CoursesView userRole={userRole} />} />
              <Route path="courses/:courseSlug" element={<DaysView />} />
              
              <Route path="courses/:courseSlug/days/:dayNumber" element={<ModulesView />} />
              <Route path="courses/:courseSlug/days/:dayNumber/vocabulary" element={<Vocabulary />} />
              <Route path="courses/:courseSlug/days/:dayNumber/sentence" element={<Sentence />} />
              <Route path="courses/:courseSlug/days/:dayNumber/practice" element={<Practice />} />
              <Route path="courses/:courseSlug/days/:dayNumber/avatartostudent" element={<AvatarToStudent />} />
              <Route path="courses/:courseSlug/days/:dayNumber/studenttoavatar" element={<StudentToAvatar />} />
              <Route path="courses/:courseSlug/days/:dayNumber/quiz" element={<Quiz />} />

              {/* Passing users to CourseForm */}
              <Route path="courseform" element={<CourseForm allUsers={users} />} /> 
              
              {/* Other top-level routes */}
              <Route path="instructors" element={<InstructorsPanel userRole={userRole} />} />
              <Route path="students" element={<StudentsPanel userRole={userRole} />} />
              <Route path="announcements" element={<AnnouncementsView userRole={userRole} />} />
              <Route path="referrals" element={<ReferralsView userRole={userRole} />} />
              <Route path="transactions" element={<TransactionsView />} />
              <Route path="bulk-enrollment" element={<StudentEnrollmentForm />} />
              <Route path="module-form" element={<ModuleFormView />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="*" element={<div className="p-8">Page not found</div>} />
            </Route>
          </Routes>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl font-semibold">
          You have been logged out. Please refresh the page to sign in as Admin again.
        </div>
      )}
    </>
  );
}

export default App;