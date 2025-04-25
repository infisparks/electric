"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Zap,
  Search,
  Users,
  User,
  CreditCard,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Shield,
  LogOut,
} from "lucide-react"
import { db } from "@/firebase"
import { ref, onValue } from "firebase/database"
import AdminAuthCheck from "@/components/admin-auth-check"

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPayments, setTotalPayments] = useState(0)

  // Fetch all users from Firebase
  useEffect(() => {
    const usersRef = ref(db, "users")

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const usersList = Object.entries(data).map(([id, userData]: [string, any]) => ({
          id,
          ...userData,
          totalSpent: calculateTotalSpent(userData.history),
          transactionCount: userData.history ? Object.keys(userData.history).length : 0,
          lastTransaction: getLastTransaction(userData.history),
        }))

        setUsers(usersList)
        setTotalUsers(usersList.length)

        // Calculate total payments across all users
        let total = 0
        usersList.forEach((user) => {
          total += user.totalSpent || 0
        })
        setTotalPayments(total)
      }
    //   setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Calculate total spent for a user
  const calculateTotalSpent = (history: any) => {
    if (!history) return 0
    return Object.values(history).reduce((total: number, transaction: any) => {
      return total + (transaction.amount || 0)
    }, 0)
  }

  // Get the last transaction date for a user
  const getLastTransaction = (history: any) => {
    if (!history) return null

    const transactions = Object.values(history) as any[]
    if (transactions.length === 0) return null

    const sortedTransactions = transactions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return sortedTransactions[0]
  }

  // Handle user click to show details
  const handleUserClick = (user: any) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchQuery)
    )
  })

  // Sort users based on selected field and direction
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle special cases
    if (sortField === "lastTransaction") {
      aValue = a.lastTransaction ? new Date(a.lastTransaction.date).getTime() : 0
      bValue = b.lastTransaction ? new Date(b.lastTransaction.date).getTime() : 0
    }

    if (aValue === bValue) return 0

    const comparison = aValue > bValue ? 1 : -1
    return sortDirection === "asc" ? comparison : -comparison
  })

  // Handle sort change
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format payment history for display
  const formatPaymentHistory = (history: any) => {
    if (!history) return []

    return Object.entries(history)
      .map(([id, data]: [string, any]) => ({
        id,
        date: data.date,
        formattedDate: formatDate(data.date),
        amount: data.amount,
        plan: data.plan,
        seconds: data.seconds,
        transactionId: data.transactionId,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <AdminAuthCheck>
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
                <span className="ml-2 text-sm uppercase tracking-wider font-medium">EV Energy</span>
              </Link>

              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-[#00c853]/10 text-[#00c853] px-3 py-1.5 rounded-full">
                  <Shield className="w-4 h-4 mr-1.5" />
                  <span className="text-sm font-medium">Admin Panel</span>
                </div>
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#00c853]/90 to-[#00c853]/70 rounded-xl p-6 text-white shadow-sm">
                <div className="flex items-center mb-4">
                  <Users className="w-10 h-10 p-2 bg-white/20 rounded-lg" />
                  <h2 className="text-lg font-semibold ml-3">Total Users</h2>
                </div>
                <p className="text-3xl font-bold">{totalUsers}</p>
                <p className="text-white/80 mt-1">Registered accounts</p>
              </div>

              <div className="bg-gradient-to-br from-[#2196f3]/90 to-[#2196f3]/70 rounded-xl p-6 text-white shadow-sm">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-10 h-10 p-2 bg-white/20 rounded-lg" />
                  <h2 className="text-lg font-semibold ml-3">Total Revenue</h2>
                </div>
                <p className="text-3xl font-bold">₹{totalPayments}</p>
                <p className="text-white/80 mt-1">From all transactions</p>
              </div>

              <div className="bg-gradient-to-br from-[#ff9800]/90 to-[#ff9800]/70 rounded-xl p-6 text-white shadow-sm">
                <div className="flex items-center mb-4">
                  <Clock className="w-10 h-10 p-2 bg-white/20 rounded-lg" />
                  <h2 className="text-lg font-semibold ml-3">Avg. Transaction</h2>
                </div>
                <p className="text-3xl font-bold">₹{totalUsers > 0 ? Math.round(totalPayments / totalUsers) : 0}</p>
                <p className="text-white/80 mt-1">Per user</p>
              </div>
            </div>
          </div>
        </section>

        {/* Users List */}
        <section className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold">Users Management</h2>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg w-full"
                    />
                  </div>

                  <button className="flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    <span>Filter</span>
                  </button>

                  <button className="flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b">
                      <th
                        className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          <span>Name</span>
                          {sortField === "name" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center">
                          <span>Email</span>
                          {sortField === "email" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer"
                        onClick={() => handleSort("transactionCount")}
                      >
                        <div className="flex items-center">
                          <span>Transactions</span>
                          {sortField === "transactionCount" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer"
                        onClick={() => handleSort("totalSpent")}
                      >
                        <div className="flex items-center">
                          <span>Total Spent</span>
                          {sortField === "totalSpent" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer"
                        onClick={() => handleSort("lastTransaction")}
                      >
                        <div className="flex items-center">
                          <span>Last Transaction</span>
                          {sortField === "lastTransaction" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#00c853]/10 flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-[#00c853]" />
                            </div>
                            <span className="font-medium">{user.name || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{user.email || "N/A"}</td>
                        <td className="py-4 px-4">{user.transactionCount || 0}</td>
                        <td className="py-4 px-4 font-medium">₹{user.totalSpent || 0}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {user.lastTransaction ? formatDate(user.lastTransaction.date) : "Never"}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            className="text-[#00c853] hover:text-[#00c853]/80 font-medium"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUserClick(user)
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {sortedUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedUser.name || "User Details"}</h2>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
                <button onClick={() => setShowUserModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto flex-grow">
                {/* User Information */}
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold mb-4">User Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-[#00c853] mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{selectedUser.name || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-[#00c853] mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium">{selectedUser.email || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-[#00c853] mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-[#00c853] mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{selectedUser.address || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <CreditCard className="w-5 h-5 text-[#00c853] mr-2" />
                        <h4 className="font-medium">Total Spent</h4>
                      </div>
                      <p className="text-2xl font-bold">₹{selectedUser.totalSpent || 0}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 text-[#00c853] mr-2" />
                        <h4 className="font-medium">Transactions</h4>
                      </div>
                      <p className="text-2xl font-bold">{selectedUser.transactionCount || 0}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 text-[#00c853] mr-2" />
                        <h4 className="font-medium">Member Since</h4>
                      </div>
                      <p className="text-2xl font-bold">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment History</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Transaction ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Plan</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Duration</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formatPaymentHistory(selectedUser.history).map((payment: any) => (
                          <tr key={payment.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-medium">{payment.transactionId}</td>
                            <td className="py-3 px-4 text-gray-600">{payment.formattedDate}</td>
                            <td className="py-3 px-4">{payment.plan}</td>
                            <td className="py-3 px-4">{payment.seconds} seconds</td>
                            <td className="py-3 px-4 font-medium">₹{payment.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {!selectedUser.history && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No payment history found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-[#00c853] text-white rounded-lg hover:bg-[#00c853]/90">
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-white border-t py-6 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative w-8 h-8 bg-[#00c853] rounded-full flex items-center justify-center mr-2">
                  <Zap className="text-white w-5 h-5" />
                </div>
                <span className="text-sm font-medium">EV Energy</span>
              </div>
              <p className="text-gray-500 text-sm">© {new Date().getFullYear()} EV Energy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </AdminAuthCheck>
  )
}
