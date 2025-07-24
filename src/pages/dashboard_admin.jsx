import React from "react";
import {
  User,
  Car,
  ClipboardList,
  Bell,
  Shield,
  BarChart3,
  UserCircle,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Bar } from "recharts";

function DashboardAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("AuthToken");
    navigate("/");
  };

  const cards = [
    {
      icon: <User className="text-emerald-600" />,
      title: "User Management",
      description: "Search, filter, promote, and ban users.",
      route: "/admin/users",
    },
    {
      icon: <Car className="text-emerald-600" />,
      title: "Ride Management",
      description: "View, filter, and moderate all rides.",
      route: "/admin/rides",
    },
    {
      icon: <Bell className="text-emerald-600" />,
      title: "SOS Monitoring",
      description: "View and resolve emergency SOS alerts.",
      route: "/alerts",
    },
    {
      icon: <Shield className="text-emerald-600" />,
      title: "Authority Management",
      description: "Manage SOS authorities by city and email.",
      route: "/admin/authorities",
    },
    {
      icon: <BarChart3 className="text-emerald-600" />,
      title: "Reports & Analytics",
      description: "Visual stats on rides, users, and alerts.",
      route: "/admin/analytics",
    },
    {
      icon: <MessageCircle className="text-emerald-600" />,
      title: "Filed Emails Monitoring",
      description: "View and resolve Filed emails.",
      route: "/admin/emails",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-lg">
            <Car className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">CarpoolConnect Admin</h1>
        </button>
        <div className="flex items-center gap-4">
          <UserCircle
            onClick={() => navigate("/profile")}
            className="text-gray-600 cursor-pointer hover:text-emerald-600"
          />
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              onClick={() => navigate(card.route)}
            />
          ))}
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
        <div className="bg-emerald-100 p-2 rounded-md">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default DashboardAdmin;
