"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Zap, ChevronRight, ArrowRight, Leaf, Globe, Timer, Shield, Settings, Smartphone, Cloud, LineChart, Linkedin, Mail, Twitter, ChevronDown, Play, ArrowUpRight } from 'lucide-react'
import { motion } from "framer-motion"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // References for sections to be animated
  const heroRef = useRef<HTMLElement>(null)
  const productsRef = useRef<HTMLElement>(null)
  const solutionsRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const teamRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  // Observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")

          // Update active section for navigation
          if (entry.target.id) {
            setActiveSection(entry.target.id)
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)

    // Observe all sections
    const sections = [
      heroRef.current,
      productsRef.current,
      solutionsRef.current,
      statsRef.current,
      teamRef.current,
      ctaRef.current,
    ]

    sections.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to section smoothly
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8
      }
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#121212] overflow-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md py-3 shadow-sm" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="relative w-10 h-10 bg-[#00c853] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="ml-2 text-sm font-semibold tracking-wider">
              <span className="text-[#00c853]">EV</span>ENERGY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { name: "Products", id: "products" },
              { name: "Solutions", id: "solutions" },
              { name: "Statistics", id: "stats" },
              { name: "Team", id: "team" },
              { name: "Company", id: "company" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === item.id ? "text-[#00c853]" : "text-gray-800 hover:text-[#00c853]"
                }`}
              >
                {item.name}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00c853] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link
              href="/contact"
              className="hidden sm:flex bg-[#00c853] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#00b048] transition-colors shadow-sm hover:shadow-md hover:shadow-[#00c853]/20"
            >
              Contact Us
            </Link>
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5 text-[#121212]" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#00c853] rounded-full text-white text-[10px] flex items-center justify-center">
                2
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-gray-800 transition-transform ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-gray-800 transition-opacity ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-gray-800 transition-transform ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden absolute w-full bg-white shadow-lg transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {[
                { name: "Products", id: "products" },
                { name: "Solutions", id: "solutions" },
                { name: "Statistics", id: "stats" },
                { name: "Team", id: "team" },
                { name: "Company", id: "company" },
                { name: "Contact Us", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-800 hover:text-[#00c853] py-2 text-left border-b border-gray-100 flex justify-between items-center"
                >
                  {item.name}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative pt-20 opacity-0 transform translate-y-6 transition-all duration-1000"
        style={{
          backgroundImage: "url('https://cdn.prod.website-files.com/63053218ec1dde0a99cc4fee/66bb45f7ad7e0b19b50c7a07_Cost%20and%20Benefits%20of%20Solar-Powered%20EV%20Charging%20Stations.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10"></div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 sm:px-6 relative z-20 text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center"
        >
          <div>
            <motion.div variants={fadeInUp} className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-[#00c853] rounded-full mr-2 animate-pulse"></span>
              Revolutionizing EV Charging Technology
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              The Future of
              <span className="text-[#00c853] block mt-2">Electric Mobility</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 mb-8">
              Pioneering smart charging solutions for a sustainable future. Join us in building the next generation of
              EV infrastructure with cutting-edge technology.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/home"
                className="bg-[#00c853] text-white px-8 py-4 rounded-full text-base font-medium hover:bg-[#00b048] transition-colors shadow-lg hover:shadow-xl hover:shadow-[#00c853]/20 w-full sm:w-auto flex items-center justify-center gap-2 group"
              >
                Charge Your Vehicle
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#solutions"
                className="border-2 border-white/30 text-white px-8 py-[0.9rem] rounded-full text-base font-medium hover:bg-white/10 transition-colors w-full sm:w-auto backdrop-blur-sm"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection("solutions")
                }}
              >
                Our Technology
              </Link>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="mt-12 hidden md:flex items-center gap-6"
            >
              <button className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-[#00c853] transition-colors">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
                <span>Watch Demo</span>
              </button>
              
              <div className="h-8 w-px bg-white/20"></div>
              
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                    <Image 
                      src={`/avatar-${i}.jpg`} 
                      width={32} 
                      height={32} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#00c853] flex items-center justify-center text-xs text-white">
                  +2k
                </div>
              </div>
              <span className="text-white/80 text-sm">Trusted by thousands of EV owners</span>
            </motion.div>
          </div>

          <motion.div 
            variants={fadeIn}
            className="hidden lg:block relative h-[600px] mt-12 lg:mt-0"
          >
            <div className="absolute inset-0 bg-[#00c853]/10 rounded-2xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transform -rotate-3 transition-transform hover:rotate-0 duration-500 border border-white/20">
              <div className="w-full h-full relative">
                <Image
                  src="https://mgmotor.scene7.com/is/image/mgmotor/evpedia-bn-0060?$mg-rgb-4k-image-responsive$"
                  alt="Smart EV Charging"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold">Smart Charging</h3>
                        <p className="text-white/70 text-sm">Optimized for your vehicle</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#00c853] flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#00c853] h-full w-[75%]"></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">75% Charged</span>
                        <span className="text-white font-medium">45 min remaining</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
          <button 
            onClick={() => scrollToSection("products")}
            className="animate-bounce bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        ref={productsRef}
        className="py-24 bg-white opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#00c853]/10 px-4 py-2 rounded-full text-[#00c853] text-sm mb-4">
              <span className="w-2 h-2 bg-[#00c853] rounded-full mr-2"></span>
              Innovative Solutions
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">Smart Charging Ecosystem</h2>
            <div className="w-20 h-1 bg-[#00c853] mx-auto mt-6 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              Our comprehensive range of charging solutions designed to meet the needs of individual EV owners, businesses, and charging networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Home Smart Hub",
                description: "Intelligent residential charging with dynamic load balancing and solar integration",
                image: "https://m.media-amazon.com/images/I/61U2CznrhSL._AC_UF1000,1000_QL80_.jpg",
                features: ["Smart scheduling", "Solar integration", "Mobile control", "Energy insights"],
                badge: "Best Seller"
              },
              {
                title: "Commercial Station",
                description: "Enterprise-grade charging infrastructure for businesses and public spaces",
                image: "https://cdn.shopify.com/s/files/1/0213/7895/7412/files/DALL_E_2024-09-24_15.16.00_-_A_composite_image_focused_on_EV_charger_stations._The_scene_includes_a_modern_EV_charging_station_with_multiple_charging_units_connected_to_electric.webp?v=1727171177",
                features: ["Fleet management", "Load distribution", "Payment system", "24/7 support"],
                badge: "New"
              },
              {
                title: "Network Control",
                description: "Advanced management platform for charging networks with real-time analytics",
                image: "https://chargedevs.com/wp-content/uploads/2023/07/HIA-WM-LNCA-EVC1-48-SV1-17-copy.jpg",
                features: ["Real-time monitoring", "Predictive maintenance", "Usage analytics", "Remote control"],
                badge: null
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-[#00c853]/30"
              >
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src={product.image || ""}
                    alt={product.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {product.badge && (
                    <div className="absolute top-4 right-4 bg-[#00c853] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{product.title}</h3>
                  <p className="text-gray-600 mb-6">{product.description}</p>

                  <ul className="mb-8 space-y-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <div className="w-5 h-5 rounded-full bg-[#00c853]/10 flex items-center justify-center mr-3">
                          <span className="w-2 h-2 bg-[#00c853] rounded-full"></span>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href="#" 
                    className="inline-flex items-center text-[#00c853] hover:text-[#00b048] font-medium group"
                  >
                    <span>Discover more</span>
                    <div className="ml-2 w-6 h-6 rounded-full border border-[#00c853] flex items-center justify-center group-hover:bg-[#00c853] transition-colors">
                      <ArrowUpRight className="w-3 h-3 text-[#00c853] group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Stats Section */}
      <section
        id="stats"
        ref={statsRef}
        className="py-24 bg-[#f9fafb] opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#00c853]/10 px-4 py-2 rounded-full text-[#00c853] text-sm mb-4">
              <span className="w-2 h-2 bg-[#00c853] rounded-full mr-2"></span>
              Our Impact
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">Driving Sustainable Change</h2>
            <div className="w-20 h-1 bg-[#00c853] mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="w-10 h-10 text-[#00c853]" />,
                value: "100%",
                label: "Green Energy",
                description: "All our charging stations powered by renewable energy"
              },
              {
                icon: <Globe className="w-10 h-10 text-[#00c853]" />,
                value: "12+",
                label: "Countries",
                description: "Global presence across major markets"
              },
              {
                icon: <Timer className="w-10 h-10 text-[#00c853]" />,
                value: "24/7",
                label: "Support",
                description: "Round-the-clock customer assistance"
              },
              {
                icon: <Shield className="w-10 h-10 text-[#00c853]" />,
                value: "ISO",
                label: "Certified",
                description: "Meeting international quality standards"
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group hover:border-[#00c853]/30 border border-transparent"
              >
                <div className="bg-[#00c853]/10 p-4 rounded-full mb-6 group-hover:bg-[#00c853]/20 transition-colors">
                  {stat.icon}
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-[#00c853] font-semibold mb-3">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section
  id="solutions"
  ref={solutionsRef}
  className="py-16 bg-white opacity-0 transform translate-y-10 transition-all duration-1000"
>
  <div className="container mx-auto px-4 sm:px-6">
    <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
      
      {/* Text Column */}
      <div className="w-full md:w-1/2 order-2 md:order-1 text-center md:text-left">
        <div className="inline-flex items-center bg-[#00c853]/10 px-4 py-2 rounded-full text-[#00c853] text-sm mb-4 mx-auto md:mx-0">
          <span className="w-2 h-2 bg-[#00c853] rounded-full mr-2"></span>
          Our Technology
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-2 mb-4 sm:mb-6">
          Next-Gen Charging Platform
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg max-w-screen-sm mx-auto md:mx-0">
          Our innovative charging platform combines cutting-edge hardware with intelligent software to deliver an unmatched charging experience. Built for the future of mobility with AI-powered optimization.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {[
            {
              icon: <Settings className="w-6 h-6" />,
              title: "Smart Optimization",
              description: "AI-powered charging algorithms that adapt to your usage patterns",
            },
            {
              icon: <Smartphone className="w-6 h-6" />,
              title: "Mobile Integration",
              description: "Seamless app control for monitoring and managing your charging",
            },
            {
              icon: <Cloud className="w-6 h-6" />,
              title: "Cloud Platform",
              description: "Real-time monitoring and updates via secure cloud infrastructure",
            },
            {
              icon: <LineChart className="w-6 h-6" />,
              title: "Analytics",
              description: "Advanced usage insights and optimization recommendations",
            },
          ].map((feature, index) => (
            <div key={index} className="flex items-start group">
              <div className="flex-shrink-0">
                <div className="bg-[#00c853]/10 rounded-xl p-3 sm:p-4 mr-3 group-hover:bg-[#00c853]/20 transition-colors">
                  <div className="text-[#00c853]">{feature.icon}</div>
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center md:justify-start">
          <Link
            href="#"
            className="inline-flex items-center text-[#00c853] hover:text-[#00b048] font-medium group"
          >
            <span>Explore our technology</span>
            <div className="ml-2 w-6 h-6 rounded-full border border-[#00c853] flex items-center justify-center group-hover:bg-[#00c853] transition-colors">
              <ArrowUpRight className="w-3 h-3 text-[#00c853] group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>
      </div>

      {/* Image Column */}
      <div className="w-full md:w-1/2 relative order-1 md:order-2">
        <div className="relative h-64 sm:h-80 md:h-[550px]">
          <div className="absolute -inset-3 sm:-inset-4 bg-[#00c853]/5 rounded-2xl transform rotate-3"></div>
          <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="https://thumbs.dreamstime.com/b/modern-electric-cars-charge-futuristic-charging-stations-wind-turbines-solar-panels-renewable-energy-generation-338779666.jpg"
              alt="Advanced Charging Technology"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00c853]/30 to-transparent mix-blend-overlay"></div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-xs mx-auto md:mx-0">
          <div className="flex items-center mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00c853]/10 flex items-center justify-center mr-2 sm:mr-3">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#00c853]" />
            </div>
            <h4 className="text-base sm:text-lg font-bold">Innovation First</h4>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Pioneering the future of EV charging technology with continuous research and development
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Team Section */}
      <section
        id="team"
        ref={teamRef}
        className="py-24 bg-[#f9fafb] opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#00c853]/10 px-4 py-2 rounded-full text-[#00c853] text-sm mb-4">
              <span className="w-2 h-2 bg-[#00c853] rounded-full mr-2"></span>
              Our Team
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">Meet Our Experts</h2>
            <div className="w-20 h-1 bg-[#00c853] mx-auto mt-6 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              Our talented team of professionals is dedicated to revolutionizing the EV charging industry with
              innovative solutions and sustainable technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Maaz Arshad Khan",
                role: "Electrical Engineering Lead",
                image: "/30.jpg",
                social: {
                  linkedin: "#",
                  twitter: "#",
                  email: "mailto:maaz@example.com",
                },
              },
              {
                name: "Zaid Naim Baig Mirza",
                role: "Hardware Development Specialist",
                image: "/28.jpg",
                social: {
                  linkedin: "#",
                  twitter: "#",
                  email: "mailto:zaid@example.com",
                },
              },
              {
                name: "Mohd Faiz Khan",
                role: "Software Integration Expert",
                image: "/29.jpg",
                social: {
                  linkedin: "#",
                  twitter: "#",
                  email: "mailto:faiz@example.com",
                },
              },
              {
                name: "Khan Junaid Sadullah",
                role: "Product Innovation Director",
                image: "/27.jpg",
                social: {
                  linkedin: "#",
                  twitter: "#",
                  email: "mailto:junaid@example.com",
                },
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <div className="w-full h-full relative">
                    <Image
                      src={member.image || "/placeholder.svg?height=400&width=300"}
                      alt={member.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-[#00c853] text-sm mb-4">{member.role}</p>
                  <div className="flex space-x-3">
                    <a
                      href={member.social.linkedin}
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#00c853] hover:text-white transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#00c853] hover:text-white transition-colors"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={member.social.email}
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#00c853] hover:text-white transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="company" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#00c853]/10 px-4 py-2 rounded-full text-[#00c853] text-sm mb-4">
              <span className="w-2 h-2 bg-[#00c853] rounded-full mr-2"></span>
              Our Vision
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">Empowering Electric Mobility</h2>
            <div className="w-20 h-1 bg-[#00c853] mx-auto mt-6 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              We're on a mission to accelerate the world's transition to sustainable energy through innovative charging solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description:
                  "Pushing the boundaries of charging technology to create smarter, faster, and more efficient solutions for the future of mobility.",
                icon: <Settings className="w-8 h-8 text-[#00c853]" />
              },
              {
                title: "Sustainability",
                description:
                  "Committed to 100% renewable energy integration and reducing the carbon footprint of transportation worldwide.",
                icon: <Leaf className="w-8 h-8 text-[#00c853]" />
              },
              {
                title: "Accessibility",
                description: 
                  "Making electric vehicle charging accessible and convenient for everyone, everywhere, breaking down barriers to EV adoption.",
                icon: <Globe className="w-8 h-8 text-[#00c853]" />
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#f9fafb] rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 group hover:border-[#00c853]/30 border border-transparent"
              >
                <div className="bg-[#00c853]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#00c853]/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        ref={ctaRef}
        className="py-24 bg-[#00c853] relative overflow-hidden opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="absolute inset-0">
          <Image
            src="https://cdn.prod.website-files.com/63053218ec1dde0a99cc4fee/66bb45f7ad7e0b19b50c7a07_Cost%20and%20Benefits%20of%20Solar-Powered%20EV%20Charging%20Stations.jpg"
            alt="EV Charging Background"
            fill
            className="object-cover opacity-10"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-6">
              Join the Electric Revolution
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/90 text-lg mb-10">
              Be part of the future of sustainable transportation. Let's build the charging infrastructure of tomorrow, together.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-[#00c853] px-8 py-4 rounded-full text-base font-medium hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl hover:shadow-black/10 flex items-center gap-2 group w-full sm:w-auto justify-center"
              >
                Partner with Us
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/demo"
                className="bg-transparent text-white border-2 border-white px-8 py-[0.9rem] rounded-full text-base font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                Book a Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-white">
            <path fill="currentColor" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <Link href="/" className="flex items-center mb-6">
                <div className="relative w-10 h-10 bg-[#00c853] rounded-full flex items-center justify-center">
                  <Zap className="text-white w-6 h-6" />
                </div>
                <span className="ml-2 text-sm uppercase tracking-wider font-medium">
                  <span className="text-[#00c853]">EV</span>Energy
                </span>
              </Link>
              <p className="text-gray-400 mb-6">
                Powering the future of electric mobility with innovative charging solutions.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "instagram"].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#00c853] hover:border-[#00c853] transition-colors"
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
              {
                title: "Products",
                links: ["Home Charger", "Fast Charger", "Network Hub", "Fleet Solutions", "Accessories"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Press", "Blog", "Contact Us"],
              },
              {
                title: "Support",
                links: ["Help Center", "Installation", "Maintenance", "FAQs", "Partner Portal"],
              },
            ].map((category, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-lg mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-[#00c853] transition-colors text-sm flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-[#00c853]/60 rounded-full mr-2"></span>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} EV Energy. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <Link href="#" className="hover:text-[#00c853] transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-[#00c853] transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-[#00c853] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation styles */}
      <style jsx global>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </main>
  )
}
