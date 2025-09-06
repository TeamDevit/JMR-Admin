import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import avatarData from "../data/avatarData";
import { Search, Copy, Check, LogOut } from 'lucide-react';

const Avatars = ({ handleLogout }) => {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredAvatars = avatarData.filter((avatar) => {
    if (
      search &&
      !avatar.avatar_name.toLowerCase().includes(search.toLowerCase()) &&
      !avatar.avatar_id.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const copyToClipboard = async (text, avatarId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(avatarId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedId(avatarId);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with Logout */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="h-10 w-10 bg-indigo-600 rounded-lg shadow-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">EA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Erus Academy</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2 rounded-md w-full text-left transition-colors duration-200 text-gray-600 hover:bg-gray-100"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-2">
            Avatar Gallery
          </h1>
          <p className="text-lg text-center text-gray-600 mb-10">
            Browse our collection of digital avatars. Click to copy ID.
          </p>

          {/* Search */}
          <div className="relative w-full max-w-lg mx-auto mb-10">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-lg rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
            />
          </div>

          {/* Count */}
          <p className="mb-8 text-gray-500 text-center text-sm">
            <span className="font-semibold text-blue-600">{filteredAvatars.length}</span> results found
          </p>

          {/* Gallery */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredAvatars.map((avatar) => (
                <motion.div
                  key={avatar.avatar_id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => copyToClipboard(avatar.avatar_id, avatar.avatar_id)}
                  className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col"
                >
                  {avatar.premium && (
                    <span className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 text-xs font-bold rounded-full">
                      Premium
                    </span>
                  )}
                  
                  {/* Copy indicator */}
                  {copiedId === avatar.avatar_id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      <Check size={12} />
                      Copied!
                    </motion.div>
                  )}

                  <img
                    src={avatar.preview_image_url}
                    alt={avatar.avatar_name}
                    className="w-full h-56 object-cover rounded-xl mb-4 transform group-hover:scale-105 transition duration-300"
                    onError={(e) =>
                      (e.target.src =
                        "https://placehold.co/300x250/E5E7EB/4B5563?text=Image+Missing")
                    }
                  />
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{avatar.avatar_name}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Copy size={12} />
                      {avatar.avatar_id}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-400">
                      Gender: {avatar.gender}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(avatar.avatar_id);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                        favorites.includes(avatar.avatar_id)
                          ? "bg-red-500 text-white shadow"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {favorites.includes(avatar.avatar_id) ? "♥ Liked" : "♡ Like"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredAvatars.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No avatars found matching your search.</p>
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedAvatar && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAvatar(null)}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-lg w-full relative shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedAvatar(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl leading-none"
                >
                  &times;
                </button>
                <img
                  src={selectedAvatar.preview_image_url}
                  alt={selectedAvatar.avatar_name}
                  className="w-full h-80 object-cover rounded-2xl mb-6"
                />
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {selectedAvatar.avatar_name}
                  </h2>
                  <p className="text-gray-500 text-base">
                    {selectedAvatar.avatar_id}
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    Gender: <span className="font-semibold">{selectedAvatar.gender}</span>
                  </p>
                  {selectedAvatar.premium && (
                    <p className="text-yellow-600 font-bold mt-2">
                      Premium Avatar
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Avatars;