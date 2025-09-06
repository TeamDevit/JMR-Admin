import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const LoginPanel = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = () => {
    handleLogin(email, password);
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-indigo-600 rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">EA</span>
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Erus Academy
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            MEANS FOR SKILL UP
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember Me
              </label>
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
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

export default LoginPanel;