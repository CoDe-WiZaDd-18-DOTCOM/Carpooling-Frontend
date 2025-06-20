import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  const fetchBookingDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/bookings/booking/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });
      setBooking(res.data);
    } catch (err) {
      console.error("Error fetching booking details:", err);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  if (!booking) return <div className="text-center mt-10">Loading...</div>;

  const { ride, pickup, destination, preferredRoute, approved, driver } = booking;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Booking Details</h2>

      <div className="bg-white p-6 rounded-xl shadow-md border space-y-4">
        <h3 className="text-xl font-semibold">Ride Info</h3>
        {/* <p><strong>From:</strong> {ride.pickup.area} ({ride.pickup.city})</p>
        <p><strong>To:</strong> {ride.drop.area} ({ride.drop.city})</p> */}
        <p><strong>Route:</strong> {ride.route.map((stop) => stop.location.area).join(" ➝ ")}</p>
        <p><strong>Seats Available:</strong> {ride.availableSeats} / {ride.seatCapacity}</p>

        <h3 className="text-xl font-semibold mt-6">Driver Info</h3>
        <p><strong>Name:</strong> {driver.firstName} {driver.lastName}</p>
        <p><strong>Email:</strong> {driver.email}</p>
        <p><strong>Phone:</strong> {driver.phoneNumber}</p>

        <h3 className="text-xl font-semibold mt-6">Your Request</h3>
        <p><strong>Status:</strong> {approved ? "APPROVED" : "PENDING"}</p>
        <p><strong>Pickup:</strong> {pickup.area}</p>
        <p><strong>Drop:</strong> {destination.area}</p>
        {preferredRoute && preferredRoute.length > 0 && (
          <p><strong>Preferred Stops:</strong> {preferredRoute.map(stop => stop.area).join(", ")}</p>
        )}
      </div>
    </div>
  );
}

export default BookingDetails;
