import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Experts.css";
import API_BASE_URL from "../config";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/agents`);
      const data = await response.json();
      setExperts(data);
    } catch (error) {
      console.error("Error fetching experts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperts = experts.filter((expert) =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleExperts = filteredExperts.slice(currentIndex, currentIndex + 3);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= filteredExperts.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 3 < 0 ? Math.floor((filteredExperts.length - 1) / 3) * 3 : prevIndex - 3
    );
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <section id="experts" className="experts">
        <div className="experts-container">
          <div className="section-header">
            <h2>Meet Our Experts</h2>
            <p>Loading experts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experts" className="experts">
      <div className="experts-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Meet Our <span className="highlight">Experts</span></h2>
          <p>Connect with our real estate professionals who are here to guide you</p>
        </motion.div>

        <div className="experts-search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search experts by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredExperts.length === 0 ? (
          <div className="no-experts">
            <p>No experts found matching your search criteria.</p>
          </div>
        ) : (
          <div className="experts-carousel">
            <button className="carousel-btn prev" onClick={prevSlide}>
              &lt;
            </button>
            
            <motion.div
              className="experts-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {visibleExperts.map((expert) => (
                <motion.div
                  key={expert.id}
                  className="expert-card"
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="expert-image">
                    <img src={expert.image} alt={expert.name} loading="lazy" />
                  </div>
                  <div className="expert-info">
                    <h3>{expert.name}</h3>
                    <p className="expert-position">{expert.position}</p>
                    <p className="expert-bio">{expert.bio}</p>
                    <div className="expert-stats">
                      <div className="stat">
                        <span className="value">{expert.experience}</span>
                        <span className="label">Experience</span>
                      </div>
                      <div className="stat">
                        <span className="value">{expert.properties_sold}</span>
                        <span className="label">Properties Sold</span>
                      </div>
                    </div>
                    <div className="expert-contact">
                      <p><strong>Email:</strong> {expert.email}</p>
                      <p><strong>Phone:</strong> {expert.phone}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <button className="carousel-btn next" onClick={nextSlide}>
              &gt;
            </button>
          </div>
        )}

        {/* Experts stats */}
        <motion.div
          className="experts-stats"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="stat-item">
            <h3>{experts.length}</h3>
            <p>Expert Agents</p>
          </div>
          <div className="stat-item">
            <h3>{experts.reduce((sum, expert) => sum + expert.properties_sold, 0)}</h3>
            <p>Properties Sold</p>
          </div>
          <div className="stat-item">
            <h3>{experts.length > 0 ? Math.max(...experts.map(e => parseInt(e.experience) || 0))}+</h3>
            <p>Years Experience</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experts;