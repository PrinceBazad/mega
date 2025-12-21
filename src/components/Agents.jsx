import React, { useState, useEffect } from "react";
import "./Agents.css";
import API_BASE_URL from "../config";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAgents();
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
            <div key={agent.id} className="agent-card">
              <div className="agent-image">
                <img src={agent.image} alt={agent.name} />
              </div>
              <div className="agent-info">
                <h3>{agent.name}</h3>
                <p className="agent-position">{agent.position}</p>
                <p className="agent-experience">
                  {agent.experience} experience
                </p>
                <p className="agent-sales">
                  {agent.properties_sold} properties sold
                </p>
                <p className="agent-bio">{agent.bio}</p>
                <div className="agent-contact">
                  <p>Email: {agent.email}</p>
                  <p>Phone: {agent.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agents;
