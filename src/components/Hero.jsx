import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaHome, FaDollarSign } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    priceRange: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching with:', searchData);
    // Add search logic here
  };

  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
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
          >
            Find Your Dream Home
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover the perfect property that matches your lifestyle and budget
          </motion.p>
        </motion.div>

        <motion.div
          className="hero-search"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
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
          <div className="stat-item">
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              1000+
            </motion.h3>
            <p>Properties</p>
          </div>
          <div className="stat-item">
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring" }}
            >
              500+
            </motion.h3>
            <p>Happy Clients</p>
          </div>
          <div className="stat-item">
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
            >
              50+
            </motion.h3>
            <p>Expert Agents</p>
          </div>
          <div className="stat-item">
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: "spring" }}
            >
              15+
            </motion.h3>
            <p>Years Experience</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

