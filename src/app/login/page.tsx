"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  type UserCredential,
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Zap, User, Phone, MapPin, X, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [userCredential, setUserCredential] = useState<UserCredential | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const router = useRouter();

  // Animation effect when component mounts
  useEffect(() => {
    const loginCard = document.getElementById("login-card");
    if (loginCard) {
      loginCard.classList.remove("opacity-0", "translate-y-10");
      loginCard.classList.add("opacity-100", "translate-y-0");
    }
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in Realtime Database
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        // New user – store the credential and show registration form
        setUserCredential(result);
        setShowRegistration(true);

        // Pre-fill name from Google if available
        if (user.displayName) {
          setFormData((prev) => ({ ...prev, name: user.displayName || "" }));
        }
      } else {
        // User exists; navigate to the homepage
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Clear phone error when user types
    if (name === "phone") {
      setPhoneError("");
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the phone number (must be exactly 10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    if (userCredential && userCredential.user) {
      setRegLoading(true);
      try {
        const userRef = ref(db, "users/" + userCredential.user.uid);
        await set(userRef, {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          email: userCredential.user.email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
        setShowRegistration(false);
        router.push("/");
      } catch (error: any) {
        console.error("Error saving user details:", error);
        setError(error.message || "Failed to save user details");
      } finally {
        setRegLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div
        id="login-card"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-700 opacity-0 translate-y-10"
      >
        {/* Header with logo */}
        <div className="bg-[#00c853] p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Welcome to Bolt.Earth</h1>
          <p className="text-white/80 mt-1">Sign in to access your EV charging account</p>
        </div>

        {/* Login content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h2 className="text-lg font-semibold mb-2">Why sign in?</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="bg-[#00c853]/10 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-[#00c853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Track your charging history</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#00c853]/10 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-[#00c853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Save your favorite charging locations</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#00c853]/10 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-[#00c853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Manage payments and view invoices</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00c853] focus:ring-offset-2 transition-colors disabled:opacity-70"
            >
              {loginLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#00c853] rounded-full animate-spin mr-2"></div>
              ) : (
                <Image
                  src="/placeholder.svg?height=20&width=20&text=G"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
              )}
              {loginLoading ? "Signing in..." : "Sign in with Google"}
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By signing in, you agree to our</p>
            <div className="mt-1">
              <a href="#" className="text-[#00c853] hover:underline">
                Terms of Service
              </a>
              {" & "}
              <a href="#" className="text-[#00c853] hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistration && userCredential && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Complete Your Profile</h2>
              <button
                onClick={() => setShowRegistration(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00c853] focus:border-[#00c853] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (10-digit)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`pl-10 w-full px-4 py-2 border rounded-lg transition-colors ${
                        phoneError
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-[#00c853] focus:border-[#00c853]"
                      }`}
                      placeholder="9876543210"
                    />
                  </div>
                  {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00c853] focus:border-[#00c853] transition-colors"
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full bg-[#00c853] text-white py-3 rounded-lg font-medium hover:bg-[#00c853]/90 transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                  {regLoading && (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  )}
                  {regLoading ? "Saving..." : "Complete Registration"}
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-500 text-center">
                Your information is secure and will only be used to enhance your charging experience
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Background decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-[#00c853]/5 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/2 bg-[#00c853]/5 -z-10 rounded-tr-full"></div>
    </div>
  );
};

export default LoginPage;
