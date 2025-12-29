import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "./Contact.css";
import eventBus, { EVENT_TYPES } from "../utils/eventBus";

const Contact = () => {
  const [contactContent, setContactContent] = useState({
    phone: "+91 98765 43210",
    email: "info@megareality.com",
    address: "123 Real Estate Avenue, Gurugram, Haryana 122001",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch contact content from API
  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/home-content`);
        if (response.ok) {
          const data = await response.json();
          setContactContent(data.contact);
        }
      } catch (error) {
        console.error("Error fetching contact content:", error);
      }
    };

    fetchContactContent();

    // Listen for home content updates
    const handleHomeContentUpdate = (event) => {
      if (event.detail.section === "contact") {
        setContactContent((prev) => ({
          ...prev,
          ...event.detail.content,
        }));
      }
    };

    const handleHomeContentChanged = (data) => {
      if (data.section === "contact") {
        setContactContent((prev) => ({
          ...prev,
          ...data.content,
        }));
      }
    };

    window.addEventListener("homeContentUpdated", handleHomeContentUpdate);
    eventBus.on(EVENT_TYPES.HOME_CONTENT_CHANGED, handleHomeContentChanged);

    return () => {
      window.removeEventListener("homeContentUpdated", handleHomeContentUpdate);
      eventBus.off(EVENT_TYPES.HOME_CONTENT_CHANGED, handleHomeContentChanged);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      // Prepare data for submission
      const inquiryData = {
        user_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `${formData.subject}\n\n${formData.message}`,
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
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Phone",
      info: contactContent.phone,
      link: `tel:${contactContent.phone}`,
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      info: contactContent.email,
      link: `mailto:${contactContent.email}`,
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Address",
      info: contactContent.address,
      link: null,
    },
    {
      icon: <FaClock />,
      title: "Working Hours",
      info: "Mon - Fri: 9AM - 6PM",
      link: null,
    },
  ];

  return (
    <section id="contact" className="contact-page">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Contact Us</h1>
          <p>Get in touch with our real estate experts</p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Get In Touch</h2>
            <p>
              Have questions about our properties or services? Our team is ready
              to help you find your dream home.
            </p>

            <div className="contact-details">
              {contactInfo.map((item, index) => (
                <div key={index} className="contact-item">
                  <div className="contact-icon">{item.icon}</div>
                  <div className="contact-text">
                    <h4>{item.title}</h4>
                    {item.link ? (
                      <a href={item.link}>{item.info}</a>
                    ) : (
                      <p>{item.info}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="map-container">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890123!2d-74.0059413!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNCJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            className="contact-form-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="form-wrapper">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you shortly.</p>

              {submitSuccess && (
                <div className="success-message">
                  Thank you for your inquiry! We'll contact you soon.
                </div>
              )}

              {submitError && (
                <div className="error-message">{submitError}</div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
