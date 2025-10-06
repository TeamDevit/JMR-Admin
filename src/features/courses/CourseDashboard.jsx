import React from "react";
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Star,
  BookOpen,
  Target,
  Calendar,
  FileText,
  Play,
  CheckCircle,
  AlertCircle,
  Award,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const CourseDashboard = ({ selectedCourse, setCurrentView }) => {
  const handleGoBack = () => setCurrentView('dashboard');  // Mock data for individual course - replace with real data
  const courseStats = {
    totalRevenue: selectedCourse.price * selectedCourse.studentsEnrolled,
    enrollments: selectedCourse.studentsEnrolled || 0,
    completionRate: 74.2,
    averageRating: 4.6,
    totalModules: 42,
    completedModules: 31,
    activeLearners: Math.floor(selectedCourse.studentsEnrolled * 0.8),
    avgCompletionTime: `${selectedCourse.duration} weeks`,
    courseDuration: selectedCourse.duration * 7,
    daysCompleted: Math.floor((selectedCourse.duration * 7) * 0.74)
  };

  const recentActivities = [
    { student: "John Doe", action: "Completed Module 15", time: "2 hours ago" },
    { student: "Sarah Smith", action: "Started Module 12", time: "4 hours ago" },
    { student: "Mike Johnson", action: "Submitted Assignment 3", time: "6 hours ago" },
    { student: "Emily Davis", action: "Completed Final Quiz", time: "8 hours ago" },
    { student: "Chris Wilson", action: "Started Module 8", time: "12 hours ago" }
  ];

  const paymentBreakdown = [
    { month: "January", amount: 125000, students: 12 },
    { month: "February", amount: 98000, students: 9 },
    { month: "March", amount: 156000, students: 15 },
    { month: "April", amount: 187000, students: 18 },
    { month: "May", amount: 234000, students: 22 }
  ];

  const moduleProgress = Array.from({ length: selectedCourse.duration }, (_, weekIndex) => ({
    week: weekIndex + 1,
    totalModules: 6,
    completedModules: Math.min(6, Math.max(0, Math.floor(Math.random() * 6) + (weekIndex < 4 ? weekIndex : 4))),
    studentsActive: Math.floor(selectedCourse.studentsEnrolled * (0.9 - weekIndex * 0.05))
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedCourse.name}</h1>
              <p className="text-gray-600 mt-1">Course Code: {selectedCourse.code} • Duration: {selectedCourse.duration} weeks</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            <p className="text-lg font-semibold text-indigo-600">Course Analytics Dashboard</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Detailed Course Performance & Analytics</h2>
          <p className="opacity-90">{selectedCourse.description}</p>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Course Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(courseStats.totalRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">Price: {formatCurrency(selectedCourse.price)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-blue-600">{courseStats.enrollments}</p>
              <p className="text-xs text-gray-500 mt-1">Active: {courseStats.activeLearners}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600">{courseStats.completionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Avg time: {courseStats.avgCompletionTime}</p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Course Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{courseStats.averageRating}/5</p>
              <div className="flex items-center mt-1">
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star} 
                    className={`h-3 w-3 ${star <= courseStats.averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Module Progress and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Weekly Module Progress */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
              Weekly Module Progress
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {moduleProgress.map((week) => (
                <div key={week.week} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-indigo-600">W{week.week}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Week {week.week}</p>
                      <p className="text-sm text-gray-500">{week.studentsActive} active students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {week.completedModules}/{week.totalModules} modules
                    </p>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(week.completedModules / week.totalModules) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All Activities
            </button>
          </div>
        </div>
      </div>

      {/* Payment Analytics */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
            Monthly Revenue & Enrollment Trends
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {paymentBreakdown.map((month, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{month.month}</p>
                <p className="text-lg font-bold text-green-600 mt-1">{formatCurrency(month.amount)}</p>
                <p className="text-sm text-gray-500">{month.students} students</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(month.amount / 250000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setCurrentView('days')}
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">Manage Course Content</h4>
              <p className="text-sm text-gray-500 mt-1">Edit days, modules, and lessons</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400 group-hover:text-indigo-500" />
          </div>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left group">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">Student Management</h4>
              <p className="text-sm text-gray-500 mt-1">View enrolled students and progress</p>
            </div>
            <Users className="h-8 w-8 text-gray-400 group-hover:text-indigo-500" />
          </div>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left group">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">Financial Reports</h4>
              <p className="text-sm text-gray-500 mt-1">Detailed revenue and payment analytics</p>
            </div>
            <PieChart className="h-8 w-8 text-gray-400 group-hover:text-indigo-500" />
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">Course Analytics Dashboard - Erus Academy</p>
        <p className="text-sm text-gray-400 mt-1">© Copyright 2025 - Erus Academy Private Limited</p>
      </div>
    </div>
  );
};

export default CourseDashboard;