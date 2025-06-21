import React, { useEffect, useState } from "react";
import axios from "axios";

function IncomingRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5001/bookings/incoming", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
          },
        });
        setRequests(res.data); // Array of BookingWrapper objects
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (bookingId) => {
    try {
      await axios.post(`http://localhost:5001/bookings/${bookingId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });
      alert("Request approved!");
      // Refresh list
      setRequests((prev) =>
        prev.map((req) =>
          req.id === bookingId ? { ...req, bookingRequest: { ...req.bookingRequest, approved: true } } : req
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve the request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Incoming Ride Requests</h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No incoming ride requests.</p>
      ) : (
        <div className="space-y-6">
          {requests.map(({ id, bookingRequest }) => (
            <div
              key={id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Rider: <p>
  {bookingRequest.approved
    ? `${bookingRequest.rider.firstName} ${bookingRequest.rider.lastName}`
    : `${bookingRequest.rider.firstName.charAt(0)}.`}
</p>
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  From: {bookingRequest.pickup.area}, {bookingRequest.pickup.city}
                  <br />
                  To: {bookingRequest.destination.area}, {bookingRequest.destination.city}
                </p>
                {bookingRequest.preferredRoute && bookingRequest.preferredRoute.length > 0 && (
                  <p className="text-gray-500 text-sm mt-1">
                    Preferred Stops:{" "}
                    {bookingRequest.preferredRoute.map((stop, index) => (
                      <span key={index}>{stop.area}{index < bookingRequest.preferredRoute.length - 1 ? ", " : ""}</span>
                    ))}
                  </p>
                )}
              </div>
              <div className="mt-4 md:mt-0">
                {bookingRequest.approved ? (
                  <span className="text-green-600 font-semibold">Approved</span>
                ) : (
                  <button
                    onClick={() => handleApprove(id)}
                    className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IncomingRequests;
