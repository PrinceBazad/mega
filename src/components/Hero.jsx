import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHome,
  FaRupeeSign,
  FaChevronDown,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "./Hero.css";
import eventBus, { EVENT_TYPES } from "../utils/eventBus";

const Hero = () => {
  const [searchData, setSearchData] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
  });

  const [heroContent, setHeroContent] = useState({
    title: "Find Your Dream Property",
    subtitle: "Discover the perfect place to call home with MegaReality",
    backgroundImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
  });

  const [scrollY, setScrollY] = useState(0);
  const floatingAnim = useAnimation();
  const navigate = useNavigate();

  // Fetch hero content from API and handle scroll effect
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/home-content`);
        if (response.ok) {
          const data = await response.json();
          setHeroContent(
            data.hero || {
              title: "Find Your Dream Property",
              subtitle:
                "Discover the perfect place to call home with MegaReality",
              backgroundImage:
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
            }
          );
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      }
    };

    const handleScroll = () => setScrollY(window.scrollY);

    fetchHeroContent();
    window.addEventListener("scroll", handleScroll);

    // Floating animation for stats
    floatingAnim.start({
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });

    // Listen for home content updates
    const handleHomeContentUpdate = (event) => {
      if (event.detail.section === "hero") {
        setHeroContent((prev) => ({
          ...prev,
          ...event.detail.content,
        }));
      }
    };

    const handleHomeContentChanged = (data) => {
      if (data.section === "hero") {
        setHeroContent((prev) => ({
          ...prev,
          ...data.content,
        }));
      }
    };

    window.addEventListener("homeContentUpdated", handleHomeContentUpdate);
    eventBus.on(EVENT_TYPES.HOME_CONTENT_CHANGED, handleHomeContentChanged);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("homeContentUpdated", handleHomeContentUpdate);
      eventBus.off(EVENT_TYPES.HOME_CONTENT_CHANGED, handleHomeContentChanged);
    };
  }, [floatingAnim]);

  // Effect to handle background image changes
  useEffect(() => {
    // When the backgroundImage changes, the style will be updated in the JSX
  }, [heroContent.backgroundImage]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching with:", searchData);

    // Build query parameters
    const params = new URLSearchParams();

    if (searchData.location) {
      params.append("location", searchData.location);
    }

    if (searchData.propertyType) {
      params.append("type", searchData.propertyType);
    }

    // Parse price range
    if (searchData.priceRange) {
      if (searchData.priceRange === "50000000+") {
        // For "5 Cr+" case
        params.append("min_price", "50000000");
      } else {
        const [min, max] = searchData.priceRange.split("-");
        if (min && min !== "0") {
          params.append("min_price", min);
        }
        if (max && max !== "+") {
          params.append("max_price", max);
        }
      }
    }

    // Navigate to properties page with search parameters
    const queryString = params.toString();
    const url = queryString ? `/properties?${queryString}` : "/properties";
    window.location.href = url;
  };

  // Function to scroll to sections
  const scrollToSection = (sectionId) => {
    // Check if we're on the homepage
    if (window.location.pathname === "/") {
      // For homepage, scroll to sections
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        // If element doesn't exist yet, wait and try again
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          } else {
            // If still not found, navigate to the section
            window.location.href = `/#${sectionId}`;
          }
        }, 300);
      }
    } else {
      // If not on homepage, navigate to homepage and then scroll
      window.location.href = `/#${sectionId}`;
    }
  };

  // Animated background elements
  const FloatingElements = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="floating-element"
          style={{
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 2) * 30}%`,
            width: `${20 + i * 10}px`,
            height: `${20 + i * 10}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </>
  );

  return (
    <section id="home" className="hero">
      <FloatingElements />

      <div
        className="hero-overlay"
        style={{
          backgroundImage: `url(${
            heroContent.backgroundImage ||
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      ></div>

      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hero-title"
          >
            {heroContent.title || "Find Your Dream Property"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {heroContent.subtitle ||
              "Discover the perfect place to call home with MegaReality"}
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("properties")}
            >
              Explore Properties
            </motion.button>

            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("agents")}
            >
              Meet Our Agents
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-search"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                placeholder="Enter location"
                value={searchData.location}
                onChange={(e) =>
                  setSearchData({ ...searchData, location: e.target.value })
                }
              />
            </div>

            <div className="search-input-group">
              <FaHome className="input-icon" />
              <select
                value={searchData.propertyType}
                onChange={(e) =>
                  setSearchData({ ...searchData, propertyType: e.target.value })
                }
              >
                <option value="">Property Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="search-input-group">
              <FaRupeeSign className="input-icon" />
              <select
                value={searchData.priceRange}
                onChange={(e) =>
                  setSearchData({ ...searchData, priceRange: e.target.value })
                }
              >
                <option value="">Price Range</option>
                <option value="0-5000000">₹0 - ₹50 Lakhs</option>
                <option value="5000000-10000000">₹50 Lakhs - ₹1 Cr</option>
                <option value="10000000-20000000">₹1 Cr - ₹2 Cr</option>
                <option value="20000000-50000000">₹2 Cr - ₹5 Cr</option>
                <option value="50000000+">₹5 Cr+</option>
              </select>
            </div>

            <motion.button
              type="submit"
              className="search-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ boxShadow: "0 0 0 0 rgba(102, 126, 234, 0.7)" }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(102, 126, 234, 0.7)",
                  "0 0 0 10px rgba(102, 126, 234, 0)",
                  "0 0 0 0 rgba(102, 126, 234, 0.7)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <FaSearch /> Search
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div className="stat-item" animate={floatingAnim}>
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              1000+
            </motion.h3>
            <p>Properties</p>
          </motion.div>

          <motion.div className="stat-item" animate={floatingAnim}>
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring" }}
            >
              500+
            </motion.h3>
            <p>Happy Clients</p>
          </motion.div>

          <motion.div className="stat-item" animate={floatingAnim}>
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
            >
              50+
            </motion.h3>
            <p>Expert Agents</p>
          </motion.div>

          <motion.div className="stat-item" animate={floatingAnim}>
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: "spring" }}
            >
              15+
            </motion.h3>
            <p>Years Experience</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaChevronDown />
          </motion.div>
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
