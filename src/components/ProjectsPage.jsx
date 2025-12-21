import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import API_BASE_URL from "../config";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    status: "",
    tag: "",
  });

  const navigate = useNavigate();

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Apply filters when search filters change
  useEffect(() => {
    let filtered = [...projects];

    if (searchFilters.location) {
      filtered = filtered.filter((project) =>
        project.location
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase())
      );
    }

    if (searchFilters.status) {
      filtered = filtered.filter(
        (project) => project.status === searchFilters.status
      );
    }

    if (searchFilters.tag) {
      filtered = filtered.filter(
        (project) => project.tag === searchFilters.tag
      );
    }

    setFilteredProjects(filtered);
  }, [searchFilters, projects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      location: "",
      status: "",
      tag: "",
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
      <section className="projects-page">
        <div className="projects-container">
          <div className="section-header">
            <h2>All Projects</h2>
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-page">
      <div className="projects-container">
        <div className="section-header">
          <h2>All Projects</h2>
          <p>Browse all our current and upcoming projects</p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="filter-row">
            <div className="filter-group">
              <FaSearch className="filter-icon" />
              <input
                type="text"
                name="location"
                placeholder="Search by location..."
                value={searchFilters.location}
                onChange={handleFilterChange}
              />
            </div>

            <select
              name="status"
              value={searchFilters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Working">Working</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              name="tag"
              value={searchFilters.tag}
              onChange={handleFilterChange}
            >
              <option value="">All Tags</option>
              <option value="available">Available</option>
              <option value="latest">Latest</option>
              <option value="working">Working</option>
            </select>

            <button className="btn-clear" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
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
                    <span className={`status-${project.status.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </p>

                  <div className="project-details">
                    <div className="detail">
                      <span className="label">Units:</span>
                      <span className="value">{project.total_units}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Completion:</span>
                      <span className="value">
                        {project.completion_date || "TBD"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn-view-details"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project/${project.id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-projects">
              <p>No projects found matching your criteria.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsPage;
