import React from "react";
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Star,
  BookOpen,
  Target,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const MainDashboard = ({ courses, setSelectedCourse, setCurrentView, userRole }) => {
  // Mock data - replace with real data
  const totalRevenue = 2847650;
  const totalStudents = 1243;
  const activeCourses = courses?.length || 0;
  const completionRate = 78.5;

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateCourseStats = (course) => {
    // Mock calculations - replace with real data
    const enrolled = course.studentsEnrolled || 0;
    const capacity = Math.max(enrolled * 1.5, 100);
    const completionPercentage = ((enrolled / capacity) * 100).toFixed(2);
    const revenue = enrolled * course.price;
    
    return {
      enrolled,
      capacity,
      completionPercentage: parseFloat(completionPercentage),
      revenue
    };
  };

  const quickAccessSections = [
    {
      title: "Course Management",
      count: 5,
      items: [
        { name: "Manage Courses", icon: GraduationCap },
        { name: "Course Analytics", icon: BarChart3 },
        { name: "Student Progress", icon: TrendingUp },
        { name: "Course Reviews", icon: Star },
        { name: "Course Materials", icon: FileText }
      ]
    },
    {
      title: "Student Management",
      count: 4,
      items: [
        { name: "All Students", icon: Users },
        { name: "Enrollments", icon: BookOpen },
        { name: "Student Performance", icon: Target },
        { name: "Certificates", icon: Star }
      ]
    },
    {
      title: "Financial Management",
      count: 3,
      items: [
        { name: "Revenue Analytics", icon: DollarSign },
        { name: "Payment Tracking", icon: Activity },
        { name: "Financial Reports", icon: PieChart }
      ]
    },
    {
      title: "System & Settings",
      count: 4,
      items: [
        { name: "User Management", icon: Users },
        { name: "System Settings", icon: Settings },
        { name: "Reports", icon: FileText },
        { name: "Analytics Dashboard", icon: BarChart3 }
      ]
    }
  ];

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCurrentView('course-dashboard');
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard - Erus Academy Private Limited</h1>
            <p className="text-gray-600 mt-1">Course Management System by Erus Academy Pvt Ltd</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{getCurrentDate()}</p>
            <p className="text-lg font-semibold text-indigo-600">Welcome, {userRole === 'admin' ? 'Administrator' : 'Instructor'}!</p>
          </div>
        </div>
        <div className="bg-indigo-600 text-white p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Erus Academy Real-time Course Management Software</h2>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">{totalStudents.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-indigo-600">{activeCourses}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Enrollment Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses && courses.length > 0 ? (
            courses.map((course) => {
              const stats = calculateCourseStats(course);
              return (
                <div 
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{course.name}</h4>
                      <p className="text-xs text-gray-500">Code: {course.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">{stats.enrolled}</p>
                      <p className="text-xs text-gray-500">Enrolled</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Enrolled / Capacity</span>
                      <span className="font-semibold">{stats.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(stats.completionPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Revenue: {formatCurrency(stats.revenue)}</span>
                    <span>{stats.enrolled}/{stats.capacity}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No courses available. Create your first course to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h3>
        <p className="text-gray-600 mb-6">Navigate to your most used features</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickAccessSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{section.title}</h4>
                  <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-1 rounded-full">
                    {section.count}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className="flex items-center space-x-3 w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => {
                      // Handle navigation to specific sections
                      if (item.name === "Manage Courses") setCurrentView('courses');
                      if (item.name === "All Students" || item.name === "User Management") setCurrentView('instructors');
                      if (item.name === "Course Materials") setCurrentView('avatars');
                    }}
                  >
                    <item.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">Erus Course Management</p>
        <p className="text-sm text-gray-400 mt-1">© Copyright 2025 - Erus Academy Private Limited</p>
      </div>
    </div>
  );
};

export default MainDashboard;