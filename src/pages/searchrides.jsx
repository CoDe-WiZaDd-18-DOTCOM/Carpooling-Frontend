import React, { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

function SearchRides() {
  const [searchData, setSearchData] = useState({
    pickup: { area: "", city: "", landmark: "" },
    drop: { area: "", city: "", landmark: "" },
    preferredRoute: [],
  });

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
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
      setIsLoading(true);
      setHasSearched(true);
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
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestRide = async (rideId) => {
    try {
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

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedResults = [...results].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const mapTime = (timeStr) => {
        const [hr,min,sec] = timeStr.split(":").map(Number);
        return hr*3600+min*60+sec;
    }

    const valA = sortConfig.key === "arrivalTime"
      ? mapTime(a.routeMatchResult.arrivalTime)
      : a.routeMatchResult.score;
    const valB = sortConfig.key === "arrivalTime"
      ? mapTime(b.routeMatchResult.arrivalTime)
      : b.routeMatchResult.score;
    return sortConfig.direction === "asc" ? valA - valB : valB - valA;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Find a Ride</h2>

      {/* Search Form */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pickup & Drop</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup */}
          <div>
            {["area", "city", "landmark"].map((field, idx) => (
              <div key={idx} className="mb-2">
                <label className="block text-sm text-gray-700 capitalize">{field}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={searchData.pickup[field]}
                  onChange={(e) => handlePickupDropChange("pickup", field, e.target.value)}
                />
              </div>
            ))}
          </div>
          {/* Drop */}
          <div>
            {["area", "city", "landmark"].map((field, idx) => (
              <div key={idx} className="mb-2">
                <label className="block text-sm text-gray-700 capitalize">{field}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={searchData.drop[field]}
                  onChange={(e) => handlePickupDropChange("drop", field, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Stops */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Preferred Stops (Optional)</h3>
          {searchData.preferredRoute.map((stop, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {["area", "city", "landmark"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={stop[field]}
                  onChange={(e) => handlePreferredRouteChange(idx, field, e.target.value)}
                  className="p-2 border rounded"
                />
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={addPreferredStop}
            className="text-emerald-600 font-semibold hover:underline mt-2"
          >
            + Add Stop
          </button>
        </div>

        {/* Search Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSearch}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <Search className="inline mr-2" size={20} />
            Search Rides
          </button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for rides...</p>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-medium mt-6">
          No vehicles available at your pickup point.
        </div>
      ) : results.length > 0 ? (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Matched Rides</h3>
          <div className="overflow-auto">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-semibold">Driver</th>
                  <th className="p-3 font-semibold">Vehicle</th>
                  <th className="p-3 font-semibold cursor-pointer" onClick={() => toggleSort("arrivalTime")}>
                    Arrival Time {sortConfig.key === "arrivalTime" ? (sortConfig.direction === "asc" ? "⬆️" : "⬇️") : ""}
                  </th>
                  <th className="p-3 font-semibold cursor-pointer" onClick={() => toggleSort("score")}>
                    Match % {sortConfig.key === "score" ? (sortConfig.direction === "asc" ? "⬆️" : "⬇️") : ""}
                  </th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((ride) => (
                  <tr key={ride.rideSearchDto.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-3">
                      {ride.rideSearchDto.driver.profileImageBase64 && (
                        <img
                          src={`data:image/jpeg;base64,${ride.rideSearchDto.driver.profileImageBase64}`}
                          alt="Driver"
                          className={`w-10 h-10 rounded-full object-cover border ${
                            ride.status === "APPROVED" ? "" : "blur-sm"
                          }`}
                        />
                      )}
                      <span>
                        {ride.rideSearchDto.driver.firstName} {ride.rideSearchDto.driver.lastName}
                      </span>
                    </td>
                    <td className="p-3">
                      {ride.rideSearchDto.vehicle.brand} {ride.rideSearchDto.vehicle.model}
                    </td>
                    <td className="p-3">{ride.routeMatchResult.arrivalTime}</td>
                    <td className="p-3 font-semibold text-emerald-600">{Math.round(ride.routeMatchResult.score)}%</td>
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
      ) : null}
    </div>
  );
}

export default SearchRides;
