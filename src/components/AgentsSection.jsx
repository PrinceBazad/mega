import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import API_BASE_URL from "../config";
import "./AgentsSection.css";

const AgentsSection = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/agents`);
        const data = await response.json();
        setAgents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const nextAgent = () => {
    setCurrentIndex((prevIndex) => {
      // Move by 3 items at a time for smoother navigation
      const newIndex = prevIndex + 3;
      return newIndex >= agents.length ? 0 : newIndex;
    });
  };

  const prevAgent = () => {
    setCurrentIndex((prevIndex) => {
      // Move by 3 items at a time for smoother navigation
      const newIndex = prevIndex - 3;
      return newIndex < 0 ? Math.max(0, agents.length - 3) : newIndex;
    });
  };

  if (loading) {
    return (
      <section id="agents" className="agents-section">
        <div className="agents-container">
          <div className="section-header">
            <h2>Meet Our Agents</h2>
            <p>Loading agents...</p>
          </div>
        </div>
      </section>
    );
  }

  if (agents.length === 0) {
    return null;
  }

  // Show 3 agents at a time
  const visibleAgents = agents.slice(currentIndex, currentIndex + 3);

  return (
    <section id="agents" className="agents-section">
      <div className="agents-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Meet Our <span className="highlight">Agents</span></h2>
          <p>Connect with our real estate professionals who are here to guide you</p>
        </motion.div>

        <div className="agents-carousel">
          <button
            className="carousel-btn prev-btn"
            onClick={prevAgent}
            aria-label="Previous agents"
            disabled={agents.length <= 3}
          >
            <FaArrowLeft />
          </button>

          <div className="agents-grid">
            {visibleAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                className="agent-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="agent-image">
                  <img src={agent.image} alt={agent.name} loading="lazy" />
                </div>
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p className="agent-position">{agent.position}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            className="carousel-btn next-btn"
            onClick={nextAgent}
            aria-label="Next agents"
            disabled={agents.length <= 3}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;