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
import { Zap, User, Phone, MapPin, X, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

/**
 * LoginPage – Modern, premium login experience for SparkTech users.
 * Supports Google Auth and a custom registration flow for new users.
 */
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

  useEffect(() => {
    const loginCard = document.getElementById("login-card");
    if (loginCard) {
      setTimeout(() => {
        loginCard.classList.remove("opacity-0", "translate-y-10");
        loginCard.classList.add("opacity-100", "translate-y-0");
      }, 100);
    }
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        setUserCredential(result);
        setShowRegistration(true);
        if (user.displayName) {
          setFormData((prev) => ({ ...prev, name: user.displayName || "" }));
        }
      } else {
        router.push("/home");
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
    if (name === "phone") setPhoneError("");
  };

  const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        router.push("/home");
      } catch (error: any) {
        console.error("Error saving user details:", error);
        setError(error.message || "Failed to save user details");
      } finally {
        setRegLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-5 relative overflow-hidden transition-all duration-500">
      {/* Background aesthetic elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00e676]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0070f3]/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div
        id="login-card"
        className="w-full max-w-md bg-[#0d1220] rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 opacity-0 translate-y-10 border border-white/5 relative z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0d1220] to-[#121a2a] p-10 text-center border-b border-white/5 relative">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00e676] to-[#00b248] rounded-2xl rotate-6 animate-pulse" />
              <Zap className="relative text-[#080c14] w-8 h-8 z-10" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <span className="text-[#00e676]">Spark</span>Tech
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium">Elevate Your EV Experience</p>
        </div>

        {/* Form Body */}
        <div className="p-8 pb-10">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start text-sm">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-white font-bold text-lg mb-4">Account Access</h2>
              {[
                { label: "Live Impact Stats", icon: <ShieldCheck className="w-4 h-4 text-[#00e676]" /> },
                { label: "AI Optimized Charging", icon: <Sparkles className="w-4 h-4 text-[#00e676]" /> },
                { label: "Seamless Payments", icon: <Zap className="w-4 h-4 text-[#00e676]" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-[#00e676]/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-white/60 text-xs font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="w-full group flex items-center justify-center bg-white text-[#080c14] rounded-2xl px-6 py-4 font-bold hover:shadow-2xl hover:shadow-[#00e676]/20 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:translate-y-0"
            >
              {loginLoading ? (
                <div className="w-5 h-5 border-[3px] border-gray-200 border-t-[#00e676] rounded-full animate-spin"></div>
              ) : (
                <div className="flex items-center justify-center w-full gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Multi-Auth</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-center text-[10px] text-white/30 tracking-widest uppercase font-bold">
            <p className="mb-3">Secure Enterprise Infrastructure</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="hover:text-[#00e676] transition-colors">Privacy</a>
              <span className="text-white/10">•</span>
              <a href="#" className="hover:text-[#00e676] transition-colors">Legal</a>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistration && userCredential && (
        <div className="fixed inset-0 bg-[#080c14]/90 backdrop-blur-xl flex items-center justify-center p-5 z-[100] animate-fadeIn">
          <div className="bg-[#0d1220] rounded-[2rem] w-full max-w-md shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-scaleIn border border-white/10 overflow-hidden">
            <div className="flex justify-between items-center p-8 bg-[#121a2a] border-b border-white/5">
              <div>
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Finalize Profile</h2>
                <p className="text-white/40 text-xs mt-1">Configure your charging preferences</p>
              </div>
              <button
                onClick={() => setShowRegistration(false)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="p-8 pt-10">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-black text-white/30 mb-2 uppercase tracking-widest">
                    Full Identity
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00e676] transition-colors" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-12 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#00e676]/50 transition-all font-medium"
                      placeholder="e.g. Elon Musk"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[10px] font-black text-white/30 mb-2 uppercase tracking-widest">
                    Telecom Contact (10 Digits)
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00e676] transition-colors" />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full bg-white/5 border rounded-2xl px-12 py-4 text-white placeholder:text-white/10 focus:outline-none transition-all font-medium ${
                        phoneError ? "border-red-500/50" : "border-white/5 focus:border-[#00e676]/50"
                      }`}
                      placeholder="98765 43210"
                    />
                  </div>
                  {phoneError && <p className="mt-2 text-[10px] text-red-500 font-bold ml-1">{phoneError}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-[10px] font-black text-white/30 mb-2 uppercase tracking-widest">
                    Primary Zone
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00e676] transition-colors" />
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-12 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#00e676]/50 transition-all font-medium"
                      placeholder="New York, NY"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-[#00e676] to-[#00b248] text-[#080c14] py-5 rounded-2xl font-black text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.3)] disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {regLoading ? "Optimizing Systems..." : "Initialize Experience"}
                    {!regLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </button>
              </div>

              <p className="mt-6 text-[10px] text-white/20 text-center font-medium leading-relaxed">
                By entering the SparkTech ecosystem, you agree to our <span className="text-white/40 hover:text-white transition-colors cursor-pointer">Protocol Agreements</span> and data sovereignty policies.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
