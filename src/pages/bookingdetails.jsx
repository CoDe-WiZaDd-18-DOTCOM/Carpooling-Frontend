import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [sosMessage, setSosMessage] = useState("");
  const [locationText, setLocationText] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);



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

  const handleGetCurrentLocation = () => {
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `Current Location: https://www.google.com/maps?q=${latitude},${longitude}`;
        setSosMessage((prev) => `${prev}\n\n${locationString}`);
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to fetch location. Please allow GPS access.");
        setIsFetchingLocation(false);
      }
    );
  };

  const handleSendSos = async () => {
  try {
    const res = await axios.post(
      `http://localhost:5001/sos/alert/${id}`,
      sosMessage,
      {
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      }
    );
    alert("🚨 SOS alert sent successfully!");
  } catch (error) {
    console.error("SOS send failed:", error);
    alert("Failed to send SOS.");
  }
};


  const handleShareLocation = async () => {
    if (!locationText.trim()) {
      alert("Please enter a location.");
      return;
    }

    try {
      await axios.post(`http://localhost:5001/share-location/${id}`, locationText, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
          "Content-Type": "text/plain"
        },
      });
      alert("📍 Location shared successfully!");
    } catch (error) {
      console.error("Error sharing location:", error);
      alert("Failed to share location.");
    }
  };

  const handleGetCurrentLocationForShare = () => {
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `Current Location: https://www.google.com/maps?q=${latitude},${longitude}`;
        setLocationText(locationString);
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to fetch location. Please allow GPS access.");
        setIsFetchingLocation(false);
      }
    );
  };




  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-20">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight">
        Booking Details
      </h2>

      <div className="bg-white p-8 rounded-2xl shadow-lg border space-y-8">
        {/* Ride Info */}
        <section>
          <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Ride Info</h3>
          <div className="space-y-1 text-gray-700">
            <p><strong>Route:</strong> {ride.route.map((stop) => stop.location.area).join(" ➝ ")}</p>
            <p><strong>Seats Available:</strong> {ride.availableSeats} / {ride.seatCapacity}</p>
          </div>
        </section>

        {/* Driver Info */}
        <section>
          <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Driver Info</h3>
          <div className="flex items-center gap-4 mb-3">
            {approved && driver.profileImageBase64 && (
              <img
                src={`data:image/jpeg;base64,${driver.profileImageBase64}`}
                alt="Driver Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
            )}
            <div className="text-gray-700 space-y-1">
              <p><strong>Name:</strong> {driver.firstName} {driver.lastName}</p>
              <p><strong>Email:</strong> {driver.email}</p>
              <p><strong>Phone:</strong> {driver.phoneNumber}</p>
            </div>
          </div>
        </section>

        {/* Status */}
        <section>
          <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Your Request</h3>
          <p className="text-gray-700">
            <strong>Status:</strong>{" "}
            <span className="font-medium text-green-600">APPROVED</span>
          </p>
        </section>

        {/* SOS */}
        <section>
          <h3 className="text-xl font-semibold text-red-600">Send SOS Alert</h3>
          <textarea
            rows={4}
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800"
            placeholder="Type your emergency message..."
            value={sosMessage}
            onChange={(e) => setSosMessage(e.target.value)}
          />
          <div className="flex flex-wrap gap-3 mt-3">
            <button
              onClick={handleGetCurrentLocation}
              disabled={isFetchingLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isFetchingLocation ? "Fetching..." : "📍 Use My Location"}
            </button>
            <button
              onClick={handleSendSos}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              🚨 Send SOS
            </button>
          </div>
        </section>

        {/* Share Location */}
        <section>
          <h3 className="text-xl font-semibold text-emerald-700">Live Location Sharing</h3>
          <input
            type="text"
            placeholder="Enter or use your current location"
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-800"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
          />
          <div className="flex flex-wrap gap-3 mt-3">
            <button
              onClick={handleGetCurrentLocationForShare}
              disabled={isFetchingLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isFetchingLocation ? "Fetching..." : "📍 Use My Location"}
            </button>
            <button
              onClick={handleShareLocation}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
            >
              📤 Share Location
            </button>
          </div>
        </section>

        {/* Pickup & Drop */}
        <section className="text-gray-700 space-y-1">
          <p><strong>Pickup:</strong> {pickup.area}</p>
          <p><strong>Drop:</strong> {destination.area}</p>
          {preferredRoute && preferredRoute.length > 0 && (
            <p><strong>Preferred Stops:</strong> {preferredRoute.map(stop => stop.area).join(", ")}</p>
          )}
        </section>
      </div>
    </div>

  );
}

export default BookingDetails;
