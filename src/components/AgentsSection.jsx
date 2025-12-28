import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "./AgentsSection.css";

const AgentsSection = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sectionContent, setSectionContent] = useState({
    title: "Meet Our Agents",
    description:
      "Connect with our real estate professionals who are here to guide you",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/agents`);
        const data = await response.json();
        // Show only favorite agents on homepage, but ensure the section is visible
        // If there are no favorite agents, show all agents as fallback
        const favoriteAgents = data.filter(
          (agent) => agent.is_favorite === true
        );

        if (favoriteAgents.length > 0) {
          setAgents(favoriteAgents);
        } else {
          // If no favorites, show a limited number of all agents
          setAgents(data.slice(0, 3));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Fetch section content from admin panel
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/home-content`);
        if (response.ok) {
          const data = await response.json();
          if (data.agents) {
            setSectionContent({
              title: data.agents.title,
              description: data.agents.description,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching agents section content:", error);
      }
    };

    fetchHomeContent();

    // Listen for home content updates
    const handleHomeContentUpdate = (event) => {
      if (event.detail.section === "agents") {
        setSectionContent({
          title: event.detail.content.title,
          description: event.detail.content.description,
        });
      }
    };

    window.addEventListener("homeContentUpdated", handleHomeContentUpdate);

    return () => {
      window.removeEventListener("homeContentUpdated", handleHomeContentUpdate);
    };
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
      return Math.max(0, newIndex);
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
            <h2>{sectionContent.title}</h2>
            <p>{sectionContent.description}</p>
          </motion.div>
          <div className="no-agents-message">
            <p>No agents available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  // Show 3 agents at a time, or fewer if there aren't enough
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
          <h2>{sectionContent.title}</h2>
          <p>{sectionContent.description}</p>
        </motion.div>

        <div className="agents-carousel">
          <button
            className="carousel-btn prev-btn"
            onClick={prevAgent}
            aria-label="Previous agents"
            disabled={currentIndex === 0}
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
                onClick={() => {
                  window.location.href = `/agent/${agent.id}`;
                }}
                style={{ cursor: "pointer" }}
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
            disabled={currentIndex + 3 >= agents.length}
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Button to view all agents */}
        <div className="view-all-agents">
          <motion.button
            className="btn-view-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.location.href = "/agents";
            }}
          >
            View All Agents
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
