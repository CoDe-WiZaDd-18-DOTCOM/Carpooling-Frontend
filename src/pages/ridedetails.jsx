import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function RideDetails() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchRideData = async () => {
      try {
        const token = localStorage.getItem("AuthToken");

        // Fetch ride details
        const rideRes = await axios.get(`http://localhost:5001/rides/ride/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRide(rideRes.data);

        // Fetch bookings for the ride
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
      const rideRes=await axios.post(`http://localhost:5001/rides/close-ride/${id}`, {}, {
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
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ride Details</h2>

      {/* Ride Info */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {ride.route[0].location.area} ➝ {ride.route[ride.route.length - 1].location.area}
        </h3>
        <p className="text-gray-600 mb-1">Seats: {ride.availableSeats}/{ride.seatCapacity}</p>
        <p className="text-gray-600 mb-1">Status: {ride.status}</p>
        <p className="text-gray-600 mb-1">
          Vehicle: {ride.vehicle.brand} {ride.vehicle.model} ({ride.vehicle.color})
        </p>

        {/* ✅ Close Ride Button */}
        {ride.status !== "CLOSED" && (
          <div className="mt-6">
            <button
              onClick={handleCloseRide}
              disabled={isClosing}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow disabled:opacity-50"
            >
              {isClosing ? "Closing..." : "Close Ride"}
            </button>
            <p className="text-sm text-gray-500 mt-1">
              Close this after completion of ride.
            </p>
          </div>
        )}
      </div>

      {/* Booking Requests */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Booking Requests</h3>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No booking requests yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((wrapper) => {
            const { id: bookingId, bookingRequest } = wrapper;
            const rider = bookingRequest.rider;
            const statusText = bookingRequest.approved ? "APPROVED" : "PENDING";
            const statusClass = bookingRequest.approved ? "text-green-600" : "text-yellow-600";

            return (
              <div
                key={bookingId}
                className="bg-white p-4 rounded-lg shadow border"
              >
                <div className="flex items-center gap-4 mb-2">
                  {rider.profileImageBase64 && (
                    <img
                      src={`data:image/jpeg;base64,${rider.profileImageBase64}`}
                      alt="Rider"
                      className={`w-12 h-12 rounded-full object-cover border ${
                        bookingRequest.approved ? "" : "blur-sm"
                      }`}
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {rider.firstName} {rider.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">Email: {rider.email}</p>
                    <p className="text-sm text-gray-600">Phone: {rider.phoneNumber}</p>
                  </div>
                </div>

                <p className={`text-sm font-medium mt-2 ${statusClass}`}>
                  Status: {statusText}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RideDetails;
