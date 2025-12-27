import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaHome,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaShareAlt,
  FaHeart,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "./PropertyDetail.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [liked, setLiked] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);

        // Fetch similar properties
        fetchSimilarProperties(data.property_type, data.location);
      } else {
        setError("Property not found");
      }
    } catch (err) {
      setError("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProperties = async (type, location) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/properties?type=${type}&location=${encodeURIComponent(
          location
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        // Filter out the current property and limit to 3
        const filtered = data.filter((p) => p.id !== parseInt(id)).slice(0, 3);
        setSimilarProperties(filtered);
      }
    } catch (err) {
      console.error("Failed to load similar properties");
    }
  };

  const nextImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleContactFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      // Prepare data for submission
      const inquiryData = {
        user_name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        property_id: parseInt(id),
        message: contactForm.message,
      };

      // Submit to backend API
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setContactForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(
          data.message || "Failed to submit inquiry. Please try again."
        );
      }
    } catch (error) {
      setSubmitError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="property-detail-page">
        <div className="container">
          <div className="loading">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail-page">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="property-detail-page">
      <div className="container">
        {/* Back Button */}
        <motion.button
          className="back-button"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaChevronLeft /> Back
        </motion.button>

        <div className="property-content">
          {/* Property Images Gallery */}
          <motion.div
            className="property-gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="main-image">
              {property.images && property.images.length > 0 ? (
                <>
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                  />
                  {property.images.length > 1 && (
                    <>
                      <button className="nav-button prev" onClick={prevImage}>
                        <FaChevronLeft />
                      </button>
                      <button className="nav-button next" onClick={nextImage}>
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                  <div className="image-counter">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              ) : (
                <div className="no-image-placeholder">No images available</div>
              )}
            </div>

            {property.images && property.images.length > 1 && (
              <div className="thumbnail-gallery">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className={index === currentImageIndex ? "active" : ""}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Property Info and Contact */}
          <div className="property-info-section">
            <motion.div
              className="property-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="header-top">
                <h1>{property.title}</h1>
                <div className="property-actions">
                  <button
                    className={`like-button ${liked ? "liked" : ""}`}
                    onClick={() => setLiked(!liked)}
                  >
                    <FaHeart />
                  </button>
                  <button className="share-button">
                    <FaShareAlt />
                  </button>
                </div>
              </div>
              <div className="property-location">
                <FaMapMarkerAlt />
                <span>{property.location}</span>
              </div>
              <div className="property-price">
                ₹{property.price?.toLocaleString()}
              </div>
            </motion.div>

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
              {submitSuccess && (
                <div className="success-message">
                  Inquiry submitted successfully! We'll contact you soon.
                </div>
              )}
              {submitError && (
                <div className="error-message">{submitError}</div>
              )}
              <form className="contact-form" onSubmit={handleContactFormSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={contactForm.phone}
                    onChange={handleContactFormChange}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="I'm interested in this property. Please provide more details."
                    rows="4"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>

              <div className="social-share">
                <p>Or contact us directly:</p>
                <div className="social-links">
                  <a href="#" className="social-link whatsapp">
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <a href="#" className="social-link facebook">
                    <FaFacebook /> Facebook
                  </a>
                  <a href="#" className="social-link twitter">
                    <FaTwitter /> Twitter
                  </a>
                </div>
              </div>
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
                        ₹{similarProperty.price.toLocaleString()}
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
