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

  // state for mobile toggle
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // detect screen width
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

  const links = [
    { name: "Module Panel", path: "/", icon: BookOpen, description: "Learn new words" },
    { name: "Student Panel", path: "/studentpanel", icon: FileText, description: "Practice sentences" },
    { name: "Exercise", path: "/exercise", icon: Dumbbell, description: "Interactive drills" },
    { name: "Avatars", path: "/avatars", icon: Bot, description: "Get help instantly" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      {!isDesktop && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 rounded-xl text-white bg-slate-800/70 shadow-lg z-50"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {!isDesktop && isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-slate-950/70 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full
          ${isDesktop ? "w-72" : "w-72"} 
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700/50 z-50
          transition-transform duration-300 ease-in-out
          ${isDesktop ? "translate-x-0" : isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LearnHub
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your learning companion</p>
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
                  flex items-center p-3 rounded-xl transition relative
                  ${isActive ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "hover:bg-slate-700/50"}
                `}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${isActive ? "bg-white/20" : "bg-slate-600/30 text-slate-300"}`}>
                  <Icon size={20} />
                </div>
                <div className="ml-4 flex-1">
                  <div className="font-medium text-sm">{link.name}</div>
                  <div className="text-xs text-slate-400">{link.description}</div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-sm">
              U
            </div>
            <div>
              <div className="text-sm font-medium">Student</div>
              <div className="text-xs text-slate-400">Learning Progress</div>
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
