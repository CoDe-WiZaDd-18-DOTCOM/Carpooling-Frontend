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

export const AuthContext = createContext();
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <Route path="/create" element={<RideCreation />} />
        <Route path="/incoming" element={<IncomingRequests />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/my-bookings/:id" element={<BookingDetails />} />
      </Routes>
    </Router>
    </MantineProvider>
  );
}

export default App;
