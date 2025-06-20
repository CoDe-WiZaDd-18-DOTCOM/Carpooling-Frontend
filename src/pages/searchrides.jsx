import React, { useState } from "react";
import axios from "axios";
import { MapPin, Search, Percent } from "lucide-react";

function SearchRides() {
  const [searchData, setSearchData] = useState({
    pickup: { area: "", city: "", landmark: "" },
    drop: { area: "", city: "", landmark: "" },
    preferredRoute: [],
  });

  const [results, setResults] = useState([]);
  const [requestedRides, setRequestedRides] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc", 
  });



  const handlePickupDropChange = (type, field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handlePreferredRouteChange = (index, field, value) => {
    const updated = [...searchData.preferredRoute];
    if (!updated[index]) updated[index] = { area: "", city: "", landmark: "" };
    updated[index][field] = value;
    setSearchData({ ...searchData, preferredRoute: updated });
  };

  const addPreferredStop = () => {
    setSearchData({
      ...searchData,
      preferredRoute: [...searchData.preferredRoute, { area: "", city: "", landmark: "" }],
    });
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("AuthToken");

      const response = await axios.post(
        "http://localhost:5001/rides/search",
        {
          pickup: searchData.pickup,
          drop: searchData.drop,
          prefferedRoute: searchData.preferredRoute,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Search response:", response.data); 
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleRequestRide = async (rideId) => {
  try {
    console.log("Sending request for ride ID:", rideId);  
    console.log("Search Data:", searchData);
    const res = await axios.post(
      `http://localhost:5001/bookings/${rideId}/create-request`,
      searchData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      }
    );
    alert("Request sent successfully!");
    handleSearch(); 
  } catch (err) {
    console.error(err);
    alert("Something went wrong while sending the request.");
  }
};


  const sortedResults = [...results].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valA = sortConfig.key === "arrivalTime"
      ? new Date(a.routeMatchResult.arrivalTime)
      : a.routeMatchResult.score;
    const valB = sortConfig.key === "arrivalTime"
      ? new Date(b.routeMatchResult.arrivalTime)
      : b.routeMatchResult.score;

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };



  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Find a Ride</h2>

      {/* Search Form */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pickup & Drop</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Pickup - Area</label>
            <input type="text" className="w-full input" value={searchData.pickup.area}
              onChange={(e) => handlePickupDropChange("pickup", "area", e.target.value)} />
            <label className="block mt-2 text-gray-700">City</label>
            <input type="text" className="w-full input" value={searchData.pickup.city}
              onChange={(e) => handlePickupDropChange("pickup", "city", e.target.value)} />
            <label className="block mt-2 text-gray-700">Landmark</label>
            <input type="text" className="w-full input" value={searchData.pickup.landmark}
              onChange={(e) => handlePickupDropChange("pickup", "landmark", e.target.value)} />
          </div>

          {/* Drop */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Drop - Area</label>
            <input type="text" className="w-full input" value={searchData.drop.area}
              onChange={(e) => handlePickupDropChange("drop", "area", e.target.value)} />
            <label className="block mt-2 text-gray-700">City</label>
            <input type="text" className="w-full input" value={searchData.drop.city}
              onChange={(e) => handlePickupDropChange("drop", "city", e.target.value)} />
            <label className="block mt-2 text-gray-700">Landmark</label>
            <input type="text" className="w-full input" value={searchData.drop.landmark}
              onChange={(e) => handlePickupDropChange("drop", "landmark", e.target.value)} />
          </div>
        </div>

        {/* Preferred Stops */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Preferred Route Stops (Optional)</h3>
          {searchData.preferredRoute.map((stop, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input type="text" placeholder="Area" value={stop.area}
                onChange={(e) => handlePreferredRouteChange(idx, "area", e.target.value)}
                className="input" />
              <input type="text" placeholder="City" value={stop.city}
                onChange={(e) => handlePreferredRouteChange(idx, "city", e.target.value)}
                className="input" />
              <input type="text" placeholder="Landmark" value={stop.landmark}
                onChange={(e) => handlePreferredRouteChange(idx, "landmark", e.target.value)}
                className="input" />
            </div>
          ))}
          <button type="button" onClick={addPreferredStop} className="text-emerald-600 font-semibold hover:underline">
            + Add Stop
          </button>
        </div>

        {/* Search Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700"
          >
            <Search className="inline-block mr-2" size={20} />
            Search Rides
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 ? (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Matched Rides</h3>
          <div className="space-y-4">
            <table className="w-full text-left border-collapse">
  <thead>
    <tr className="bg-gray-100">
      <th className="p-3 font-semibold">Driver</th>
      <th className="p-3 font-semibold">Vehicle</th>
      <th
        className="p-3 font-semibold cursor-pointer"
        onClick={() => toggleSort("arrivalTime")}
      >
        Arrival Time {sortConfig.key === "arrivalTime" ? (sortConfig.direction === "asc" ? "⬆️" : "⬇️") : ""}
      </th>
      <th
        className="p-3 font-semibold cursor-pointer"
        onClick={() => toggleSort("score")}
      >
        Match % {sortConfig.key === "score" ? (sortConfig.direction === "asc" ? "⬆️" : "⬇️") : ""}
      </th>
      <th className="p-3 font-semibold">Status</th>
    </tr>
  </thead>
  <tbody>
    {sortedResults.map((ride) => (
      <tr key={ride.rideSearchDto.id} className="border-t hover:bg-gray-50">
        <td className="p-3">
          {ride.rideSearchDto.driver.firstName} {ride.rideSearchDto.driver.lastName}
        </td>
        <td className="p-3">
          {ride.rideSearchDto.vehicle.brand} {ride.rideSearchDto.vehicle.model}
        </td>
        <td className="p-3">
          {new Date(ride.routeMatchResult.arrivalTime).toLocaleString()}
        </td>
        <td className="p-3 font-semibold text-emerald-600">
          {Math.round(ride.routeMatchResult.score)}%
        </td>
        <td className="p-3">
          {ride.status === "APPROVED" ? (
            <button className="bg-green-500 text-white px-4 py-1 rounded-md" disabled>
              Approved
            </button>
          ) : ride.status === "PENDING" ? (
            <button className="bg-gray-400 text-white px-4 py-1 rounded-md" disabled>
              Request Sent
            </button>
          ) : (
            <button
              className="bg-emerald-500 text-white px-4 py-1 rounded-md hover:bg-emerald-600"
              onClick={() => handleRequestRide(ride.rideSearchDto.id)}
            >
              Request Ride
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg font-medium">
          No vehicles available at your pickup point.
        </div>
      )}

    </div>
  );
}

export default SearchRides;
