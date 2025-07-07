import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Car, Clock, MapPin, Users, ShieldCheck } from "lucide-react";

function RideDetails() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    const fetchRideData = async () => {
      try {
        const token = localStorage.getItem("AuthToken");

        const rideRes = await axios.get(`http://localhost:5001/rides/ride/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRide(rideRes.data);

        const bookingsRes = await axios.get(`http://localhost:5001/bookings/booking/by-ride/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error("Error fetching ride or bookings:", error);
      }
    };

    fetchRideData();
  }, [id]);

  const handleCloseRide = async () => {
    try {
      setIsClosing(true);
      const token = localStorage.getItem("AuthToken");
      const rideRes = await axios.post(`http://localhost:5001/rides/close-ride/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRide(rideRes.data);
    } catch (error) {
      console.error("Failed to close ride:", error);
    } finally {
      setIsClosing(false);
    }
  };

  if (!ride) {
    return <p className="text-center text-gray-500 py-10">Loading ride details...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-indigo-50 py-10 px-6 md:px-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">🚘 Ride Overview</h2>

        {/* Ride Summary Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 border-l-4 border-emerald-500">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
              <MapPin className="text-emerald-500" /> Full Route
            </h3>
            <ol className="mt-4 ml-5 space-y-3 text-gray-700 list-decimal">
              {ride.route.map((stop, idx) => (
                <li key={idx}>
                  <p className="font-medium">{stop.location.label}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {stop.arrivalTime}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <p className="flex items-center gap-2">
              <Users className="text-emerald-500" /> Seats:{" "}
              <span className="font-semibold">
                {ride.availableSeats}/{ride.seatCapacity}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" /> Status:{" "}
              <span className={`font-semibold ${ride.status === "OPEN" ? "text-green-600" : "text-gray-600"}`}>
                {ride.status}
              </span>
            </p>
            <p className="flex items-center gap-2 col-span-2">
              <Car className="text-emerald-500" />
              Vehicle:{" "}
              <span className="font-semibold">
                {ride.vehicle.brand} {ride.vehicle.model} ({ride.vehicle.color})
              </span>
            </p>
          </div>

          {/* Ride Preferences */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Ride Preferences</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">🎵 Music: {ride.preferences.music}</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">❄️ AC: {ride.preferences.ac}</span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">🚬 Smoking: {ride.preferences.smoking}</span>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">🐾 Pet-Friendly: {ride.preferences.petFriendly}</span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">🚻 Gender: {ride.preferences.genderBased}</span>
            </div>
          </div>


          {ride.status !== "CLOSED" && (
            <div className="mt-8 text-right">
              <button
                onClick={handleCloseRide}
                disabled={isClosing}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow font-semibold disabled:opacity-50"
              >
                {isClosing ? "Closing..." : "Close Ride"}
              </button>
              <p className="text-xs text-gray-500 mt-1">Click after ride is complete.</p>
            </div>
          )}
        </div>

        {/* Booking Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-indigo-500">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">📬 Booking Requests</h3>

          {bookings.length === 0 ? (
            <p className="text-gray-500">No booking requests yet.</p>
          ) : (
            <div className="grid gap-6">
              {bookings.map(({ id: bookingId, bookingRequest }) => {
                const { rider, approved } = bookingRequest;
                const status = approved ? "APPROVED" : "PENDING";
                const statusColor = approved ? "text-green-600" : "text-yellow-600";

                const handleApprove = async (bookingId) => {
                  try {
                    setApprovingId(bookingId); // 🆕
                    await axios.post(`http://localhost:5001/bookings/${bookingId}/approve`, {}, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
                      },
                    });

                    setBookings((prev) =>
                      prev.map((b) =>
                        b.id === bookingId ? { ...b, bookingRequest: { ...b.bookingRequest, approved: true } } : b
                      )
                    );
                  } catch (error) {
                    console.error("Failed to approve booking:", error);
                    alert("Something went wrong while approving. Try again.");
                  } finally {
                    setApprovingId(null); 
                  }
                };


                return (
                  <div
                    key={bookingId}
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    {rider.profileImageBase64 && (
                      <img
                        src={`data:image/jpeg;base64,${rider.profileImageBase64}`}
                        alt="Rider"
                        className={`w-14 h-14 rounded-full object-cover border ${
                          approved ? "" : "blur-sm"
                        }`}
                      />
                    )}

                    <div className="flex-1 w-full">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {rider.firstName} {rider.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">📧 {rider.email}</p>
                      <p className="text-sm text-gray-600">📞 {rider.phoneNumber}</p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          🎵 Music: {rider.preferences.music}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          ❄️ AC: {rider.preferences.ac}
                        </span>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          🚬 Smoking: {rider.preferences.smoking}
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          🐾 Pet-Friendly: {rider.preferences.petFriendly}
                        </span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          🚻 Gender: {rider.preferences.genderBased}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <span className={`text-sm font-bold ${statusColor}`}>Status: {status}</span>
                      {!approved && (
                        <button
                          onClick={() => handleApprove(bookingId)}
                          disabled={approvingId === bookingId}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded-md font-semibold disabled:opacity-60"
                        >
                          {approvingId === bookingId ? "Approving..." : "Approve"}
                        </button>
                      )}

                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RideDetails;
