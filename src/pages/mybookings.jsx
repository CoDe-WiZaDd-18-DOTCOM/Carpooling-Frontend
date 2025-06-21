import React, { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

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
  if (phone.length < 2) return "XXXXXXXXXX";
  return `XXXXXX${phone.slice(-4)}`;
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Ride Requests</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No ride requests sent yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((wrapper) => {
            const { id, bookingRequest } = wrapper;
            const driver = bookingRequest.driver;
            const pickup = bookingRequest.pickup.area;
            const drop = bookingRequest.destination.area;
            const status = bookingRequest.approved ? "APPROVED" : "PENDING";

            return (
              <div
                key={id}
                className="bg-white p-6 rounded-xl shadow-md border flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Driver: {driver.firstName} {driver.lastName}
                  </h3>
                  <p className="text-gray-600">
                    {pickup} ➝ {drop}
                  </p>
                  {status === "PENDING" ? (
                  <p className="text-sm text-gray-500">
                    Email: {maskEmail(driver.email)}, Phone: {maskPhone(driver.phoneNumber)}
                    </p>) : (
                    <p className="text-sm text-gray-500">
                      Email: {driver.email}, Phone: {driver.phoneNumber}
                    </p>
                  )}
                  <br />
                  {status === "APPROVED" ? (
                    <button
                        className="mt-4 md:mt-0 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
                        onClick={() => window.location.href = `/my-bookings/${id}`}
                    >
                        View Ride Details
                    </button>
                    ):(
                      <button
                        className="mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-not-allowed"
                        disabled
                        >
                            Pending Approval
                        </button>
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

export default MyBookings;
