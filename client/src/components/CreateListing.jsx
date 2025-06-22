import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Image as ImageIcon, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    rent: '',
    isVacant: true,
    images: [], 
  });

  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - formData.images.length);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // set loading to true for animation

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('rent', formData.rent);
      formDataToSend.append('isVacant', formData.isVacant);

      formData.images?.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await axios.post(`${BASE_URL}/api/listings/newlisting`, formDataToSend, {
        withCredentials: true,
      });

      toast.success("Your location has been listed successfully!");
      setTimeout(() => navigate('/account/view'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false); // set loading to false regardless of success or failure
    }
  };


  return (

    <div className="pt-20 px-4 max-w-2xl mx-auto mb-28">
      <ToastContainer position="top-center" autoClose={2000} />

      <h2 className="text-2xl font-bold mb-4">List Your Space</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="address"
          type="text"
          placeholder="Location"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="city"
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="rent"
          type="number"
          placeholder="Monthly Rent (INR)"
          value={formData.rent}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          min="0"
        />

        <div>
          <label className="block font-medium mb-1">Upload Images (max 5)</label>
          {formData.images?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative border rounded p-1">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="h-16 w-16 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition"
            >
              <ImageIcon size={18} />
              {formData.images?.length > 0 ? 'Add More Images' : 'Select Images'}
            </button>
            <span className="ml-2 text-sm text-gray-500">
              {formData.images?.length || 0} / 5 selected
            </span>
          </div>

          <input
            ref={fileInputRef}
            name="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            name="isVacant"
            type="checkbox"
            checked={formData.isVacant}
            onChange={handleChange}
          />
          <label>Currently Vacant?</label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white transition duration-200 ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Listing'
          )}
        </button>

      </form>
    </div>
  );
};

export default CreateListing;
