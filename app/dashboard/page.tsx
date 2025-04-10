"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Coffee, DollarSign, LogOut, ShoppingBag, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  const cashierName = "Grace Procia"
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Initialize stats with zero values
  const [stats, setStats] = useState([
    {
      title: "Total Sales Today",
      value: "₱0.00",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Orders Completed",
      value: "0",
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Average Order Value",
      value: "₱0.00",
      icon: TrendingUp,
      color: "bg-violet-100 text-violet-800",
    },
  ])

  // Load current sales data when dashboard loads
  useEffect(() => {
    // Check if this is a new day/session
    const lastSessionDate = localStorage.getItem("sessionDate")
    const today = new Date().toISOString().split("T")[0]

    if (lastSessionDate !== today) {
      // It's a new day, reset all stats
      localStorage.removeItem("dailySales")
      localStorage.removeItem("ordersCompleted")
      localStorage.removeItem("transactions")
      localStorage.removeItem("productSales")
      localStorage.removeItem("paymentStats")
      localStorage.setItem("sessionDate", today)
    }

    // Update stats from localStorage
    updateStatsFromStorage()
  }, [])

  // Function to update stats from localStorage
  const updateStatsFromStorage = () => {
    const dailySales = localStorage.getItem("dailySales")
      ? Number.parseFloat(localStorage.getItem("dailySales") || "0")
      : 0
    const ordersCompleted = localStorage.getItem("ordersCompleted")
      ? Number.parseInt(localStorage.getItem("ordersCompleted") || "0")
      : 0

    // Calculate average order value
    const avgOrderValue = ordersCompleted > 0 ? dailySales / ordersCompleted : 0

    setStats([
      {
        title: "Total Sales Today",
        value: `₱${dailySales.toFixed(2)}`,
        icon: DollarSign,
        color: "bg-emerald-100 text-emerald-800",
      },
      {
        title: "Orders Completed",
        value: ordersCompleted.toString(),
        icon: ShoppingBag,
        color: "bg-blue-100 text-blue-800",
      },
      {
        title: "Average Order Value",
        value: `₱${avgOrderValue.toFixed(2)}`,
        icon: TrendingUp,
        color: "bg-violet-100 text-violet-800",
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-teal-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Coffee className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Babe Coffee Shop</h1>
          </div>
          <Button variant="ghost" className="text-white hover:bg-teal-700" onClick={() => router.push("/")}>
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Welcome, {cashierName}</h2>
              <p className="text-slate-600">{currentDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-none shadow-md rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-slate-700">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-1"
            >
              <Button
                className="w-full h-32 text-xl bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg transition-all duration-200"
                onClick={() => router.push("/order")}
              >
                <ShoppingBag className="h-8 w-8 mr-3" />
                New Order
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="col-span-1"
            >
              <Button
                className="w-full h-32 text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition-all duration-200"
                onClick={() => router.push("/reports")}
              >
                <TrendingUp className="h-8 w-8 mr-3" />
                Sales Report
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="col-span-1"
            >
              <Button
                className="w-full h-32 text-xl bg-violet-600 hover:bg-violet-700 text-white rounded-2xl shadow-lg transition-all duration-200"
                onClick={() => router.push("/")}
              >
                <LogOut className="h-8 w-8 mr-3" />
                Logout
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

