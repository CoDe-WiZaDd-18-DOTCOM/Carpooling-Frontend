import React, { useState } from "react";
import axios from "axios";
import { RIDE_URL } from "../utils/apis";

const RideCreate = () => {
  const [route, setRoute] = useState([{ landmark: "", area: "", city: "", arrivalTime: "" }]);
  const [seatCapacity, setSeatCapacity] = useState(1);
  const [vehicle, setVehicle] = useState({
    model: "",
    brand: "",
    licensePlate: "",
    color: "",
  });
  const [preferences, setPreferences] = useState({
    music: "NONE",
    smoking: "NONE",
    petFriendly: "NONE",
    genderBased: "NONE",
    ac: "NONE",
  });
  const [loading, setLoading] = useState(false);

  const addRouteStop = () => {
    setRoute([...route, { landmark: "", area: "", city: "", arrivalTime: "" }]);
  };

  const updateRouteStop = (index, field, value) => {
    const updatedRoute = [...route];
    updatedRoute[index][field] = value;
    setRoute(updatedRoute);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      route: route.map(stop => ({
        location: {
          landmark: stop.landmark,
          area: stop.area,
          city: stop.city,
        },
        arrivalTime: stop.arrivalTime,
      })),
      seatCapacity,
      availableSeats: seatCapacity,
      vehicle,
      preferences,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("AuthToken");
      await axios.post(RIDE_URL, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Ride created successfully!");
    } catch (err) {
      alert("❌ Failed to create ride.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center">Create a Ride</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Route Input */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Route (Start → Stops → End)</h3>
            {route.map((stop, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Landmark"
                  className="input-style"
                  value={stop.landmark}
                  onChange={(e) => updateRouteStop(index, "landmark", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Area"
                  className="input-style"
                  value={stop.area}
                  onChange={(e) => updateRouteStop(index, "area", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="City"
                  className="input-style"
                  value={stop.city}
                  onChange={(e) => updateRouteStop(index, "city", e.target.value)}
                />
                <input
                  type="time"
                  className="input-style"
                  value={stop.arrivalTime}
                  onChange={(e) => updateRouteStop(index, "arrivalTime", e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addRouteStop}
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              + Add Another Stop
            </button>
          </section>

          {/* Vehicle Info */}
          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Vehicle Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["model", "brand", "licensePlate", "color"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="input-style"
                  value={vehicle[field]}
                  onChange={(e) => setVehicle({ ...vehicle, [field]: e.target.value })}
                />
              ))}
            </div>
          </section>

          {/* Seat Capacity */}
          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Seats Available</h3>
            <input
              type="number"
              className="input-style w-24"
              value={seatCapacity}
              min={1}
              max={10}
              onChange={(e) => setSeatCapacity(parseInt(e.target.value))}
            />
          </section>

          {/* Preferences */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["music", "smoking", "petFriendly", "ac"].map((pref) => (
                <div key={pref}>
                  <label className="block text-sm capitalize mb-1">{pref}</label>
                  <select
                    value={preferences[pref]}
                    onChange={(e) => setPreferences({ ...preferences, [pref]: e.target.value })}
                    className="input-style"
                  >
                    <option value="NONE">NONE</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-sm mb-1">Gender Based</label>
                <select
                  value={preferences.genderBased}
                  onChange={(e) =>
                    setPreferences({ ...preferences, genderBased: e.target.value })
                  }
                  className="input-style"
                >
                  <option value="NONE">NONE</option>
                  <option value="MALE_ONLY">MALE ONLY</option>
                  <option value="FEMALE_ONLY">FEMALE ONLY</option>
                </select>
              </div>
            </div>
          </section>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
            disabled={loading}
          >
            {loading ? "Creating Ride..." : "Create Ride"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RideCreate;
