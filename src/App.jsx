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
const API_COURSES_URL = "/admincourses/get-course";

function App() {
  const [userRole, setUserRole] = useState("admin");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_USERS_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const usersArray = data.users || [];
        setUsers(usersArray);
      } catch (error) {
        console.error("[Users Fetch] Catastrophic Error:", error.message);
        setUsers([]);
        toast.error("Could not connect to user API or parse data.");
      }
    };

    if (userRole === "admin") {
      fetchUsers();
    }
  }, [userRole]);
  
  useEffect(() => {
    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await api.get(API_COURSES_URL);
            
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
            setCourses(coursesArray);
            console.log(`✅ Courses Loaded: ${coursesArray.length}`);
        } catch (error) {
            console.error("Course Fetch FAILED:", error);
            toast.error("Could not load course data.");
        } finally {
            setLoadingCourses(false);
        }
    };

    if (userRole === "admin") {
        fetchCourses();
    }
}, [userRole]);

  const handleLogout = () => {
    setUserRole(null);
    toast.success("Logged out successfully!");
  };
  
  if (userRole && loadingCourses) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-xl font-semibold">
        Loading core data...
      </div>
    );
  }

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
              <Route index element={<MainDashboard courses={courses} />} />
              <Route path="avatars" element={<Avatars />} />
              <Route path="courses" element={<CoursesView userRole={userRole} courses={courses} />} />
              <Route path="courses/:courseSlug" element={<DaysView />} />

              <Route path="courses/:courseSlug/days/:dayNumber" element={<ModulesView />} />
              
              {/* Pass courses prop to ALL module components */}
              <Route path="courses/:courseSlug/days/:dayNumber/vocabulary" element={<Vocabulary courses={courses} />} />
              <Route path="courses/:courseSlug/days/:dayNumber/sentence" element={<Sentence courses={courses} />} />
              <Route path="courses/:courseSlug/days/:dayNumber/practice" element={<Practice courses={courses} />} />
              <Route path="courses/:courseSlug/days/:dayNumber/avatartostudent" element={<AvatarToStudent courses={courses} />} />
              <Route path="courses/:courseSlug/days/:dayNumber/studenttoavatar" element={<StudentToAvatar courses={courses} />} />
              <Route path="courses/:courseSlug/days/:dayNumber/quiz" element={<Quiz courses={courses} />} />

              <Route
                path="courseform"
                element={<CourseForm allUsers={users} />}
              />
              <Route
                path="courseform/edit/:courseId"
                element={<CourseForm allUsers={users} />}
              />

              <Route path="instructors" element={<InstructorsPanel userRole={userRole} />} />
              <Route path="students" element={<StudentsPanel userRole={userRole} />} />
              <Route path="announcements" element={<AnnouncementsView userRole={userRole} courses={courses} />} />
              <Route path="referrals" element={<ReferralsView userRole={userRole} />} />
              <Route path="transactions" element={<TransactionsView />} />
              <Route path="bulk-enrollment" element={<StudentEnrollmentForm courses={courses} />} />
              <Route path="module-form" element={<ModuleFormView courses={courses} />} />
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