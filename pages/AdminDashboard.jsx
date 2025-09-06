import VocabularyForm from '../src/forms/vocabulary';
import PracticeForm from '../src/forms/Practice';
import QuizForm from '../src/forms/Quiz';
import SentenceForm from '../src/forms/Sentence';
import AvatarToStudentForm from '../src/forms/AvatarToStudent';
import StudentToAvatarForm from '../src/forms/StudentToAvatar';
import AvatarsPanel from "./Avatars";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ListTree, ScrollText, Settings, ClipboardList, Rocket, Eye, BrainCircuit,
  Handshake, ArrowRight, XCircle, GraduationCap, PlusCircle, Users, Pencil, Copy, Search, LogIn, LogOut, Bot, BookOpen, FileText, Dumbbell, ChevronRight, Menu, X
} from 'lucide-react';

// Helper function to convert a number to Indian Rupee words
const convertNumberToWords = (num) => {
  if (isNaN(num) || num === null || num === '') {
    return "";
  }
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const c = ['', 'hundred', 'thousand', 'lakh', 'crore'];

  const numString = String(num);
  let output = '';

  const inWords = (m, place) => {
    let s = a[Number(m)];
    if (Number(m) > 19) {
      s = b[Math.floor(Number(m) / 10)] + ' ' + a[Number(m) % 10];
    }
    if (s !== '') {
      output += s + ' ' + c[place] + ' ';
    }
  };

  const n = ('000000000' + numString).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';

  inWords(n[1], 4);
  inWords(n[2], 3);
  inWords(n[3], 2);
  inWords(n[4], 1);
  inWords(n[5], 0);

  const words = output.replace(/\s+/g, ' ').trim();
  const titleCaseWords = words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return titleCaseWords + " Rupees";
};

// =========================================================================
// Below are the contents of the individual form files, now in a single file
// =========================================================================


// New Avatars Panel Component


// New Instructors Management Panel Component
const InstructorsPanel = ({ instructors, handleAddInstructor, handleDeleteInstructor }) => {
  const [showAddInstructorForm, setShowAddInstructorForm] = useState(false);
  const [instructorFormData, setInstructorFormData] = useState({ name: '', email: '', mobile: '', loginEnabled: true });
  const [instructorSearchTerm, setInstructorSearchTerm] = useState('');

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInstructorFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!instructorFormData.name || !instructorFormData.email) {
      toast.error("Name and Email are required.");
      return;
    }
    
    // Simulate a backend API call
    console.log("Simulating backend API call to create instructor and send email invitation...");
    console.log("Data sent:", instructorFormData);

    // In a real application, you would replace this with a fetch request
    // const response = await fetch('/api/instructors', { method: 'POST', body: JSON.stringify(instructorFormData) });
    // if (response.ok) { ... } else { ... }

    // On success, add the instructor to local state and show a toast
    handleAddInstructor(instructorFormData);
    setInstructorFormData({ name: '', email: '', mobile: '', loginEnabled: true });
    setShowAddInstructorForm(false);
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(instructorSearchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(instructorSearchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-7xl flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Instructors Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search instructors..."
              value={instructorSearchTerm}
              onChange={(e) => setInstructorSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowAddInstructorForm(!showAddInstructorForm)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
          >
            <PlusCircle size={16} />
            <span>Add Instructor</span>
          </button>
        </div>
      </div>

      {showAddInstructorForm && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mb-8 mx-auto">
          <h3 className="text-xl font-semibold mb-4">Add New Instructor</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="instructor-name" className="text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
                <input
                  id="instructor-name"
                  type="text"
                  name="name"
                  value={instructorFormData.name}
                  onChange={handleFormChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="instructor-email" className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="instructor-email"
                  type="email"
                  name="email"
                  value={instructorFormData.email}
                  onChange={handleFormChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="instructor-mobile" className="text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  id="instructor-mobile"
                  type="tel"
                  name="mobile"
                  value={instructorFormData.mobile}
                  onChange={handleFormChange}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <input
                  id="login-access"
                  type="checkbox"
                  name="loginEnabled"
                  checked={instructorFormData.loginEnabled}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="login-access" className="text-sm font-medium text-gray-700">Login Access</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddInstructorForm(false)}
                className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save Instructor
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Access
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstructors.length > 0 ? (
                filteredInstructors.map((instructor, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{instructor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${instructor.loginEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {instructor.loginEnabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDeleteInstructor(instructor.email)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No instructors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Login Panel Component
const LoginPanel = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = () => {
    handleLogin(email, password);
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img
              className="h-16 w-auto rounded-lg shadow-lg"
              src="src\assets\erus.jpg"
              alt="Erus Academy Logo"
            />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Erus Academy
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            MEANS FOR SKILL UP
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember Me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot Password? Contact your Administrator
              </a>
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          By using this software, you agree to our terms, conditions, and license agreement.
        </p>
        <p className="text-center text-xs text-gray-400">
          © Copyright 2025 - Erus Academy Private Limited
        </p>
      </div>
    </div>
  );
};

const Sidebar = ({ userRole, currentView, setCurrentView, handleLogout }) => {
  const navigation = [
    { name: 'Courses', icon: GraduationCap, view: 'courses', roles: ['admin', 'instructor'] },
    { name: 'Avatars', icon: Bot, view: 'avatars', roles: ['admin', 'instructor'] },
    { name: 'Instructors', icon: Users, view: 'instructors', roles: ['admin'] },
  ];

  const allowedNavigation = navigation.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-8">
          <img
            className="h-10 w-auto rounded-lg shadow-md"
            src="src\assets\erus.jpg"
            alt="Erus Academy Logo"
          />
          <span className="text-xl font-bold text-gray-900">Erus Academy</span>
        </div>
        <nav className="space-y-2">
          {allowedNavigation.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex items-center space-x-3 px-4 py-2 rounded-md w-full text-left transition-colors duration-200
                ${currentView === item.view ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 px-4 py-2 rounded-md w-full text-left transition-colors duration-200 text-gray-600 hover:bg-gray-100"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'courses', 'days', 'modules', 'module-form', 'instructors', 'avatars'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin', 'instructor', null

  const [courses, setCourses] = useState([
    { id: 'course-1', name: 'English Language Mastery', code: 'ELM-101', description: 'Advanced grammar and vocabulary for professional use.', originalPrice: 15000, price: 12999, duration: 8, studentsEnrolled: 45 },
    { id: 'course-2', name: 'Conversational Spanish', code: 'CS-201', description: 'Learn to speak Spanish fluently with daily practice.', originalPrice: null, price: 9999, duration: 6, studentsEnrolled: 82 },
    { id: 'course-3', name: 'Data Science Fundamentals', code: 'DSF-301', description: 'An introductory course to data science and machine learning.', originalPrice: 25000, price: 19999, duration: 12, studentsEnrolled: 60 },
  ]);

  const [instructors, setInstructors] = useState([
    { id: 'instr-1', name: 'Jane Doe', email: 'jane@erus.com', mobile: '9876543210', loginEnabled: true },
    { id: 'instr-2', name: 'John Smith', email: 'john@erus.com', mobile: '9988776655', loginEnabled: true },
  ]);

  const handleAddInstructor = (newInstructorData) => {
    const newId = `instr-${Date.now()}`;
    setInstructors(prev => [...prev, { id: newId, ...newInstructorData }]);
    toast.success("Instructor added successfully! An invitation email has been sent.");
  };

  const handleDeleteInstructor = (email) => {
    setInstructors(prev => prev.filter(i => i.email !== email));
    toast.success("Instructor deleted successfully!");
  };

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

  const [moduleStates, setModuleStates] = useState([
    { title: "Vocabulary", content: "Manage and update the vocabulary module.", path: "/vocabulary", icon: ListTree, status: "Active", form: "VocabularyForm" },
    { title: "Sentence Pronunciation", content: "Manage and update the Sentence Pronounciation module.", path: "/sentence", icon: BrainCircuit, status: "Draft", form: "SentenceForm" },
    { title: "Practice Speaking", content: "Manage and update the Practice Speaking module.", path: "/practice", icon: ScrollText, status: "Active", form: "PracticeForm" },
    { title: "Conversation-Avatar to Student", content: "Manage and update the Conversation-AS module.", path: "/avatartostudent", icon: Handshake, status: "Draft", form: "AvatarToStudentForm" },
    { title: "Conversation-Student To Avatar", content: "Manage and update the Conversation-SA module.", path: "/studenttoavatar", icon: ClipboardList, status: "Active", form: "StudentToAvatarForm" },
    { title: "Quiz", content: "Manage and update the Quiz Module.", path: "/quiz", icon: Settings, status: "Draft", form: "QuizForm" },
  ]);

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
    toast.success("Logged out successfully!");
  };

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

  const renderContent = () => {
    if (currentView === 'courses') {
      const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(courseSearchTerm.toLowerCase())
      );
      return (
        <div className="flex-1 p-8">
          <Toaster position="top-right" reverseOrder={false} />
          <div className="w-full max-w-7xl flex items-center justify-between mb-12">
            <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="w-full max-w-7xl flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Courses</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={courseSearchTerm}
                  onChange={(e) => setCourseSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
             onClick={() => {
  setShowAddCourseForm(true);
  setIsEditing(false);
  setCourseFormData({ code: '', name: '', description: '', originalPrice: '', price: '', duration: '' });
}}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
              >
                <PlusCircle size={16} />
                <span>Add Course</span>
              </button>
            </div>
          </div>
         {showAddCourseForm && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-8 shadow-xl max-w-2xl w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Add New Course</h3>
        <button onClick={() => setShowAddCourseForm(false)} className="text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="add-course-code" className="text-sm font-medium text-gray-700 mb-1">Course Code</label>
            <input
              id="add-course-code"
              type="text"
              name="code"
              value={courseFormData.code}
              onChange={handleFormChange}
              placeholder="e.g., ELM-101"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="add-course-name" className="text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              id="add-course-name"
              type="text"
              name="name"
              value={courseFormData.name}
              onChange={handleFormChange}
              placeholder="e.g., English Language Mastery"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="add-original-price" className="text-sm font-medium text-gray-700 mb-1">Original Price (INR)</label>
            <input
              id="add-original-price"
              type="number"
              name="originalPrice"
              value={courseFormData.originalPrice}
              onChange={handleFormChange}
              placeholder="e.g., 15000"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="add-course-price" className="text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
            <input
              id="add-course-price"
              type="number"
              name="price"
              value={courseFormData.price}
              onChange={handleFormChange}
              placeholder="e.g., 12999"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {courseFormData.price ? convertNumberToWords(courseFormData.price) : "Enter a price"}
            </p>
          </div>
          <div className="flex flex-col">
            <label htmlFor="add-course-duration" className="text-sm font-medium text-gray-700 mb-1">Duration (Weeks)</label>
            <input
              id="add-course-duration"
              type="number"
              name="duration"
              value={courseFormData.duration}
              onChange={handleFormChange}
              placeholder="e.g., 8"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {courseFormData.duration > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                This is a {courseFormData.duration * 7} day course.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="add-course-description" className="text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="add-course-description"
            name="description"
            value={courseFormData.description}
            onChange={handleFormChange}
            placeholder="Provide a brief description of the course."
            rows="3"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setShowAddCourseForm(false)}
            className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddCourse}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Course
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      );
    } else if (currentView === 'days') {
      const days = selectedCourse ? Array.from({ length: selectedCourse.duration * 7 }, (_, i) => `Day ${i + 1}`) : [];
      const filteredDays = days.filter(day =>
        day.toLowerCase().includes(daySearchTerm.toLowerCase())
      );
      return (
        <div className="flex-1 p-8">
          <Toaster position="top-right" reverseOrder={false} />
          <div className="w-full max-w-7xl flex items-center justify-between mb-12">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowRight className="rotate-180" size={16} />
              <span>Change Course</span>
            </button>
            <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">Admin Dashboard</h1>
            <div className="w-24" />
          </div>

          <div className="w-full max-w-7xl mb-12 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-700">
              Select a day for: <span className="text-indigo-600">{selectedCourse.name}</span>
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search days..."
                value={daySearchTerm}
                onChange={(e) => setDaySearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="w-full max-w-7xl flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDays.length > 0 ? (
                filteredDays.map((day, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setSelectedDay(day);
                            setCurrentView('modules');
                        }}
                        className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between items-center shadow-sm
                            hover:ring-2 hover:ring-indigo-500 transition-all duration-300 ease-in-out cursor-pointer"
                    >
                        <div className="p-3 mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-xl">
                            {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mt-2">{day}</h3>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                    No matching days found.
                </div>
            )}
          </div>
        </div>
      );
    } else if (currentView === 'modules') {
      return (
        <div className="flex-1 p-8">
          <Toaster position="top-right" reverseOrder={false} />
          <div className="w-full max-w-7xl flex items-center justify-between mb-12">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowRight className="rotate-180" size={16} />
              <span>Change Day</span>
            </button>
            <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">Admin Dashboard</h1>
            <div className="w-24" />
          </div>

          <div className="w-full max-w-7xl mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Modules for: <span className="text-indigo-600">{selectedCourse.name}</span>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-indigo-600">{selectedDay}</span>
            </h2>
          </div>

          <div className="w-full max-w-7xl flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleStates.map((module, index) => {
              const Icon = module.icon;
              const isCompleted = module.status === 'Active';

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between shadow-sm
                    hover:ring-2 hover:ring-indigo-500 transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={() => {
                    setSelectedModule(module);
                    setCurrentView('module-form');
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <div className="p-3 mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mt-2">{module.title}</h3>
                    </div>
                    <label className="flex items-center cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isCompleted}
                        onChange={() => handleModuleToggle(module.title)}
                      />
                      <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}>
                        <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 transform ${isCompleted ? "translate-x-6" : "translate-x-0"} shadow-md`}></div>
                      </div>
                    </label>
                  </div>

                  <p className="text-sm text-gray-600 mt-4 leading-relaxed flex-grow">
                    {module.content}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium">
                    <span className={`h-2.5 w-2.5 rounded-full mr-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span className={`${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>{isCompleted ? "Completed" : "In Progress"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-7xl flex items-center justify-center gap-6 mt-12">
            <button
              onClick={() => toast.success("Content for the selected day is now live!")}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              <Rocket size={18} className="inline-block mr-2" />
              Go Live
            </button>
            <button
              onClick={() => toast.success("Preview loaded!")}
              className="px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              <Eye size={18} className="inline-block mr-2" />
              Preview
            </button>
          </div>
        </div>
      );
    } else if (currentView === 'module-form') {
      const FormComponent = (() => {
        switch (selectedModule?.form) {
          case 'VocabularyForm':
            return VocabularyForm;
          case 'PracticeForm':
            return PracticeForm;
          case 'QuizForm':
            return QuizForm;
          case 'SentenceForm':
            return SentenceForm;
          case 'AvatarToStudentForm':
            return AvatarToStudentForm;
          case 'StudentToAvatarForm':
            return StudentToAvatarForm;
          default:
            return null;
        }
      })();
      const title = selectedModule?.title || 'Unknown Module';
      return (
          <div className="flex-1 p-8">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="w-full max-w-7xl flex items-center justify-between mb-12">
                <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                <ArrowRight className="rotate-180" size={16} />
                <span>Go Back to Modules</span>
                </button>
                <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">{title}</h1>
            </div>
            <div className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
                    Content for {title}
                </h2>
                {FormComponent ? (
                    <FormComponent />
                ) : (
                    <p className="text-sm text-gray-500 mt-4">
                      This is a placeholder for the content of {title}. The form component could not be found or is not yet implemented.
                    </p>
                )}
            </div>
          </div>
      );
    } else if (currentView === 'instructors') {
      return (
        <InstructorsPanel
          instructors={instructors}
          handleAddInstructor={handleAddInstructor}
          handleDeleteInstructor={handleDeleteInstructor}
        />
      );
    } else if (currentView === 'avatars') {
      return <AvatarsPanel />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {userRole ? (
        <>
          <Sidebar
            userRole={userRole}
            currentView={currentView}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
          {renderContent()}
        </>
      ) : (
        <LoginPanel handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default AdminDashboard;
