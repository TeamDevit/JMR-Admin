import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import avatarData from "../data/avatarData";

const Avatars = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const filteredAvatars = avatarData.filter((avatar) => {
    if (filter === "premium" && !avatar.premium) return false;
    if (filter === "free" && avatar.premium) return false;
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

  return (
    <div className="p-5 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-center">🌟 Avatar Gallery</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filters */}
      <div className="flex gap-2 mb-6 justify-center">
        {["all", "free", "premium"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-md transition font-medium ${
              filter === type
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mb-6 text-gray-600 text-center">
        Showing{" "}
        <span className="font-semibold text-blue-600">
          {filteredAvatars.length}
        </span>{" "}
        of <span className="font-semibold">{avatarData.length}</span> avatars
      </p>

      {/* Gallery */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
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
              onClick={() => setSelectedAvatar(avatar)}
              className="border border-gray-200 rounded-xl p-3 relative shadow hover:shadow-xl transition cursor-pointer group bg-white"
            >
              {avatar.premium && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded">
                  Premium
                </span>
              )}
              <img
                src={avatar.preview_image_url}
                alt={avatar.avatar_name}
                className="w-full h-48 object-cover rounded-lg mb-3 transform group-hover:scale-105 transition duration-300"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300x250?text=No+Image")
                }
              />
              <h3 className="text-lg font-semibold">{avatar.avatar_name}</h3>
              <p className="text-gray-500">{avatar.avatar_id}</p>

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">{avatar.gender}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // stop modal
                    toggleFavorite(avatar.avatar_id);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    favorites.includes(avatar.avatar_id)
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {favorites.includes(avatar.avatar_id) ? "♥" : "♡"} Fav
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedAvatar && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedAvatar(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
              >
                ✖
              </button>
              <img
                src={selectedAvatar.preview_image_url}
                alt={selectedAvatar.avatar_name}
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold">{selectedAvatar.avatar_name}</h2>
              <p className="text-gray-500">{selectedAvatar.avatar_id}</p>
              <p className="text-sm text-gray-600 mt-2">
                Gender: {selectedAvatar.gender}
              </p>
              {selectedAvatar.premium && (
                <p className="text-yellow-600 font-semibold mt-2">
                  Premium Avatar
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Avatars;
