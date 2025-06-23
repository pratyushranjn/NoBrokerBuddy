import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    rent: "",
    isVacant: true,
  });

  const [initialData, setInitialData] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: "", text: "" }), 1500);
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/listings/${id}`, {
          withCredentials: true,
        });

        const listing = {
          title: res.data.title || "",
          description: res.data.description || "",
          city: res.data.city || "",
          rent: res.data.rent || "",
          isVacant: res.data.isVacant || false,
        };
        setFormData(listing);
        setInitialData(listing);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
        showMessage("error", "Failed to load listing.");
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Compare changes
    if (JSON.stringify(formData) === JSON.stringify(initialData)) {
      showMessage("info", "No changes made.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/listings/updatelisting/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`  
          }
        }
      );
      showMessage("success", "Listing updated!");
      setTimeout(() => navigate("/account/view"), 1500);
    } catch (error) {
      console.error("Update failed:", error);
      showMessage("error", "Failed to update listing.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Edit Listing</h2>

      {statusMessage.text && (
        <div
          className={`mb-4 p-3 rounded text-sm font-medium ${statusMessage.type === "success"
            ? "bg-green-100 text-green-700"
            : statusMessage.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
            }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="number"
          name="rent"
          placeholder="Rent"
          value={formData.rent}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isVacant"
            checked={formData.isVacant}
            onChange={handleChange}
          />
          <label>Currently Vacant?</label>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditListing;