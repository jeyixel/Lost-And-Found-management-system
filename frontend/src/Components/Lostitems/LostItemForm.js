import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LostItemForm.css";

const LostItemForm = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    lastSeenLocation: "",
    dateLost: "",
    image: null,
    studentId: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log(`Handling change for ${name}`);

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    console.log("Form submission started");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        console.log(`Appending ${key}: ${formData[key]}`);
        data.append(key, formData[key]);
      });

      const response = await axios.post(
        "http://localhost:5000/api/lost-items",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response received:", response.data);
      setSuccess("Lost item report submitted successfully!");
      setFormData({
        itemName: "",
        description: "",
        lastSeenLocation: "",
        dateLost: "",
        image: null,
        studentId: "",
        status: "pending",
      });
    } catch (err) {
      console.error("Error during form submission:", err);
      setError(err.response?.data?.message || "Error submitting report");
    } finally {
      console.log("Form submission finished");
      setLoading(false);
    }
  };

  return (
    <div className="lost-item-form-container">
      <h2>Report Lost Item</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="lost-item-form">
        <div className="form-group">
          <label htmlFor="itemName">Item Name*</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            placeholder="Enter item name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Provide detailed description of the item"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastSeenLocation">Last Seen Location*</label>
          <input
            type="text"
            id="lastSeenLocation"
            name="lastSeenLocation"
            value={formData.lastSeenLocation}
            onChange={handleChange}
            required
            placeholder="Where did you last see the item?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateLost">Date Lost*</label>
          <input
            type="date"
            id="dateLost"
            name="dateLost"
            value={formData.dateLost}
            onChange={handleChange}
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image of Item</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default LostItemForm;
