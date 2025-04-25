"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Zap,
  ChevronRight,
  ArrowRight,
  Leaf,
  Globe,
  Timer,
  Shield,
  Settings,
  Smartphone,
  Cloud,
  LineChart,
} from "lucide-react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // References for sections to be animated
  const heroRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const solutionsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");

          // Update active section for navigation
          if (entry.target.id) {
            setActiveSection(entry.target.id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      handleIntersect,
      observerOptions,
    );

    // Observe all sections
    const sections = [
      heroRef.current,
      productsRef.current,
      solutionsRef.current,
      statsRef.current,
      ctaRef.current,
    ];

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section smoothly
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-[#121212] overflow-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="relative w-10 h-10 bg-[#00c853] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="ml-2 text-sm font-semibold tracking-wider">
              <span className="text-[#00c853]">BOLT</span>.EARTH
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { name: "Products", id: "products" },
              { name: "Solutions", id: "solutions" },
              { name: "Statistics", id: "stats" },
              { name: "Company", id: "company" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === item.id
                    ? "text-[#00c853]"
                    : "text-gray-800 hover:text-[#00c853]"
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
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00c853]/5 via-white/40 to-white z-10"></div>
          <Image
            src="https://images.pexels.com/photos/7294543/pexels-photo-7294543.jpeg"
            alt="Modern EV Charging Station"
            fill
            priority
            className="object-cover object-center opacity-90"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-20 text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Revolutionizing
              <span className="text-[#00c853] block mt-2">EV Charging</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0 mb-8">
              Pioneering smart charging solutions for a sustainable future. Join
              us in building the next generation of EV infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {/* Changed button as requested */}
              <Link
                href="/home"
                className="bg-[#00c853] text-white px-8 py-4 rounded-full text-base font-medium hover:bg-[#00b048] transition-colors shadow-lg hover:shadow-xl hover:shadow-[#00c853]/20 w-full sm:w-auto flex items-center justify-center gap-2 group"
              >
                Charge Your Vehicle
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#about"
                className="border-2 border-[#00c853] text-[#00c853] px-8 py-[0.9rem] rounded-full text-base font-medium hover:bg-[#00c853]/5 transition-colors w-full sm:w-auto"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("solutions");
                }}
              >
                Our Technology
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative h-[500px] mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-[#00c853]/10 rounded-2xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden transform -rotate-3 transition-transform hover:rotate-0 duration-500">
              <Image
                src="https://images.pexels.com/photos/10553207/pexels-photo-10553207.jpeg"
                alt="Smart EV Charging"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        ref={productsRef}
        className="py-20 bg-white opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-[#00c853] text-sm font-semibold tracking-wider uppercase">
              Innovation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Smart Charging Solutions
            </h2>
            <div className="w-20 h-1 bg-[#00c853] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Home Hub",
                description:
                  "Intelligent residential charging with dynamic load balancing",
                image:
                  "https://images.pexels.com/photos/3894378/pexels-photo-3894378.jpeg",
                features: [
                  "Smart scheduling",
                  "Solar integration",
                  "Mobile control",
                  "Energy insights",
                ],
              },
              {
                title: "Commercial Station",
                description:
                  "Enterprise-grade charging infrastructure for businesses",
                image:
                  "https://images.pexels.com/photos/9511156/pexels-photo-9511156.jpeg",
                features: [
                  "Fleet management",
                  "Load distribution",
                  "Payment system",
                  "24/7 support",
                ],
              },
              {
                title: "Network Control",
                description:
                  "Advanced management platform for charging networks",
                image:
                  "https://images.pexels.com/photos/3859986/pexels-photo-3859986.jpeg",
                features: [
                  "Real-time monitoring",
                  "Predictive maintenance",
                  "Usage analytics",
                  "Remote control",
                ],
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className="h-52 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <ul className="mb-5 space-y-2">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-[#00c853] rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="#"
                    className="inline-flex items-center text-[#00c853] hover:underline font-medium"
                  >
                    Discover more
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
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
        className="py-16 bg-[#f9f9f9] opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Leaf className="w-8 h-8 text-[#00c853]" />,
                value: "100%",
                label: "Green Energy",
              },
              {
                icon: <Globe className="w-8 h-8 text-[#00c853]" />,
                value: "5+",
                label: "Countries",
              },
              {
                icon: <Timer className="w-8 h-8 text-[#00c853]" />,
                value: "24/7",
                label: "Support",
              },
              {
                icon: <Shield className="w-8 h-8 text-[#00c853]" />,
                value: "ISO",
                label: "Certified",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="bg-[#00c853]/10 p-3 rounded-full mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section
        id="solutions"
        ref={solutionsRef}
        className="py-20 bg-white opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 order-2 md:order-1">
              <span className="text-[#00c853] text-sm font-semibold tracking-wider uppercase">
                Our Technology
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                Next-Gen Charging Platform
              </h2>
              <p className="text-gray-600 mb-8">
                Our innovative charging platform combines cutting-edge hardware
                with intelligent software to deliver an unmatched charging
                experience. Built for the future of mobility.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    icon: <Settings className="w-5 h-5" />,
                    title: "Smart Optimization",
                    description: "AI-powered charging algorithms",
                  },
                  {
                    icon: <Smartphone className="w-5 h-5" />,
                    title: "Mobile Integration",
                    description: "Seamless app control",
                  },
                  {
                    icon: <Cloud className="w-5 h-5" />,
                    title: "Cloud Platform",
                    description: "Real-time monitoring",
                  },
                  {
                    icon: <LineChart className="w-5 h-5" />,
                    title: "Analytics",
                    description: "Advanced usage insights",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="bg-[#00c853]/10 rounded-lg p-2 mr-4">
                        <div className="bg-[#00c853] rounded-full p-1.5 w-8 h-8 flex items-center justify-center text-white">
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="#"
                className="inline-flex items-center text-[#00c853] hover:underline font-medium"
              >
                Explore technology
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="md:w-1/2 relative h-[450px] order-1 md:order-2">
              <div className="absolute -inset-4 bg-[#00c853]/5 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/7516544/pexels-photo-7516544.jpeg"
                  alt="Advanced Charging Technology"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#00c853]/30 to-transparent mix-blend-overlay"></div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-6 max-w-[220px]">
                <h4 className="text-lg font-bold mb-2">Innovation First</h4>
                <p className="text-sm text-gray-600">
                  Pioneering the future of EV charging technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="company" className="py-20 bg-[#f9f9f9]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-[#00c853] text-sm font-semibold tracking-wider uppercase">
              Our Vision
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Empowering Electric Mobility
            </h2>
            <div className="w-20 h-1 bg-[#00c853] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Innovation",
                description:
                  "Pushing the boundaries of charging technology to create smarter, faster, and more efficient solutions.",
              },
              {
                title: "Sustainability",
                description:
                  "Committed to 100% renewable energy integration and reducing the carbon footprint of mobility.",
              },
              {
                title: "Accessibility",
                description:
                  "Making electric vehicle charging accessible and convenient for everyone, everywhere.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
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
        className="py-20 bg-[#00c853] relative overflow-hidden opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/3847770/pexels-photo-3847770.jpeg"
            alt="EV Charging Background"
            fill
            className="object-cover opacity-10"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Join the Electric Revolution
          </h2>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Be part of the future of sustainable transportation. Let build
            the charging infrastructure of tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
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
                  <span className="text-[#00c853]">BOLT</span>.EARTH
                </span>
              </Link>
              <p className="text-gray-400 mb-6">
                Powering the future of electric mobility with innovative
                charging solutions.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "instagram"].map(
                  (social) => (
                    <Link
                      key={social}
                      href="#"
                      className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#00c853] hover:border-[#00c853] transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 8h-1.35c-.538 0-.65.221-.65.778V10h2l-.209 2H13v7h-3v-7H8v-2h2V7.692C10 5.923 10.931 5 13.029 5H15v3z" />
                      </svg>
                    </Link>
                  ),
                )}
              </div>
            </div>

            {[
              {
                title: "Products",
                links: [
                  "Home Charger",
                  "Fast Charger",
                  "Network Hub",
                  "Fleet Solutions",
                  "Accessories",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "Careers",
                  "Press",
                  "Blog",
                  "Contact Us",
                ],
              },
              {
                title: "Support",
                links: [
                  "Help Center",
                  "Installation",
                  "Maintenance",
                  "FAQs",
                  "Partner Portal",
                ],
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
              © {new Date().getFullYear()} Bolt.Earth. All rights reserved.
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
  );
}
