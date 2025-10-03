import React, { useState } from "react";
import toast from "react-hot-toast";
import { User, KeyRound, Eye, EyeOff, Lock, Loader2 } from "lucide-react";

// *** Placeholder for API Service ***
// In a real application, you would import an API client here.
const api = {
  updateProfile: async (data) => {
    // Simulate an API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.name === "ErrorUser") {
          reject(new Error("API Error: Name update failed."));
        } else {
          resolve({ success: true, newName: data.name });
        }
      }, 1000);
    });
  },
  changePassword: async (data) => {
    // Simulate an API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.currentPassword === "wrong") {
          reject(new Error("Invalid current password."));
        } else {
          resolve({ success: true });
        }
      }, 1000);
    });
  },
};

const AccountPage = ({ user }) => {
  // State for Profile Update
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // State for Password Update
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // -------------------------------------------------------------------
  // PROFILE UPDATE LOGIC
  // -------------------------------------------------------------------
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (isProfileLoading) return;

    if (!profileData.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setIsProfileLoading(true);
      // *** API CALL INTEGRATION ***
      const response = await api.updateProfile({
        name: profileData.name,
      });

      if (response.success) {
        toast.success("Profile updated successfully!");
        // Optional: Update the parent component's user state with response.newName
      } else {
        throw new Error("Profile update failed on server.");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsProfileLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // PASSWORD UPDATE LOGIC
  // -------------------------------------------------------------------
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (isPasswordLoading) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsPasswordLoading(true);
      // *** API CALL INTEGRATION ***
      const response = await api.changePassword({
        currentPassword,
        newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully!");
        // Clear fields on success
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        throw new Error("Password change failed on server.");
      }
    } catch (error) {
      console.error("Password Update Error:", error);
      toast.error(error.message || "Failed to change password.");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // RENDER METHOD
  // -------------------------------------------------------------------
  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Manage your profile and security settings.</p>

        {/* SIDE-BY-SIDE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Profile Information (Left Side) */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 h-fit">
            <div className="flex items-center mb-6">
              <User className="h-7 w-7 text-indigo-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  disabled={isProfileLoading}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 p-2"
                />
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isProfileLoading}
                  className="flex items-center px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                >
                  {isProfileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isProfileLoading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Update Password (Right Side) */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 h-fit">
            <div className="flex items-center mb-6">
              <KeyRound className="h-7 w-7 text-indigo-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-800">Update Password</h2>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isPasswordLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pr-10 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Lock size={18} className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isPasswordLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pr-10 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-gray-500" />
                    ) : (
                      <Eye size={20} className="text-gray-500" />
                    )}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPasswordLoading}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="flex items-center px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                >
                  {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPasswordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;