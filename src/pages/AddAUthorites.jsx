import axios from "axios";
import { useState } from "react";

function AddAuthorities() {
  const [formData, setFormData] = useState({
    area: "",
    email: "",
  });

  const [authorities, setAuthorities] = useState();
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addAuth = async () => {
    try {
      const res = await axios.post("/api/authorities", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });

      if (res.status === 200) {
        alert("Successfully added");
        setFormData({ area: "", email: "" });
      }
    } catch (error) {
      console.log(error);
      alert("Failed to add!");
    }
  };

  const fetchAuth = async () => {
    try {
      const res = await axios.get(`/api/authorities/${formData.area}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });

      if (res.status === 200) {
        setAuthorities(res.data);
        setIsVisible(true);
      } else if (res.status === 300) {
        alert("Authorities data not found");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
        Manage SOS Authorities
      </h2>

      {/* Add Authority Form */}
      <section className="bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Authority</h3>
        <div className="flex justify-between">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="input-style"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Authority Email</label>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-style"
                />
            </div>
        </div>

        <button
          onClick={addAuth}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded"
        >
          Submit
        </button>
      </section>

      {/* Fetch Authority */}
      <section className="bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fetch Authority Details</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="input-style"
          />
        </div>
        <button
          onClick={fetchAuth}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded"
        >
          Fetch
        </button>
      </section>

      {/* Display Result */}
      {isVisible && authorities && (
        <section className="bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Authority Details</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <div>
              <strong>Area:</strong> {authorities.area}
            </div>
            <div>
              <strong>City:</strong> {authorities.city}
            </div>
            <div>
              <strong>Email:</strong> {authorities.email}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default AddAuthorities;
