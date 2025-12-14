import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaList,
  FaInbox,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin");
    const token = localStorage.getItem("adminToken");

    if (!adminData || !token) {
      navigate("/admin/login");
      return;
    }

    try {
      const parsedAdmin = JSON.parse(adminData);
      setAdmin(parsedAdmin);
    } catch (error) {
      // Invalid admin data, redirect to login
      handleLogout();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  // Check if token is expired (simplified version)
  const isTokenExpired = () => {
    // In a real application, you would decode the JWT and check expiration
    // This is a simplified version for demonstration
    return false;
  };

  // Enhanced logout that also clears any expired tokens
  const handleSecureLogout = () => {
    // Clear all auth related data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    // Also clear any other sensitive data
    // localStorage.clear(); // Only if you want to clear everything

    navigate("/admin/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "properties":
        return <PropertyManagement />;
      case "add-property":
        return <AddPropertyForm />;
      case "inquiries":
        return <InquiryManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <p>Welcome, {admin.name}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartBar /> Dashboard
          </button>

          <button
            className={activeTab === "properties" ? "active" : ""}
            onClick={() => setActiveTab("properties")}
          >
            <FaList /> Manage Properties
          </button>

          <button
            className={activeTab === "add-property" ? "active" : ""}
            onClick={() => setActiveTab("add-property")}
          >
            <FaPlus /> Add Property
          </button>

          <button
            className={activeTab === "inquiries" ? "active" : ""}
            onClick={() => setActiveTab("inquiries")}
          >
            <FaInbox /> Inquiries
          </button>

          <button className="logout-button" onClick={handleSecureLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      <div className="main-content">
        <div className="content-header">
          <h1>
            {activeTab === "dashboard"
              ? "Dashboard"
              : activeTab === "properties"
              ? "Property Management"
              : activeTab === "add-property"
              ? "Add New Property"
              : activeTab === "inquiries"
              ? "Inquiry Management"
              : "Dashboard"}
          </h1>
        </div>

        <div className="content-body">{renderContent()}</div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    inquiries: 0,
  });

  useEffect(() => {
    // In a real app, fetch stats from backend
    setStats({
      totalProperties: 24,
      availableProperties: 18,
      soldProperties: 6,
      inquiries: 12,
    });
  }, []);

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaHome />
          </div>
          <div className="stat-info">
            <h3>{stats.totalProperties}</h3>
            <p>Total Properties</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon available">
            <FaHome />
          </div>
          <div className="stat-info">
            <h3>{stats.availableProperties}</h3>
            <p>Available</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sold">
            <FaHome />
          </div>
          <div className="stat-info">
            <h3>{stats.soldProperties}</h3>
            <p>Sold</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inquiries">
            <FaInbox />
          </div>
          <div className="stat-info">
            <h3>{stats.inquiries}</h3>
            <p>New Inquiries</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <p>New property added: Luxury Villa in Beverly Hills</p>
            <span className="time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <p>Inquiry received for Downtown Apartment</p>
            <span className="time">5 hours ago</span>
          </div>
          <div className="activity-item">
            <p>Property status updated: Beachfront Condo marked as Sold</p>
            <span className="time">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Property Management Component
const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    // Fetch properties from backend
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/properties");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleEdit = (property) => {
    setEditingProperty(property);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem("adminToken");

        // Check if token exists
        if (!token) {
          alert("Authentication required. Please log in again.");
          window.location.href = "/admin/login";
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/admin/properties/${propertyId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Remove property from state
          setProperties(properties.filter((prop) => prop.id !== propertyId));
          alert("Property deleted successfully!");
        } else if (response.status === 401) {
          // Unauthorized - token might be expired
          alert("Session expired. Please log in again.");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");
          window.location.href = "/admin/login";
        } else {
          const errorData = await response.json();
          alert(
            `Failed to delete property: ${errorData.message || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Network error. Please check your connection and try again.");
      }
    }
  };

  const handleUpdate = (updatedProperty) => {
    setProperties(
      properties.map((prop) =>
        prop.id === updatedProperty.id ? updatedProperty : prop
      )
    );
    setEditingProperty(null);
  };

  if (loading) {
    return <div>Loading properties...</div>;
  }

  if (editingProperty) {
    return (
      <EditPropertyForm
        property={editingProperty}
        onUpdate={handleUpdate}
        onCancel={() => setEditingProperty(null)}
      />
    );
  }

  return (
    <div className="property-management">
      <table className="properties-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Price</th>
            <th>Status</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{property.location}</td>
              <td>${property.price.toLocaleString()}</td>
              <td>
                <span
                  className={`status-badge ${property.status.toLowerCase()}`}
                >
                  {property.status}
                </span>
              </td>
              <td>{property.property_type}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(property)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(property.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Add Property Form Component
const AddPropertyForm = () => {
  const [propertyData, setPropertyData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    property_type: "House",
    status: "Available",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    images: [],
  });
  const [imageInput, setImageInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageInput(e.target.value);
  };

  const addImage = () => {
    if (imageInput.trim() !== "") {
      setPropertyData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const removeImage = (index) => {
    setPropertyData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      // Check if token exists
      if (!token) {
        alert("Authentication required. Please log in again.");
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/properties",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...propertyData,
            price: parseFloat(propertyData.price),
            bedrooms: parseInt(propertyData.bedrooms) || 0,
            bathrooms: parseInt(propertyData.bathrooms) || 0,
            area_sqft: parseInt(propertyData.area_sqft) || 0,
          }),
        }
      );

      if (response.ok) {
        alert("Property added successfully!");
        // Reset form
        setPropertyData({
          title: "",
          description: "",
          price: "",
          location: "",
          property_type: "House",
          status: "Available",
          bedrooms: "",
          bathrooms: "",
          area_sqft: "",
          images: [],
        });
        setImageInput("");
      } else if (response.status === 401) {
        // Unauthorized - token might be expired
        alert("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to add property"}`);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="add-property-form">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Property Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={propertyData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={propertyData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={propertyData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={propertyData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="property_type">Property Type</label>
            <select
              id="property_type"
              name="property_type"
              value={propertyData.property_type}
              onChange={handleChange}
            >
              <option value="House">House</option>
              <option value="Flat">Flat</option>
              <option value="Plot">Plot</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={propertyData.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Rent">Rent</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={propertyData.bedrooms}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={propertyData.bathrooms}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="area_sqft">Area (sq ft)</label>
            <input
              type="number"
              id="area_sqft"
              name="area_sqft"
              value={propertyData.area_sqft}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="form-group">
          <label htmlFor="image-url">Add Image URLs</label>
          <div className="image-input-group">
            <input
              type="text"
              id="image-url"
              value={imageInput}
              onChange={handleImageChange}
              placeholder="Enter image URL"
            />
            <button type="button" onClick={addImage} className="add-image-btn">
              Add Image
            </button>
          </div>

          {propertyData.images.length > 0 && (
            <div className="image-preview">
              <h4>Added Images:</h4>
              {propertyData.images.map((image, index) => (
                <div key={index} className="image-item">
                  <span>{image}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Add Property
        </button>
      </form>
    </div>
  );
};

// Inquiry Management Component
const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch inquiries from backend
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        // Check if token exists
        if (!token) {
          console.error("Authentication required");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/inquiries",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setInquiries(data);
        } else if (response.status === 401) {
          // Unauthorized - token might be expired
          console.error("Session expired");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");
          window.location.href = "/admin/login";
        } else {
          console.error("Failed to fetch inquiries");
        }
      } catch (error) {
        console.error("Network error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (loading) {
    return <div>Loading inquiries...</div>;
  }

  return (
    <div className="inquiry-management">
      <table className="inquiries-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Property</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id}>
              <td>{inquiry.user_name}</td>
              <td>{inquiry.email}</td>
              <td>{inquiry.phone}</td>
              <td>{inquiry.property ? inquiry.property.title : "N/A"}</td>
              <td>{inquiry.message}</td>
              <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Edit Property Form Component
const EditPropertyForm = ({ property, onUpdate, onCancel }) => {
  const [propertyData, setPropertyData] = useState({
    ...property,
    price: property.price.toString(),
    bedrooms: property.bedrooms?.toString() || "",
    bathrooms: property.bathrooms?.toString() || "",
    area_sqft: property.area_sqft?.toString() || "",
  });
  const [imageInput, setImageInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageInput(e.target.value);
  };

  const addImage = () => {
    if (imageInput.trim() !== "") {
      setPropertyData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const removeImage = (index) => {
    setPropertyData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      // Check if token exists
      if (!token) {
        alert("Authentication required. Please log in again.");
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/properties/${propertyData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...propertyData,
            price: parseFloat(propertyData.price),
            bedrooms: parseInt(propertyData.bedrooms) || 0,
            bathrooms: parseInt(propertyData.bathrooms) || 0,
            area_sqft: parseInt(propertyData.area_sqft) || 0,
          }),
        }
      );

      if (response.ok) {
        const updatedProperty = await response.json();
        onUpdate(updatedProperty);
        alert("Property updated successfully!");
      } else if (response.status === 401) {
        // Unauthorized - token might be expired
        alert("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to update property"}`);
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="add-property-form">
      <h2>Edit Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Property Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={propertyData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={propertyData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={propertyData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={propertyData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="property_type">Property Type</label>
            <select
              id="property_type"
              name="property_type"
              value={propertyData.property_type}
              onChange={handleChange}
            >
              <option value="House">House</option>
              <option value="Flat">Flat</option>
              <option value="Plot">Plot</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={propertyData.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Rent">Rent</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={propertyData.bedrooms}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={propertyData.bathrooms}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="area_sqft">Area (sq ft)</label>
            <input
              type="number"
              id="area_sqft"
              name="area_sqft"
              value={propertyData.area_sqft}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="form-group">
          <label htmlFor="image-url">Add Image URLs</label>
          <div className="image-input-group">
            <input
              type="text"
              id="image-url"
              value={imageInput}
              onChange={handleImageChange}
              placeholder="Enter image URL"
            />
            <button type="button" onClick={addImage} className="add-image-btn">
              Add Image
            </button>
          </div>

          {propertyData.images.length > 0 && (
            <div className="image-preview">
              <h4>Added Images:</h4>
              {propertyData.images.map((image, index) => (
                <div key={index} className="image-item">
                  <span>{image}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Update Property
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
