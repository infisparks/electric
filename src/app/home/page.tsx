"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Battery,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase";
import { ref, push, set } from "firebase/database";
import jsQR from "jsqr";

/**
 * QRPage – scans webcam frames with jsQR.
 * Succeeds only when the decoded text === "infispark" (case-insensitive).
 * After successful Razorpay payment it
 *  • writes a status (in seconds) to device/status
 *  • appends the payment to users/{uid}/history
 */
export default function QRPage() {
  const router = useRouter();

  /* --------------------------- State --------------------------- */
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );

  /* --------------------------- Refs ---------------------------- */
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanningRef = useRef<boolean>(false);
  const frameReqId = useRef<number | undefined>(undefined);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* --------------------- Static charger info ------------------- */
  const [chargerInfo] = useState({
    id: "CHG-2023-0042",
    location: "Green Park Charging Station",
    rate: "₹15/kWh",
    status: "Available",
  });

  /* ---------------------- Plan options ------------------------ */
  const plans = [
    { id: "quick5", label: "5 Seconds (Test)", price: 1 },     //  ₹1 →  5 s
    { id: "quick10", label: "10 Seconds (Test)", price: 2 },   //  ₹2 → 10 s
    { id: "plan1", label: "30 Minutes", price: 100 },
    { id: "plan2", label: "65 Minutes", price: 200 },
    { id: "plan3", label: "2 Hours", price: 400 },
  ];
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  /* --------------------- Auth guard --------------------------- */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => !u && router.push("/login"));
    return () => unsub();
  }, [router]);

  /* -------------------- Cleanup on unmount -------------------- */
  useEffect(() => () => cleanupCamera(), []);

  /* ------------------ Helper: stop camera --------------------- */
  const cleanupCamera = () => {
    scanningRef.current = false;
    if (frameReqId.current) cancelAnimationFrame(frameReqId.current);
    if (timeoutId.current) clearTimeout(timeoutId.current);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  /* ------------- Draw & attempt QR decode each frame ---------- */
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !scanningRef.current) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
      frameReqId.current = requestAnimationFrame(scanFrame);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(img.data, img.width, img.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      const text = code.data.trim().toLowerCase();
      if (text === "infispark") {
        cleanupCamera();
        setScanning(false);
        setScanned(true);
        return;
      }
    }
    frameReqId.current = requestAnimationFrame(scanFrame);
  };

  /* -------------------- Start scanning ------------------------ */
  const startScanning = async () => {
    cleanupCamera();
    setScanning(true);
    setScanned(false);
    setError(false);

    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });

      if (!videoRef.current) throw new Error();
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", "true");
      const onLoaded = () => {
        videoRef.current?.play();
        scanningRef.current = true;
        frameReqId.current = requestAnimationFrame(scanFrame);
      };
      if (videoRef.current.readyState >= 2) {
        onLoaded();
      } else {
        videoRef.current.addEventListener("loadedmetadata", onLoaded, {
          once: true,
        });
      }
      

      setCameraPermission(true);
      timeoutId.current = setTimeout(() => {
        if (scanningRef.current) simulateError();
      }, 30_000);
    } catch (e) {
      console.error("Error accessing camera:", e);
      setCameraPermission(false);
      setScanning(false);
      setError(true);
    }
  };

  const simulateError = () => {
    cleanupCamera();
    setScanning(false);
    setScanned(false);
    setError(true);
  };

  /* --------------- Razorpay dynamic loader -------------------- */
  const loadRazorpayScript = () =>
    new Promise<boolean>((res) => {
      if ((window as any).Razorpay) return res(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => res(true);
      s.onerror = () => res(false);
      document.body.appendChild(s);
    });

  /* ----------- Helper: amount ⇒ status-seconds ---------------- */
  const amountToSeconds = (amount: number, label: string): number => {
    if (amount === 1) return 5;           // ₹1  →  5 s
    if (amount === 2) return 10;          // ₹2  → 10 s

    // For plan labels like "30 Minutes", "2 Hours", etc.
    const m = label.match(/(\d+)\s*(Minutes?|Hours?)/i);
    if (m) {
      const value = parseInt(m[1], 10);
      return /hour/i.test(m[2]) ? value * 3600 : value * 60;
    }
    // Fallback – convert ₹→seconds  (1 ₹ ≈ 60 s)
    return amount * 60;
  };

  /* ------------------ Payment handler ------------------------- */
  const handlePayment = async () => {
    if (!scanned) return;
    const ok = await loadRazorpayScript();
    if (!ok) return alert("Razorpay SDK failed to load. Are you online?");

    const opts = {
      key: "rzp_test_0M6qo3zzUUkUCv",
      amount: selectedPlan.price * 100,
      currency: "INR",
      name: "Bolt.Earth",
      description: `${selectedPlan.label} Charging Payment`,
      handler: async (resp: any) => {
        const user = auth.currentUser;
        if (!user) return;

        /* ---------- 1️⃣  compute seconds for device/status ---------- */
        const seconds = amountToSeconds(selectedPlan.price, selectedPlan.label);

        /* ---------- 2️⃣  write status ------------------------------ */
        await set(ref(db, "device/status"), seconds);

        /* ---------- 3️⃣  append history --------------------------- */
        const histRef = ref(db, `users/${user.uid}/history`);
        const newRef = push(histRef);
        await set(newRef, {
          plan: selectedPlan.label,
          amount: selectedPlan.price,
          seconds,
          transactionId: resp.razorpay_payment_id,
          date: new Date().toISOString(),
        });

        alert(
          `Payment Successful! Charger enabled for ${seconds} seconds.\nEnjoy your session.`
        );
      },
      prefill: {
        name: auth.currentUser?.displayName ?? "",
        email: auth.currentUser?.email ?? "",
      },
      notes: { address: "Bolt.Earth Charging Station" },
      theme: { color: "#00c853" },
    } as any;

    new (window as any).Razorpay(opts).open();
  };

  /* ----------------------------- UI ---------------------------- */
  return (
    <main className="min-h-screen bg-white flex flex-col">
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

      {/* Body */}
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Scan&nbsp;&amp;&nbsp;Pay</h1>
            <p className="text-gray-600">
              Scan the QR code on your charging station to begin charging your
              electric vehicle.
            </p>
          </div>

          {/* Scanner card */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg mb-8">
            {/* Live camera / placeholders */}
            <div className="relative aspect-square bg-black">
              {/* Idle */}
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

              {/* Scanning live */}
              {scanning && (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 border-[3px] border-[#00c853] m-12 rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#00c853] border-t-transparent rounded-full animate-spin" />
                  </div>
                </>
              )}

              {/* Success */}
              {scanned && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#00c853]/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-[#00c853]" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Scanner Found!</h2>
                  <p className="text-gray-600 mb-4">
                    QR verified – charger ready for payment.
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Scanning Failed</h2>
                  <p className="text-gray-600 mb-4">
                    {cameraPermission === false
                      ? "Camera access denied. Please allow camera access and try again."
                      : "No valid QR found. Please try again."}
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

            {/* Charger info & payment */}
            {scanned && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Charger Information
                  </h3>
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
                      <span className="font-medium text-[#00c853]">
                        {chargerInfo.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Select Charging Plan
                  </h3>
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
                        {plan.label} – ₹{plan.price}
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

            {/* How it works (idle) */}
            {!scanned && !scanning && !error && (
              <>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                  <ol className="space-y-3 text-gray-600">
                    {[
                      "Scan the QR code on the charging station",
                      "Confirm charger details and pricing",
                      "Make payment via Razorpay and start charging",
                    ].map((txt, i) => (
                      <li key={txt} className="flex">
                        <span className="bg-[#00c853] text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          {i + 1}
                        </span>
                        <span>{txt}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex justify-center space-x-4 p-6">
                  <button
                    onClick={startScanning}
                    className="bg-[#00c853] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00c853]/90 transition-colors"
                  >
                    Scan&nbsp;QR&nbsp;Code
                  </button>
                  <button
                    onClick={simulateError}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
                  >
                    Enter&nbsp;Manually
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-6">
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
