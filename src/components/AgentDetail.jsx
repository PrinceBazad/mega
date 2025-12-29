import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_BASE_URL from "../config";
import "./AgentDetail.css";
import eventBus, { EVENT_TYPES } from "../utils/eventBus";

const AgentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/agents/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAgent(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching agent:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  // Listen for agent changes
  useEffect(() => {
    const handleAgentsChanged = (data) => {
      if (data.entityId && data.entityId === parseInt(id)) {
        // Re-fetch agent when this specific agent changes
        const fetchAgent = async () => {
          try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/agents/${id}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAgent(data);
          } catch (err) {
            setError(err.message);
            console.error("Error fetching agent:", err);
          } finally {
            setLoading(false);
          }
        };

        fetchAgent();
      }
    };

    const handleFavoritesChanged = (data) => {
      if (data.entityType === "agent" && data.entityId === parseInt(id)) {
        // Re-fetch agent to get updated favorite status
        const fetchAgent = async () => {
          try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/agents/${id}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAgent(data);
          } catch (err) {
            setError(err.message);
            console.error("Error fetching agent:", err);
          } finally {
            setLoading(false);
          }
        };

        fetchAgent();
      }
    };

    eventBus.on(EVENT_TYPES.AGENTS_CHANGED, handleAgentsChanged);
    eventBus.on(EVENT_TYPES.FAVORITES_CHANGED, handleFavoritesChanged);

    return () => {
      eventBus.off(EVENT_TYPES.AGENTS_CHANGED, handleAgentsChanged);
      eventBus.off(EVENT_TYPES.FAVORITES_CHANGED, handleFavoritesChanged);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="agent-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading agent details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agent-detail-page">
        <div className="error-container">
          <h2>Error Loading Agent</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="agent-detail-page">
        <div className="error-container">
          <h2>Agent Not Found</h2>
          <p>The requested agent could not be found.</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="agent-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="agent-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Agents
        </button>

        <div className="agent-header">
          <div className="agent-image-large">
            <img src={agent.image} alt={agent.name} />
          </div>

          <div className="agent-basic-info">
            <h1>{agent.name}</h1>
            <p className="agent-position">{agent.position}</p>
            <p className="agent-experience">
              <strong>Experience:</strong> {agent.experience}
            </p>
            <p className="agent-sales">
              <strong>Properties Sold:</strong> {agent.properties_sold}
            </p>
          </div>
        </div>

        <div className="agent-details">
          <div className="agent-bio-section">
            <h2>About</h2>
            <p>{agent.bio}</p>
          </div>

          <div className="agent-contact-section">
            <h2>Contact Information</h2>
            <div className="contact-details">
              <p>
                <strong>Email:</strong> {agent.email}
              </p>
              <p>
                <strong>Phone:</strong> {agent.phone}
              </p>
              {agent.license_number && (
                <p>
                  <strong>License:</strong> {agent.license_number}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentDetail;
