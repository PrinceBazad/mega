import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaBuilding } from "react-icons/fa";
import API_BASE_URL from "../config";
import "./TopBuilders.css";

const TopBuilders = () => {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/builders`);
        const data = await response.json();
        setBuilders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching builders:", error);
        setLoading(false);
      }
    };

    fetchBuilders();
  }, []);

  const nextBuilder = () => {
    setCurrentIndex((prevIndex) => {
      // Move by 3 items at a time for smoother navigation
      const newIndex = prevIndex + 3;
      return newIndex >= builders.length ? 0 : newIndex;
    });
  };

  const prevBuilder = () => {
    setCurrentIndex((prevIndex) => {
      // Move by 3 items at a time for smoother navigation
      const newIndex = prevIndex - 3;
      return newIndex < 0 ? Math.max(0, builders.length - 3) : newIndex;
    });
  };

  const handleViewProjects = (builderId) => {
    // Navigate to the properties page filtered by this builder
    navigate(`/properties?builder=${builderId}`);
  };

  if (loading) {
    return (
      <section className="top-builders">
        <div className="top-builders-container">
          <div className="section-header">
            <h2>Top Builders</h2>
            <p>Loading top builders...</p>
          </div>
        </div>
      </section>
    );
  }

  if (builders.length === 0) {
    return null;
  }

  // Show 3 builders at a time
  const visibleBuilders = builders.slice(currentIndex, currentIndex + 3);

  return (
    <section id="topbuilders" className="top-builders">
      <div className="top-builders-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Top Builders</h2>
          <p>Discover properties from leading real estate developers</p>
        </motion.div>

        <div className="builders-carousel">
          <button
            className="carousel-btn prev-btn"
            onClick={prevBuilder}
            aria-label="Previous builders"
            disabled={builders.length <= 3}
          >
            <FaArrowLeft />
          </button>

          <div className="builders-grid">
            {visibleBuilders.map((builder, index) => (
              <motion.div
                key={builder.id}
                className="builder-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="builder-image">
                  <img src={builder.image} alt={builder.name} />
                </div>
                <div className="builder-info">
                  <h3>{builder.name}</h3>
                  <p className="builder-description">{builder.description}</p>
                  <div className="builder-stats">
                    <div className="stat">
                      <FaBuilding />
                      <span>{builder.projects_count} Projects</span>
                    </div>
                  </div>
                  <motion.button
                    className="btn-view-projects"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewProjects(builder.id)}
                  >
                    View Projects
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            className="carousel-btn next-btn"
            onClick={nextBuilder}
            aria-label="Next builders"
            disabled={builders.length <= 3}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopBuilders;
