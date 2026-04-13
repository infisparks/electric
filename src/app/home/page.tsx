"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Battery, Zap, CheckCircle2, AlertCircle, Scan, History, User, LogOut, LayoutDashboard, QrCode, Settings, Bell, ChevronRight, Lock, Sparkles, Keyboard, Activity, Gauge } from "lucide-react"
import { useRouter } from "next/navigation"
import { auth, db } from "../../firebase"
import { ref, push, set, onValue } from "firebase/database"
import jsQR from "jsqr"
import { motion, AnimatePresence } from "framer-motion"

/**
 * SparkTech Dashboard - Professional Light Ecosystem with Real-time Charging Simulation.
 * Calculations based on: 230V, 10A (2.3kW Power).
 */
export default function Dashboard() {
  const router = useRouter()

  /* --------------------------- State --------------------------- */
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [error, setError] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [chargingSeconds, setChargingSeconds] = useState(0)
  const [manualCode, setManualCode] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  /* ── Simulation State ── */
  const [isCharging, setIsCharging] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [deliveredEnergy, setDeliveredEnergy] = useState(0) // in kWh
  const [currentPower, setCurrentPower] = useState(2.3) // 2.3kW constant

  /* --------------------------- Refs ---------------------------- */
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanningRef = useRef<boolean>(false)
  const frameReqId = useRef<number | undefined>(undefined)
  const timeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const [chargerInfo] = useState({ id: "ST-HUB-402", location: "Neo City Station A4", rate: "₹12/min", status: "Online" })

  const plans = [
    { id: "quick10", label: "10 Seconds (Test)", price: 2, icon: <Zap className="w-4 h-4" /> },
    { id: "plan1", label: "30 Minutes", price: 100, icon: <Battery className="w-4 h-4" /> },
    { id: "plan2", label: "60 Minutes", price: 180, icon: <Battery className="w-4 h-4" /> },
    { id: "plan3", label: "2 Hours", price: 350, icon: <Battery className="w-4 h-4" /> },
  ]
  const [selectedPlan, setSelectedPlan] = useState(plans[0])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      if (user) {
        const histRef = ref(db, `users/${user.uid}/history`)
        onValue(histRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const list = Object.entries(data).map(([id, val]: any) => ({ id, ...val })).reverse()
            setHistory(list.slice(0, 3))
          }
        })
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  /* ── Charging Simulation Timer ── */
  useEffect(() => {
    let timer: any
    if (isCharging && elapsed < chargingSeconds) {
      timer = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 0.1
          // Energy(kWh) = Power(kW) * Time(hrs)
          // 0.1s = 0.1 / 3600 hrs
          const energyAdded = (2.3 * 0.1) / 3600
          setDeliveredEnergy(e => e + energyAdded)
          
          // Slight power fluctuation for realism
          setCurrentPower(2.3 + (Math.random() * 0.04 - 0.02))
          
          if (next >= chargingSeconds) {
            clearInterval(timer)
            setIsCharging(false)
            return chargingSeconds
          }
          return next
        })
      }, 100)
    }
    return () => clearInterval(timer)
  }, [isCharging, elapsed, chargingSeconds])

  useEffect(() => () => cleanupCamera(), [])

  const cleanupCamera = () => {
    scanningRef.current = false
    if (frameReqId.current) cancelAnimationFrame(frameReqId.current)
    if (timeoutId.current) clearTimeout(timeoutId.current)
    if (videoRef.current?.srcObject) {
      ;(videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
  }

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !scanningRef.current) return
    const video = videoRef.current
    if (video.readyState < 2) {
      frameReqId.current = requestAnimationFrame(scanFrame)
      return
    }
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" })

    if (code) {
      if (code.data.trim().toLowerCase() === "infispark") {
        cleanupCamera()
        setScanning(false)
        setScanned(true)
        return
      }
    }
    frameReqId.current = requestAnimationFrame(scanFrame)
  }

  const startScanning = async () => {
    cleanupCamera()
    setScanning(true)
    setScanned(false)
    setError(false)
    setShowManualInput(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } })
      if (!videoRef.current) throw new Error()
      videoRef.current.srcObject = stream
      videoRef.current.setAttribute("playsinline", "true")
      const onLoaded = () => {
        videoRef.current?.play()
        scanningRef.current = true
        frameReqId.current = requestAnimationFrame(scanFrame)
      }
      if (videoRef.current.readyState >= 2) onLoaded()
      else videoRef.current.addEventListener("loadedmetadata", onLoaded, { once: true })
      timeoutId.current = setTimeout(() => { if (scanningRef.current) simulateError() }, 30_000)
    } catch (e) {
      setScanning(false)
      setError(true)
    }
  }

  const simulateError = () => { cleanupCamera(); setScanning(false); setError(true) }

  const handleManualEntry = () => {
    if (manualCode.trim().toLowerCase() === "infispark") {
      setScanned(true)
      setShowManualInput(false)
      setError(false)
    } else alert("Invalid Charger Logic")
  }

  const handlePayment = async () => {
    if (!scanned) return
    if (!(window as any).Razorpay) {
      const s = document.createElement("script")
      s.src = "https://checkout.razorpay.com/v1/checkout.js"
      document.body.appendChild(s)
      alert("System initializing...")
      return
    }

    const opts = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: selectedPlan.price * 100,
      currency: "INR",
      name: "SparkTech",
      description: `Charging Session: ${selectedPlan.label}`,
      handler: async (resp: any) => {
        const user = auth.currentUser
        if (!user) return
        const seconds = selectedPlan.id === "quick10" ? 10 : (selectedPlan.label.includes("Hour") ? Number.parseInt(selectedPlan.label) * 3600 : Number.parseInt(selectedPlan.label) * 60)
        await set(ref(db, "device/status"), seconds)
        const histRef = ref(db, `users/${user.uid}/history`)
        await set(push(histRef), {
          plan: selectedPlan.label,
          amount: selectedPlan.price,
          seconds,
          transactionId: resp.razorpay_payment_id,
          date: new Date().toISOString(),
        })
        setChargingSeconds(seconds)
        setElapsed(0)
        setDeliveredEnergy(0)
        setIsCharging(true)
        setShowSuccessModal(true)
      },
      prefill: { name: auth.currentUser?.displayName ?? "", email: auth.currentUser?.email ?? "" },
      theme: { color: "#00c853" },
    } as any
    ;new (window as any).Razorpay(opts).open()
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><Zap className={ "animate-bounce text-[#00c853]" } size={40} /></div>

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-sm border border-gray-100">
           <Lock className="w-16 h-16 text-[#00c853] mx-auto mb-6" />
           <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
           <p className="text-gray-500 mb-8">Please login to start your SparkTech journey.</p>
           <button onClick={() => router.push("/login")} className="w-full bg-[#00c853] text-white py-4 rounded-xl font-bold">Authenticate</button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col md:flex-row">
      <aside className="hidden md:flex w-72 bg-white border-r border-gray-100 flex-col p-8 gap-10">
        <div className="flex items-center gap-3">
          <Zap className="text-[#00c853] w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900">SparkTech</span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {[{ label: "Dashboard", icon: <LayoutDashboard size={20} />, active: true }, { label: "History", icon: <History size={20} />, active: false }].map((item, i) => (
            <button key={i} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${item.active ? "bg-green-50 text-[#00c853]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => auth.signOut()} className="flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500/60 transition-all font-bold text-sm"><LogOut size={20} />Sign Out</button>
      </aside>

      <header className="md:hidden bg-white p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2"><Zap className="text-[#00c853] w-6 h-6" /><span className="font-bold text-gray-900">SparkTech</span></div>
        <button onClick={() => auth.signOut()} className="text-red-500"><LogOut size={20} /></button>
      </header>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div><p className="text-[#00c853] text-xs font-bold uppercase tracking-widest mb-1">Session Verified</p><h1 className="text-3xl font-extrabold text-gray-900">Hello, {currentUser.displayName?.split(" ")[0] || "User"}</h1></div>
            <div className="bg-white border border-gray-100 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm">
               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">{currentUser.photoURL ? <Image src={currentUser.photoURL} alt="User" width={40} height={40} /> : <User className="text-gray-300" />}</div>
               <div><p className="text-gray-900 font-bold text-xs">{currentUser.displayName || currentUser.email}</p><p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Premium Member</p></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <section className="space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
                <div className="relative aspect-square md:aspect-[4/3] bg-gray-900 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {!scanning && !scanned && !error && !showManualInput && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="idle" className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-[#00c853]"><QrCode size={40} /></div>
                        <h3 className="text-xl font-bold mb-8">Scan QR to Charge</h3>
                        <div className="flex flex-col w-full gap-3 max-w-[260px]">
                           <button onClick={startScanning} className="w-full bg-[#00c853] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-500/20">Open Camera</button>
                           <button onClick={() => setShowManualInput(true)} className="w-full bg-gray-50 text-gray-500 py-4 rounded-xl font-bold">Manual Entry</button>
                        </div>
                      </motion.div>
                    )}
                    {showManualInput && !scanned && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="manual" className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-white">
                         <h3 className="text-xl font-bold mb-6">Enter Hub Secret</h3>
                         <input type="text" placeholder="e.g. infispark" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-center text-lg font-bold focus:ring-[#00c853] transition-all" value={manualCode} onChange={(e) => setManualCode(e.target.value)} />
                         <div className="flex w-full gap-3 mt-8"><button onClick={handleManualEntry} className="flex-1 bg-[#00c853] text-white py-4 rounded-xl font-bold">Verify</button><button onClick={() => setShowManualInput(false)} className="px-6 bg-gray-50 text-gray-500 py-4 rounded-xl font-bold">Cancel</button></div>
                      </motion.div>
                    )}
                    {scanning && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="scanning" className="absolute inset-0">
                         <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted />
                         <canvas ref={canvasRef} className="hidden" />
                         <div className="absolute inset-0 border-[40px] border-black/60"><div className="absolute inset-0 border-2 border-[#00c853] rounded-3xl" /></div>
                      </motion.div>
                    )}
                    {scanned && (
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} key="success" className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#00c853]">
                        <CheckCircle2 className="w-20 h-20 text-white mb-4" /><h3 className="text-2xl font-black text-white">Station Ready</h3>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {scanned && (
                  <div className="p-8 space-y-8 bg-white">
                    <div className="grid grid-cols-2 gap-3"><div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Hub ID</p><p className="font-bold text-sm">{chargerInfo.id}</p></div><div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Rate</p><p className="font-bold text-sm">{chargerInfo.rate}</p></div></div>
                    <div className="space-y-3"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selection</p>
                      <div className="grid grid-cols-1 gap-2">
                        {plans.map((p) => (<button key={p.id} onClick={() => setSelectedPlan(p)} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selectedPlan.id === p.id ? "bg-green-50 border-[#00c853]" : "bg-white border-gray-100"}`}><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedPlan.id === p.id ? "bg-[#00c853] text-white" : "bg-gray-50 text-gray-400"}`}>{p.icon}</div><span className="font-bold text-sm">{p.label}</span></div><span className="font-bold text-[#00c853]">₹{p.price}</span></button>))}
                      </div>
                    </div>
                    <button onClick={handlePayment} className="w-full bg-[#00c853] text-white py-5 rounded-2xl font-black text-base shadow-lg shadow-green-500/30">Authorize & Start Charge</button>
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-8">
               <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Recent Sessions</h4>
                  <div className="space-y-4">
                     {history.map((h, i) => (<div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#00c853] shadow-sm"><Zap size={20} /></div><div><p className="font-bold text-sm">{h.plan}</p><p className="text-[10px] text-gray-400 font-bold">{new Date(h.date).toLocaleDateString()}</p></div></div><p className="font-bold text-[#00c853]">₹{h.amount}</p></div>))}
                  </div>
               </div>
               <div className="bg-[#00c853] rounded-[2.5rem] p-8 text-white h-64 flex flex-col justify-between shadow-xl">
                  <div><Sparkles className="w-10 h-10 mb-4 opacity-50" /><h3 className="text-2xl font-black mb-2">Power Hub A4</h3><p className="text-white/80 text-sm">Optimal charging conditions detected. 230V @ 10A stability confirmed.</p></div>
                  <button className="bg-white text-[#00c853] px-6 py-2 rounded-xl font-bold text-xs uppercase self-start">Specs</button>
               </div>
            </aside>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full shadow-2xl overflow-hidden relative border border-gray-100">
               
               {/* 📊 Live Simulation HUD */}
               <div className="text-center space-y-8 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00c853]">High Frequency Power Link</p>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">System Engaged</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center">
                        <Activity className="text-[#00c853] mb-2" size={24} />
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Voltage Rate</p>
                        <p className="text-xl font-black text-gray-900">230.1V</p>
                     </div>
                     <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center">
                        <Gauge className="text-[#00c853] mb-2" size={24} />
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Current Draw</p>
                        <p className="text-xl font-black text-gray-900">{currentPower.toFixed(2)}A</p>
                     </div>
                  </div>

                  {/* Battery Simulation */}
                  <div className="relative py-10">
                      <div className="flex justify-between items-end mb-4 px-2">
                         <div className="text-left">
                           <p className="text-[9px] font-bold text-gray-400 uppercase">Energy Delivered</p>
                           <p className="text-4xl font-black text-[#00c853]">{deliveredEnergy.toFixed(6)} <span className="text-sm">kWh</span></p>
                         </div>
                         <div className="text-right">
                           <p className="text-[9px] font-bold text-gray-400 uppercase">Elapsed</p>
                           <p className="text-xl font-bold text-gray-900">{elapsed.toFixed(1)}s / {chargingSeconds}s</p>
                         </div>
                      </div>
                      
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(elapsed / chargingSeconds) * 100}%` }}
                           className="h-full bg-gradient-to-r from-[#00c853] to-[#00e676]" 
                         />
                      </div>
                      
                      <div className="mt-6 flex justify-center items-center gap-6">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00c853] rounded-full animate-ping" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Stream</span>
                         </div>
                         {elapsed < chargingSeconds ? (
                           <div className="px-4 py-1.5 bg-green-50 rounded-full flex items-center gap-2">
                              <Zap size={12} className="text-[#00c853] fill-[#00c853]" />
                              <span className="text-[10px] font-black text-[#00c853] uppercase">Charging...</span>
                           </div>
                         ) : (
                           <div className="px-4 py-1.5 bg-gray-100 rounded-full flex items-center gap-2">
                              <CheckCircle2 size={12} className="text-gray-400" />
                              <span className="text-[10px] font-black text-gray-400 uppercase">Completed</span>
                           </div>
                         )}
                      </div>
                  </div>

                  <button 
                    disabled={isCharging}
                    onClick={() => setShowSuccessModal(false)} 
                    className={`w-full py-5 rounded-2xl font-black text-sm transition-all ${isCharging ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white shadow-xl hover:scale-[1.02]"}`}
                  >
                    {isCharging ? "Transferring Ions..." : "Acknowledge Sequence"}
                  </button>
               </div>

               {/* Background Decorative */}
               <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c853] to-transparent opacity-20" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
