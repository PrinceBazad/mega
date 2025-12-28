import React, { useState, useEffect } from "react";
import Typewriter from "./Typewriter";
import "./TopBar.css";

const TopBar = () => {
  const [selectedLocation, setSelectedLocation] = useState("Gurugram");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const locations = ["Gurugram", "Delhi"];

  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", location);

    // Dispatch a custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("locationChanged", { detail: location })
    );

    setIsDropdownOpen(false);
  };

  return (
    <div className="top-bar">
      <div className="typewriter-container">
        <Typewriter />
      </div>
      <div className="location-selector">
        <button
          className="location-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="location-icon">📍</span>
          <span className="location-text">{selectedLocation}</span>
          <span className="dropdown-arrow">▼</span>
        </button>
        {isDropdownOpen && (
          <div className="location-dropdown">
            {locations.map((location) => (
              <div
                key={location}
                className="location-option"
                onClick={() => handleLocationChange(location)}
              >
                {location}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
