import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";


// Top-level components and layouts
import LoginPanel from "./components/LoginPanel";
import MainLayout from "./layouts/MainLayout";

// Feature-based imports
import CoursesView from "./features/courses/CoursesView";
import CourseDashboard from "./features/courses/CourseDashboard";
import DaysView from "./features/courses/DaysView";
import InstructorsPanel from "./features/instructors/InstructorsPanel";
import StudentsPanel from "./features/students/StudentsPanel";
import StudentEnrollmentForm from "./features/students/StudentEnrollmentForm";
import MainDashboard from "./features/dashboard/MainDashboard";
import TransactionsView from "./features/transactions/TransactionsView";
import AnnouncementsView from "./features/announcements/AnnouncementsView";
import ReferralsView from "./features/referrals/ReferralsView";
import ModulesView from "./features/modules/ModulesView";
import ModuleFormView from "./features/modules/ModuleFormView";
import CourseForm from "./features/courses/CourseForm";
import AccountPage from "./features/account/AccountPage";

// Pages
import Avatars from "./pages/Avatars";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPanel from "./pages/StudentPanel";

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (email, password) => {
    if (email === "admin@erus.com" && password === "admin123") {
      setUserRole("admin");
  
    } else if (email === "instructor@erus.com" && password === "instructor123") {
      setUserRole("instructor");
      toast.success("Signed in as Instructor!");
      
    } else {
      toast.error("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    toast.success("Logged out successfully!");
  };

  return (
    <>
      {/* Only one Toaster at the top level */}
      <Toaster position="top-right" reverseOrder={false} />

      {userRole ? (
        // Wrap all pages to leave space for fixed sidebar
        <div className="md:pl-64 min-h-screen bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={<MainLayout handleLogout={handleLogout} userRole={userRole} />}
            >
              <Route index element={<MainDashboard />} />
              <Route path="adminpanel" element={<AdminDashboard userRole={userRole} />} />
              <Route path="studentpanel" element={<StudentPanel />} />
              <Route path="avatars" element={<Avatars />} />
              <Route path="courses" element={<CoursesView userRole={userRole} />} />
              <Route path="courseForm" element={<CourseForm/>} />
              <Route path="instructors" element={<InstructorsPanel userRole={userRole} />} />
              <Route path="students" element={<StudentsPanel userRole={userRole} />} />
              <Route path="announcements" element={<AnnouncementsView userRole={userRole} />} />
              <Route path="referrals" element={<ReferralsView userRole={userRole} />} />
              <Route path="transactions" element={<TransactionsView />} />
              <Route path="bulk-enrollment" element={<StudentEnrollmentForm />} />
              <Route path="course-dashboard" element={<CourseDashboard />} />
              <Route path="days" element={<DaysView />} />
              <Route path="modules" element={<ModulesView />} />
              <Route path="module-form" element={<ModuleFormView />} />
              <Route path="*" element={<div className="p-8">Page not found</div>} />
<Route path="account" element={<AccountPage  />} />

            </Route>
          </Routes>
        </div>
      ) : (
        <LoginPanel handleLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
