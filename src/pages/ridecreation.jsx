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
      const token = localStorage.getItem("AuthToken"); 
      await axios.post(RIDE_URL, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Ride created successfully!");
    } catch (err) {
      alert("Failed to create ride.");
      console.error(err);
    }
    console.log("Ride Data:", requestBody);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create a Ride</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Route Input */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Route (Start → Stops → End)</h3>
          {route.map((stop, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Landmark"
                className="p-2 border rounded"
                value={stop.landmark}
                onChange={(e) => updateRouteStop(index, "landmark", e.target.value)}
              />
              <input
                type="text"
                placeholder="Area"
                className="p-2 border rounded"
                value={stop.area}
                onChange={(e) => updateRouteStop(index, "area", e.target.value)}
              />
              <input
                type="text"
                placeholder="City"
                className="p-2 border rounded"
                value={stop.city}
                onChange={(e) => updateRouteStop(index, "city", e.target.value)}
              />
              <input
                type="time"
                className="p-2 border rounded"
                value={stop.arrivalTime}
                onChange={(e) => updateRouteStop(index, "arrivalTime", e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addRouteStop}
            className="text-emerald-600 hover:underline mt-2"
          >
            + Add Stop
          </button>
        </div>

        {/* Vehicle Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Vehicle Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Model"
              className="p-2 border rounded"
              value={vehicle.model}
              onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
            />
            <input
              type="text"
              placeholder="Brand"
              className="p-2 border rounded"
              value={vehicle.brand}
              onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
            />
            <input
              type="text"
              placeholder="License Plate"
              className="p-2 border rounded"
              value={vehicle.licensePlate}
              onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value })}
            />
            <input
              type="text"
              placeholder="Color"
              className="p-2 border rounded"
              value={vehicle.color}
              onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
            />
          </div>
        </div>

        {/* Seat Capacity */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Seats</h3>
          <input
            type="number"
            className="p-2 border rounded w-24"
            value={seatCapacity}
            min={1}
            max={10}
            onChange={(e) => setSeatCapacity(parseInt(e.target.value))}
          />
        </div>

        {/* Preferences */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["music", "smoking", "petFriendly", "ac"].map((pref) => (
              <div key={pref}>
                <label className="block text-sm capitalize mb-1">{pref}</label>
                <select
                  value={preferences[pref]}
                  onChange={(e) => setPreferences({ ...preferences, [pref]: e.target.value })}
                  className="p-2 border rounded w-full"
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
                onChange={(e) => setPreferences({ ...preferences, genderBased: e.target.value })}
                className="p-2 border rounded w-full"
              >
                <option value="NONE">NONE</option>
                <option value="MALE_ONLY">MALE ONLY</option>
                <option value="FEMALE_ONLY">FEMALE ONLY</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all"
        >
          Create Ride
        </button>
      </form>
    </div>
  );
};

export default RideCreate;
