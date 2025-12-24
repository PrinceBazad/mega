import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import "./TopBar.css";

const TopBar = () => {
  const [selectedLocation, setSelectedLocation] = useState("Gurugram");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setDarkMode(isDark);
      applyTheme(isDark);
    } else {
      const isDark = systemPrefersDark;
      setDarkMode(isDark);
      applyTheme(isDark);
    }

    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    applyTheme(newDarkMode);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", location);
    // Dispatch event with location data
    const event = new CustomEvent("locationChanged", {
      detail: { location: location.toLowerCase() },
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="top-bar">
      <div className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
        <span className="theme-label">{darkMode ? 'Dark' : 'Light'}</span>
      </div>
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