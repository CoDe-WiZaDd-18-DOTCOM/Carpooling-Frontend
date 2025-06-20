import React from "react";
import { Car, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
      const navigate = useNavigate();
      localStorage.removeItem("AuthToken");
      navigate("/");
    };

    const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-lg">
            <Car className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">CarpoolConnect</h1>
        </div>
        <div className="flex items-center gap-4">
          <User onClick={()=>{navigate("/profile")}} className="text-gray-600 cursor-pointer" />
          <button onClick={handleLogout} className="text-red-500 hover:text-red-600 flex items-center gap-1">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to your Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          {role === "DRIVER" && (
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Create a Ride</h3>
              <p className="text-gray-600 mb-4">
                Offer a ride by entering your route, timing, preferences, and vehicle.
              </p>
              <button
                onClick={() => navigate("/ride/create")}
                className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition"
              >
                Create Ride
              </button>
            </div>
          )}


          {/* Card 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Find a Ride</h3>
            <p className="text-sm text-gray-600 mb-4">Looking for a ride? Browse available options.</p>
            <button onClick={()=>{navigate("/search")}} className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition">
              Search Rides
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
