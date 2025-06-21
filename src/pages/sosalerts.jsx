import React, { useEffect, useState } from "react";
import axios from "axios";

function SosAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/sos/alerts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });
      setAlerts(res.data);
    } catch (err) {
      console.error("Error fetching SOS alerts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🚨 SOS Alerts</h2>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-red-600 font-medium">Loading SOS alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <p className="text-center text-gray-600">No alerts received yet.</p>
      ) : (
        <div className="space-y-6">
          {alerts.map((alert) => {
            const booking = alert.bookingRequest;
            const rider = alert.user;
            const driver = booking?.driver;

            return (
              <div
                key={alert.id}
                className="bg-white p-6 rounded-xl shadow border border-red-100 flex flex-col md:flex-row justify-between"
              >
                {/* Left Side - Alert and Booking Info */}
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold text-red-600 mb-2">Alert Message</h3>
                  <p className="text-gray-700 italic mb-4">"{alert.message || 'No message provided'}"</p>

                  {booking && (
                    <>
                      <div className="text-sm text-gray-800 mb-2">
                        <p><strong>Pickup:</strong> {booking.pickup.area}</p>
                        <p><strong>Drop:</strong> {booking.destination.area}</p>
                        <p><strong>Status:</strong> {booking.approved ? "APPROVED" : "PENDING"}</p>
                      </div>

                      {/* Rider Info */}
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 mb-1">👤 Rider Info</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Name:</strong> {rider.firstName} {rider.lastName}<br />
                          <strong>Email:</strong> {rider.email}<br />
                          <strong>Phone:</strong> {rider.phoneNumber}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Side - Driver Info */}
                <div className="md:w-1/3 md:pl-8 mt-6 md:mt-0 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0">
                  <h4 className="font-semibold text-gray-700 mb-1">🚗 Driver Info</h4>
                  {driver ? (
                    <p className="text-sm text-gray-600">
                      <strong>Name:</strong> {driver.firstName} {driver.lastName}<br />
                      <strong>Email:</strong> {driver.email}<br />
                      <strong>Phone:</strong> {driver.phoneNumber}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">No driver information available.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SosAlerts;
