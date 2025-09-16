import React, { useState } from "react";
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

  // Mock data for courses, instructors, students, announcements, and transactions
  const [courses, setCourses] = useState([
    { id: 'course-1', name: 'English Language Mastery', code: 'ELM-101', description: 'Advanced grammar and vocabulary for professional use.', originalPrice: 15000, price: 12999, duration: 8, studentsEnrolled: 45, razorpayKey: 'rzp_test_xyz' },
    { id: 'course-2', name: 'Conversational Spanish', code: 'CS-201', description: 'Learn to speak Spanish fluently with daily practice.', originalPrice: null, price: 9999, duration: 6, studentsEnrolled: 82, razorpayKey: 'rzp_test_abc' },
    { id: 'course-3', name: 'Data Science Fundamentals', code: 'DSF-301', description: 'An introductory course to data science and machine learning.', originalPrice: 25000, price: 19999, duration: 12, studentsEnrolled: 60, razorpayKey: '' },
  ]);

  const [instructors, setInstructors] = useState([
    { id: 'instr-1', name: 'Jane Doe', email: 'jane@erus.com', mobile: '9876543210', loginEnabled: true, role: 'admin', referralCode: 'JANE10', referredStudents: 10, commissionEarned: 5000  },
    { id: 'instr-2', name: 'John Smith', email: 'john@erus.com', mobile: '9988776655', loginEnabled: true, role: 'instructor', referralCode: 'JOHN20', referredStudents: 25, commissionEarned: 12500  },
  ]);

  const [students, setStudents] = useState([
    { id: 'student-1', name: 'Alice Johnson', email: 'alice@student.com', courses: ['ELM-101'], progress: 75, grade: 92 },
    { id: 'student-2', name: 'Bob Williams', email: 'bob@student.com', courses: ['CS-201'], progress: 50, grade: 85 },
    { id: 'student-3', name: 'Charlie Brown', email: 'charlie@student.com', courses: ['ELM-101', 'DSF-301'], progress: 95, grade: 98 },
  ]);

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

  // Handlers for instructor management
  const handleAddInstructor = (newInstructorData) => {
    const newId = `instr-${Date.now()}`;
    setInstructors(prev => [...prev, { id: newId, ...newInstructorData, coursesCreated: 0, referredStudents: 0, commissionEarned: 0 }]);
    toast.success("Instructor added successfully!");
  };

  const handleUpdateInstructor = (updatedUserData) => {
    setInstructors(prev => prev.map(user =>
      user.id === updatedUserData.id ? { ...user, ...updatedUserData } : user
    ));
    toast.success("User updated successfully!");
  };

  const handleDeleteInstructor = (userId) => {
    setInstructors(prev => prev.filter(user => user.id !== userId));
    toast.success("Instructor deleted successfully!");
  };

  // Handlers for student management
  const handleBulkEnrollment = (studentsData, courseCode) => {
    // This is where you would process the uploaded file and enroll students.
    // For now, we'll just show a success message.
    console.log(`Enrolling ${studentsData.length} students into course ${courseCode}`);
    toast.success(`Successfully enrolled ${studentsData.length} students into course ${courseCode}!`);
  };

  const handleDeleteStudent = (studentId) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
    toast.success("Student deleted successfully!");
  };

  // Handlers for announcements
  const handleAddAnnouncement = (newAnnouncement) => {
    const newId = `ann-${Date.now()}`;
    setAnnouncements(prev => [{ id: newId, ...newAnnouncement, date: new Date().toISOString().split('T')[0] }, ...prev]);
    toast.success("Announcement created successfully!");
  };

  // State and handlers for course forms
  const [courseFormData, setCourseFormData] = useState({
    id: null,
    code: '',
    name: '',
    description: '',
    originalPrice: '',
    price: '',
    duration: '',
    razorpayKey: '', // Added for Razorpay integration
  });

  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [daySearchTerm, setDaySearchTerm] = useState('');

  // Mock data for modules and their statuses
  const [moduleStates, setModuleStates] = useState([
    { title: "Vocabulary", content: "Manage and update the vocabulary module.", path: "/vocabulary", icon: ListTree, status: "Active", form: "VocabularyForm" },
    { title: "Sentence Pronunciation", content: "Manage and update the Sentence Pronounciation module.", path: "/sentence", icon: BrainCircuit, status: "Draft", form: "SentenceForm" },
    { title: "Practice Speaking", content: "Manage and update the Practice Speaking module.", path: "/practice", icon: ScrollText, status: "Active", form: "PracticeForm" },
    { title: "Conversation-Avatar to Student", content: "Manage and update the Conversation-AS module.", path: "/avatartostudent", icon: Handshake, status: "Draft", form: "AvatarToStudentForm" },
    { title: "Conversation-Student To Avatar", content: "Manage and update the Conversation-SA module.", path: "/studenttoavatar", icon: ClipboardList, status: "Active", form: "StudentToAvatarForm" },
    { title: "Quiz", content: "Manage and update the Quiz Module.", path: "/quiz", icon: Settings, status: "Draft", form: "QuizForm" },
  ]);

  // Authentication handlers
  const handleLogin = (email, password) => {
    if (email === "admin@erus.com" && password === "admin123") {
      setUserRole('admin');
      setCurrentView('courses');
      toast.success("Signed in as Admin!");
    } else if (email === "instructor@erus.com" && password === "instructor123") {
      setUserRole('instructor');
      setCurrentView('courses');
      toast.success("Signed in as Instructor!");
    } else {
      toast.error("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('login');
    setSelectedCourse(null);
    setSelectedDay(null);
    setSelectedModule(null);
    toast.success("Logged out successfully!");
  };

  // Navigation handlers
  const handleGoBack = () => {
    if (currentView === 'module-form') {
      setCurrentView('modules');
      setSelectedModule(null);
    } else if (currentView === 'modules') {
      setCurrentView('days');
      setSelectedDay(null);
    } else if (currentView === 'days') {
      setCurrentView('courses');
      setSelectedCourse(null);
    } else if (currentView === 'instructors' || currentView === 'avatars' || currentView === 'referrals' || currentView === 'students' || currentView === 'announcements' || currentView === 'transactions' || currentView === 'bulk-enrollment') {
      setCurrentView('courses');
    }
  };

  // Course management handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCourseFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = (formData) => {
    const { name, code, price, duration, description, originalPrice, razorpayKey } = formData;
    if (!name || !code || !price || !duration) {
      toast.error("Please fill all required fields.");
      return;
    }
    const newId = `course-${Date.now()}`;
    const courseToAdd = {
      id: newId,
      name,
      code,
      description,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      price: parseFloat(price),
      duration: parseInt(duration),
      razorpayKey,
      studentsEnrolled: 0,
    };
    setCourses(prevCourses => [...prevCourses, courseToAdd]);
    toast.success("Course added successfully!");
  };

  const handleUpdateCourse = (formData) => {
    const { name, code, price, duration, description, originalPrice, razorpayKey } = formData;
    if (!name || !code || !price || !duration) {
      toast.error("Please fill all required fields.");
      return;
    }
    setCourses(prevCourses => prevCourses.map(course =>
      course.id === formData.id ? {
        ...course,
        name,
        code,
        description,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        price: parseFloat(price),
        duration: parseInt(duration),
        razorpayKey,
      } : course
    ));
    toast.success("Course updated successfully!");
  };

  const handleEditCourse = (course) => {
    setCourseFormData({
      id: course.id,
      code: course.code,
      name: course.name,
      description: course.description,
      originalPrice: course.originalPrice,
      price: course.price,
      duration: course.duration,
      razorpayKey: course.razorpayKey || '',
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const handleDuplicateCourse = (course) => {
    const newId = `course-${Date.now()}`;
    const newCourse = {
      ...course,
      id: newId,
      code: `${course.code}-DUPLICATE`,
      name: `${course.name} (Duplicate)`,
    };
    setCourses(prevCourses => [...prevCourses, newCourse]);
    toast.success("Course duplicated successfully!");
  };

  // Handler for toggling module status
  const handleModuleToggle = (moduleTitle) => {
    setModuleStates(prevModules =>
      prevModules.map(module =>
        module.title === moduleTitle
          ? {
              ...module,
              status: module.status === 'Active' ? 'Draft' : 'Active',
            }
          : module
      )
    );
    toast.success("Module status updated!");
  };

  // New transaction export handler
  const handleExportTransactions = () => {
    const csvContent = "data:text/csv;charset=utf-8," + [
      Object.keys(transactions[0]).join(','),
      ...transactions.map(t => Object.values(t).map(value => `"${value}"`).join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Transaction report exported successfully!");
  };


  // View rendering logic
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <MainDashboard courses={courses} setSelectedCourse={setSelectedCourse} setCurrentView={setCurrentView} userRole={userRole} />;
      case 'course-dashboard':
        return <CourseDashboard selectedCourse={selectedCourse} setCurrentView={setCurrentView} handleGoBack={() => setCurrentView('dashboard')} />;
      case 'courses':
        return (
          <CoursesView
            courses={courses}
            courseSearchTerm={courseSearchTerm}
            setCourseSearchTerm={setCourseSearchTerm}
            showAddCourseForm={showAddCourseForm}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            handleUpdateCourse={handleUpdateCourse}
            handleEditCourse={handleEditCourse}
            handleDuplicateCourse={handleDuplicateCourse}
            setSelectedCourse={setSelectedCourse}
            setCurrentView={setCurrentView}
            userRole={userRole}
            courseFormData={courseFormData}
            setCourseFormData={setCourseFormData}
          />
        );
      case 'days':
        return (
          <DaysView
            selectedCourse={selectedCourse}
            daySearchTerm={daySearchTerm}
            setDaySearchTerm={setDaySearchTerm}
            setSelectedDay={setSelectedDay}
            setCurrentView={setCurrentView}
            handleGoBack={handleGoBack}
          />
        );
      case 'modules':
        return (
          <ModulesView
            selectedCourse={selectedCourse}
            selectedDay={selectedDay}
            moduleStates={moduleStates}
            handleModuleToggle={handleModuleToggle}
            setSelectedModule={setSelectedModule}
            setCurrentView={setCurrentView}
            handleGoBack={handleGoBack}
          />
        );
      case 'module-form':
        return (
          <ModuleFormView
            selectedModule={selectedModule}
            handleGoBack={handleGoBack}
          />
        );
      case 'instructors':
        return (
          <InstructorsPanel
            instructors={instructors}
            handleAddInstructor={handleAddInstructor}
            handleDeleteInstructor={handleDeleteInstructor}
            handleUpdateInstructor={handleUpdateInstructor}
            userRole={userRole}
          />
        );
      case 'students':
        return (
          <StudentsPanel
            students={students}
            courses={courses}
            handleDeleteStudent={handleDeleteStudent}
            userRole={userRole}
          />
        );
      case 'bulk-enrollment':
        return (
          <StudentEnrollmentForm
            courses={courses}
            handleBulkEnrollment={handleBulkEnrollment}
          />
        );
      case 'announcements':
        return (
          <AnnouncementsView
            announcements={announcements}
            handleAddAnnouncement={handleAddAnnouncement}
            userRole={userRole}
          />
        );
      case 'avatars':
        return <Avatars handleLogout={handleLogout} />;
      case 'referrals':
        return (
          <ReferralsView
            referralData={instructors.filter(i => i.referralCode)} // Pass the instructors with referral data
          />
        );
      case 'transactions':
        return (
          <TransactionsView
            transactions={transactions}
            handleExport={handleExportTransactions}
          />
        );
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
