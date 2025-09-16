import React, { useState } from "react";
import { GraduationCap, Bot, Users, LogOut, BarChart3, Menu, X, Gift, Bell, User2, DollarSign, Upload } from "lucide-react";

const Sidebar = ({ userRole, currentView, setCurrentView, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", icon: BarChart3, view: "dashboard", roles: ["admin", "instructor"] },
    { name: "Courses", icon: GraduationCap, view: "courses", roles: ["admin", "instructor"] },
    { name: "Avatars", icon: Bot, view: "avatars", roles: ["admin", "instructor"] },
    { name: "Users", icon: Users, view: "instructors", roles: ["admin"] },
    { name: "Students", icon: User2, view: "students", roles: ["admin", "instructor"] },
    { name: "Bulk Enrollment", icon: Upload, view: "bulk-enrollment", roles: ["admin"] },
    { name: "Announcements", icon: Bell, view: "announcements", roles: ["admin", "instructor"] },
    { name: "Referrals", icon: Gift, view: "referrals", roles: ["admin"] },
    { name: "Transactions", icon: DollarSign, view: "transactions", roles: ["admin"] },
  ];

  const allowedNavigation = navigation.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Floating Toggle Button (mobile only, before sidebar opens) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md text-gray-600 hover:text-indigo-600"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-lg p-6 flex flex-col justify-between transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          {/* Top Section: Logo + Close button (mobile) */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <img
                className="h-10 w-auto rounded-lg shadow-md"
                src="src/assets/erus.jpg"
                alt="Erus Academy Logo"
              />
              <span className="text-xl font-bold text-gray-900">Erus Academy</span>
            </div>
            {/* Close button (only mobile) */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-600 hover:text-indigo-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2">
            {allowedNavigation.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setCurrentView(item.view);
                  setIsOpen(false); // auto close on mobile
                }}
                className={`flex items-center space-x-3 px-4 py-2 rounded-md w-full text-left transition-colors duration-200
                ${
                  currentView === item.view
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2 rounded-md w-full text-left transition-colors duration-200 text-gray-600 hover:bg-gray-100"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Background overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
export default Sidebar;
