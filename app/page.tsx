"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { Coffee } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiService } from "./services/api"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await apiService.login({ username, password })
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto bg-teal-600 text-white w-16 h-16 flex items-center justify-center rounded-full"
          >
            <Coffee className="h-8 w-8" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-slate-800">Babe Coffee Shop</h2>
          <p className="mt-2 text-sm text-slate-600">Cashiering System</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-slate-700">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="w-full py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all duration-200 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

