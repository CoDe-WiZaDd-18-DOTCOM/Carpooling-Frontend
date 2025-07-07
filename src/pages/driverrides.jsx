import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function DriverRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        console.error("Failed to fetch driver rides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-6 md:px-20">
      <h2 className="text-4xl font-bold text-emerald-700 mb-10 text-center">My Created Rides</h2>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
        </div>
      ) : rides.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">You haven’t created any rides yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rides.map(({ id, ride }) => {
            const from = ride.route[0]?.location?.label || "Start";
            const to = ride.route[ride.route.length - 1]?.location?.label || "End";

            // console.log(from+" "+to);


            return (
              <div
                key={id}
                className="bg-white border border-emerald-100 shadow hover:shadow-lg rounded-2xl p-6 transition-transform hover:scale-[1.01] cursor-pointer"
                onClick={() => navigate(`/ride-details/${id}`)}
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {from} <span className="text-emerald-600">➝</span> {to}
                  </h3>
                  <div className="text-sm text-gray-500">
                    <p>Seats: <span className="font-medium text-gray-700">{ride.availableSeats} / {ride.seatCapacity}</span></p>
                    <p>Status: 
                      <span
                        className={`ml-2 font-semibold ${
                          ride.status === "ACTIVE"
                            ? "text-green-600"
                            : ride.status === "INACTIVE"
                            ? "text-gray-500"
                            : "text-yellow-600"
                        }`}
                      >
                        {ride.status}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/ride-details/${id}`);
                      }}
                      className="text-sm font-medium text-emerald-600 hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
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
