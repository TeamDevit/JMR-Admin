import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Dumbbell,
  Bot,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const activePath = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

  const links = [
    { name: "Module Panel", path: "/", icon: BookOpen, description: "Manage modules" },
    { name: "Student Panel", path: "/studentpanel", icon: FileText, description: "Track students" },
    { name: "Avatars", path: "/avatars", icon: Bot, description: "Configure avatars" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      {!isDesktop && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 rounded-md text-gray-700 bg-white shadow-md border border-gray-200 z-50"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {!isDesktop && isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full
          w-72 bg-white text-gray-900 shadow-lg border-r border-gray-200 z-50
          transition-transform duration-300 ease-in-out
          ${isDesktop ? "translate-x-0" : isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-stone-90000">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1">Navigation</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = activePath.toLowerCase() === link.path.toLowerCase();

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center p-3 rounded-lg border transition relative
                  ${isActive 
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                    : "bg-white border-gray-200 hover:bg-gray-50"}
                `}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-md 
                  ${isActive ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`}>
                  <Icon size={20} />
                </div>
                <div className="ml-4 flex-1">
                  <div className="font-medium text-sm">{link.name}</div>
                  <div className="text-xs text-gray-500">{link.description}</div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
              U
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">User_1X32</div>
              <div className="text-xs text-gray-500">Logout</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add margin for content when desktop */}
      <div className={isDesktop ? "ml-72" : ""}></div>
    </>
  );
}

export default Sidebar;
