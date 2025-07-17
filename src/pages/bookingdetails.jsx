import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [sosMessage, setSosMessage] = useState("");
  const [locationText, setLocationText] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);





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

  const fetchReviewStatus = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5001/reviews/check",
      id, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
          "Content-Type": "text/plain", // Important for sending raw string in POST
        },
      }
    );
    setReviewSubmitted(res.data === true);
  } catch (err) {
    console.error("Failed to check review status:", err);
  }
};


  useEffect(() => {
  fetchBookingDetails();
  fetchReviewStatus();
}, []);


  const handleSubmitReview = async () => {
  if (!comment.trim()) {
    alert("Please enter a comment.");
    return;
  }

  setIsSubmittingReview(true);

  try {
    const res = await axios.post(
      "http://localhost:5001/reviews/submit",
      {
        // reviewerEmail: localStorage.getItem("email"),
        revieweeEmail: driver.email,
        rating,
        comment,
        bookingId:id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      }
    );

    alert("✅ Review submitted successfully!");
    setReviewSubmitted(true);

  } catch (error) {
    console.error("Failed to submit review:", error);
    alert("Failed to submit review.");
  } finally {
    setIsSubmittingReview(false);
  }
};


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
        <section className="bg-white rounded-xl shadow-md border border-emerald-200 p-6 space-y-3">
          <h3 className="text-2xl font-bold text-emerald-700 mb-2 flex items-center gap-2">🛣️ Ride Info</h3>
          <p className="text-gray-700"><strong>Route:</strong> <span className="text-gray-800">{ride.route.map((stop) => stop.location.label).join(" ➝ ")}</span></p>
          <p className="text-gray-700"><strong>Seats Available:</strong> <span className="text-gray-800">{ride.availableSeats} / {ride.seatCapacity}</span></p>
        </section>


        {/* Driver Info */}
        <section className="bg-white rounded-xl shadow-md border border-emerald-200 p-6 space-y-3">
        <h3 className="text-2xl font-bold text-emerald-700 mb-4 flex items-center gap-2">👨‍✈️ Driver Info</h3>
        <div className="flex items-center gap-6">
          {approved && driver.profileImageBase64 && (
            <img
              src={`data:image/jpeg;base64,${driver.profileImageBase64}`}
              alt="Driver Profile"
              className="w-20 h-20 rounded-full object-cover border shadow"
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
        <section className="bg-white rounded-xl shadow-md border border-emerald-200 p-6">
          <h3 className="text-2xl font-bold text-emerald-700 mb-3">📄 Your Booking Status</h3>
          <p className="text-gray-700">
            <strong>Status:</strong>{" "}
            <span className="font-bold text-green-600">{approved ? "APPROVED" : "PENDING"}</span>
          </p>
        </section>


        {ride.status === "CLOSED" ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-4 rounded-md">
            🚗 This ride has been <strong>completed</strong>. SOS and location sharing features are disabled.
          </div>
        ) : (
          <>
            {/* SOS */}
            <section className="bg-white rounded-xl shadow-md border border-red-200 p-6">
              <h3 className="text-2xl font-bold text-red-600 mb-3">🚨 SOS Emergency Alert</h3>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 text-gray-800 bg-red-50 shadow-sm"
                placeholder="Describe your emergency..."
                value={sosMessage}
                onChange={(e) => setSosMessage(e.target.value)}
              />
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isFetchingLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition disabled:opacity-50"
                >
                  {isFetchingLocation ? "Fetching..." : "📍 Use My Location"}
                </button>
                <button
                  onClick={handleSendSos}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow transition"
                >
                  🚨 Send SOS
                </button>
              </div>
            </section>


            {/* Share Location */}
            <section className="bg-white rounded-xl shadow-md border border-emerald-200 p-6">
              <h3 className="text-2xl font-bold text-emerald-700 mb-3">📍 Share Your Location</h3>
              <input
                type="text"
                placeholder="Enter or use your current location"
                className="w-full px-4 py-3 border rounded-xl shadow-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500 text-gray-800"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={handleGetCurrentLocationForShare}
                  disabled={isFetchingLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition disabled:opacity-50"
                >
                  {isFetchingLocation ? "Fetching..." : "📍 Use My Location"}
                </button>
                <button
                  onClick={handleShareLocation}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md shadow transition"
                >
                  📤 Share Location
                </button>
              </div>
            </section>

          </>
        )}

        {ride.status === "CLOSED" && !reviewSubmitted && (
          <section className="mt-10">
  <h3 className="text-3xl font-extrabold text-emerald-700 text-center mb-6">
    🌟 Drop a Vibe Check!
  </h3>
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6 max-w-2xl mx-auto">
    
    <div className="text-center">
      <p className="text-lg font-semibold text-gray-800">
        How was the ride with <span className="text-emerald-600">{driver.firstName}</span>? ✨
      </p>
    </div>

    <div>
      <label className="block text-sm font-bold text-emerald-700 mb-2">🎯 Your Rating</label>
      <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg border shadow-sm">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            onClick={() => setRating(val)}
            className={`text-2xl transition-transform duration-150 ${
              rating === val ? "scale-125 text-emerald-600" : "opacity-50"
            }`}
          >
            {["😡", "😕", "😐", "😊", "🤩"][val - 1]}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-emerald-500 text-center">
        {["Terrible", "Bad", "Okay", "Great", "Awesome"][rating - 1]}
      </p>
    </div>

    <div>
      <label className="block text-sm font-bold text-emerald-700 mb-2">💬 Share your thoughts</label>
      <textarea
        rows={4}
        className="w-full px-4 py-3 border rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-800"
        placeholder="Say something cool or helpful 😎"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </div>

    <div className="text-center">
      <button
        onClick={handleSubmitReview}
        disabled={isSubmittingReview}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full text-lg font-bold shadow-md transition-all duration-300 hover:scale-105 disabled:opacity-50"
      >
        {isSubmittingReview ? "Sending vibes..." : "Submit Vibe 💚"}
      </button>
    </div>

    <p className="text-xs text-center text-gray-400">Your feedback helps drivers level up 🚗⚡</p>
  </div>
</section>


      )}

      {ride.status === "CLOSED" && reviewSubmitted && (
      <p className="text-green-700 font-medium">
        ✅ You've already submitted a review for this ride.
      </p>
    )}



        {/* Pickup & Drop */}
        <section className="bg-white rounded-xl shadow-md border border-indigo-200 p-6 space-y-2">
          <h3 className="text-2xl font-bold text-indigo-700 mb-2">🧭 Route Details</h3>
          <p className="text-gray-700"><strong>Pickup:</strong> {pickup.label}</p>
          <p className="text-gray-700"><strong>Drop:</strong> {destination.label}</p>
          {preferredRoute && preferredRoute.length > 0 && (
            <p className="text-gray-700"><strong>Preferred Stops:</strong> {preferredRoute.map(stop => stop.label).join(", ")}</p>
          )}
        </section>

      </div>
    </div>

  );
}

export default BookingDetails;
