import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHome,
  FaDollarSign,
  FaChevronDown,
  FaHouseUser,
  FaBuilding,
  FaLandmark,
  FaChartLine
} from "react-icons/fa";
import "./Hero.css";

const Hero = () => {
  const [searchData, setSearchData] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
  });

  const [scrollY, setScrollY] = useState(0);
  const floatingAnim = useAnimation();
  const navigate = useNavigate();

  // Handle scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    // Floating animation for stats
    floatingAnim.start({
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [floatingAnim]);

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
      const [min, max] = searchData.priceRange.split("-");
      if (min && min !== "0") {
        params.append("min_price", min);
      }
      if (max && max !== "+") {
        params.append("max_price", max);
      }
    }

    // Navigate to properties page with search parameters
    const queryString = params.toString();
    const url = queryString ? `/properties?${queryString}` : "/properties";
    navigate(url);
  };

  // Enhanced animated background elements
  const FloatingElements = () => (
    <>
      {/* Main floating elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="floating-element"
          style={{
            left: `${5 + i * 12}%`,
            top: `${15 + (i % 3) * 20}%`,
            width: `${25 + i * 5}px`,
            height: `${25 + i * 5}px`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
      
      {/* Additional floating elements for more depth */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`secondary-${i}`}
          className="floating-element-secondary"
          style={{
            left: `${20 + i * 15}%`,
            top: `${60 + (i % 2) * 15}%`,
            width: `${15 + i * 3}px`,
            height: `${15 + i * 3}px`,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, -15, 0],
            rotate: [0, -180, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
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
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      ></div>

      <div className="hero-gradient-overlay"></div>

      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="hero-title"
          >
            Discover Your <span className="highlight">Perfect Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            Find your dream property with our premium real estate platform. 
            Browse thousands of listings with advanced search and personalized recommendations.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            <Link to="/properties">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <FaHouseUser className="btn-icon" />
                Browse Properties
              </motion.button>
            </Link>

            <Link to="/agents">
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <FaBuilding className="btn-icon" />
                Meet Agents
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-search"
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
        >
          <div className="search-header">
            <h3>Find Your Dream Property</h3>
            <p>Search from thousands of available listings</p>
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                placeholder="Enter location (e.g. Delhi, Gurugram)"
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
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="search-input-group">
              <FaDollarSign className="input-icon" />
              <select
                value={searchData.priceRange}
                onChange={(e) =>
                  setSearchData({ ...searchData, priceRange: e.target.value })
                }
              >
                <option value="">Price Range</option>
                <option value="0-100000">$0 - $100,000</option>
                <option value="100000-300000">$100,000 - $300,000</option>
                <option value="300000-500000">$300,000 - $500,000</option>
                <option value="500000-1000000">$500,000 - $1M</option>
                <option value="1000000+">$1M+</option>
              </select>
            </div>

            <motion.button
              type="submit"
              className="search-btn"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <FaSearch className="btn-icon" />
              Find Properties
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          className="hero-features"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <div className="feature-card">
            <FaHouseUser className="feature-icon" />
            <h4>10,000+</h4>
            <p>Properties</p>
          </div>
          <div className="feature-card">
            <FaBuilding className="feature-icon" />
            <h4>500+</h4>
            <p>Agents</p>
          </div>
          <div className="feature-card">
            <FaLandmark className="feature-icon" />
            <h4>100+</h4>
            <p>Developers</p>
          </div>
          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h4>98%</h4>
            <p>Satisfaction</p>
          </div>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaChevronDown />
          </motion.div>
          <span>Explore more</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;