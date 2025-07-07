import axios from "axios";
import { useState } from "react";
import LocationSearchInput from "./LocationSearchInput";

function AddAuthorities() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [email, setEmail] = useState("");
  const [authorities, setAuthorities] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const addAuth = async () => {
    if (!selectedLocation || !email) {
      alert("Please select a location and provide an email.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5001/sos/authority",
        {
          label: selectedLocation.label,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
          },
        }
      );

      if (res.status === 200) {
        alert("✅ Successfully added");
        setSelectedLocation(null);
        setEmail("");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add!");
    }
  };

  const fetchAuth = async () => {
    if (!selectedLocation) {
      alert("Please select a location.");
      return;
    }

    try {
      const res = await axios.get(`/api/authorities/${selectedLocation.label}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });

      if (res.status === 200) {
        setAuthorities(res.data);
        setIsVisible(true);
      } else {
        alert("Authorities data not found.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select City (via Nominatim)
          </label>
          <LocationSearchInput onSelect={setSelectedLocation} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Authority Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-style w-full"
          />
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Fetch Authority Details
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select City (via Nominatim)
          </label>
          <LocationSearchInput onSelect={setSelectedLocation} />
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
