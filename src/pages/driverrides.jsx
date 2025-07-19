import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, Trash2, ChevronLeft , ChevronRight } from "lucide-react";

const PAGE_SIZE = 4; // Or your choice

function DriverRides() {
  const [ridesPage, setRidesPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [page, setPage] = useState(0); // zero-based page index
  const navigate = useNavigate();

  const fetchRides = async (currPage = page) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/rides/me`, {
        params: { page: currPage, size: PAGE_SIZE },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });
      setRidesPage(res.data);
    } catch (err) {
      console.error("Failed to fetch driver rides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides(page);
    // eslint-disable-next-line
  }, [page]);

  const handleDelete = async (rideId) => {
    try {
      await axios.delete(`http://localhost:5001/rides/delete/${rideId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      });
      // Automatically refresh current page
      fetchRides(page); // Or decrement page if last element deleted
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Failed to delete ride:", err);
      alert("Failed to delete ride. Please try again.");
    }
  };

  const rides = ridesPage?.content || [];
  const totalPages = ridesPage?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-6 md:px-20">
      <h2 className="text-4xl font-bold text-emerald-700 mb-10 text-center">My Created Rides</h2>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
        </div>
      ) : rides.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">You haven’t created any rides yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rides.map(({ id, ride }) => {
              const from = ride.route[0]?.location?.label || "Start";
              const to = ride.route[ride.route.length - 1]?.location?.label || "End";
              return (
                <div
                  key={id}
                  className="bg-white border border-emerald-100 shadow hover:shadow-lg rounded-2xl p-6 transition-transform hover:scale-[1.01] cursor-pointer relative"
                  onClick={() => navigate(`/ride-details/${id}`)}
                >
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setConfirmDeleteId(id);
                      }}
                      title="Delete Ride"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {from} <span className="text-emerald-600">➝</span> {to}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <p>
                        Seats:{" "}
                        <span className="font-medium text-gray-700">
                          {ride.availableSeats} / {ride.seatCapacity}
                        </span>
                      </p>
                      <p>
                        Status:
                        <span
                          className={`ml-2 font-semibold ${
                            ride.status === "ACTIVE"
                              ? "text-green-600"
                              : ride.status === "INACTIVE"
                              ? "text-gray-500"
                              : "text-yellow-600"
                          }`}
                        >
                          {ride.status}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/ride-details/${id}`);
                        }}
                        className="text-sm font-medium text-emerald-600 hover:underline"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 rounded border ${
                  page === i ? "bg-emerald-500 text-white" : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✖
            </button>
            <div className="flex items-center gap-3">
              <span className="text-yellow-500 text-xl">⚠️</span>
              <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this ride? This action cannot be undone.
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
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverRides;
