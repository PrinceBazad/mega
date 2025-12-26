import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_BASE_URL from "../config";
import "./ProjectDetail.css";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <h2>Error Loading Project</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <h2>Project Not Found</h2>
          <p>The requested project could not be found.</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="project-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="project-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Projects
        </button>

        <div className="project-header">
          <div className="project-image-large">
            {project.images && project.images.length > 0 ? (
              <img src={project.images[0]} alt={project.title} />
            ) : (
              <div className="no-image-large">No Image Available</div>
            )}
          </div>

          <div className="project-basic-info">
            <h1>{project.title}</h1>
            <div className="project-meta">
              <span className={`project-tag tag-${project.tag}`}>
                {project.tag}
              </span>
              <p className="project-status">
                Status:{" "}
                <span className={`status-${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              </p>
            </div>
            <p className="project-location">
              <strong>Location:</strong> {project.location}
            </p>
            <p className="project-units">
              <strong>Total Units:</strong> {project.total_units}
            </p>
            <p className="project-completion">
              <strong>Expected Completion:</strong>{" "}
              {project.completion_date || "TBD"}
            </p>
          </div>
        </div>

        <div className="project-details">
          <div className="project-description-section">
            <h2>Description</h2>
            <p>{project.description || "No description available."}</p>
          </div>

          {project.features && project.features.length > 0 && (
            <div className="project-features-section">
              <h2>Features</h2>
              <ul className="features-list">
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="project-specifications-section">
            <h2>Specifications</h2>
            <div className="specifications-grid">
              <div className="spec-item">
                <strong>Builder:</strong> {project.builder_name || "N/A"}
              </div>
              <div className="spec-item">
                <strong>Project Type:</strong> {project.type || "N/A"}
              </div>
              <div className="spec-item">
                <strong>Area:</strong> {project.area || "N/A"}
              </div>
              <div className="spec-item">
                <strong>Price Range:</strong> {project.price_range || "N/A"}
              </div>
            </div>
          </div>

          <div className="project-location-section">
            <h2>Location</h2>
            <div className="location-details">
              <p>
                <strong>Address:</strong> {project.address || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {project.city || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {project.state || "N/A"}
              </p>
              <p>
                <strong>Pincode:</strong> {project.pincode || "N/A"}
              </p>
            </div>
          </div>

          {project.images && project.images.length > 1 && (
            <div className="project-gallery-section">
              <h2>Gallery</h2>
              <div className="project-gallery">
                {project.images.slice(1).map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img src={image} alt={`Project view ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
