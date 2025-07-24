import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { RIDE_URL } from "../utils/apis";
import LocationSearchInput from "./LocationSearchInput";
import { Route } from "lucide-react";

const RideCreate = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const isUpdate = !!rideId;

  const [route, setRoute] = useState([{ location: null, arrivalTime: "" }]);
  const [seatCapacity, setSeatCapacity] = useState(1);
  const [availableSeats, setAvailableSeats] = useState(1);
  const [version,setVersion] = useState(0);
  const [vehicle, setVehicle] = useState({ model: "", brand: "", licensePlate: "", color: "" });
  const [preferences, setPreferences] = useState({
    music: "NONE",
    smoking: "NONE",
    petFriendly: "NONE",
    genderBased: "NONE",
    ac: "NONE",
  });
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");

  // Pre-fill fields if updating
  useEffect(() => {
    console.log(isUpdate);
    if (isUpdate) {
      setLoading(true);
      axios.get(`${RIDE_URL}/ride/${rideId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("AuthToken")}` },
      })
      .then(res => {
        const d = res.data;
        console.log("ride data:",d);
        setRoute(d.route ?? [{ location: null, arrivalTime: "" }]);
        setSeatCapacity(d.seatCapacity ?? 1);
        setVehicle(d.vehicle ?? { model: "", brand: "", licensePlate: "", color: "" });
        setPreferences(d.preferences ?? {
          music: "NONE", smoking: "NONE", petFriendly: "NONE", genderBased: "NONE", ac: "NONE",
        });
        setAvailableSeats(d.availableSeats);
        setVersion(d.version);
      })
      .catch(() => alert("Failed to fetch ride data"))
      .finally(() => {
        setLoading(false);
      });
    }
  }, [isUpdate, rideId]);

  const addRouteStop = () => {
    setRoute([...route, { location: null, arrivalTime: "" }]);
  };

  const updateRouteStop = (idx, key, value) => {
    const updated = [...route];
    updated[idx][key] = value;
    setRoute(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      route: route.map(s => ({ location: s.location, arrivalTime: s.arrivalTime })),
      seatCapacity,
      availableSeats: isUpdate?availableSeats:seatCapacity,
      vehicle,
      preferences,
      version,
      city,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("AuthToken");
      if (isUpdate) {
        try {
          console.log(requestBody);
          const res=await axios.put(`${RIDE_URL}/${rideId}`, requestBody, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("✅ Ride updated successfully!");
          console.log(res.data);
        } catch (err) {
          if (err?.response?.status === 409) {
            alert("❌ Update failed: this ride was updated by someone else. Please reload and try again.");
          } else {
            alert("❌ Failed to update ride.");
          }
        }
      } else {
        console.log(requestBody);
        await axios.post(RIDE_URL, requestBody, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Ride created successfully!");
      }
      navigate("/driver-rides");
    } catch (err) {
      alert(isUpdate ? "❌ Failed to update ride." : "❌ Failed to create ride.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center">
          {isUpdate ? "Update Ride" : "Create a Ride"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Route Input */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Route (Start → Stops → End)</h3>
            {route.map((stop, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LocationSearchInput
                  value={stop.location}
                  onSelect={(loc,city) => {
                    updateRouteStop(index, "location", loc);
                    if(index===0) setCity(city);
                  }}
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

          {isUpdate && (
              <section>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Seats Available</h3>
                <input
                  type="number"
                  className="input-style w-24"
                  value={availableSeats}
                  min={1}
                  max={10}
                  onChange={(e) => setAvailableSeats(parseInt(e.target.value))}
                />
              </section>
            )
          }

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
            {loading ? (isUpdate ? "Updating..." : "Creating Ride...") : (isUpdate ? "Update Ride" : "Create Ride")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RideCreate;

    
