import React, { useState } from "react";
import avatarData from "../data/avatarData";

const Avatars = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredAvatars = avatarData.filter((avatar) => {
    if (filter === "premium" && !avatar.premium) return false;
    if (filter === "free" && avatar.premium) return false;

    if (
      search &&
      !avatar.avatar_name.toLowerCase().includes(search.toLowerCase()) &&
      !avatar.avatar_id.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-5 bg-white" >
      <h1 className="text-3xl font-bold mb-5">Avatar Gallery</h1>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
       
       
      </div>

      {/* Count */}
      <p className="mb-4 text-gray-600">
        Showing {filteredAvatars.length} of {avatarData.length} avatars
      </p>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredAvatars.map((avatar) => (
          <div
            key={avatar.avatar_id}
            className="border border-gray-300 rounded-xl p-3 relative shadow hover:shadow-lg transition-shadow"
          >
            {avatar.premium && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded">
                Premium
              </span>
            )}
            <img
              src={avatar.preview_image_url}
              alt={avatar.avatar_name}
              className="w-full h-48 object-cover rounded-lg mb-3"
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/300x250?text=No+Image")
              }
            />
            <h3 className="text-lg font-semibold">{avatar.avatar_name}</h3>
            <p className="text-gray-500">{avatar.avatar_id}</p>
            <span className="text-sm text-gray-400">{avatar.gender}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Avatars;
