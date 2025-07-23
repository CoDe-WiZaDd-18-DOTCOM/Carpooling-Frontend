import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
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
      ac: "",
    },
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);

  // Helper: Start resend cooldown timer (e.g., 30 seconds)
  const startResendTimeout = () => {
    setResendTimeout(30);
    let timer = setInterval(() => {
      setResendTimeout((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

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

  const sendOtp = async () => {
    if (!signupData.email) {
      alert("Please enter your email to get OTP.");
      return;
    }
    try {
      await axios.post('http://localhost:5001/auth/verify/email', { email: signupData.email }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setOtpSent(true);
      setOtpVerified(false);
      setOtp("");
      alert("OTP sent! Check your email.");
      startResendTimeout();
    } catch (error) {
      alert("Could not send OTP. Try again.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5001/auth/verify/otp', {
        email: signupData.email,
        otp: otp,
      });
      if (res.status === 200) {
        setOtpVerified(true);
        alert("OTP verification successful.");
      } else {
        throw new Error();
      }
    } catch {
      alert("Invalid or expired OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify your OTP before signing up.");
      return;
    }
    try {
      const response = await axios.post(SIGNUP_URL, signupData);
      if (response.status === 200) {
        alert("Successfully signed up!");
        localStorage.setItem("AuthToken", response.data.jwtToken);
        navigate("/Dashboard");
      } else if (response.status === 403) {
        alert("Email already exists, please try again.");
      } else {
        alert("Failed to signup, please try again.");
      }
    } catch (error) {
      alert("Failed to signup. Email already exists or unforeseen error.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-emerald-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Join CarpoolConnect</h2>
          <button onClick={() => navigate("/")} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={signupData.firstName}
              onChange={(e) => handleSignupChange("firstName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="First Name"
            />
            <input
              type="text"
              value={signupData.lastName}
              onChange={(e) => handleSignupChange("lastName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Last Name"
            />
          </div>
          <div>
            <input
              type="email"
              value={signupData.email}
              onChange={(e) => handleSignupChange("email", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Email"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={sendOtp}
                className="bg-emerald-500 text-white px-4 py-2 rounded disabled:opacity-60"
                disabled={!signupData.email || (otpSent && resendTimeout > 0)}
              >
                {otpSent && resendTimeout > 0
                  ? `Resend OTP (${resendTimeout}s)`
                  : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
              </button>
              {otpSent && (!otpVerified) && (
                <div className="flex-1">
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={otp}
                      maxLength={6}
                      onChange={e => setOtp(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg w-36"
                      placeholder="Enter OTP"
                    />
                    <button
                      type="button"
                      onClick={verifyOtp}
                      className="bg-emerald-600 text-white px-4 py-2 rounded"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}
              {otpVerified && (
                <span className="text-green-600 font-medium ml-2">✔ Verified</span>
              )}
            </div>
          </div>
          <input
            type="tel"
            value={signupData.phoneNumber}
            onChange={(e) => handleSignupChange("phoneNumber", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Phone Number"
          />
          <input
            type="password"
            value={signupData.password}
            onChange={(e) => handleSignupChange("password", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Password"
          />
          <select
            value={signupData.role}
            onChange={(e) => handleSignupChange("role", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Role</option>
            <option value="RIDER">Rider</option>
            <option value="DRIVER">Driver</option>
          </select>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Preferences</h3>
            <div className="grid grid-cols-2 gap-3">
              {["genderBased"].map((genderBased) => (
                <select
                  key={genderBased}
                  value={signupData.preferences[genderBased]}
                  onChange={(e) =>
                    handleSignupChange(`preferences.${genderBased}`, e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">{`Gender Based`}</option>
                  <option value="MALE_ONLY">Male</option>
                  <option value="FEMALE_ONLY">Female</option>
                  <option value="NONE">None</option>
                </select>
              ))}
              {["music", "smoking", "petFriendly", "ac"].map((pref) => (
                <select
                  key={pref}
                  value={signupData.preferences[pref]}
                  onChange={(e) =>
                    handleSignupChange(`preferences.${pref}`, e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">{pref.charAt(0).toUpperCase() + pref.slice(1)}</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="NONE">None</option>
                </select>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg mt-6"
            disabled={!otpVerified}
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() =>
              window.location.href =
                "https://accounts.google.com/o/oauth2/v2/auth?client_id=652720590250-tvni6g7q7d8go16tfduq3pre3m3mkveu.apps.googleusercontent.com&redirect_uri=http://localhost:5001/auth/google/callback&response_type=code&scope=openid%20email%20profile"
            }
            className="w-full bg-white text-gray-800 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Sign up with Google
          </button>
          <p className="text-sm text-gray-600 mt-4">
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
