import React, { useEffect, useState } from "react";
import axios from "axios";
import { BOOKING_URL, GET_DRIVER_BOOKING } from "../utils/apis";

function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(GET_DRIVER_BOOKING, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
          },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (bookingId) => {
    try {
      await axios.post(`${BOOKING_URL}/${bookingId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });
      alert("✅ Request approved!");
      setRequests((prev) =>
        prev.map((req) =>
          req.id === bookingId
            ? { ...req, bookingRequest: { ...req.bookingRequest, approved: true } }
            : req
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
      alert("❌ Failed to approve the request.");
    }
  };

  if (loading)
    return <div className="text-center text-gray-500 mt-10">Loading incoming requests...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Incoming Ride Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center text-gray-600">No incoming ride requests.</div>
      ) : (
        <div className="grid gap-6">
          {requests.map(({ id, bookingRequest }) => (
            <div
              key={id}
              className="bg-white shadow-lg hover:shadow-xl rounded-xl p-6 border-l-4 border-emerald-500 transition"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Rider:{" "}
                    {bookingRequest.approved
                      ? `${bookingRequest.rider.firstName} ${bookingRequest.rider.lastName}`
                      : `${bookingRequest.rider.firstName.charAt(0)}.`}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    From: <strong>{bookingRequest.pickup.label}</strong>
                    <br />
                    To: <strong>{bookingRequest.destination.label}</strong>
                  </p>
                  {bookingRequest.preferredRoute?.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Preferred Stops:{" "}
                      {bookingRequest.preferredRoute.map((stop, i) => (
                        <span key={i}>
                          {stop.label}
                          {i < bookingRequest.preferredRoute.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  )}

                </div>

                <div>
                  {bookingRequest.approved ? (
                    <span className="text-green-600 font-semibold text-sm bg-green-100 px-4 py-1 rounded-full">
                      ✅ Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm transition"
                    >
                      Approve Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IncomingRequests;
