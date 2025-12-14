import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";
import "./Properties.css";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    status: "",
  });

  const navigate = useNavigate();

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

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

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
  }, [searchFilters, properties]);

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
          <h2>All Properties</h2>
          <p>Browse our complete collection of properties</p>
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
      </div>
    </section>
  );
};

export default PropertiesPage;
