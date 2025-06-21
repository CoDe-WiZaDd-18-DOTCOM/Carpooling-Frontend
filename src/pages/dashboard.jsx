import React from "react";
import { Car, User, LogOut, PlusCircle, Search, ClipboardList, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("AuthToken");
    navigate("/");
  };

  const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <button onClick={()=>navigate("/")} className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-lg">
            <Car className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">CarpoolConnect</h1>
        </button>
        <div className="flex items-center gap-4">
          <User onClick={() => navigate("/profile")} className="text-gray-600 cursor-pointer hover:text-emerald-600" />
          <button onClick={handleLogout} className="text-red-500 hover:text-red-600 flex items-center gap-1">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome to your Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {role === "DRIVER" && (
            <DashboardCard
              icon={<PlusCircle className="text-emerald-600" />}
              title="Create a Ride"
              description="Offer a ride by entering your route, timing, preferences, and vehicle."
              onClick={() => navigate("/create")}
            />
          )}

          <DashboardCard
            icon={<Search className="text-emerald-600" />}
            title="Find a Ride"
            description="Looking for a ride? Browse available options and book your seat."
            onClick={() => navigate("/search")}
          />

          {role === "DRIVER" && (
            <DashboardCard
              icon={<ClipboardList className="text-emerald-600" />}
              title="My Rides"
              description="Manage and review the rides you have created."
              onClick={() => navigate("/driver-rides")}
            />
          )}

          <DashboardCard
            icon={<FileText className="text-emerald-600" />}
            title="My Bookings"
            description="Track your ride bookings and view booking history."
            onClick={() => navigate("/mybookings")}
          />

          {role === "DRIVER" && (
            <DashboardCard
              icon={<CheckCircle className="text-emerald-600" />}
              title="Incoming Requests"
              description="Review and manage ride requests from passengers."
              onClick={() => navigate("/incoming")}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ icon, title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white shadow-md hover:shadow-xl p-6 rounded-xl border border-transparent hover:border-emerald-500 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-100 p-2 rounded-md">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default Dashboard;
