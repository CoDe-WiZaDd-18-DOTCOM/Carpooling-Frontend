import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { SIGNUP_URL } from "../utils/apis";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    preferences: {
      music: "",
      smoking: "",
      petFriendly: "",
      genderBased: "",
      ac:"",
    },
  });

  const handleSignupChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setSignupData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setSignupData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post(SIGNUP_URL,signupData);

        if (response.status == 200) {
            notifications.show({
                title: "Succesfully signed up",
                message: `Succesfully signed up`,
                color: "green",
            });
            localStorage.setItem("AuthToken",response.data.jwtToken);
            navigate("/Dashboard");
        }
        else if( response.status == 403) {
            notifications.show({    
                title: "Failed to signup", 
                message: "Email already exists, please try again",
                color: "red", 
            });
        }
        else{
            notifications.show({
                title: "Failed to signup", 
                message: "Failed to signup, please try again",
                color: "red", 
            });
        }
        console.log("Signup Data:", signupData);
    }
    catch (error) {
        notifications.show({    
                title: "Failed to signup", 
                message: "Email already exists, please try again",
                color: "red", 
            });
        console.error(error);
    }
    
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-emerald-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Join CarpoolConnect</h2>
          <button onClick={() => navigate("/")} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={signupData.firstName}
                onChange={(e) => handleSignupChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={signupData.lastName}
                onChange={(e) => handleSignupChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={signupData.email}
              onChange={(e) => handleSignupChange("email", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={signupData.phoneNumber}
              onChange={(e) => handleSignupChange("phoneNumber", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={signupData.password}
              onChange={(e) => handleSignupChange("password", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={signupData.role}
              onChange={(e) => handleSignupChange("role", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select your role</option>
              <option value="RIDER">Rider</option>
              <option value="DRIVER">Driver</option>
            </select>
          </div>

          <div className="md:col-span-2 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["genderBased"].map((genderBased) => (
                <div key={genderBased}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {genderBased.charAt(0).toUpperCase() + genderBased.slice(1)}
                  </label>
                  <select
                    value={signupData.preferences[genderBased]}
                    onChange={(e) => handleSignupChange(`preferences.${genderBased}`, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select preference</option>
                    <option value="MALE_ONLY">Male</option>
                    <option value="FEMALE_ONLY">Female</option>
                    <option value="NONE">NONE</option>
                  </select>
                </div>
                ))}
              {["music", "smoking", "petFriendly", "ac"].map((pref) => (
                <div key={pref}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {pref.charAt(0).toUpperCase() + pref.slice(1)}
                  </label>
                  <select
                    value={signupData.preferences[pref]}
                    onChange={(e) => handleSignupChange(`preferences.${pref}`, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select preference</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                    <option value="NONE">NONE</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg mt-6"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-emerald-600 font-semibold">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
