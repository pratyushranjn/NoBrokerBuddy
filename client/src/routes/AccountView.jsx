import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Pencil, Trash2, MapPin } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AccountView = () => {
  const [userListings, setUserListings] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [initialUserInfo, setInitialUserInfo] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showMessage = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: "", text: "" }), 3000);
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/me`, {
          withCredentials: true,
        });

        const user = res.data.user;
        setUserListings(user.listings);

        const fetchedData = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          city: user.location || "",
        };

        setUserInfo(fetchedData);
        setInitialUserInfo(fetchedData);
      } catch (error) {
        console.error("Failed to fetch user listings:", error);
        showMessage("error", "Failed to load profile.");
      }
    };

    fetchUserListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/listings/deletelisting/${id}`, {
        withCredentials: true,
      });

      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
      showMessage("success", "Listing deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      showMessage("error", "Failed to delete listing.");
    }
  };


  const updateUser = async (e) => {
    e.preventDefault();

    if (JSON.stringify(userInfo) === JSON.stringify(initialUserInfo)) {
      showMessage("info", "No changes made.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${BASE_URL}/api/user/update-profile`, userInfo, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser((prev) => ({ ...prev, ...userInfo }));
      
      setUserInfo(userInfo);
      setInitialUserInfo(userInfo);

      showMessage("success", "Profile updated!");
    } catch (error) {
      console.error("Update failed:", error);
      if (error.response?.status === 409) {
        showMessage("error", "Email is already in use.");
      } else {
        showMessage("error", "Something went wrong.");
      }
    }
  };


  const updatePassword = async (e) => {
    e.preventDefault();
    const { current, new: newPass, confirm } = passwords;

    if (!current || !newPass || !confirm) {
      showMessage("error", "Please fill in all password fields.");
      return;
    }

    if (newPass !== confirm) {
      showMessage("error", "New passwords do not match.");
      return;
    }


    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/user/update-password`, {
        currentPassword: current,
        newPassword: newPass,
      }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showMessage("success", "Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswordForm(false);
    } catch (error) {
      console.error("Password update failed:", error);
      showMessage(
        "error",
        error.response?.data?.message || "Failed to update password."
      );
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-11">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">My Account</h2>

      {statusMessage.text && (
        <div
          className={`mb-5 p-3 rounded-lg text-sm font-medium ${statusMessage.type === "success"
            ? "bg-green-100 text-green-700"
            : statusMessage.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
            }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Edit Profile */}
      <div className="bg-white border rounded-lg shadow-sm p-6 mb-5">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Edit Profile</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={updateUser}>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border px-4 py-2 rounded text-sm"
          />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="border px-4 py-2 rounded text-sm"
          />
          <input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border px-4 py-2 rounded text-sm"
          />
          <input
            type="text"
            name="city"
            value={userInfo.city}
            onChange={handleChange}
            placeholder="City"
            className="border px-4 py-2 rounded text-sm"
          />
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Toggle password section */}
        <div className="mt-6">
          <button
            onClick={() => setShowPasswordForm((prev) => !prev)}
            className="text-indigo-600 font-medium hover:underline text-sm"
          >
            {showPasswordForm ? "Cancel Password Change" : "Change Password"}
          </button>
        </div>
      </div>

      {/* Password Form - Conditionally shown */}
      {showPasswordForm && (
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-5">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Change Password</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={updatePassword}>
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="border px-4 py-2 rounded text-sm"
            />
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="border px-4 py-2 rounded text-sm"
            />
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              className="border px-4 py-2 rounded text-sm"
            />
            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listings */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">My Listings</h3>
        {userListings.length === 0 ? (
          <p className="text-gray-500">You haven’t posted any listings yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => navigate(`/listing/${listing._id}`)}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition flex gap-4 cursor-pointer bg-white"
              >
                <img
                  src={listing.images?.[0]?.url || "/default-placeholder.jpg"}
                  alt={listing.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-800">{listing.title}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} /> {listing.city}
                  </p>
                  <p className="text-green-600 font-semibold text-sm mt-1">₹ {listing.rent}</p>
                  <div className="flex gap-4 mt-2 text-sm" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/edit-listing/${listing._id}`)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountView;
