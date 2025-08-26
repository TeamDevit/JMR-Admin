import React, { useState, useCallback, useRef, useEffect } from "react";
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
  const location = useLocation(); // ✅ reactive
  const activePath = location.pathname;

  // State to manage the collapse state, initialized for mobile vs desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Check screen width on initial render
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });

  const [isHovered, setIsHovered] = useState(false);

  // Set up a resize listener to update the collapse state
  useEffect(() => {
    const handleResize = () => {
      // If the screen is large (lg), the sidebar should not be collapsed
      if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = [
    {
      name: "Module Panel",
      path: "/",
      icon: BookOpen, 
      description: "Learn new words",
    },
    {
      name: "studentpanel",
      path: "/StudentPanel",  
      icon: FileText,
      description: "Practice sentences",
    },
    {
      name: "Exercise",
      path: "/Exercise",
      icon: Dumbbell,
      description: "Interactive drills",
    },
    {
      name: "Avatars",
      path: "/Avatars",
      icon: Bot,
      description: "Get help instantly",
    },
    
  ];

  // Logic to control the sidebar's width and position
  const sidebarWidthClass = isCollapsed ? "w-20" : "w-72";
  const mobileTranslateClass = isCollapsed ? "-translate-x-full" : "translate-x-0";

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <>
      {/* Mobile backdrop overlay */}
      {!isCollapsed && (
        <div 
          onClick={toggleCollapse} 
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden"
        />
      )}
      
      {/* Mobile toggle button (visible on small screens) */}
      <button
        onClick={toggleCollapse}
        className={`
          fixed top-4 left-4 p-2 rounded-xl text-white bg-slate-800/50 shadow-lg z-50
          lg:hidden transition-all duration-300 transform
          ${!isCollapsed ? 'rotate-90' : 'rotate-0'}
        `}
        aria-label="Toggle Sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Main Sidebar Container */}
      <div
        className={`
          ${sidebarWidthClass} flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out shadow-2xl border-r border-slate-700/50 relative fixed inset-y-0 left-0 z-50
          lg:static lg:w-72
          ${mobileTranslateClass}
          ${isCollapsed && !isHovered ? 'lg:w-20' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header Section with Toggle Button */}
        <div className="p-6 border-b border-slate-700/50 relative">
          <div className="flex items-center justify-between">
            <div
              className={`transition-opacity duration-200 ${
                isCollapsed && !isHovered ? "opacity-0" : "opacity-100"
              }`}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LearnHub
              </h1>
              <p className="text-slate-400 text-sm mt-1">Your learning companion</p>
            </div>
            {/* The toggle button is now outside, but a close button can be here for mobile */}
            {!isCollapsed && (
              <button
                onClick={toggleCollapse}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white transition-all duration-300 lg:hidden"
                aria-label="Close Sidebar"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2 flex-1">
          {links.map((link, index) => {
            const Icon = link.icon;
            const isActive = activePath === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  group/link flex items-center p-3 rounded-xl transition-all duration-200 ease-in-out relative overflow-hidden w-full text-left
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02] border-l-4 border-white/50"
                      : "hover:bg-slate-700/50 hover:transform hover:scale-[1.02] hover:shadow-lg"
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-600/30 text-slate-300 group-hover/link:bg-slate-600/50 group-hover/link:text-white"
                    }
                  `}
                >
                  <Icon size={20} />
                </div>

                {/* Text content */}
                <div
                  className={`
                    ml-4 flex-1 transition-all duration-200
                    ${
                      isCollapsed && !isHovered
                        ? "opacity-0 translate-x-4"
                        : "opacity-100 translate-x-0"
                    }
                  `}
                >
                  <div className="font-medium text-sm">{link.name}</div>
                  <div
                    className={`
                      text-xs transition-colors duration-200
                      ${
                        isActive
                          ? "text-white/80"
                          : "text-slate-400 group-hover/link:text-slate-300"
                      }
                    `}
                  >
                    {link.description}
                  </div>
                </div>
                {/* Chevron icon, visible when not collapsed or on hover */}
                {!isCollapsed || isHovered ? (
                  <ChevronRight
                    size={16}
                    className={`
                      transition-all duration-200
                      ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover/link:text-white"
                      }
                    `}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`
            p-4 border-t border-slate-700/50 transition-opacity duration-200
            ${isCollapsed && !isHovered ? "opacity-0" : "opacity-100"}
          `}
        >
          <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Student</div>
              <div className="text-xs text-slate-400">Learning Progress</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Sidebar;
