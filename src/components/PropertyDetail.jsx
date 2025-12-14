import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
  FaShare,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";
import "./PropertyDetail.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Fetch main property
        const response = await fetch(
          `http://localhost:5000/api/properties/${id}`
        );
        const data = await response.json();

        if (response.ok) {
          setProperty(data);

          // Fetch similar properties (same location)
          const similarResponse = await fetch(
            `http://localhost:5000/api/properties?location=${encodeURIComponent(
              data.location
            )}`
          );
          const similarData = await similarResponse.json();

          // Filter out the current property and limit to 3
          const filteredSimilar = similarData
            .filter((prop) => prop.id !== parseInt(id))
            .slice(0, 3);

          setSimilarProperties(filteredSimilar);
        } else {
          setError(data.message || "Property not found");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleImageClick = (index) => {
    setActiveImageIndex(index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="property-detail">
        <div className="container">
          <div className="loading-state">
            <p>Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
            <button className="back-link" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back to Previous Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail">
        <div className="container">
          <div className="not-found">
            <h2>Property Not Found</h2>
            <button className="back-link" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back to Previous Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail">
      <div className="container">
        <motion.div
          className="property-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-top">
            <div>
              <h1>{property.title}</h1>
              <div className="property-location">
                <FaMapMarkerAlt />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="header-actions">
              <button className="action-btn">
                <FaHeart /> Save
              </button>
              <button className="action-btn" onClick={handleShare}>
                <FaShare /> Share
              </button>
            </div>
          </div>

          <div className="property-price">
            <h2>${property.price.toLocaleString()}</h2>
            <span className={`status-badge ${property.status.toLowerCase()}`}>
              {property.status}
            </span>
          </div>
        </motion.div>

        {/* Property Images Gallery */}
        <div className="property-gallery">
          <motion.div
            className="main-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[activeImageIndex]}
                alt={property.title}
                loading="lazy"
              />
            ) : (
              <div className="placeholder-image">No Image Available</div>
            )}
          </motion.div>

          {property.images && property.images.length > 1 && (
            <div className="thumbnail-gallery">
              {property.images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`thumbnail ${
                    index === activeImageIndex ? "active" : ""
                  }`}
                  onClick={() => handleImageClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="property-content">
          <div className="property-info">
            <motion.div
              className="property-features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>Property Details</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <FaBed />
                  <div>
                    <strong>{property.bedrooms || 0}</strong>
                    <span>Beds</span>
                  </div>
                </div>

                <div className="feature-item">
                  <FaBath />
                  <div>
                    <strong>{property.bathrooms || 0}</strong>
                    <span>Baths</span>
                  </div>
                </div>

                <div className="feature-item">
                  <FaRulerCombined />
                  <div>
                    <strong>{property.area_sqft || 0}</strong>
                    <span>Square Feet</span>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <FaHome />
                  </div>
                  <div>
                    <strong>{property.property_type}</strong>
                    <span>Type</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="property-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3>Description</h3>
              <p>
                {property.description ||
                  "No description available for this property."}
              </p>
            </motion.div>
          </div>

          <div className="property-sidebar">
            <motion.div
              className="contact-agent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3>Contact Agent</h3>
              <form className="contact-form">
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Your Phone" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="4"></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <motion.div
            className="similar-properties"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3>Similar Properties</h3>
            <div className="properties-grid">
              {similarProperties.map((similarProperty) => (
                <motion.div
                  key={similarProperty.id}
                  className="property-card"
                  whileHover={{ y: -10 }}
                  onClick={() => navigate(`/property/${similarProperty.id}`)}
                >
                  <div className="property-image">
                    {similarProperty.images &&
                    similarProperty.images.length > 0 ? (
                      <img
                        src={similarProperty.images[0]}
                        alt={similarProperty.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                    {similarProperty.featured && (
                      <span className="badge-featured">Featured</span>
                    )}
                  </div>

                  <div className="property-info">
                    <div className="property-header">
                      <h4>{similarProperty.title}</h4>
                      <p className="property-price">
                        ${similarProperty.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="property-location">
                      <FaMapMarkerAlt />
                      <span>{similarProperty.location}</span>
                    </div>

                    <div className="property-features">
                      <div className="feature">
                        <FaBed />
                        <span>{similarProperty.bedrooms || 0} Beds</span>
                      </div>
                      <div className="feature">
                        <FaBath />
                        <span>{similarProperty.bathrooms || 0} Baths</span>
                      </div>
                      <div className="feature">
                        <FaRulerCombined />
                        <span>{similarProperty.area_sqft || 0} sqft</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
