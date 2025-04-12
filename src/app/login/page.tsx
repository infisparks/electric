// app/login/page.tsx
"use client";
import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";


const LoginPage = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [userCredential, setUserCredential] = useState<UserCredential | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const router = useRouter();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check if additional user data exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        // New user – show registration popup to complete additional details
        setUserCredential(result);
        setShowRegistration(true);
      } else {
        // User already exists; navigate to homepage
        router.push("/homepage");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate the phone number (must be exactly 10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (userCredential && userCredential.user) {
      try {
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          email: userCredential.user.email,
        });
        setShowRegistration(false);
        router.push("/homepage");
      } catch (error) {
        console.error("Error saving user details:", error);
      }
    }
  };

  return (
    <div className="login-page">
      <h1>Welcome to Our App</h1>
      <button className="login-button" onClick={handleLogin}>
        Login with Google
      </button>

      {showRegistration && (
        <div className="registration-modal">
          <div className="modal-content">
            <h2>Complete Your Registration</h2>
            <form onSubmit={handleRegistrationSubmit}>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="phone">Phone (10-digit):</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="address">Address:</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />

              <button type="submit" className="register-button">
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
