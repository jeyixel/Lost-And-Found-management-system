import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LostItemsList.css";

const LostItemsList = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState({
    itemName: "",
    location: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    category: "",
  });
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    lastSeenLocation: "",
    dateLost: "",
    category: "",
    image: null,
  });

  const categories = [
    "Electronics",
    "Books",
    "Clothing",
    "Accessories",
    "Documents",
    "Others",
  ];

  const fetchLostItems = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      );
      const response = await axios.get("http://localhost:5000/api/lost-items", {
        params,
      });
      setLostItems(response.data);
    } catch (err) {
      setError("Error fetching lost items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/lost-items/${itemId}/status`,
        {
          status: newStatus,
        }
      );
      fetchLostItems();
    } catch (err) {
      setError("Error updating item status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData[key] === null && selectedItem?.image) {
          // Don't append image if we're editing and no new image was selected
          return;
        }
        data.append(key, formData[key]);
      });

      if (isEditing && selectedItem) {
        await axios.put(
          `http://localhost:5000/api/lost-items/${selectedItem._id}`,
          data
        );
      } else {
        console.log(data);
        console.log(formData);
        await axios.post("http://localhost:5000/api/lost-items", data);
      }

      fetchLostItems();
      resetForm();
    } catch (err) {
      setError(isEditing ? "Error updating item" : "Error reporting item");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      itemName: item.itemName,
      description: item.description,
      lastSeenLocation: item.lastSeenLocation,
      dateLost: item.dateLost.split("T")[0],
      category: item.category || "",
      image: null,
    });
    setImagePreview(item.image ? `http://localhost:5000/${item.image}` : null);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/lost-items/${id}`);
      fetchLostItems();
    } catch (err) {
      setError("Error deleting item");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: "",
      description: "",
      lastSeenLocation: "",
      dateLost: "",
      category: "",
      image: null,
    });
    setSelectedItem(null);
    setIsEditing(false);
    setImagePreview(null);
  };

  const clearFilters = () => {
    setFilters({
      itemName: "",
      location: "",
      status: "",
      dateFrom: "",
      dateTo: "",
      category: "",
    });
  };

  return (
    <div className="lost-items-container">
      <section className="form-section">
        <h2>{isEditing ? "Edit Lost Item" : "Report Lost Item"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="itemName">Item Name*</label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastSeenLocation">Last Seen Location*</label>
            <input
              type="text"
              id="lastSeenLocation"
              name="lastSeenLocation"
              value={formData.lastSeenLocation}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateLost">Date Lost*</label>
            <input
              type="date"
              id="dateLost"
              name="dateLost"
              value={formData.dateLost}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: null }));
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {isEditing ? "Update Item" : "Submit Report"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="search-section">
        <h2>Search Lost Items</h2>
        <div className="search-header">
          <button
            type="button"
            className="toggle-search-button"
            onClick={() => setAdvancedSearch(!advancedSearch)}
          >
            {advancedSearch ? "Simple Search" : "Advanced Search"}
          </button>
          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        <div className="search-filters">
          <input
            type="text"
            name="itemName"
            placeholder="Search by item name"
            value={filters.itemName}
            onChange={handleFilterChange}
            className="search-input"
          />
          <input
            type="text"
            name="location"
            placeholder="Search by location"
            value={filters.location}
            onChange={handleFilterChange}
            className="search-input"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="search-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>

        {advancedSearch && (
          <div className="advanced-filters">
            <div className="date-filters">
              <div className="form-group">
                <label htmlFor="dateFrom">From Date</label>
                <input
                  type="date"
                  id="dateFrom"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateTo">To Date</label>
                <input
                  type="date"
                  id="dateTo"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="filterCategory">Category</label>
              <select
                id="filterCategory"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="search-select"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      <section className="items-list">
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="lost-items-grid">
            {lostItems.map((item) => (
              <div key={item._id} className="lost-item-card">
                {item.image && (
                  <img
                    src={`http://localhost:5000/${item.image}`}
                    alt={item.itemName}
                    className="item-image"
                  />
                )}
                <div className="item-details">
                  <div className="item-header">
                    <h3>{item.itemName}</h3>
                    <span className="item-category">{item.category}</span>
                  </div>
                  <p className="description">{item.description}</p>
                  <p>
                    <strong>Location:</strong> {item.lastSeenLocation}
                  </p>
                  <p>
                    <strong>Date Lost:</strong>{" "}
                    {new Date(item.dateLost).toLocaleDateString()}
                  </p>

                  <div className="status-section">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      className={`status-select status-${item.status.toLowerCase()}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="found">Found</option>
                      <option value="claimed">Claimed</option>
                    </select>
                  </div>

                  <div className="item-actions">
                    <button
                      onClick={() => handleEdit(item)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {lostItems.length === 0 && (
              <div className="no-items">No lost items found</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default LostItemsList;
