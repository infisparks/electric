"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ShoppingCart, Zap } from "lucide-react"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Animate elements when they come into view
      const elements = [heroRef, headingRef, productsRef]
      elements.forEach((ref) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight * 0.8
          if (isVisible) {
            ref.current.classList.add("animate-in")
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-white text-[#121212] overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md py-3 shadow-md" : "py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 bg-[#00c853] rounded-full flex items-center justify-center">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="ml-2 text-sm uppercase tracking-wider font-medium">BOLT.EARTH</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#products" className="text-sm hover:text-[#00c853] transition-colors">
              Products
            </Link>
            <Link href="#charging" className="text-sm hover:text-[#00c853] transition-colors">
              Charging Solutions
            </Link>
            <Link href="#company" className="text-sm hover:text-[#00c853] transition-colors">
              Company
            </Link>
            <Link href="#partner" className="text-sm hover:text-[#00c853] transition-colors">
              Partner with Us
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/contact"
              className="bg-[#00c853] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#00c853]/90 transition-colors"
            >
              Contact Us
            </Link>
            <button className="relative">
              <ShoppingCart className="w-5 h-5 text-[#121212]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="h-screen flex items-center justify-center relative opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00c853]/10 to-white/90 z-10"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Powering the Future of <br />
            <span className="text-[#00c853]">Electric Mobility</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
            Comprehensive EV charging solutions for businesses and individuals
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/qr"
              className="bg-[#00c853] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#00c853]/90 transition-colors"
            >
              Explore Solutions
            </Link>
            <Link
              href="#about"
              className="border border-[#00c853] text-[#00c853] px-8 py-3 rounded-full text-lg font-medium hover:bg-[#00c853]/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-[#00c853] flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-[#00c853] rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Main Heading */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2
            ref={headingRef}
            className="text-4xl md:text-5xl font-bold text-center opacity-0 transform translate-y-10 transition-all duration-1000"
          >
            BOLT.EARTH EV CHARGING SOLUTIONS
          </h2>
        </div>
      </section>

      {/* Products Section */}
      <section
        ref={productsRef}
        className="py-20 bg-[#f8f8f8] opacity-0 transform translate-y-10 transition-all duration-1000"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Products</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="h-48 bg-[#f2f2f2] relative overflow-hidden">
                  <Image src="/placeholder.svg?height=400&width=600" alt="EV Charger" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">EV Charging Station {item}</h3>
                  <p className="text-gray-600 mb-4">
                    High-performance charging solution for electric vehicles with smart features.
                  </p>
                  <Link href="#" className="inline-flex items-center text-[#00c853] hover:underline">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Complete Charging Solutions</h2>
              <p className="text-gray-600 mb-8">
                We provide end-to-end EV charging infrastructure solutions for businesses, residential complexes, and
                public spaces. Our smart charging technology ensures optimal performance and energy management.
              </p>
              <ul className="space-y-4">
                {["Smart Charging", "Remote Monitoring", "Payment Integration", "Energy Management"].map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="bg-[#00c853] rounded-full p-1 mr-3 mt-1">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 relative h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00c853]/20 to-transparent rounded-xl"></div>
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="EV Charging Solutions"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#00c853]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Electrify Your Journey?</h2>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of EV owners and businesses who trust Bolt.Earth for their charging needs.
          </p>
          <Link
            href="/qr"
            className="bg-white text-[#00c853] px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <Link href="/" className="flex items-center mb-6">
                <div className="relative w-10 h-10 bg-[#00c853] rounded-full flex items-center justify-center">
                  <Zap className="text-white w-6 h-6" />
                </div>
                <span className="ml-2 text-sm uppercase tracking-wider font-medium">BOLT.EARTH</span>
              </Link>
              <p className="text-gray-400">
                Powering the future of electric mobility with innovative charging solutions.
              </p>
            </div>

            {["Products", "Solutions", "Company", "Support"].map((category) => (
              <div key={category}>
                <h3 className="font-bold mb-4">{category}</h3>
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-gray-400 hover:text-[#00c853] transition-colors">
                        {category} Link {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Bolt.Earth. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["Facebook", "Twitter", "LinkedIn", "Instagram"].map((social) => (
                <Link key={social} href="#" className="text-gray-400 hover:text-[#00c853] transition-colors">
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Animation Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', () => {
            // Animate in elements that are initially visible
            const animateElements = document.querySelectorAll('.opacity-0');
            animateElements.forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.top < window.innerHeight * 0.8) {
                el.classList.add('animate-in');
              }
            });
          });
        `,
        }}
      />

      <style jsx global>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </main>
  )
}
