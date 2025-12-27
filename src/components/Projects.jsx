import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaArrowRight,
  FaBuilding,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        const data = await response.json();
        // Filter to show only favorite projects
        const favoriteProjects = data.filter(project => project.is_favorite === true);
        setProjects(favoriteProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewAllProjects = () => {
    // Navigate to the dedicated projects page
    window.location.href = "/projects";
  };

  const nextProject = () => {
    setCurrentIndex((prevIndex) => {
      // Move by 3 items at a time for smoother navigation
      const newIndex = prevIndex + 3;
      // If we've reached or passed the end, cycle back to the beginning
      return newIndex >= projects.length ? 0 : newIndex;
    });
  };

  const prevProject = () => {
    setCurrentIndex((prevIndex) => {
      // Move by 3 items at a time for smoother navigation
      const newIndex = prevIndex - 3;
      // If going before first set, go to the last possible set
      if (newIndex < 0) {
        // Calculate the index for the last possible set of 3 items
        const lastPossibleIndex = Math.max(0, projects.length - 3);
        return lastPossibleIndex;
      }
      return newIndex;
    });
  };

  if (loading) {
    return (
      <section id="projects" className="projects">
        <div className="projects-container">
          <div className="section-header">
            <h2>Our Projects</h2>
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show 3 projects at a time
  const visibleProjects = projects.slice(currentIndex, currentIndex + 3);

  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <div className="section-header">
          <h2>Our Projects</h2>
          <p>Discover our latest and upcoming projects</p>
        </div>

        <div className="projects-carousel">
          <button
            className="carousel-btn prev-btn"
            onClick={prevProject}
            aria-label="Previous projects"
            disabled={projects.length <= 3}
          >
            <FaArrowLeft />
          </button>

          <div
            className="projects-grid"
            key={currentIndex} // Add key to force re-render when index changes
          >
            {projects.length > 0 ? (
              visibleProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => {
                    window.location.href = `/project/${project.id}`;
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="project-image">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <span className={`project-tag tag-${project.tag}`}>
                      {project.tag}
                    </span>
                  </div>

                  <div className="project-info">
                    <h3>{project.title}</h3>

                    <div className="project-location">
                      <FaMapMarkerAlt />
                      <span>{project.location}</span>
                    </div>

                    {project.builder_name && (
                      <p className="project-builder">
                        Builder: {project.builder_name}
                      </p>
                    )}

                    <p className="project-status">
                      Status:{" "}
                      <span
                        className={`status-${project.status.toLowerCase()}`}
                      >
                        {project.status}
                      </span>
                    </p>

                    <div className="project-details">
                      <div className="detail">
                        <FaBuilding />
                        <span>{project.total_units} Units</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-projects">
                <p>No projects available at the moment.</p>
              </div>
            )}
          </div>

          <button
            className="carousel-btn next-btn"
            onClick={nextProject}
            aria-label="Next projects"
            disabled={
              projects.length <= 3 || currentIndex + 3 >= projects.length
            }
          >
            <FaArrowRight />
          </button>
        </div>

        <motion.div
          className="view-all-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="btn-view-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewAllProjects}
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
