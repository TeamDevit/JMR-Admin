import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

// Top-level components and layouts
// NOTE: LoginPanel is removed as we are bypassing the login screen
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

function App() {
  // *** MODIFICATION HERE: Default userRole is set to "admin" to bypass login ***
  const [userRole, setUserRole] = useState("admin");

  // Removed handleLogin function as it is no longer required to authenticate

  const handleLogout = () => {
    // Allows logging out, which will set userRole to null
    setUserRole(null);
    toast.success("Logged out successfully!");
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {userRole ? (
        // Renders the main application if userRole is set (defaulted to "admin")
        <div className="md:pl-64 min-h-screen bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={<MainLayout handleLogout={handleLogout} userRole={userRole} />}
            >
              <Route index element={<MainDashboard />} />
              <Route path="avatars" element={<Avatars />} />
              <Route path="courses" element={<CoursesView userRole={userRole} />} />

              {/* Route for the Days list of a course */}
              <Route path="courses/:courseId" element={<DaysView />} />
              
              {/* Route for the Modules list of a specific day */}
              <Route path="courses/:courseId/days/:dayId" element={<ModulesView />} />
              
              {/* Separate routes for each form. They will now open as full pages. */}
              <Route path="courses/:courseId/days/:dayId/vocabulary" element={<Vocabulary />} />
              <Route path="courses/:courseId/days/:dayId/sentence" element={<Sentence />} />
              <Route path="courses/:courseId/days/:dayId/practice" element={<Practice />} />
              <Route path="courses/:courseId/days/:dayId/avatartostudent" element={<AvatarToStudent />} />
              <Route path="courses/:courseId/days/:dayId/studenttoavatar" element={<StudentToAvatar />} />
              <Route path="courses/:courseId/days/:dayId/quiz" element={<Quiz />} />

              {/* Other top-level routes */}
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
        // Placeholder text if the user logs out, since LoginPanel is no longer imported
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl font-semibold">
          You have been logged out. Please refresh the page to sign in as Admin again.
        </div>
      )}
    </>
  );
}

export default App;
