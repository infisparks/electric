"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Battery, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase";
import { ref, push, set } from "firebase/database";

export default function QRPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [chargerInfo] = useState({
    id: "CHG-2023-0042",
    location: "Green Park Charging Station",
    rate: "₹15/kWh",
    status: "Available",
  });

  // Define charging plan options
  const plans = [
    { id: "plan1", label: "30 Minutes", price: 100 },
    { id: "plan2", label: "65 Minutes", price: 200 },
    { id: "plan3", label: "2 Hours", price: 400 },
  ];
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  // Check if user is logged in; if not, redirect to /login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Cleanup camera tracks on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    setScanning(true);
    setScanned(false);
    setError(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraPermission(true);

          // Simulate QR code scanning after 3 seconds
          setTimeout(() => {
            setScanning(false);
            setScanned(true);

            // Stop the camera after successful scan
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
          }, 3000);
        }
      } else {
        setCameraPermission(false);
        setScanning(false);
        setError(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraPermission(false);
      setScanning(false);
      setError(true);
    }
  };

  const simulateError = () => {
    setScanning(false);
    setScanned(false);
    setError(true);

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  // Dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_0M6qo3zzUUkUCv", // Test Key ID
      amount: selectedPlan.price * 100, // amount in paise
      currency: "INR",
      name: "Bolt.Earth",
      description: `${selectedPlan.label} Charging Payment`,
      handler: async function (response: any) {
        // Payment successful, save payment history in Realtime Database
        const currentUser = auth.currentUser;
        if (currentUser) {
          const paymentHistoryRef = ref(db, `users/${currentUser.uid}/makeHistory`);
          const newPaymentRef = push(paymentHistoryRef);
          await set(newPaymentRef, {
            plan: selectedPlan.label,
            amount: selectedPlan.price,
            transactionId: response.razorpay_payment_id,
            date: new Date().toISOString(),
          });
          alert("Payment Successful! Your charging session has been initiated.");
        }
      },
      prefill: {
        name: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || "",
        contact: "",
      },
      notes: {
        address: "Bolt.Earth Charging Station",
      },
      theme: {
        color: "#00c853",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#00c853] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Scan &amp; Pay</h1>
            <p className="text-gray-600">
              Scan the QR code on your charging station to begin charging your electric vehicle.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg mb-8">
            <div className="relative aspect-square bg-black">
              {!scanning && !scanned && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <Zap className="w-16 h-16 text-[#00c853] mb-4" />
                  <p className="mb-4">
                    Point your camera at the QR code on the charging station
                  </p>
                  <button
                    onClick={startScanning}
                    className="bg-[#00c853] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00c853]/90 transition-colors"
                  >
                    Start Scanning
                  </button>
                </div>
              )}

              {scanning && (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                  ></video>
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full hidden"></canvas>
                  <div className="absolute inset-0 border-[3px] border-[#00c853] m-12 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#00c853] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              )}

              {scanned && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#00c853]/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-[#00c853]" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">QR Code Scanned Successfully!</h2>
                  <p className="text-gray-600 mb-4">
                    Charger connected and ready to use.
                  </p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Scanning Failed</h2>
                  <p className="text-gray-600 mb-4">
                    {cameraPermission === false
                      ? "Camera access denied. Please allow camera access and try again."
                      : "Could not scan QR code. Please try again."}
                  </p>
                  <button
                    onClick={startScanning}
                    className="bg-[#00c853] text-white px-6 py-2 rounded-full font-medium hover:bg-[#00c853]/90 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {scanned && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Charger Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Charger ID</span>
                      <span className="font-medium">{chargerInfo.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location</span>
                      <span className="font-medium">{chargerInfo.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rate</span>
                      <span className="font-medium">{chargerInfo.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium text-[#00c853]">{chargerInfo.status}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Select Charging Plan</h3>
                  <select
                    value={selectedPlan.id}
                    onChange={(e) => {
                      const plan = plans.find((p) => p.id === e.target.value);
                      if (plan) setSelectedPlan(plan);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.label} - ₹{plan.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={handlePayment}
                    className="w-full bg-[#00c853] text-white py-3 rounded-full font-medium hover:bg-[#00c853]/90 transition-colors flex items-center justify-center"
                  >
                    <Battery className="w-5 h-5 mr-2" />
                    Start Charging
                  </button>
                </div>
              </div>
            )}

            {!scanned && !scanning && !error && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex">
                    <span className="bg-[#00c853] text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      1
                    </span>
                    <span>Scan the QR code on the charging station</span>
                  </li>
                  <li className="flex">
                    <span className="bg-[#00c853] text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      2
                    </span>
                    <span>Confirm charger details and pricing</span>
                  </li>
                  <li className="flex">
                    <span className="bg-[#00c853] text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      3
                    </span>
                    <span>Make payment via Razorpay and start charging</span>
                  </li>
                </ol>
              </div>
            )}

            {!scanned && !scanning && !error && (
              <div className="flex justify-center space-x-4 p-6">
                <button
                  onClick={startScanning}
                  className="bg-[#00c853] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00c853]/90 transition-colors"
                >
                  Scan QR Code
                </button>
                <button
                  onClick={simulateError}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  Enter Manually
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative w-8 h-8 bg-[#00c853] rounded-full flex items-center justify-center mr-2">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-sm font-medium">BOLT.EARTH</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Bolt.Earth. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
