import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DriverRides() {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await axios.get("http://localhost:5001/rides/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
          },
        });
        setRides(res.data);
        console.log("Fetched rides:", res.data);
      } catch (err) {
        console.error("Failed to fetch driver rides:", err);
      }
    };

    fetchRides();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Rides</h2>

      {rides.length === 0 ? (
        <p className="text-center text-gray-500">No rides created yet.</p>
      ) : (
        <div className="space-y-6">
          {rides.map((wrapper) => {
            const { id, ride } = wrapper;
            return (
              <div
                key={id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border cursor-pointer transition"
                onClick={() => navigate(`/ride-details/${id}`)}
                >
                <div className="flex justify-between items-start">
                    <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                        {ride.route[0]?.location?.area} ➝ {ride.route[ride.route.length - 1]?.location?.area}
                    </h3>
                    <p className="text-gray-600 mt-1">
                        Seats: {ride.availableSeats}/{ride.seatCapacity}
                    </p>
                    <p className="text-sm text-gray-500">Status: {ride.status}</p>
                    </div>

                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/ride-details/${id}`);
                    }}
                    className="text-emerald-600 font-semibold hover:underline"
                    >
                    View Details
                    </button>
                </div>
                </div>

              
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DriverRides;
