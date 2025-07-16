import React, { useEffect, useState } from "react";
import axios from "axios";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount,setRatingCount] = useState(0);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5001/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });
      console.log(res.data);
      setUser(res.data);
      setForm(res.data);
      // fetchAverageRating(res.data.email); // Fetch rating after user is loaded
      setAverageRating(res.data.rating);
      setRatingCount(res.data.ratingCount);
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const fetchAverageRating = async (email) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/reviews/average-rating",
        {email},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      setAverageRating(res.data);
    } catch (err) {
      console.error("Error fetching average rating", err);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handlePreferenceChange = (field, value) => {
    setForm({
      ...form,
      preferences: {
        ...form.preferences,
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:5001/users/me", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await axios.post("http://localhost:5001/users/upload-picture", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setEditMode(false);
      setSelectedFile(null);
      fetchUser();
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-emerald-600">My Profile</h2>
          {averageRating !== null && ratingCount!==0 &&(
            <div className="mt-1 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={`text-xl ${i <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating} / 5
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                averageRating >= 4.5
                  ? "bg-green-100 text-green-700"
                  : averageRating >= 3.5
                  ? "bg-emerald-100 text-emerald-700"
                  : averageRating >= 2.5
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {averageRating >= 4.5
                  ? "Excellent"
                  : averageRating >= 3.5
                  ? "Good"
                  : averageRating >= 2.5
                  ? "Average"
                  : "Poor"}
              </span>
            </div>
          )}

          {ratingCount===0 && (
            <p>user is not yet rated</p>
          )}

        </div>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center gap-4 mb-6">
        {user.profileImageBase64 ? (
          <img
            src={`data:image/jpeg;base64,${user.profileImageBase64}`}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border shadow-md"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        {editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="text-sm"
          />
        )}
      </div>

      {/* User Info Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-600 font-medium">First Name</label>
            <input
              type="text"
              value={form.firstName}
              disabled={!editMode}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 ${
                editMode ? "focus:ring-emerald-500" : "bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="text-gray-600 font-medium">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              disabled={!editMode}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 ${
                editMode ? "focus:ring-emerald-500" : "bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="text-gray-600 font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="text-gray-600 font-medium">Phone</label>
            <input
              type="tel"
              value={form.phoneNumber}
              disabled={!editMode}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 ${
                editMode ? "focus:ring-emerald-500" : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="text-gray-600 font-medium">Emergency Email</label>
            <input
              type="email"
              value={form.emergencyEmail || ""}
              disabled={!editMode}
              onChange={(e) => handleChange("emergencyEmail", e.target.value)}
              className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 ${
                editMode ? "focus:ring-emerald-500" : "bg-gray-100"
              }`}
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-emerald-600 mt-6 mb-2">Preferences</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["music", "smoking", "petFriendly", "ac"].map((field) => (
            <div key={field}>
              <label className="text-gray-600 capitalize">{field}</label>
              <select
                value={form.preferences?.[field] || "NONE"}
                onChange={(e) => handlePreferenceChange(field, e.target.value)}
                disabled={!editMode}
                className={`w-full mt-1 p-3 border rounded-lg ${
                  editMode ? "focus:ring-emerald-500" : "bg-gray-100"
                }`}
              >
                <option value="NONE">None</option>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
            </div>
          ))}
          <div>
            <label className="text-gray-600">Gender Preference</label>
            <select
              value={form.preferences?.genderBased || "NONE"}
              onChange={(e) => handlePreferenceChange("genderBased", e.target.value)}
              disabled={!editMode}
              className={`w-full mt-1 p-3 border rounded-lg ${
                editMode ? "focus:ring-emerald-500" : "bg-gray-100"
              }`}
            >
              <option value="NONE">None</option>
              <option value="MALE_ONLY">Male Only</option>
              <option value="FEMALE_ONLY">Female Only</option>
            </select>
          </div>
        </div>

        <div className="text-center mt-6">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium shadow-md"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-md"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setForm(user);
                  setSelectedFile(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
