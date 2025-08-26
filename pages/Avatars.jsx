import React, { useState } from "react";
import "./Avatars.css"; // optional, for styles
import avatarData from "../data/avatarData";

const Avatars = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Filter + search logic
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
    <div className="avatars-container">
      <h1>Avatar Gallery</h1>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Filter buttons */}
      <div className="filters">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("premium")}
          className={filter === "premium" ? "active" : ""}
        >
          Premium
        </button>
        <button
          onClick={() => setFilter("free")}
          className={filter === "free" ? "active" : ""}
        >
          Free
        </button>
      </div>

      {/* Count */}
      <p>
        Showing {filteredAvatars.length} of {avatarData.length} avatars
      </p>

      {/* Gallery */}
      <div className="gallery">
        {filteredAvatars.map((avatar) => (
          <div key={avatar.avatar_id} className="card">
            {avatar.premium && <span className="premium-badge">Premium</span>}
            <img
              src={avatar.preview_image_url}
              alt={avatar.avatar_name}
              className="card-image"
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/300x250?text=No+Image")
              }
            />
            <h3>{avatar.avatar_name}</h3>
            <p>{avatar.avatar_id}</p>
            <span className="gender">{avatar.gender}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Avatars;
