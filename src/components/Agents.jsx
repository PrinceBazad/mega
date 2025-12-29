import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Agents.css";
import API_BASE_URL from "../config";
import eventBus, { EVENT_TYPES } from "../utils/eventBus";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  // Listen for agent changes
  useEffect(() => {
    const handleAgentsChanged = () => {
      // Re-fetch agents when changes occur
      fetchAgents();
    };

    const handleFavoritesChanged = (data) => {
      if (data.entityType === "agent") {
        // Re-fetch agents to get updated favorite status
        fetchAgents();
      }
    };

    eventBus.on(EVENT_TYPES.AGENTS_CHANGED, handleAgentsChanged);
    eventBus.on(EVENT_TYPES.FAVORITES_CHANGED, handleFavoritesChanged);

    return () => {
      eventBus.off(EVENT_TYPES.AGENTS_CHANGED, handleAgentsChanged);
      eventBus.off(EVENT_TYPES.FAVORITES_CHANGED, handleFavoritesChanged);
    };
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/agents`);
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="agents-page">
        <div className="page-header">
          <h1>Our Real Estate Agents</h1>
          <p>Meet our professional team ready to assist you</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agents-page">
      <div className="page-header">
        <h1>Our Real Estate Agents</h1>
        <p>Meet our professional team ready to assist you</p>
      </div>

      <div className="agents-search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search agents by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="no-agents">
          <p>No agents found matching your search criteria.</p>
        </div>
      ) : (
        <div className="agents-grid">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="agent-card"
              onClick={() => {
                window.location.href = `/agent/${agent.id}`;
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="agent-image">
                <img src={agent.image} alt={agent.name} />
              </div>
              <div className="agent-info">
                <h3>{agent.name}</h3>
                <p className="agent-position">{agent.position}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agents;
