import { useState, useEffect } from "react";
import "./TopBar.css";

const TopBar = () => {
  const [selectedLocation, setSelectedLocation] = useState("Gurugram");

  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", location);
    window.dispatchEvent(new Event("locationChanged"));
  };

  return (
    <div className="top-bar">
      <div className="location-selector">
        <span className="location-label">Location:</span>
        <select
          value={selectedLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="location-dropdown"
        >
          <option value="Gurugram">Gurugram</option>
          <option value="Delhi">Delhi</option>
        </select>
      </div>
    </div>
  );
};

export default TopBar;
