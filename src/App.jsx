import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

// Top-level components and layouts
import LoginPanel from "./components/LoginPanel";
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

//forms
import Vocabulary from "./features/modules/vocabulary";
import Sentence from "./features/modules/Sentence";
import Practice from "./features/modules/Practice";
import AvatarToStudent from "./features/modules/AvatarToStudent";
import StudentToAvatar from "./features/modules/StudentToAvatar";
import Quiz from "./features/modules/Quiz";

// Pages
import Avatars from "./pages/Avatars";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPanel from "./pages/StudentPanel";

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (email, password) => {
    if (email === "admin@erus.com" && password === "admin123") {
      setUserRole("admin");
      toast.success("Signed in as Admin!");
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
      <Toaster position="top-right" reverseOrder={false} />

      {userRole ? (
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
              {/* Nested route for DaysView */}
              <Route path="courses/:courseId" element={<DaysView />} />
              {/* Nested route for ModulesView */}
              <Route path="courses/:courseId/days/:dayId" element={<ModulesView />} />

              <Route path="vocabulary" element={<Vocabulary />} />
              <Route path="sentence" element={<Sentence />} />
              <Route path="practice" element={<Practice />} />
              <Route path="avatartostudent" element={<AvatarToStudent />} />
              <Route path="studenttoavatar" element={<StudentToAvatar />} />
              <Route path="quiz" element={<Quiz />} />

              <Route path="courseform" element={<CourseForm />} />
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
        <LoginPanel handleLogin={handleLogin} />
      )}
    </>
  );
}

export default App;