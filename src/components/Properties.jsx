import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "./Properties.css";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationChanging, setLocationChanging] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("gurugram");

  const navigate = useNavigate();

  // Apply location filter function
  const applyLocationFilter = (location) => {
    if (!location || !properties.length) return; // Handle undefined/null location and empty properties

    // First filter by favorites only
    let filtered = properties.filter((prop) => prop.is_favorite === true);

    // Apply location filter based on selected location
    if (location === "gurugram") {
      filtered = filtered.filter(
        (prop) =>
          prop.location.toLowerCase().includes("gurugram") ||
          prop.location.toLowerCase().includes("gurgaon")
      );
    } else if (location === "delhi") {
      filtered = filtered.filter(
        (prop) =>
          prop.location.toLowerCase().includes("delhi") ||
          prop.location.toLowerCase().includes("new delhi")
      );
    }

    setFilteredProperties(filtered);
  };

  // Listen for location changes
  useEffect(() => {
    const handleLocationChange = (e) => {
      setLocationChanging(true);
      const newLocation = e.detail.location;
      setSelectedLocation(newLocation);

      // Apply location filter immediately
      applyLocationFilter(newLocation);

      // Simulate loading delay for better UX
      setTimeout(() => {
        setLocationChanging(false);
      }, 500);
    };

    window.addEventListener("locationChanged", handleLocationChange);

    // Check initial location from localStorage
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      const normalizedLocation = savedLocation.toLowerCase();
      setSelectedLocation(normalizedLocation);
      applyLocationFilter(normalizedLocation);
    }

    return () => {
      window.removeEventListener("locationChanged", handleLocationChange);
    };
  }, [applyLocationFilter]); // Added applyLocationFilter to dependency array

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties`);
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
        setLoading(false);

        // Apply location filter after initial load if needed
        const savedLocation = localStorage.getItem("selectedLocation");
        if (savedLocation) {
          const normalizedLocation = savedLocation.toLowerCase();
          setSelectedLocation(normalizedLocation);
          applyLocationFilter(normalizedLocation);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Re-apply location filter whenever properties change
  useEffect(() => {
    if (properties.length > 0) {
      applyLocationFilter(selectedLocation);
    }
  }, [properties, selectedLocation, applyLocationFilter]);

  const handleViewAllProperties = () => {
    // Navigate to the dedicated properties page
    window.location.href = "/properties";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Show 3 properties at a time
  const propertiesToShow = filteredProperties.slice(0, 6);
  const propertyGroups = [];
  for (let i = 0; i < propertiesToShow.length; i += 3) {
    propertyGroups.push(propertiesToShow.slice(i, i + 3));
  }

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const nextGroup = () => {
    setCurrentGroupIndex((prevIndex) =>
      prevIndex < propertyGroups.length - 1 ? prevIndex + 1 : 0
    );
  };

  const prevGroup = () => {
    setCurrentGroupIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : propertyGroups.length - 1
    );
  };

  const visibleProperties = propertyGroups[currentGroupIndex] || [];

  if (loading) {
    return (
      <section id="properties" className="properties">
        <div className="properties-container">
          <div className="section-header">
            <h2>Featured Properties</h2>
            <p>Loading properties...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="properties" className="properties">
      <div className="properties-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            Featured Properties in{" "}
            {selectedLocation &&
              selectedLocation.charAt(0).toUpperCase() +
                selectedLocation.slice(1)}
          </h2>
          <p>Explore our handpicked selection of premium properties</p>
        </motion.div>

        {/* Loading indicator when location is changing */}
        {locationChanging && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading properties for {selectedLocation || "location"}...</p>
            </div>
          </div>
        )}

        <div className="properties-scroller">
          <button className="carousel-btn prev-btn" onClick={prevGroup}>
            <FaArrowLeft />
          </button>

          <motion.div
            className="properties-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {visibleProperties.length > 0 ? (
              visibleProperties.map((property) => (
                <motion.div
                  key={property.id}
                  className="property-card"
                  variants={cardVariants}
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => {
                    window.location.href = `/property/${property.id}`;
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="property-image">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}

                    {/* Property info overlay */}
                    <div className="property-overlay">
                      <h3>{property.title}</h3>
                      <p className="property-price">
                        ₹{property.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="property-location">
                    <FaMapMarkerAlt />
                    <span>{property.location}</span>
                  </div>

                  {property.builder_name && (
                    <p className="property-builder">
                      Builder: {property.builder_name}
                    </p>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="no-properties">
                <p>No properties found matching your criteria.</p>
              </div>
            )}
          </motion.div>

          <button className="carousel-btn next-btn" onClick={nextGroup}>
            <FaArrowRight />
          </button>
        </div>

        <div className="scroller-indicators">
          {propertyGroups.map((_, index) => (
            <button
              key={index}
              className={`indicator ${
                index === currentGroupIndex ? "active" : ""
              }`}
              onClick={() => setCurrentGroupIndex(index)}
            />
          ))}
        </div>

        <motion.div
          className="view-all-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="btn-view-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewAllProperties}
          >
            View All Properties
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Properties;
