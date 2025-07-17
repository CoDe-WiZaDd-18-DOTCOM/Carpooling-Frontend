import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Loader } from "lucide-react";

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171", "#A78BFA"];

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("");

  const token = localStorage.getItem("AuthToken");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log("called")
        const res = await axios.get("http://localhost:5001/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(res.data);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  const filteredRidesByCity = cityFilter
    ? Object.entries(analytics?.ridesByCity || {}).filter(([city]) =>
        city.toLowerCase().includes(cityFilter.toLowerCase())
      )
    : Object.entries(analytics?.ridesByCity || {});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
        Platform Analytics
      </h2>

      {loading ? (
        <div className="text-center py-10">
          <Loader className="animate-spin mx-auto text-emerald-600" />
          <p className="text-gray-500 mt-2">Loading analytics...</p>
        </div>
      ) : (
        analytics && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Summary Cards */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4">Overview</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>Total Users: <strong>{analytics.totalUsers}</strong></p>
                <p>Total Rides: <strong>{analytics.totalRides}</strong></p>
                <p>Total Bookings: <strong>{analytics.totalBookings}</strong></p>
                <p>Total SOS Raised: <strong>{analytics.totalSOS}</strong></p>
              </div>
            </div>

            {/* Filter and Rides by City Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Rides by City</h3>
                <input
                  type="text"
                  placeholder="Filter by city"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="border px-3 py-1 rounded text-sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={filteredRidesByCity.map(([name, value]) => ({ name, value }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#34D399" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rides Per Driver Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Rides per Driver</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(analytics.ridesPerDriver).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={(entry) => entry.name}
                  >
                    {Object.keys(analytics.ridesPerDriver).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default AdminAnalytics;
