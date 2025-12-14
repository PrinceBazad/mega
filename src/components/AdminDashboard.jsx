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
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
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
    images: [""],
  });
  const [imageInputs, setImageInputs] = useState([""]);

  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
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
        // Mock admin data for now
        setAdmins([
          {
            id: 1,
            name: "Admin User",
            email: "admin@example.com",
            role: "Super Admin",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
      images: property.images || [""],
    });
    setImageInputs(property.images || [""]);
    setShowEditForm(true);
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
      images: [""],
    });
    setImageInputs([""]);
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
            </div>
            <div className="property-info">
              <h3>{property.title}</h3>
              <p className="property-location">{property.location}</p>
              <p className="property-price">
                ${property.price.toLocaleString()}
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
                  <label>Price ($) *</label>
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

  const InquiryManagement = () => (
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
              <th>Property</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{inquiry.id}</td>
                <td>{inquiry.user_name}</td>
                <td>{inquiry.email}</td>
                <td>{inquiry.property_id || "N/A"}</td>
                <td>{inquiry.message}</td>
                <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AdminManagement = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Admin Management</h2>
        <button className="btn-primary">
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
                <td>
                  <button className="btn-edit">
                    <FaEdit /> Edit
                  </button>
                  <button className="btn-delete">
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <h2>Admin Panel</h2>
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

            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {activeTab === "properties" && <PropertyManagement />}
          {activeTab === "inquiries" && <InquiryManagement />}
          {activeTab === "admins" && <AdminManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
