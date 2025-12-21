import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaHome, FaDollarSign, FaChevronDown } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    priceRange: ''
  });
  
  const [scrollY, setScrollY] = useState(0);
  const floatingAnim = useAnimation();

  // Handle scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Floating animation for stats
    floatingAnim.start({
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [floatingAnim]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching with:', searchData);
    // Add search logic here
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
            delay: i * 0.5
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
            Find Your Dream <span className="highlight">Home</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover the perfect property that matches your lifestyle and budget with our expert agents
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
            >
              Explore Properties
            </motion.button>
            
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
              />
            </div>

            <div className="search-input-group">
              <FaHome className="input-icon" />
              <select
                value={searchData.propertyType}
                onChange={(e) => setSearchData({ ...searchData, propertyType: e.target.value })}
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
              <FaDollarSign className="input-icon" />
              <select
                value={searchData.priceRange}
                onChange={(e) => setSearchData({ ...searchData, priceRange: e.target.value })}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ boxShadow: "0 0 0 0 rgba(102, 126, 234, 0.7)" }}
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(102, 126, 234, 0.7)",
                  "0 0 0 10px rgba(102, 126, 234, 0)",
                  "0 0 0 0 rgba(102, 126, 234, 0.7)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
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