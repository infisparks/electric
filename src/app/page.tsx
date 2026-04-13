"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Zap, ChevronRight, ArrowRight, Leaf, Globe, Timer, Shield, Settings, Smartphone, Cloud, LineChart, Linkedin, Mail, Twitter, ChevronDown, Play, ArrowUpRight, Menu, X, Sparkles, Battery, Cpu } from 'lucide-react'
import { motion, useScroll, useTransform } from "framer-motion"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const productsRef = useRef<HTMLElement>(null)
  const solutionsRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const teamRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 600], [0, 120])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20px",
      threshold: 0.08,
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
          if (entry.target.id) {
            setActiveSection(entry.target.id)
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    const sections = [heroRef.current, productsRef.current, solutionsRef.current, statsRef.current, teamRef.current, ctaRef.current]
    sections.forEach((section) => { if (section) observer.observe(section) })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: "smooth" })
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.9 } }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  }

  const teamMembers = [
    {
      name: "Abu Wakas Siddique",
      role: "Software Expert",
      image: "/team/Abu Wakas Siddique.jpeg",
      social: { linkedin: "#", twitter: "#", email: "mailto:abu@sparktech.io" },
    },
    {
      name: "Khan Numan Abdul Sami",
      role: "Hardware Specialist",
      image: "/team/Khan Numan abdul sami.jpeg",
      social: { linkedin: "#", twitter: "#", email: "mailto:numan@sparktech.io" },
    },
    {
      name: "Khan Saad Abdulaziz",
      role: "Software Expert",
      image: "/team/Khana Saad Abdulaziz.jpeg",
      social: { linkedin: "#", twitter: "#", email: "mailto:saad@sparktech.io" },
    },
    {
      name: "Khan Zeeshan Abrar",
      role: "Hardware Specialist",
      image: "/team/Khana zeeshan Abrar.jpeg",
      social: { linkedin: "#", twitter: "#", email: "mailto:zeeshan@sparktech.io" },
    },
  ]

  return (
    <main className="min-h-screen bg-[#080c14] text-white overflow-hidden" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#080c14]/90 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl shadow-black/30"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00e676] to-[#00b248] rounded-xl rotate-3 group-hover:rotate-0 transition-transform duration-300" />
              <Zap className="relative text-white w-5 h-5 z-10" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              <span className="text-[#00e676]">Spark</span>Tech
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { name: "Products", id: "products" },
              { name: "Statistics", id: "stats" },
              { name: "Team", id: "team" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  activeSection === item.id ? "text-[#00e676]" : "text-white/70 hover:text-white"
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-px bg-[#00e676] transition-all duration-300 ${activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute w-full bg-[#0d1220]/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300 overflow-hidden ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="container mx-auto px-5 py-5">
            <nav className="flex flex-col gap-1">
              {[
                { name: "Products", id: "products" },
                { name: "Statistics", id: "stats" },
                { name: "Team", id: "team" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white/70 hover:text-white py-3 text-left border-b border-white/5 flex justify-between items-center hover:bg-white/5 px-2 rounded-lg transition-colors"
                >
                  {item.name}
                  <ChevronRight className="w-4 h-4 text-[#00e676]" />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section
        id="hero"
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated BG */}
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/sparktech-hero.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/80 via-[#080c14]/50 to-[#080c14] z-10" />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00e676]/10 rounded-full blur-3xl z-10 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#0070f3]/10 rounded-full blur-3xl z-10" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-5 sm:px-8 relative z-20 text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center"
        >
          <div>
            <motion.div variants={fadeInUp} className="inline-flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-white/80 text-sm mb-7 border border-white/10 gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00e676]" />
              Revolutionizing EV Charging Technology
              <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-pulse" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              The Future of
              <span className="block bg-gradient-to-r from-[#00e676] via-[#69f0ae] to-[#00b248] bg-clip-text text-transparent mt-1">
                Electric Mobility
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-white/60 max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed">
              Pioneering smart charging solutions for a sustainable future. Join us in building the next
              generation of EV infrastructure with <span className="text-white/90 font-medium">AI-powered technology</span>.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/home"
                className="group relative bg-gradient-to-r from-[#00e676] to-[#00b248] text-[#080c14] px-8 py-4 rounded-full text-base font-bold hover:shadow-2xl hover:shadow-[#00e676]/30 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Charge Your Vehicle
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => scrollToSection("solutions")}
                className="border border-white/20 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
              >
                Our Technology
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 hidden md:flex items-center gap-6">
              <button className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15 group-hover:bg-[#00e676]/20 group-hover:border-[#00e676]/40 transition-all duration-300">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
                <span className="text-sm">Watch Demo</span>
              </button>
              <div className="h-6 w-px bg-white/15" />
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    "/team/Abu Wakas Siddique.jpeg",
                    "/team/Khan Numan abdul sami.jpeg",
                    "/team/Khana Saad Abdulaziz.jpeg",
                    "/team/Khana zeeshan Abrar.jpeg",
                  ].map((src, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#080c14] overflow-hidden bg-gray-700">
                      <Image src={src} width={36} height={36} alt="Team member" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-white/60 text-sm">Trusted by <span className="text-white font-semibold">2,000+</span> EV owners</span>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeIn} className="hidden lg:block relative h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00e676]/20 to-[#0070f3]/10 rounded-3xl transform rotate-2 blur-sm" />
            <div className="absolute inset-2 bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/10 transform -rotate-1 hover:rotate-0 transition-transform duration-700">
              <Image
                src="https://mgmotor.scene7.com/is/image/mgmotor/evpedia-bn-0060?$mg-rgb-4k-image-responsive$"
                alt="Smart EV Charging"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/15">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-white/50 mb-0.5">SparkTech AI</p>
                      <h3 className="text-white font-bold">Smart Charging</h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00e676] to-[#00b248] flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#080c14]" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                        className="bg-gradient-to-r from-[#00e676] to-[#00b248] h-full rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/50">75% Charged</span>
                      <span className="text-[#00e676] font-semibold">45 min remaining</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
          <button onClick={() => scrollToSection("products")} className="animate-bounce bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-full transition-colors backdrop-blur-sm">
            <ChevronDown className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </section>

      {/* ── PRODUCTS SECTION ── */}
      <section
        id="products"
        ref={productsRef}
        className="py-28 bg-[#080c14] opacity-0 transform translate-y-10 transition-all duration-1000 relative"
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="container mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-[#00e676]/10 border border-[#00e676]/20 px-4 py-2 rounded-full text-[#00e676] text-xs font-semibold mb-5 gap-2 tracking-wider uppercase">
              <Cpu className="w-3.5 h-3.5" />
              Innovative Solutions
            </div>
            <h2 className="text-4xl md:text-6xl font-black mt-2 tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              Smart Charging{" "}
              <span className="bg-gradient-to-r from-[#00e676] to-[#69f0ae] bg-clip-text text-transparent">Ecosystem</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00e676] to-[#00b248] mx-auto mt-7 rounded-full" />
            <p className="text-white/50 max-w-2xl mx-auto mt-6 text-base leading-relaxed">
              Our comprehensive range of charging solutions designed to meet every need — from individual EV owners to enterprise networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                title: "Home Smart Hub",
                description: "Intelligent residential charging with dynamic load balancing and solar integration",
                image: "https://m.media-amazon.com/images/I/61U2CznrhSL._AC_UF1000,1000_QL80_.jpg",
                features: ["Smart scheduling", "Solar integration", "Mobile control", "Energy insights"],
                badge: "Best Seller",
                badgeColor: "from-[#00e676] to-[#00b248]",
              },
              {
                title: "Commercial Station",
                description: "Enterprise-grade charging infrastructure for businesses and public spaces",
                image: "https://cdn.shopify.com/s/files/1/0213/7895/7412/files/DALL_E_2024-09-24_15.16.00_-_A_composite_image_focused_on_EV_charger_stations._The_scene_includes_a_modern_EV_charging_station_with_multiple_charging_units_connected_to_electric.webp?v=1727171177",
                features: ["Fleet management", "Load distribution", "Payment system", "24/7 support"],
                badge: "New",
                badgeColor: "from-[#0070f3] to-[#0050d0]",
              },
              {
                title: "Network Control",
                description: "Advanced management platform for charging networks with real-time analytics",
                image: "https://chargedevs.com/wp-content/uploads/2023/07/HIA-WM-LNCA-EVC1-48-SV1-17-copy.jpg",
                features: ["Real-time monitoring", "Predictive maintenance", "Usage analytics", "Remote control"],
                badge: null,
                badgeColor: "",
              },
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-[#0d1220] rounded-2xl overflow-hidden border border-white/5 hover:border-[#00e676]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00e676]/10 hover:-translate-y-2"
              >
                <div className="h-60 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1220] via-transparent to-transparent" />
                  {product.badge && (
                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${product.badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide`}>
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-bold mb-2 text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>{product.title}</h3>
                  <p className="text-white/50 mb-6 text-sm leading-relaxed">{product.description}</p>
                  <ul className="mb-7 space-y-2.5">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-white/60 flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#00e676]/15 flex items-center justify-center flex-shrink-0">
                          <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-[#00e676] hover:text-white font-semibold text-sm group/link transition-colors duration-200"
                  >
                    Discover more
                    <div className="w-7 h-7 rounded-full border border-[#00e676]/40 flex items-center justify-center group-hover/link:bg-[#00e676] group-hover/link:border-[#00e676] transition-all duration-200">
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#00e676] group-hover/link:text-[#080c14] transition-colors" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section
        id="stats"
        ref={statsRef}
        className="py-28 opacity-0 transform translate-y-10 transition-all duration-1000 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a10 50%, #080c14 100%)" }}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#00e676]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0070f3]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-[#00e676]/10 border border-[#00e676]/20 px-4 py-2 rounded-full text-[#00e676] text-xs font-semibold mb-5 gap-2 tracking-wider uppercase">
              <Battery className="w-3.5 h-3.5" />
              Our Impact
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              Driving Sustainable{" "}
              <span className="bg-gradient-to-r from-[#00e676] to-[#69f0ae] bg-clip-text text-transparent">Change</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00e676] to-[#00b248] mx-auto mt-7 rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Leaf className="w-8 h-8 text-[#00e676]" />, value: "100%", label: "Green Energy", description: "All stations powered by renewable energy" },
              { icon: <Globe className="w-8 h-8 text-[#00e676]" />, value: "12+", label: "Countries", description: "Global presence across major markets" },
              { icon: <Timer className="w-8 h-8 text-[#00e676]" />, value: "24/7", label: "Support", description: "Round-the-clock customer assistance" },
              { icon: <Shield className="w-8 h-8 text-[#00e676]" />, value: "ISO", label: "Certified", description: "Meeting international quality standards" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/8 hover:border-[#00e676]/30 transition-all duration-400 hover:bg-white/8 text-center hover:-translate-y-1"
              >
                <div className="bg-[#00e676]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:bg-[#00e676]/20 transition-colors duration-300">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black text-white mb-1" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>{stat.value}</h3>
                <p className="text-[#00e676] font-semibold text-sm mb-2">{stat.label}</p>
                <p className="text-white/40 text-xs leading-relaxed">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS / TECHNOLOGY SECTION ── */}
      <section
        id="solutions"
        ref={solutionsRef}
        className="py-28 bg-[#080c14] opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="container mx-auto px-5 sm:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <div className="inline-flex items-center bg-[#00e676]/10 border border-[#00e676]/20 px-4 py-2 rounded-full text-[#00e676] text-xs font-semibold mb-6 gap-2 tracking-wider uppercase">
                <Settings className="w-3.5 h-3.5" />
                Our Technology
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                Next-Gen{" "}
                <span className="bg-gradient-to-r from-[#00e676] to-[#69f0ae] bg-clip-text text-transparent">Charging Platform</span>
              </h2>
              <p className="text-white/50 mb-9 text-base leading-relaxed max-w-md mx-auto md:mx-0">
                Our innovative platform combines cutting-edge hardware with intelligent software to deliver an unmatched charging experience — built on AI-powered optimization.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-9">
                {[
                  { icon: <Settings className="w-5 h-5" />, title: "Smart Optimization", description: "AI-powered algorithms adapting to your usage" },
                  { icon: <Smartphone className="w-5 h-5" />, title: "Mobile Integration", description: "Seamless app control and live monitoring" },
                  { icon: <Cloud className="w-5 h-5" />, title: "Cloud Platform", description: "Real-time updates via secure cloud infrastructure" },
                  { icon: <LineChart className="w-5 h-5" />, title: "Analytics", description: "Advanced usage insights and AI recommendations" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 bg-[#00e676]/10 rounded-xl p-3 group-hover:bg-[#00e676]/20 transition-colors border border-[#00e676]/10">
                      <div className="text-[#00e676]">{feature.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1 text-white text-sm">{feature.title}</h3>
                      <p className="text-white/40 text-xs leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 text-[#00e676] hover:text-white font-semibold text-sm group transition-colors duration-200"
              >
                Explore our technology
                <div className="w-7 h-7 rounded-full border border-[#00e676]/40 flex items-center justify-center group-hover:bg-[#00e676] group-hover:border-[#00e676] transition-all duration-200">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#00e676] group-hover:text-[#080c14] transition-colors" />
                </div>
              </Link>
            </div>

            <div className="w-full md:w-1/2 relative">
              <div className="relative h-72 sm:h-96 md:h-[560px]">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#00e676]/10 to-[#0070f3]/5 rounded-3xl transform rotate-2" />
                <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/50 border border-white/10">
                  <Image
                    src="https://thumbs.dreamstime.com/b/modern-electric-cars-charge-futuristic-charging-stations-wind-turbines-solar-panels-renewable-energy-generation-338779666.jpg"
                    alt="Advanced Charging Technology"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00e676]/15 to-transparent mix-blend-overlay" />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-[#0d1220]/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 border border-white/10 max-w-[220px]">
                  <div className="flex items-center mb-3 gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#00e676]/15 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-[#00e676]" />
                    </div>
                    <h4 className="font-bold text-white text-sm">Innovation First</h4>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">
                    Pioneering the future with continuous R&D in EV charging
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ── */}
      <section
        id="team"
        ref={teamRef}
        className="py-28 opacity-0 transform translate-y-10 transition-all duration-1000 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #080c14 0%, #0a0f1e 50%, #080c14 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #00e676 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="container mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-[#00e676]/10 border border-[#00e676]/20 px-4 py-2 rounded-full text-[#00e676] text-xs font-semibold mb-5 gap-2 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Our Team
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              Meet the{" "}
              <span className="bg-gradient-to-r from-[#00e676] to-[#69f0ae] bg-clip-text text-transparent">Visionaries</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00e676] to-[#00b248] mx-auto mt-7 rounded-full" />
            <p className="text-white/50 max-w-2xl mx-auto mt-6 leading-relaxed">
              Our talented professionals are dedicated to revolutionizing the EV charging industry with innovative solutions and sustainable technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-[#0d1220] rounded-3xl overflow-hidden border border-white/5 hover:border-[#00e676]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00e676]/10 hover:-translate-y-3"
              >
                {/* Photo */}
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Green top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00e676] to-[#00b248] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1220] via-[#0d1220]/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  {/* Social icons (appear on hover) */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    {[
                      { href: member.social.linkedin, icon: <Linkedin className="w-3.5 h-3.5" />, label: "LinkedIn" },
                      { href: member.social.twitter, icon: <Twitter className="w-3.5 h-3.5" />, label: "Twitter" },
                      { href: member.social.email, icon: <Mail className="w-3.5 h-3.5" />, label: "Email" },
                    ].map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        aria-label={s.label}
                        className="w-9 h-9 rounded-full bg-[#080c14]/80 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-[#00e676] hover:border-[#00e676] transition-all duration-200 text-white"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1 leading-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                        {member.name}
                      </h3>
                      <p className="text-[#00e676] text-xs font-medium">{member.role}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#00e676]/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#00e676]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION SECTION ── */}
      <section id="company" className="py-28 bg-[#080c14]">
        <div className="container mx-auto px-5 sm:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-[#00e676]/10 border border-[#00e676]/20 px-4 py-2 rounded-full text-[#00e676] text-xs font-semibold mb-5 gap-2 tracking-wider uppercase">
              <Globe className="w-3.5 h-3.5" />
              Our Vision
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              Empowering{" "}
              <span className="bg-gradient-to-r from-[#00e676] to-[#69f0ae] bg-clip-text text-transparent">Electric Mobility</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00e676] to-[#00b248] mx-auto mt-7 rounded-full" />
            <p className="text-white/50 max-w-2xl mx-auto mt-6 leading-relaxed">
              We&apos;re on a mission to accelerate the world&apos;s transition to sustainable energy through innovative charging solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                title: "Innovation",
                description: "Pushing the boundaries of charging technology to create smarter, faster, and more efficient solutions for the future of mobility.",
                icon: <Settings className="w-7 h-7 text-[#00e676]" />,
              },
              {
                title: "Sustainability",
                description: "Committed to 100% renewable energy integration and reducing the carbon footprint of transportation worldwide.",
                icon: <Leaf className="w-7 h-7 text-[#00e676]" />,
              },
              {
                title: "Accessibility",
                description: "Making electric vehicle charging accessible and convenient for everyone, everywhere, breaking down barriers to EV adoption.",
                icon: <Globe className="w-7 h-7 text-[#00e676]" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group bg-[#0d1220] rounded-2xl p-9 border border-white/5 hover:border-[#00e676]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#00e676]/5 hover:-translate-y-1.5"
              >
                <div className="bg-[#00e676]/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-7 group-hover:bg-[#00e676]/20 transition-colors border border-[#00e676]/10">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>{item.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section
        id="contact"
        ref={ctaRef}
        className="py-32 relative overflow-hidden opacity-0 transform translate-y-10 transition-all duration-1000"
        style={{ background: "linear-gradient(135deg, #00271a 0%, #001a30 50%, #00271a 100%)" }}
      >
        <div className="absolute inset-0">
          <Image
            src="/sparktech-hero.png"
            alt="Background"
            fill
            className="object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00e676]/5 via-transparent to-[#0070f3]/5" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00e676]/8 rounded-full blur-3xl" />

        <div className="container mx-auto px-5 sm:px-8 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white/70 text-xs font-semibold mb-7 gap-2 tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5 text-[#00e676]" />
              Join the Revolution
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Power the Future with{" "}
              <span className="bg-gradient-to-r from-[#00e676] to-[#69f0ae] bg-clip-text text-transparent">SparkTech</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/50 text-lg mb-11 leading-relaxed">
              Be part of the future of sustainable transportation. Let&apos;s build the charging infrastructure of tomorrow, together.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group bg-gradient-to-r from-[#00e676] to-[#00b248] text-[#080c14] px-9 py-4.5 rounded-full text-base font-bold hover:shadow-2xl hover:shadow-[#00e676]/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center"
                style={{ paddingTop: "1.1rem", paddingBottom: "1.1rem" }}
              >
                Partner with Us
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#"
                className="bg-white/5 text-white border border-white/15 px-9 rounded-full text-base font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
                style={{ paddingTop: "1.1rem", paddingBottom: "1.1rem" }}
              >
                Book a Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="text-[#080c14]">
            <path fill="currentColor" fillOpacity="1" d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z" />
          </svg>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080c14] pt-4 pb-12 text-white border-t border-white/5">
        <div className="container mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00e676] to-[#00b248] rounded-xl" />
                  <Zap className="relative text-[#080c14] w-5 h-5 z-10" strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  <span className="text-[#00e676]">Spark</span>Tech
                </span>
              </Link>
              <p className="text-white/40 mb-6 text-sm leading-relaxed">
                Powering the future of electric mobility with innovative smart charging solutions.
              </p>
              <div className="flex gap-3">
                {["facebook", "twitter", "linkedin", "instagram"].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-[#00e676] hover:border-[#00e676] hover:text-[#080c14] transition-all duration-200"
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 8h-1.35c-.538 0-.65.221-.65.778V10h2l-.209 2H13v7h-3v-7H8v-2h2V7.692C10 5.923 10.931 5 13.029 5H15v3z" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {[
              { title: "Solutions", links: ["Home Charging", "Fast Charging", "Network Management", "EV Fleet", "Accessories"] },
              { title: "SparkTech", links: ["About Infrastructure", "Technology", "Verified Statistics", "Our Team"] },
            ].map((category, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-base mb-5 text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>{category.title}</h3>
                <ul className="space-y-3">
                  {category.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link href="#" className="text-white/40 hover:text-[#00e676] transition-colors text-sm flex items-center gap-2 group">
                        <span className="w-1 h-1 bg-[#00e676]/40 rounded-full group-hover:bg-[#00e676] transition-colors" />
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} SparkTech. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-5 text-sm text-white/30">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <Link key={item} href="#" className="hover:text-[#00e676] transition-colors">{item}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Animation styles */}
      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @media (prefers-reduced-motion: no-preference) {
          html { scroll-behavior: smooth; }
        }
      `}</style>
    </main>
  )
}
