"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Zap, User, Phone, Mail, MapPin, ChevronRight, Edit, LogOut, Battery, Calendar } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+91 98765 43210",
    address: "123 Green Avenue, Eco Park, New Delhi - 110001",
    profileImage: "/placeholder.svg?height=200&width=200",
    memberSince: "January 2023",
    totalSessions: 42,
    totalEnergy: "368 kWh",
    savedCO2: "184 kg",
  }

  // Mock payment history
  const paymentHistory = [
    {
      id: "PAY-2023-0042",
      date: "Apr 12, 2023",
      amount: "₹450",
      location: "Green Park Charging Station",
      status: "Completed",
      energy: "30 kWh",
    },
    {
      id: "PAY-2023-0036",
      date: "Apr 5, 2023",
      amount: "₹375",
      location: "Cyber City Charging Hub",
      status: "Completed",
      energy: "25 kWh",
    },
    {
      id: "PAY-2023-0029",
      date: "Mar 28, 2023",
      amount: "₹600",
      location: "Highway Express Charger",
      status: "Completed",
      energy: "40 kWh",
    },
    {
      id: "PAY-2023-0021",
      date: "Mar 20, 2023",
      amount: "₹225",
      location: "Mall of India Parking",
      status: "Completed",
      energy: "15 kWh",
    },
  ]

  // Mock saved locations
  const savedLocations = [
    {
      id: 1,
      name: "Home",
      address: "123 Green Avenue, Eco Park, New Delhi - 110001",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      address: "Block B, Cyber City, Gurugram - 122002",
      isDefault: false,
    },
    {
      id: 3,
      name: "Weekend Home",
      address: "Villa 45, Hill View Resort, Lonavala - 410401",
      isDefault: false,
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2 text-gray-600" />
              <div className="relative w-8 h-8 bg-[#00c853] rounded-full flex items-center justify-center">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="ml-2 text-sm uppercase tracking-wider font-medium">BOLT.EARTH</span>
            </Link>

            <button className="text-[#00c853] hover:text-[#00c853]/80 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Hero Section */}
      <section className="bg-gradient-to-r from-[#00c853]/90 to-[#00c853]/70 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white/30">
                <Image src={user.profileImage || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-[#00c853] rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
              <p className="text-white/80 mt-1">Member since {user.memberSince}</p>

              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                  <Battery className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm text-white/80">Total Energy</p>
                    <p className="font-semibold">{user.totalEnergy}</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm text-white/80">Sessions</p>
                    <p className="font-semibold">{user.totalSessions}</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm text-white/80">CO₂ Saved</p>
                    <p className="font-semibold">{user.savedCO2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-4 font-medium text-sm whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-[#00c853] border-b-2 border-[#00c853]"
                  : "text-gray-600 hover:text-[#00c853]/70"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`px-4 py-4 font-medium text-sm whitespace-nowrap ${
                activeTab === "payment"
                  ? "text-[#00c853] border-b-2 border-[#00c853]"
                  : "text-gray-600 hover:text-[#00c853]/70"
              }`}
            >
              Payment History
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`px-4 py-4 font-medium text-sm whitespace-nowrap ${
                activeTab === "address"
                  ? "text-[#00c853] border-b-2 border-[#00c853]"
                  : "text-gray-600 hover:text-[#00c853]/70"
              }`}
            >
              Saved Locations
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-[#00c853] mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-[#00c853] mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-[#00c853] mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-[#00c853] mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Primary Address</p>
                      <p className="font-medium">{user.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="text-[#00c853] font-medium hover:text-[#00c853]/80 transition-colors flex items-center">
                    Edit Information
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

                <div className="space-y-4">
                  {paymentHistory.slice(0, 3).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#00c853]/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <Battery className="w-5 h-5 text-[#00c853]" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{payment.location}</p>
                        <p className="text-sm text-gray-500">
                          {payment.date} • {payment.energy}
                        </p>
                      </div>
                      <p className="font-medium">{payment.amount}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => setActiveTab("payment")}
                    className="text-[#00c853] font-medium hover:text-[#00c853]/80 transition-colors flex items-center"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stacked Images Card */}
            <div className="md:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Recommended Charging Stations</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="group relative overflow-hidden rounded-lg">
                      <div className="relative h-48 overflow-hidden">
                        {/* Stacked images with parallax effect */}
                        <div className="absolute inset-0 transform group-hover:scale-105 transition-transform duration-500">
                          <Image
                            src={`/placeholder.svg?height=400&width=600&text=Station ${item}`}
                            alt={`Charging Station ${item}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                        {/* Floating badge */}
                        <div className="absolute top-3 right-3 bg-[#00c853] text-white text-xs font-medium px-2 py-1 rounded-full">
                          {item === 1 ? "New" : item === 2 ? "Popular" : "Nearby"}
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold">Charging Station {item}</h3>
                        <p className="text-sm text-white/80">
                          {item === 1 ? "2.5 km away" : item === 2 ? "4.1 km away" : "5.7 km away"}
                        </p>
                      </div>

                      <Link href="#" className="absolute inset-0" aria-label={`View Charging Station ${item}`}></Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === "payment" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Payment History</h2>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Energy</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium">{payment.id}</td>
                        <td className="py-4 px-4 text-gray-600">{payment.date}</td>
                        <td className="py-4 px-4">{payment.location}</td>
                        <td className="py-4 px-4">{payment.energy}</td>
                        <td className="py-4 px-4 font-medium">{payment.amount}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing 4 of 24 transactions</p>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 border rounded-md bg-[#00c853] text-white hover:bg-[#00c853]/90 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Locations Tab */}
        {activeTab === "address" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Saved Locations</h2>
                <button className="bg-[#00c853] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#00c853]/90 transition-colors">
                  Add New Location
                </button>
              </div>

              <div className="space-y-4">
                {savedLocations.map((location) => (
                  <div key={location.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-[#00c853]/10 flex items-center justify-center mr-3 flex-shrink-0">
                          <MapPin className="w-5 h-5 text-[#00c853]" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold">{location.name}</h3>
                            {location.isDefault && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{location.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-[#00c853] transition-colors p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative w-8 h-8 bg-[#00c853] rounded-full flex items-center justify-center mr-2">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-sm font-medium">BOLT.EARTH</span>
            </div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Bolt.Earth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
