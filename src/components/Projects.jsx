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
        // Fetch all projects for carousel functionality
        setProjects(data);
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
    navigate("/projects");
  };

  const nextProject = () => {
    setCurrentIndex((prevIndex) => {
      // Move by 3 items at a time for smoother navigation
      const newIndex = prevIndex + 3;
      return newIndex >= projects.length ? 0 : newIndex;
    });
  };

  const prevProject = () => {
    setCurrentIndex((prevIndex) => {
      // Move by 3 items at a time for smoother navigation
      const newIndex = prevIndex - 3;
      return newIndex < 0 ? Math.max(0, projects.length - 3) : newIndex;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
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
            disabled={currentIndex === 0}
          >
            <FaArrowLeft />
          </button>

          <motion.div
            className="projects-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {projects.length > 0 ? (
              visibleProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className="project-card"
                  variants={cardVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  onClick={() => navigate(`/project/${project.id}`)}
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

                    <button
                      className="btn-view-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Scroll to projects section on the same page
                        const element = document.getElementById("projects");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="no-projects">
                <p>No projects available at the moment.</p>
              </div>
            )}
          </motion.div>

          <button
            className="carousel-btn next-btn"
            onClick={nextProject}
            aria-label="Next projects"
            disabled={currentIndex + 3 >= projects.length || projects.length <= 3}
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
