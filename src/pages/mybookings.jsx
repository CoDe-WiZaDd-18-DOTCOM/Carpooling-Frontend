import React, { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5001/bookings/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    if (name.length <= 1) return `*@${domain}`;
    return `${name[0]}${"*".repeat(name.length - 1)}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (phone.length < 4) return "XXXXXXX0000";
    return `XXXXXX${phone.slice(-4)}`;
  };

  if (loading)
    return <div className="text-center text-gray-500 mt-10">Loading your bookings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">My Ride Requests</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No ride requests sent yet.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map(({ id, bookingRequest }) => {
            const { driver, pickup, destination, approved } = bookingRequest;
            const status = approved ? "APPROVED" : "PENDING";

            return (
              <div
                key={id}
                className="bg-white border-l-4 border-emerald-500 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Driver: {driver.firstName} {driver.lastName}
                    </h3>
                    <p className="text-gray-600">
                      {pickup.area} ➝ {destination.area}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Email: {approved ? driver.email : maskEmail(driver.email)}, Phone:{" "}
                      {approved ? driver.phoneNumber : maskPhone(driver.phoneNumber)}
                    </p>
                  </div>

                  <div>
                    {approved ? (
                      <button
                        className="bg-emerald-500 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition"
                        onClick={() => (window.location.href = `/my-bookings/${id}`)}
                      >
                        View Ride Details
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg cursor-not-allowed"
                      >
                        Pending Approval
                      </button>
                    )}
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

export default MyBookings;
