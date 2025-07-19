import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, X, AlertTriangle } from "lucide-react";


function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);


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


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/bookings/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };


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
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-20 relative">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">My Ride Requests</h2>


      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No ride requests sent yet.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map(({ id, bookingRequest }) => {
            const { driver, pickup, destination, approved } = bookingRequest;


            return (
              <div
                key={id}
                className="bg-white border-l-4 border-emerald-500 p-6 rounded-xl shadow hover:shadow-lg transition relative"
              >
                {!approved && (
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setConfirmDeleteId(id)}
                      title="Cancel Booking"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}


                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Driver: {driver.firstName} {driver.lastName}
                    </h3>
                    <p className="text-gray-600">
                      {pickup.label} ➝ {destination.label}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Email: {approved ? driver.email : maskEmail(driver.email)}, Phone:{" "}
                      {approved ? driver.phoneNumber : maskPhone(driver.phoneNumber)}
                    </p>
                  </div>


                  <div className="flex flex-col gap-2">
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


      {/* Custom Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-500 w-6 h-6" />
              <h3 className="text-xl font-semibold text-gray-800">Confirm Cancellation</h3>
            </div>
            <p className="text-gray-600 mt-2">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Cancel It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default MyBookings;