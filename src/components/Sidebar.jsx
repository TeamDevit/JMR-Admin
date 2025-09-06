import React from "react";
import { GraduationCap, Bot, Users, LogOut, BarChart3 } from 'lucide-react';

const Sidebar = ({ userRole, currentView, setCurrentView, handleLogout }) => {
const navigation = [
  { name: 'Dashboard', icon: BarChart3, view: 'dashboard', roles: ['admin', 'instructor'] }, // Add this
  { name: 'Courses', icon: GraduationCap, view: 'courses', roles: ['admin', 'instructor'] },
  { name: 'Avatars', icon: Bot, view: 'avatars', roles: ['admin', 'instructor'] },
  { name: 'Users', icon: Users, view: 'instructors', roles: ['admin'] },
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

export default Sidebar;