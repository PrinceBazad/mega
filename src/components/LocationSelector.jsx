import { useState, useEffect } from "react";
import "./LocationSelector.css";

const LocationSelector = () => {
  const [selectedLocation, setSelectedLocation] = useState("gurugram");

  useEffect(() => {
    // Save selected location to localStorage
    localStorage.setItem("selectedLocation", selectedLocation);

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("locationChanged", {
        detail: { location: selectedLocation },
      })
    );
  }, [selectedLocation]);

  return (
    <div className="location-selector">
      <div className="location-container">
        <div className="location-content">
          <span className="location-label">Select Location:</span>
          <select
            className="location-dropdown"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="gurugram">Gurugram</option>
            <option value="delhi">Delhi</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
