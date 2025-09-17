import React, { useState } from "react";
import {
  GraduationCap,
  Bot,
  Users,
  LogOut,
  BarChart3,
  Menu,
  X,
  Gift,
  Bell,
  User2,
  DollarSign,
  Upload,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ userRole, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", icon: BarChart3, path: "/", roles: ["admin", "instructor"] },
    { name: "Courses", icon: GraduationCap, path: "courses", roles: ["admin", "instructor"] },
    { name: "Users", icon: Users, path: "instructors", roles: ["admin"] },
    { name: "Students", icon: User2, path: "students", roles: ["admin", "instructor"] },
    { name: "Bulk Enrollment", icon: Upload, path: "bulk-enrollment", roles: ["admin"] },
    { name: "Announcements", icon: Bell, path: "announcements", roles: ["admin", "instructor"] },
    { name: "Referrals", icon: Gift, path: "referrals", roles: ["admin"] },
    { name: "Transactions", icon: DollarSign, path: "transactions", roles: ["admin"] },
    { name: "Avatars", icon: Bot, path: "avatars", roles: ["admin", "instructor"] },
    { name: "Account", icon: Settings, path: "account", roles: ["admin", "instructor"] }, // 👈 New
  ];

  const allowedNavigation = navigation.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-6 flex flex-col justify-between transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo & Close Button */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <img
                className="h-10 w-auto rounded-lg shadow-md"
                src="src/assets/erus.jpg"
                alt="Erus Academy Logo"
              />
              <span className="text-xl font-bold text-gray-900">Erus Academy</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-600 hover:text-indigo-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {allowedNavigation.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-2 rounded-md w-full text-left transition-colors duration-200
                ${
                  window.location.pathname === `/${item.path}`
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

      {/* Hamburger button for mobile */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md text-gray-600 hover:text-indigo-600"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 md:hidden bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
