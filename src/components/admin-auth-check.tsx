"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"

// This is a placeholder for a real admin check
// In a real application, you would check if the user has admin privileges
const ADMIN_EMAILS = ["admin@example.com", "infisparks@gmail.com", "moinzariwala99@gmail.com","kfaiz9940@gmail.com"]

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00c853] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}
