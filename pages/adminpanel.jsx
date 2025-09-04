import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ListTree, ScrollText, Settings, ClipboardList, Rocket, Eye, BrainCircuit,
  Handshake, ArrowRight, XCircle, GraduationCap, PlusCircle, Users, Pencil, Copy, Search
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

  const n = ('000000000' + numString).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';

  const inWords = (m, place) => {
    let s = a[Number(m)];
    if (Number(m) > 19) {
      s = b[Math.floor(Number(m) / 10)] + ' ' + a[Number(m) % 10];
    }
    if (s !== '') {
      output += s + ' ' + c[place] + ' ';
    }
  };

  inWords(n[1], 4);
  inWords(n[2], 3);
  inWords(n[3], 2);
  inWords(n[4], 1);
  inWords(n[5], 0);

  return output.replace(/\s+/g, ' ').trim() + " Rupees";
};

// =========================================================================
// Below are the contents of the individual form files, now in a single file
// =========================================================================

const VocabularyForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Vocabulary Module Form</h3>
      <p className="text-sm text-gray-600">This is a placeholder form for the Vocabulary module.</p>
    </div>
);

const PracticeForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Practice Speaking Module Form</h3>
      <p className="text-sm text-gray-600">This is a placeholder form for the Practice Speaking module.</p>
    </div>
);

const QuizForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Quiz Module Form</h3>
      <p className="text-sm text-gray-600">This is a placeholder form for the Quiz module.</p>
    </div>
);

const SentenceForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Sentence Pronunciation Module Form</h3>
      <p className="text-sm text-gray-600">This is a placeholder form for the Sentence Pronunciation module.</p>
    </div>
);

const AvatarToStudentForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Conversation-Avatar to Student Form</h3>
      <p className="text-sm text-gray-600">This is a placeholder form for the Avatar to Student Conversation module.</p>
    </div>
);

const StudentToAvatarForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Conversation-Student to Avatar Form</h3>
      <p className="text-sm text-gray-600">This is a placeholder form for the Student to Avatar Conversation module.</p>
    </div>
);

// =========================================================================
// End of individual form file contents
// =========================================================================

const AdminPanel = () => {
  const [currentView, setCurrentView] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [courses, setCourses] = useState([
    { id: 'course-1', name: 'English Language Mastery', code: 'ELM-101', description: 'Advanced grammar and vocabulary for professional use.', price: 12999, duration: 8, studentsEnrolled: 45 },
    { id: 'course-2', name: 'Conversational Spanish', code: 'CS-201', description: 'Learn to speak Spanish fluently with daily practice.', price: 9999, duration: 6, studentsEnrolled: 82 },
    { id: 'course-3', name: 'Data Science Fundamentals', code: 'DSF-301', description: 'An introductory course to data science and machine learning.', price: 19999, duration: 12, studentsEnrolled: 60 },
  ]);

  const [courseFormData, setCourseFormData] = useState({
    id: null,
    code: '',
    name: '',
    description: '',
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
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCourseFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!courseFormData.name || !courseFormData.code || !courseFormData.price || !courseFormData.duration) {
      toast.error("Please fill all required fields.");
      return;
    }
    const newId = `course-${Date.now()}`;
    const courseToAdd = {
      id: newId,
      ...courseFormData,
      price: parseFloat(courseFormData.price),
      duration: parseInt(courseFormData.duration),
      studentsEnrolled: 0,
    };
    setCourses(prevCourses => [...prevCourses, courseToAdd]);
    setCourseFormData({ id: null, code: '', name: '', description: '', price: '', duration: '' });
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
        price: parseFloat(courseFormData.price),
        duration: parseInt(courseFormData.duration),
      } : course
    ));
    setCourseFormData({ id: null, code: '', name: '', description: '', price: '', duration: '' });
    setIsEditing(false);
    setShowAddCourseForm(false);
    toast.success("Course updated successfully!");
  };

  const handleEditCourse = (course) => {
    setCourseFormData({
      id: course.id,
      code: course.code,
      name: course.name,
      description: course.description,
      price: course.price,
      duration: course.duration,
    });
    setIsEditing(true);
    setShowAddCourseForm(true);
  };

  const handleDuplicateCourse = (course) => {
    const newId = `course-${Date.now()}`;
    const newCourse = {
      ...course,
      id: newId,
      code: `${course.code}-DUPLICATE`,
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

  const renderView = () => {
    if (currentView === 'courses') {
      const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(courseSearchTerm.toLowerCase())
      );
      return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans flex flex-col items-center">
          <Toaster position="top-right" reverseOrder={false} />
          <div className="w-full max-w-7xl flex items-center justify-between mb-12">
            <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">Admin Dashboard</h1>
            <div className="w-24" />
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
                  setShowAddCourseForm(!showAddCourseForm);
                  setIsEditing(false);
                  setCourseFormData({ code: '', name: '', description: '', price: '', duration: '' });
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
              >
                <PlusCircle size={16} />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          {showAddCourseForm && (
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">{isEditing ? "Edit Course" : "Add New Course"}</h3>
              <form onSubmit={isEditing ? handleUpdateCourse : handleAddCourse}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="course-code" className="text-sm font-medium text-gray-700 mb-1">Course Code</label>
                    <input
                      id="course-code"
                      type="text"
                      name="code"
                      value={courseFormData.code}
                      onChange={handleFormChange}
                      placeholder="e.g., ELM-101"
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={isEditing}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="course-name" className="text-sm font-medium text-gray-700 mb-1">Course Name</label>
                    <input
                      id="course-name"
                      type="text"
                      name="name"
                      value={courseFormData.name}
                      onChange={handleFormChange}
                      placeholder="e.g., English Language Mastery"
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="course-price" className="text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
                    <input
                      id="course-price"
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
                    <label htmlFor="course-duration" className="text-sm font-medium text-gray-700 mb-1">Duration (Weeks)</label>
                    <input
                      id="course-duration"
                      type="number"
                      name="duration"
                      value={courseFormData.duration}
                      onChange={handleFormChange}
                      placeholder="e.g., 8"
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <label htmlFor="course-description" className="text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="course-description"
                    name="description"
                    value={courseFormData.description}
                    onChange={handleFormChange}
                    placeholder="Provide a brief description of the course."
                    rows="3"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
                {courseFormData.duration > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    This is a {courseFormData.duration * 7} day course.
                  </p>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCourseForm(false);
                      setIsEditing(false);
                      setCourseFormData({ code: '', name: '', description: '', price: '', duration: '' });
                    }}
                    className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    {isEditing ? "Update Course" : "Save Course"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="w-full max-w-7xl flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between shadow-sm
                      hover:ring-2 hover:ring-indigo-500 transition-all duration-300 ease-in-out"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="p-3 mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white">
                          <GraduationCap size={20} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mt-2">{course.name}</h3>
                        <p className="text-xs text-gray-400">Code: {course.code}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditCourse(course)} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full transition-colors">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDuplicateCourse(course)} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full transition-colors">
                          <Copy size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 leading-relaxed flex-grow">
                      {course.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center text-sm text-gray-500">
                      <div className="flex items-center mr-4 mb-2">
                        <span className="mr-1">Price:</span>
                        <span className="font-bold text-gray-700">₹{course.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center mr-4 mb-2">
                        <span className="mr-1">Duration:</span>
                        <span className="font-bold text-gray-700">{course.duration} weeks</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <Users size={16} className="text-indigo-500 mr-1" />
                        <span className="mr-1">Enrolled:</span>
                        <span className="font-bold text-gray-700">{course.studentsEnrolled}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setCurrentView('days');
                      }}
                      className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <span>Select Course</span>
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No courses found. Add a new one to get started!
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (currentView === 'days') {
      const days = selectedCourse ? Array.from({ length: selectedCourse.duration * 7 }, (_, i) => `Day ${i + 1}`) : [];
      const filteredDays = days.filter(day =>
        day.toLowerCase().includes(daySearchTerm.toLowerCase())
      );
      return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans flex flex-col items-center">
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
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans flex flex-col items-center">
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
      const content = selectedModule?.content || 'Content not available.';

      return (
          <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans flex flex-col items-center">
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
                <div className="w-24" />
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
    }
  };

  return renderView();
};

export default AdminPanel;
