import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
  FaSearch,
} from "react-icons/fa";
import "./Properties.css";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationChanging, setLocationChanging] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    status: "",
  });
  const [selectedLocation, setSelectedLocation] = useState("gurugram");

  const navigate = useNavigate();

  // Listen for location changes
  useEffect(() => {
    const handleLocationChange = (e) => {
      setLocationChanging(true);
      setSelectedLocation(e.detail.location);

      // Simulate loading delay for better UX
      setTimeout(() => {
        setLocationChanging(false);
      }, 500);
    };

    window.addEventListener("locationChanged", handleLocationChange);

    // Check initial location from localStorage
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }

    return () => {
      window.removeEventListener("locationChanged", handleLocationChange);
    };
  }, []);

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/properties");
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters including location filter
  useEffect(() => {
    let filtered = [...properties];

    // Apply location filter based on selected location
    if (selectedLocation === "gurugram") {
      filtered = filtered.filter(
        (prop) =>
          prop.location.toLowerCase().includes("gurugram") ||
          prop.location.toLowerCase().includes("gurgaon")
      );
    } else if (selectedLocation === "delhi") {
      filtered = filtered.filter(
        (prop) =>
          prop.location.toLowerCase().includes("delhi") ||
          prop.location.toLowerCase().includes("new delhi")
      );
    }

    // Apply other filters
    if (searchFilters.location) {
      filtered = filtered.filter((prop) =>
        prop.location
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase())
      );
    }

    if (searchFilters.propertyType) {
      filtered = filtered.filter(
        (prop) => prop.property_type === searchFilters.propertyType
      );
    }

    if (searchFilters.minPrice) {
      filtered = filtered.filter(
        (prop) => prop.price >= parseFloat(searchFilters.minPrice)
      );
    }

    if (searchFilters.maxPrice) {
      filtered = filtered.filter(
        (prop) => prop.price <= parseFloat(searchFilters.maxPrice)
      );
    }

    if (searchFilters.status) {
      filtered = filtered.filter(
        (prop) => prop.status === searchFilters.status
      );
    }

    setFilteredProperties(filtered);
  }, [searchFilters, properties, selectedLocation]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      location: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      status: "",
    });
  };

  const handleViewAllProperties = () => {
    // Navigate to the dedicated properties page
    navigate("/properties");
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
            {selectedLocation.charAt(0).toUpperCase() +
              selectedLocation.slice(1)}
          </h2>
          <p>Explore our handpicked selection of premium properties</p>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="search-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="City, State or Zip"
                value={searchFilters.location}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                name="propertyType"
                value={searchFilters.propertyType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="House">House</option>
                <option value="Flat">Flat</option>
                <option value="Plot">Plot</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={searchFilters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="minPrice">Min Price ($)</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="Min Price"
                value={searchFilters.minPrice}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="maxPrice">Max Price ($)</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Max Price"
                value={searchFilters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-actions">
              <button className="btn-clear" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading indicator when location is changing */}
        {locationChanging && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading properties for {selectedLocation}...</p>
            </div>
          </div>
        )}

        <motion.div
          className="properties-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                className="property-card"
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                onClick={() => navigate(`/property/${property.id}`)}
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
                    <div className="placeholder-image">No Image</div>
                  )}
                  {property.featured && (
                    <span className="badge-featured">Featured</span>
                  )}
                  <motion.button
                    className="btn-favorite"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaHeart />
                  </motion.button>
                </div>

                <div className="property-info">
                  <div className="property-header">
                    <h3>{property.title}</h3>
                    <p className="property-price">
                      ${property.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="property-location">
                    <FaMapMarkerAlt />
                    <span>{property.location}</span>
                  </div>

                  <div className="property-features">
                    <div className="feature">
                      <FaBed />
                      <span>{property.bedrooms || 0} Beds</span>
                    </div>
                    <div className="feature">
                      <FaBath />
                      <span>{property.bathrooms || 0} Baths</span>
                    </div>
                    <div className="feature">
                      <FaRulerCombined />
                      <span>{property.area_sqft || 0} sqft</span>
                    </div>
                  </div>

                  <motion.button
                    className="btn-view-details"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/property/${property.id}`);
                    }}
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-properties">
              <p>No properties found matching your criteria.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </motion.div>

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
