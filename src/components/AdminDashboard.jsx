import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaUsers,
  FaList,
  FaEye,
  FaUserFriends,
  FaBuilding,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import Notification from "./Notification";
import "./Notification.css";
import API_BASE_URL from "../config";
import "./AdminDashboard.css";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [token, setToken] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [showEditAdminForm, setShowEditAdminForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    property_type: "House",
    status: "Available",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    builder_id: "",
    images: [""],
  });
  const [adminFormData, setAdminFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [imageInputs, setImageInputs] = useState([""]);

  // Agent management state
  const [agents, setAgents] = useState([]);
  const [showAddAgentForm, setShowAddAgentForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    properties_sold: 0,
    image: "",
    bio: "",
  });

  // Project management state
  const [projects, setProjects] = useState([]);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    location: "",
    status: "Available",
    completion_date: "",
    total_units: 0,
    builder_id: "",
    images: [""],
    tag: "available",
  });

  // Builder management state
  const [builders, setBuilders] = useState([]);
  const [showAddBuilderForm, setShowAddBuilderForm] = useState(false);
  const [editingBuilder, setEditingBuilder] = useState(null);
  const [builderForm, setBuilderForm] = useState({
    name: "",
    projects_count: 0,
    image: "",
    description: "",
  });

  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    } else {
      setToken(token);
    }
  }, [navigate]);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (activeTab === "properties") {
        const response = await fetch(`${API_BASE_URL}/api/admin/properties`, {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } else if (activeTab === "inquiries") {
        const response = await fetch(`${API_BASE_URL}/api/admin/inquiries`, {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setInquiries(data);
        }
      } else if (activeTab === "admins") {
        const response = await fetch(`${API_BASE_URL}/api/admins`, {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setAdmins(data);
        }
      } else if (activeTab === "agents") {
        const response = await fetch(`${API_BASE_URL}/api/admin/agents`, {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setAgents(data);
        }
      } else if (activeTab === "projects") {
        const response = await fetch(`${API_BASE_URL}/api/admin/projects`, {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } else if (activeTab === "builders") {
        const response = await fetch(`${API_BASE_URL}/api/admin/builders`, {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setBuilders(data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleToggleFavorite = async (propertyId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/properties/${propertyId}/favorite`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_favorite: !currentStatus }),
        }
      );

      if (response.ok) {
        // Update local state
        setProperties((prev) =>
          prev.map((prop) =>
            prop.id === propertyId
              ? { ...prop, is_favorite: !currentStatus }
              : prop
          )
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleToggleAgentFavorite = async (agentId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/agents/${agentId}/favorite`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_favorite: !currentStatus }),
        }
      );

      if (response.ok) {
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === agentId
              ? { ...agent, is_favorite: !currentStatus }
              : agent
          )
        );
      }
    } catch (error) {
      console.error("Error toggling agent favorite:", error);
    }
  };

  const handleToggleProjectFavorite = async (projectId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/projects/${projectId}/favorite`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_favorite: !currentStatus }),
        }
      );

      if (response.ok) {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? { ...project, is_favorite: !currentStatus }
              : project
          )
        );
      }
    } catch (error) {
      console.error("Error toggling project favorite:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageInputChange = (index, value) => {
    const newImages = [...imageInputs];
    newImages[index] = value;
    setImageInputs(newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const addImageInput = () => {
    setImageInputs([...imageInputs, ""]);
  };

  const removeImageInput = (index) => {
    if (imageInputs.length > 1) {
      const newImages = imageInputs.filter((_, i) => i !== index);
      setImageInputs(newImages);
      setFormData((prev) => ({
        ...prev,
        images: newImages,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area_sqft: parseInt(formData.area_sqft) || 0,
        builder_id: formData.builder_id ? parseInt(formData.builder_id) : null,
        images: imageInputs.filter((url) => url.trim() !== ""),
      };

      const url = editingProperty
        ? `${API_BASE_URL}/api/admin/properties/${editingProperty.id}`
        : `${API_BASE_URL}/api/admin/properties`;

      const method = editingProperty ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        setShowAddForm(false);
        setShowEditForm(false);
        setEditingProperty(null);
        resetForm();
        fetchData();
      } else {
        console.error("Failed to save property");
      }
    } catch (error) {
      console.error("Error saving property:", error);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const url = editingAdmin
        ? `${API_BASE_URL}/api/admins/${editingAdmin.id}`
        : `${API_BASE_URL}/api/admin/register`;

      const method = editingAdmin ? "PUT" : "POST";

      // For updates, we don't send password unless it's changed
      const adminData = { ...adminFormData };
      if (editingAdmin && !adminData.password) {
        delete adminData.password;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(adminData),
      });

      if (response.ok) {
        setShowAddAdminForm(false);
        setShowEditAdminForm(false);
        setEditingAdmin(null);
        resetAdminForm();
        fetchData();
      } else {
        const errorData = await response.json();
        console.error("Failed to save admin:", errorData.message);
      }
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      location: property.location,
      property_type: property.property_type,
      status: property.status,
      bedrooms: property.bedrooms?.toString() || "",
      bathrooms: property.bathrooms?.toString() || "",
      area_sqft: property.area_sqft?.toString() || "",
      builder_id: property.builder_id?.toString() || "",
      images: property.images || [""],
    });
    setImageInputs(property.images || [""]);
    setShowEditForm(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setAdminFormData({
      name: admin.name,
      email: admin.email,
      password: "", // Don't prefill password
      role: admin.role,
    });
    setShowEditAdminForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await fetch(
          `${API_BASE_URL}/api/admin/properties/${id}`,
          {
            method: "DELETE",
            headers,
          }
        );

        if (response.ok) {
          fetchData();
        } else {
          console.error("Failed to delete property");
        }
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await fetch(`${API_BASE_URL}/api/admins/${id}`, {
          method: "DELETE",
          headers,
        });

        if (response.ok) {
          fetchData();
        } else {
          const errorData = await response.json();
          alert(errorData.message);
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      property_type: "House",
      status: "Available",
      bedrooms: "",
      bathrooms: "",
      area_sqft: "",
      builder_id: "",
      images: [""],
    });
    setImageInputs([""]);
  };

  const resetAdminForm = () => {
    setAdminFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
    });
  };

  // Handle agent form submission
  const handleAgentSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingAgent
        ? `${API_BASE_URL}/api/admin/agents/${editingAgent.id}`
        : `${API_BASE_URL}/api/admin/agents`;

      const method = editingAgent ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentForm),
      });

      if (response.ok) {
        fetchData();
        setShowAddAgentForm(false);
        setEditingAgent(null);
        setAgentForm({
          name: "",
          email: "",
          phone: "",
          position: "",
          experience: "",
          properties_sold: 0,
          image: "",
          bio: "",
        });
      } else {
        console.error("Failed to save agent");
      }
    } catch (error) {
      console.error("Error saving agent:", error);
    }
  };

  // Edit agent
  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    setAgentForm({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      position: agent.position,
      experience: agent.experience,
      properties_sold: agent.properties_sold,
      image: agent.image,
      bio: agent.bio,
    });
    setShowAddAgentForm(true);
  };

  // Delete agent
  const handleDeleteAgent = async (agentId) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/agents/${agentId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          fetchData();
        } else {
          console.error("Failed to delete agent");
        }
      } catch (error) {
        console.error("Error deleting agent:", error);
      }
    }
  };

  // Handle builder form submission
  const handleBuilderSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingBuilder
        ? `${API_BASE_URL}/api/admin/builders/${editingBuilder.id}`
        : `${API_BASE_URL}/api/admin/builders`;

      const method = editingBuilder ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(builderForm),
      });

      if (response.ok) {
        fetchData();
        setShowAddBuilderForm(false);
        setEditingBuilder(null);
        setBuilderForm({
          name: "",
          projects_count: 0,
          image: "",
          description: "",
        });
      } else {
        console.error("Failed to save builder");
      }
    } catch (error) {
      console.error("Error saving builder:", error);
    }
  };

  // Edit builder
  const handleEditBuilder = (builder) => {
    setEditingBuilder(builder);
    setBuilderForm({
      name: builder.name,
      projects_count: builder.projects_count,
      image: builder.image,
      description: builder.description,
    });
    setShowAddBuilderForm(true);
  };

  // Handle project form submission
  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingProject
        ? `${API_BASE_URL}/api/admin/projects/${editingProject.id}`
        : `${API_BASE_URL}/api/admin/projects`;

      const method = editingProject ? "PUT" : "POST";

      const projectData = {
        title: projectForm.title,
        description: projectForm.description,
        location: projectForm.location,
        status: projectForm.status,
        completion_date: projectForm.completion_date,
        total_units: parseInt(projectForm.total_units) || 0,
        builder_id: projectForm.builder_id
          ? parseInt(projectForm.builder_id)
          : null,
        images: projectForm.images.filter((url) => url.trim() !== ""),
        tag: projectForm.tag,
      };

      const token = localStorage.getItem("adminToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        fetchData();
        setShowAddProjectForm(false);
        setEditingProject(null);
        setProjectForm({
          title: "",
          description: "",
          location: "",
          status: "Available",
          completion_date: "",
          total_units: 0,
          builder_id: "",
          images: [""],
          tag: "available",
        });
      } else {
        console.error("Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // Edit project
  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      location: project.location,
      status: project.status,
      completion_date: project.completion_date,
      total_units: project.total_units,
      builder_id: project.builder_id?.toString() || "",
      images: project.images || [""],
      tag: project.tag,
    });
    setShowAddProjectForm(true);
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/projects/${projectId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          fetchData();
        } else {
          console.error("Failed to delete project");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  // Delete builder
  const handleDeleteBuilder = async (builderId) => {
    if (window.confirm("Are you sure you want to delete this builder?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/builders/${builderId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          fetchData();
        } else {
          console.error("Failed to delete builder");
        }
      } catch (error) {
        console.error("Error deleting builder:", error);
      }
    }
  };

  const PropertyManagement = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Property Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
            setEditingProperty(null);
          }}
        >
          <FaPlus /> Add Property
        </button>
      </div>

      <div className="properties-grid">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <div className="property-image">
              {property.images && property.images.length > 0 ? (
                <img src={property.images[0]} alt={property.title} />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <button
                className={`favorite-btn ${
                  property.is_favorite ? "active" : ""
                }`}
                onClick={() =>
                  handleToggleFavorite(property.id, property.is_favorite)
                }
                title={
                  property.is_favorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {property.is_favorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            <div className="property-info">
              <h3>{property.title}</h3>
              <p className="property-location">{property.location}</p>
              {property.builder_name && (
                <p className="property-builder">
                  Builder: {property.builder_name}
                </p>
              )}
              <p className="property-price">
                ₹{property.price.toLocaleString()}
              </p>
              <div className="property-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(property)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(property.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Property Form Modal */}
      {(showAddForm || showEditForm) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProperty ? "Edit Property" : "Add New Property"}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditForm(false);
                  setEditingProperty(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="property-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Property Type</label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                  >
                    <option value="House">House</option>
                    <option value="Flat">Flat</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Area (sqft)</label>
                  <input
                    type="number"
                    name="area_sqft"
                    value={formData.area_sqft}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              {/* Builder Selection */}
              <div className="form-group">
                <label>Builder</label>
                <select
                  name="builder_id"
                  value={formData.builder_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select a Builder (Optional)</option>
                  {builders.map((builder) => (
                    <option key={builder.id} value={builder.id}>
                      {builder.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URLs Section */}
              <div className="form-group">
                <label>Image URLs</label>
                <div className="image-inputs">
                  {imageInputs.map((url, index) => (
                    <div key={index} className="image-input-group">
                      <input
                        type="url"
                        placeholder="Enter image URL"
                        value={url}
                        onChange={(e) =>
                          handleImageInputChange(index, e.target.value)
                        }
                      />
                      {imageInputs.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={() => removeImageInput(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-image"
                    onClick={addImageInput}
                  >
                    + Add Image URL
                  </button>
                </div>
              </div>

              {imageInputs.some((url) => url.trim() !== "") && (
                <div className="image-preview">
                  <h4>Image Preview</h4>
                  <div className="preview-images">
                    {imageInputs
                      .filter((url) => url.trim() !== "")
                      .map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Preview ${index + 1}`}
                        />
                      ))}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddForm(false);
                    setShowEditForm(false);
                    setEditingProperty(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingProperty ? "Update Property" : "Add Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const InquiryManagement = () => {
    const handleStatusChange = async (inquiryId, newStatus) => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${API_BASE_URL}/api/admin/inquiries/${inquiryId}/status`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (response.ok) {
          // Update local state
          setInquiries((prev) =>
            prev.map((inq) =>
              inq.id === inquiryId ? { ...inq, status: newStatus } : inq
            )
          );
        }
      } catch (error) {
        console.error("Error updating inquiry status:", error);
      }
    };

    return (
      <div className="dashboard-content">
        <div className="content-header">
          <h2>Inquiry Management</h2>
        </div>

        <div className="inquiries-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Property ID</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td>{inquiry.user_name}</td>
                  <td>{inquiry.email}</td>
                  <td>{inquiry.phone || "N/A"}</td>
                  <td>{inquiry.property_id || "N/A"}</td>
                  <td>{inquiry.message}</td>
                  <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      className={`status-select status-${
                        inquiry.status || "pending"
                      }`}
                      value={inquiry.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(inquiry.id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="solved">Solved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const AdminManagement = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Admin Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            resetAdminForm();
            setShowAddAdminForm(true);
            setEditingAdmin(null);
          }}
        >
          <FaPlus /> Add Admin
        </button>
      </div>

      <div className="admins-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditAdmin(admin)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteAdmin(admin.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Admin Form Modal */}
      {(showAddAdminForm || showEditAdminForm) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingAdmin ? "Edit Admin" : "Add New Admin"}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddAdminForm(false);
                  setShowEditAdminForm(false);
                  setEditingAdmin(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAdminSubmit} className="admin-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={adminFormData.name}
                  onChange={handleAdminInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={adminFormData.email}
                  onChange={handleAdminInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password {!editingAdmin && "*"}</label>
                <input
                  type="password"
                  name="password"
                  value={adminFormData.password}
                  onChange={handleAdminInputChange}
                  {...(!editingAdmin ? { required: true } : {})}
                />
                {editingAdmin && (
                  <small>Leave blank to keep current password</small>
                )}
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={adminFormData.role}
                  onChange={handleAdminInputChange}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddAdminForm(false);
                    setShowEditAdminForm(false);
                    setEditingAdmin(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingAdmin ? "Update Admin" : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const ProjectManagement = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Project Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingProject(null);
            setProjectForm({
              title: "",
              description: "",
              location: "",
              status: "Available",
              completion_date: "",
              total_units: 0,
              builder_id: "",
              images: [""],
              tag: "available",
            });
            setShowAddProjectForm(true);
          }}
        >
          <FaPlus /> Add Project
        </button>
      </div>

      <div className="properties-grid">
        {projects.map((project) => (
          <div key={project.id} className="property-card">
            <div className="property-image">
              {project.images && project.images.length > 0 ? (
                <img src={project.images[0]} alt={project.title} />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <button
                className={`favorite-btn ${project.is_favorite ? 'active' : ''}`}
                onClick={() => handleToggleProjectFavorite(project.id, project.is_favorite)}
                title={project.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {project.is_favorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            <div className="property-info">
              <h3>{project.title}</h3>
              <p className="property-location">{project.location}</p>
              {project.builder_name && (
                <p className="property-builder">
                  Builder: {project.builder_name}
                </p>
              )}
              <div className="project-tags">
                <span className={`tag tag-${project.tag}`}>
                  {project.tag.charAt(0).toUpperCase() + project.tag.slice(1)}
                </span>
              </div>
              <div className="property-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditProject(project)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="admin-dashboard">
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Admin Panel</h2>
              <Notification token={token} />
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={activeTab === "properties" ? "active" : ""}
              onClick={() => setActiveTab("properties")}
            >
              <FaHome /> Properties
            </button>
            <button
              className={activeTab === "inquiries" ? "active" : ""}
              onClick={() => setActiveTab("inquiries")}
            >
              <FaList /> Inquiries
            </button>
            <button
              className={activeTab === "admins" ? "active" : ""}
              onClick={() => setActiveTab("admins")}
            >
              <FaUsers /> Admins
            </button>
            <button
              className={activeTab === "agents" ? "active" : ""}
              onClick={() => setActiveTab("agents")}
            >
              <FaUserFriends /> Agents
            </button>
            <button
              className={activeTab === "projects" ? "active" : ""}
              onClick={() => setActiveTab("projects")}
            >
              <FaBuilding /> Projects
            </button>
            <button
              className={activeTab === "builders" ? "active" : ""}
              onClick={() => setActiveTab("builders")}
            >
              <FaBuilding /> Builders
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>{" "}
          </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {activeTab === "properties" && <PropertyManagement />}
          {activeTab === "inquiries" && <InquiryManagement />}
          {activeTab === "admins" && <AdminManagement />}
          {activeTab === "projects" && <ProjectManagement />}
          {showAddProjectForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>{editingProject ? "Edit Project" : "Add New Project"}</h3>
                  <button
                    className="close-btn"
                    onClick={() => {
                      setShowAddProjectForm(false);
                      setEditingProject(null);
                    }}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleProjectSubmit} className="project-form">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description: e.target.value,
                        })
                      }
                      rows="4"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Location *</label>
                      <input
                        type="text"
                        value={projectForm.location}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            location: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={projectForm.status}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Available">Available</option>
                        <option value="Working">Working</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Completion Date</label>
                      <input
                        type="date"
                        value={projectForm.completion_date}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            completion_date: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Total Units</label>
                      <input
                        type="number"
                        value={projectForm.total_units}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            total_units: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tag</label>
                      <select
                        value={projectForm.tag}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            tag: e.target.value,
                          })
                        }
                      >
                        <option value="available">Available</option>
                        <option value="latest">Latest</option>
                        <option value="working">Working</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Builder</label>
                      <select
                        value={projectForm.builder_id}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            builder_id: e.target.value
                              ? parseInt(e.target.value)
                              : "",
                          })
                        }
                      >
                        <option value="">Select a Builder (Optional)</option>
                        {builders.map((builder) => (
                          <option key={builder.id} value={builder.id}>
                            {builder.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Image URLs Section */}
                  <div className="form-group">
                    <label>Image URLs</label>
                    <div className="image-inputs">
                      {projectForm.images.map((url, index) => (
                        <div key={index} className="image-input-group">
                          <input
                            type="url"
                            placeholder="Enter image URL"
                            value={url}
                            onChange={(e) => {
                              const newImages = [...projectForm.images];
                              newImages[index] = e.target.value;
                              setProjectForm({
                                ...projectForm,
                                images: newImages,
                              });
                            }}
                          />
                          {projectForm.images.length > 1 && (
                            <button
                              type="button"
                              className="btn-remove-image"
                              onClick={() => {
                                const newImages = projectForm.images.filter(
                                  (_, i) => i !== index
                                );
                                setProjectForm({
                                  ...projectForm,
                                  images: newImages,
                                });
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add-image"
                        onClick={() => {
                          setProjectForm({
                            ...projectForm,
                            images: [...projectForm.images, ""],
                          });
                        }}
                      >
                        + Add Image URL
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowAddProjectForm(false);
                        setEditingProject(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      {editingProject ? "Update Project" : "Add Project"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {activeTab === "agents" && (
            <div className="dashboard-content">
              <div className="content-header">
                <h2>Agents Management</h2>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setEditingAgent(null);
                    setAgentForm({
                      name: "",
                      email: "",
                      phone: "",
                      position: "",
                      experience: "",
                      properties_sold: 0,
                      image: "",
                      bio: "",
                    });
                    setShowAddAgentForm(true);
                  }}
                >
                  <FaPlus /> Add Agent
                </button>
              </div>

              {showAddAgentForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>{editingAgent ? "Edit Agent" : "Add New Agent"}</h3>
                      <button
                        className="close-btn"
                        onClick={() => {
                          setShowAddAgentForm(false);
                          setEditingAgent(null);
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleAgentSubmit} className="agent-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Name *</label>
                          <input
                            type="text"
                            value={agentForm.name}
                            onChange={(e) =>
                              setAgentForm({
                                ...agentForm,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email *</label>
                          <input
                            type="email"
                            value={agentForm.email}
                            onChange={(e) =>
                              setAgentForm({
                                ...agentForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Phone</label>
                          <input
                            type="text"
                            value={agentForm.phone}
                            onChange={(e) =>
                              setAgentForm({
                                ...agentForm,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Position</label>
                          <input
                            type="text"
                            value={agentForm.position}
                            onChange={(e) =>
                              setAgentForm({
                                ...agentForm,
                                position: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Experience</label>
                          <input
                            type="text"
                            value={agentForm.experience}
                            onChange={(e) =>
                              setAgentForm({
                                ...agentForm,
                                experience: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Properties Sold</label>
                          <input
                            type="number"
                            value={agentForm.properties_sold}
                            onChange={(e) =>
                              setAgentForm({
                                ...agentForm,
                                properties_sold: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Image URL</label>
                        <input
                          type="text"
                          value={agentForm.image}
                          onChange={(e) =>
                            setAgentForm({
                              ...agentForm,
                              image: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Bio</label>
                        <textarea
                          value={agentForm.bio}
                          onChange={(e) =>
                            setAgentForm({ ...agentForm, bio: e.target.value })
                          }
                          rows="3"
                        ></textarea>
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => {
                            setShowAddAgentForm(false);
                            setEditingAgent(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                          {editingAgent ? "Update Agent" : "Add Agent"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="agents-list">
                {agents.map((agent) => (
                  <div key={agent.id} className="agent-card">
                    <div className="agent-image-wrapper">
                      {agent.image ? (
                        <img
                          src={agent.image}
                          alt={agent.name}
                          className="agent-image"
                        />
                      ) : (
                        <div className="agent-placeholder">
                          <FaUserFriends />
                        </div>
                      )}
                      <button
                        className={`favorite-btn ${agent.is_favorite ? 'active' : ''}`}
                        onClick={() => handleToggleAgentFavorite(agent.id, agent.is_favorite)}
                        title={agent.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {agent.is_favorite ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    </div>
                    <div className="agent-card-content">
                      <h4 className="agent-name">{agent.name}</h4>
                    </div>
                    <div className="agent-card-actions">
                      <button
                        className="btn-edit-small"
                        onClick={() => handleEditAgent(agent)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-delete-small"
                        onClick={() => handleDeleteAgent(agent.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}{" "}
          {activeTab === "builders" && (
            <div className="dashboard-content">
              <div className="content-header">
                <h2>Builders Management</h2>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setEditingBuilder(null);
                    setBuilderForm({
                      name: "",
                      projects_count: 0,
                      image: "",
                      description: "",
                    });
                    setShowAddBuilderForm(true);
                  }}
                >
                  <FaPlus /> Add Builder
                </button>
              </div>

              {showAddBuilderForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>
                        {editingBuilder ? "Edit Builder" : "Add New Builder"}
                      </h3>
                      <button
                        className="close-btn"
                        onClick={() => {
                          setShowAddBuilderForm(false);
                          setEditingBuilder(null);
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <form
                      onSubmit={handleBuilderSubmit}
                      className="builder-form"
                    >
                      <div className="form-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          value={builderForm.name}
                          onChange={(e) =>
                            setBuilderForm({
                              ...builderForm,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Projects Count</label>
                          <input
                            type="number"
                            value={builderForm.projects_count}
                            onChange={(e) =>
                              setBuilderForm({
                                ...builderForm,
                                projects_count: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Image URL</label>
                          <input
                            type="text"
                            value={builderForm.image}
                            onChange={(e) =>
                              setBuilderForm({
                                ...builderForm,
                                image: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={builderForm.description}
                          onChange={(e) =>
                            setBuilderForm({
                              ...builderForm,
                              description: e.target.value,
                            })
                          }
                          rows="3"
                        ></textarea>
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => {
                            setShowAddBuilderForm(false);
                            setEditingBuilder(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                          {editingBuilder ? "Update Builder" : "Add Builder"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="builders-list">
                {builders.map((builder) => (
                  <div key={builder.id} className="builder-item">
                    <div className="builder-info">
                      <h4>{builder.name}</h4>
                      <p>{builder.projects_count} Projects</p>
                      <p>{builder.description}</p>
                    </div>
                    <div className="builder-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditBuilder(builder)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteBuilder(builder.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
