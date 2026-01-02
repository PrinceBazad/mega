import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "./AgentsSection.css";
import eventBus, { EVENT_TYPES } from "../utils/eventBus";

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

        setAgents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Listen for agent changes
  useEffect(() => {
    const handleAgentsChanged = () => {
      // Re-fetch agents when changes occur
      fetchAgents();
    };

    // Removed favorite functionality

    eventBus.on(EVENT_TYPES.AGENTS_CHANGED, handleAgentsChanged);

    return () => {
      eventBus.off(EVENT_TYPES.AGENTS_CHANGED, handleAgentsChanged);
    };
  }, []);

  // Function to fetch agents
  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents`);
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  // Refresh agents when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, fetch latest agents
        fetchAgents();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Fetch section content from admin panel
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/home-content`);
        if (response.ok) {
          const data = await response.json();
          setSectionContent({
            title: data.agents?.title || "Meet Our Agents",
            description:
              data.agents?.description ||
              "Connect with our real estate professionals who are here to guide you",
          });
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

    const handleHomeContentChanged = (data) => {
      if (data.section === "agents") {
        setSectionContent({
          title: data.content.title,
          description: data.content.description,
        });
      }
    };

    window.addEventListener("homeContentUpdated", handleHomeContentUpdate);
    eventBus.on(EVENT_TYPES.HOME_CONTENT_CHANGED, handleHomeContentChanged);

    return () => {
      window.removeEventListener("homeContentUpdated", handleHomeContentUpdate);
      eventBus.off(EVENT_TYPES.HOME_CONTENT_CHANGED, handleHomeContentChanged);
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
            <h2>{sectionContent.title || "Meet Our Agents"}</h2>
            <p>
              {sectionContent.description ||
                "Connect with our real estate professionals who are here to guide you"}
            </p>
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
          <h2>{sectionContent.title || "Meet Our Agents"}</h2>
          <p>
            {sectionContent.description ||
              "Connect with our real estate professionals who are here to guide you"}
          </p>
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
