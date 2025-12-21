import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBuilding,
  FaUsers,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "./ProjectDetail.css";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data = await response.json();
        setProject(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Project Not Found</h2>
            <p>{error || "The project you're looking for doesn't exist."}</p>
            <button className="btn-back" onClick={() => navigate("/projects")}>
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="container">
        {/* Back Button */}
        <div className="back-button">
          <button onClick={() => navigate("/projects")}>
            ← Back to Projects
          </button>
        </div>

        {/* Project Header */}
        <motion.div
          className="project-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="project-title-section">
            <h1>{project.title}</h1>
            <span className={`project-tag tag-${project.tag}`}>
              {project.tag}
            </span>
          </div>

          <div className="project-meta">
            <div className="meta-item">
              <FaMapMarkerAlt />
              <span>{project.location}</span>
            </div>

            <div className="meta-item">
              <FaBuilding />
              <span>{project.builder_name || "Builder not specified"}</span>
            </div>

            <div className="meta-item">
              <FaUsers />
              <span>{project.total_units} Units</span>
            </div>

            <div className="meta-item">
              <FaCalendarAlt />
              <span>
                {project.completion_date
                  ? `Completion: ${new Date(
                      project.completion_date
                    ).toLocaleDateString()}`
                  : "Completion date TBD"}
              </span>
            </div>
          </div>

          <div className="project-status">
            <span
              className={`status-badge status-${project.status.toLowerCase()}`}
            >
              {project.status}
            </span>
          </div>
        </motion.div>

        {/* Project Images */}
        <motion.div
          className="project-images"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {project.images && project.images.length > 0 ? (
            <div className="image-gallery">
              <img
                src={project.images[0]}
                alt={project.title}
                className="main-image"
              />
            </div>
          ) : (
            <div className="no-image-placeholder">
              <p>No images available for this project</p>
            </div>
          )}
        </motion.div>

        {/* Project Content */}
        <div className="project-content">
          <motion.div
            className="project-description"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2>Project Description</h2>
            <p>
              {project.description ||
                "No description available for this project."}
            </p>
          </motion.div>

          <motion.div
            className="project-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2>Project Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Location</span>
                <span className="value">{project.location}</span>
              </div>

              <div className="detail-item">
                <span className="label">Status</span>
                <span className="value">
                  <span
                    className={`status-text status-${project.status.toLowerCase()}`}
                  >
                    {project.status}
                  </span>
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Total Units</span>
                <span className="value">{project.total_units}</span>
              </div>

              <div className="detail-item">
                <span className="label">Builder</span>
                <span className="value">
                  {project.builder_name || "Not specified"}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Completion Date</span>
                <span className="value">
                  {project.completion_date
                    ? new Date(project.completion_date).toLocaleDateString()
                    : "To be determined"}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Tag</span>
                <span className="value">
                  <span className={`tag-text tag-${project.tag}`}>
                    {project.tag}
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="project-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button className="btn-primary" onClick={() => navigate("/contact")}>
            Contact Us
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/projects")}
          >
            View All Projects
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
