import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "./Properties.css";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationChanging, setLocationChanging] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("gurugram");
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    status: "",
  });
  const [searchParams] = useSearchParams();
  const builderId = searchParams.get("builder");

  const navigate = useNavigate();

  // Apply location filter function
  const applyLocationFilter = (location) => {
    if (!location || !properties.length) return; // Handle undefined/null location and empty properties

    let filtered = [...properties];

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

    // If filtering by builder, apply that filter
    if (builderId) {
      filtered = filtered.filter(
        (prop) => prop.builder_id && prop.builder_id.toString() === builderId
      );
    }

    // Apply other existing filters
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
  };

  // Listen for location changes
  useEffect(() => {
    const handleLocationChange = (e) => {
      setLocationChanging(true);
      const newLocation = e.detail.location;
      setSelectedLocation(newLocation);
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

  // Initialize search filters with URL parameters
  useEffect(() => {
    const location = searchParams.get("location") || "";
    const propertyType = searchParams.get("type") || "";
    const minPrice = searchParams.get("min_price") || "";
    const maxPrice = searchParams.get("max_price") || "";
    const status = searchParams.get("status") || "";

    setSearchFilters({
      location,
      propertyType,
      minPrice,
      maxPrice,
      status,
    });
  }, [searchParams]);

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
      <section className="properties">
        <div className="properties-container">
          <div className="section-header">
            <h2>All Properties</h2>
            <p>Loading properties...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="properties">
      <div className="properties-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            {builderId ? "Builder Projects" : "All Properties"} in{" "}
            {selectedLocation &&
              selectedLocation.charAt(0).toUpperCase() +
                selectedLocation.slice(1)}
          </h2>
          <p>
            {builderId
              ? "Browse properties from this top builder"
              : "Browse our complete collection of properties"}
          </p>
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
              <p>Loading properties for {selectedLocation || "location"}...</p>
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
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                    <div className="no-image">No Image</div>
                  )}

                  {/* Property info overlay */}
                  <div className="property-overlay">
                    <h3>{property.title}</h3>
                    <p className="property-price">
                      ${property.price.toLocaleString()}
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
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PropertiesPage;
