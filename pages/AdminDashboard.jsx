import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  ListTree, ScrollText, Settings, ClipboardList, BrainCircuit, Handshake
} from 'lucide-react';

// Import components
import LoginPanel from '../src/components/LoginPanel';
import Sidebar from '../src/components/Sidebar';
import InstructorsPanel from '../src/components/InstructorsPanel';
import CoursesView from '../src/components/CoursesView';
import DaysView from '../src/components/DaysView';
import ModulesView from '../src/components/ModulesView';
import ModuleFormView from '../src/components/ModuleFormView';
import Avatars from "./Avatars";

import MainDashboard from "../src/components/MainDashboard";
import CourseDashboard from "../src/components/CourseDashboard";
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

  // Mock data for courses and instructors
  const [courses, setCourses] = useState([
    { id: 'course-1', name: 'English Language Mastery', code: 'ELM-101', description: 'Advanced grammar and vocabulary for professional use.', originalPrice: 15000, price: 12999, duration: 8, studentsEnrolled: 45 },
    { id: 'course-2', name: 'Conversational Spanish', code: 'CS-201', description: 'Learn to speak Spanish fluently with daily practice.', originalPrice: null, price: 9999, duration: 6, studentsEnrolled: 82 },
    { id: 'course-3', name: 'Data Science Fundamentals', code: 'DSF-301', description: 'An introductory course to data science and machine learning.', originalPrice: 25000, price: 19999, duration: 12, studentsEnrolled: 60 },
  ]);

  const [instructors, setInstructors] = useState([
    { id: 'instr-1', name: 'Jane Doe', email: 'jane@erus.com', mobile: '9876543210', loginEnabled: true },
    { id: 'instr-2', name: 'John Smith', email: 'john@erus.com', mobile: '9988776655', loginEnabled: true },
  ]);

  // Handlers for instructor management
  const handleAddInstructor = (newInstructorData) => {
    const newId = `instr-${Date.now()}`;
    setInstructors(prev => [...prev, { id: newId, ...newInstructorData }]);
    toast.success("Instructor added successfully! An invitation email has been sent.");
  };

  const handleDeleteInstructor = (email) => {
    setInstructors(prev => prev.filter(i => i.email !== email));
    toast.success("Instructor deleted successfully!");
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
    } else if (currentView === 'instructors' || currentView === 'avatars') {
      setCurrentView('courses');
    }
  };

  // Course management handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCourseFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = () => {
    if (!courseFormData.name || !courseFormData.code || !courseFormData.price || !courseFormData.duration) {
      toast.error("Please fill all required fields.");
      return;
    }
    const newId = `course-${Date.now()}`;
    const courseToAdd = {
      id: newId,
      ...courseFormData,
      originalPrice: courseFormData.originalPrice ? parseFloat(courseFormData.originalPrice) : null,
      price: parseFloat(courseFormData.price),
      duration: parseInt(courseFormData.duration),
      studentsEnrolled: 0,
    };
    setCourses(prevCourses => [...prevCourses, courseToAdd]);
    setCourseFormData({ id: null, code: '', name: '', description: '', originalPrice: '', price: '', duration: '' });
    setShowAddCourseForm(false);
    toast.success("Course added successfully!");
  };

  const handleUpdateCourse = (e) => {
    e.preventDefault();
    if (!courseFormData.name || !courseFormData.code || !courseFormData.price || !courseFormData.duration) {
      toast.error("Please fill all required fields.");
      return;
    }
    setCourses(prevCourses => prevCourses.map(course =>
      course.id === courseFormData.id ? {
        ...course,
        ...courseFormData,
        originalPrice: courseFormData.originalPrice ? parseFloat(courseFormData.originalPrice) : null,
        price: parseFloat(courseFormData.price),
        duration: parseInt(courseFormData.duration),
      } : course
    ));
    setCourseFormData({ id: null, code: '', name: '', description: '', originalPrice: '', price: '', duration: '' });
    setIsEditing(false);
    setShowEditModal(false);
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
            setShowAddCourseForm={setShowAddCourseForm}
            courseFormData={courseFormData}
            handleFormChange={handleFormChange}
            handleAddCourse={handleAddCourse}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            handleUpdateCourse={handleUpdateCourse}
            handleEditCourse={handleEditCourse}
            handleDuplicateCourse={handleDuplicateCourse}
            setSelectedCourse={setSelectedCourse}
            setCurrentView={setCurrentView}
            userRole={userRole}
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
          />
        );
   case 'avatars':
  return <Avatars handleLogout={handleLogout} />;
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