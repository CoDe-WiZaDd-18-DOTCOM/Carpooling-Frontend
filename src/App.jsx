import React, { useState } from "react";
import {
  Car,
  Users,
  MapPin,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
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
    },
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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

  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <button
            onClick={() => setIsLoginOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => {
                setIsLoginOpen(false);
                setIsSignupOpen(true);
              }}
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  const SignupModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Join CarpoolConnect
          </h2>
          <button
            onClick={() => setIsSignupOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={signupData.firstName}
                onChange={(e) =>
                  handleSignupChange("firstName", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={signupData.lastName}
                onChange={(e) => handleSignupChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={signupData.email}
              onChange={(e) => handleSignupChange("email", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={signupData.phoneNumber}
              onChange={(e) =>
                handleSignupChange("phoneNumber", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={signupData.password}
              onChange={(e) => handleSignupChange("password", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={signupData.role}
              onChange={(e) => handleSignupChange("role", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select your role</option>
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Music
                </label>
                <select
                  value={signupData.preferences.music}
                  onChange={(e) =>
                    handleSignupChange("preferences.music", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select preference</option>
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                  <option value="none">NONE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Smoking
                </label>
                <select
                  value={signupData.preferences.smoking}
                  onChange={(e) =>
                    handleSignupChange("preferences.smoking", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select preference</option>
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                  <option value="none">NONE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Friendly
                </label>
                <select
                  value={signupData.preferences.petFriendly}
                  onChange={(e) =>
                    handleSignupChange(
                      "preferences.petFriendly",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select preference</option>
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                  <option value="none">NONE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender Based
                </label>
                <select
                  value={signupData.preferences.genderBased}
                  onChange={(e) =>
                    handleSignupChange(
                      "preferences.genderBased",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select preference</option>
                  <option value="any">ANY</option>
                  <option value="male_only">MALE_ONLY</option>
                  <option value="female_only">FEMALE_ONLY</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 mt-6"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => {
                setIsSignupOpen(false);
                setIsLoginOpen(true);
              }}
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">
                CarpoolConnect
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#benefits"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Benefits
              </a>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => setIsSignupOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-emerald-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#features"
                  className="block px-3 py-2 text-gray-600 hover:text-emerald-600"
                  onClick={closeMenu}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block px-3 py-2 text-gray-600 hover:text-emerald-600"
                  onClick={closeMenu}
                >
                  How It Works
                </a>
                <a
                  href="#benefits"
                  className="block px-3 py-2 text-gray-600 hover:text-emerald-600"
                  onClick={closeMenu}
                >
                  Benefits
                </a>
                <button
                  onClick={() => {
                    closeMenu();
                    setIsLoginOpen(true);
                  }}
                  className="block w-full text-left px-3 py-2 text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    setIsSignupOpen(true);
                  }}
                  className="block w-full text-left px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Rides,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                Save Money
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with fellow travelers, reduce costs, and make a positive
              impact on the environment. Our smart carpooling system matches you
              with the perfect ride.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsSignupOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with CarpoolConnect is simple and straightforward
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                1. Set Your Route
              </h3>
              <p className="text-gray-600">
                Enter your pickup and destination locations along with your
                preferred departure time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                2. Find Your Match
              </h3>
              <p className="text-gray-600">
                Our intelligent system finds the best matches based on your
                route and preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Car className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                3. Share & Save
              </h3>
              <p className="text-gray-600">
                Connect with your matched riders, share the ride, and save money
                while helping the environment.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of users who are already carpooling smarter, saving
            money, and helping the environment.
          </p>
          <button
            onClick={() => setIsSignupOpen(true)}
            className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Get Started Today <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Modals */}
      {isLoginOpen && <LoginModal />}
      {isSignupOpen && <SignupModal />}
    </div>
  );
}

export default App;
