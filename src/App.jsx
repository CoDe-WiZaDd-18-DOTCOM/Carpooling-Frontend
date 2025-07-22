import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { createContext } from "react";
import { useState, useEffect } from "react";
import Dashboard from "./pages/dashboard";
import SearchRides from "./pages/searchrides";
import RideCreation from "./pages/ridecreation";
import IncomingRequests from "./pages/incomingrequest";
import MyBookings from "./pages/mybookings";
import UserProfile from "./pages/userprofile";
import BookingDetails from "./pages/bookingdetails";
import DriverRides from "./pages/driverrides";
import RideDetails from "./pages/ridedetails";
import SosAlerts from "./pages/sosalerts";
import OAuthSuccess from "./pages/OAuthSuccess";
import AddAuthorities from "./pages/AddAUthorites";
import DashboardAdmin from "./pages/dashboard_admin";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminRides from "./pages/AdminRides.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import FailedEmailsAdmin from "./pages/FailedEmails.jsx";
import ChatBotModal from "./pages/ChatBotModel.jsx";


export const AuthContext = createContext();
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("AuthToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
      <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/search" element={<SearchRides />} />
        <Route path="/create/:rideId" element={<RideCreation />} />
        <Route path="/create" element={<RideCreation />} />
        <Route path="/incoming" element={<IncomingRequests />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/my-bookings/:id" element={<BookingDetails />} />
        <Route path="/ride-details/:id" element={<RideDetails />} />
        <Route path="/driver-rides" element={<DriverRides />} />
        <Route path="/alerts" element={<SosAlerts />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/admin/authorities" element={<AddAuthorities />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/rides" element={<AdminRides />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/emails" element={<FailedEmailsAdmin />} />
      </Routes>
    </Router>
    <button
      onClick={() => setChatOpen(true)}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-700 shadow-xl flex items-center justify-center text-3xl hover:scale-105 transition-transform z-40 border-4 border-white"
      aria-label="Open ChatBot"
    >
      <span role="img" aria-label="Robot Bot">🤖</span>
    </button>

        {/* Chatbot modal */}
        <ChatBotModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </MantineProvider>
  );
}

export default App;
