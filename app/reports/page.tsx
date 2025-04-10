"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Coffee, Download, FileText, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Initialize with empty data
const initialPaymentData = [
  { method: "Cash", count: 0, amount: 0 },
  { method: "GCash", count: 0, amount: 0 },
  { method: "Credit Card", count: 0, amount: 0 },
]

export default function ReportsPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("today")
  const [paymentMethod, setPaymentMethod] = useState<"all" | "cash" | "gcash" | "card">("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filteredSalesData, setFilteredSalesData] = useState([])
  const [filteredProductData, setFilteredProductData] = useState([])
  const [filteredPaymentData, setFilteredPaymentData] = useState(initialPaymentData)

  // Load data on initial render
  useEffect(() => {
    loadSalesData()
  }, [])

  // Load sales data from localStorage
  const loadSalesData = () => {
    // Get transactions from localStorage
    const transactions = localStorage.getItem("transactions")
      ? JSON.parse(localStorage.getItem("transactions") || "[]")
      : []

    // Get product sales from localStorage
    const productSales = localStorage.getItem("productSales")
      ? JSON.parse(localStorage.getItem("productSales") || "[]")
      : []

    // Get payment stats from localStorage
    const paymentStats = localStorage.getItem("paymentStats")
      ? JSON.parse(localStorage.getItem("paymentStats") || "[]")
      : initialPaymentData

    setFilteredSalesData(transactions)
    setFilteredProductData(productSales)
    setFilteredPaymentData(paymentStats)
  }

  // Apply filters function
  const applyFilters = () => {
    // Get all transactions
    const allTransactions = localStorage.getItem("transactions")
      ? JSON.parse(localStorage.getItem("transactions") || "[]")
      : []

    // Filter by date range
    let filteredTransactions = [...allTransactions]

    if (dateRange === "today") {
      const today = new Date().toISOString().split("T")[0]
      filteredTransactions = filteredTransactions.filter((sale: any) => sale.date === today)
    } else if (dateRange === "week") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      filteredTransactions = filteredTransactions.filter((sale: any) => new Date(sale.date) >= oneWeekAgo)
    } else if (dateRange === "month") {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      filteredTransactions = filteredTransactions.filter((sale: any) => new Date(sale.date) >= oneMonthAgo)
    } else if (dateRange === "custom" && startDate && endDate) {
      filteredTransactions = filteredTransactions.filter(
        (sale: any) => new Date(sale.date) >= new Date(startDate) && new Date(sale.date) <= new Date(endDate),
      )
    }

    // Filter by payment method
    if (paymentMethod !== "all") {
      const methodMap: Record<string, string> = {
        cash: "Cash",
        gcash: "GCash",
        card: "Credit Card",
      }
      filteredTransactions = filteredTransactions.filter((sale: any) => sale.paymentMethod === methodMap[paymentMethod])
    }

    setFilteredSalesData(filteredTransactions)

    // Update product data based on filtered transactions
    updateFilteredProductData(filteredTransactions)

    // Update payment method data based on filtered transactions
    updateFilteredPaymentData(filteredTransactions)
  }

  // Update product data based on filtered transactions
  const updateFilteredProductData = (transactions: any[]) => {
    // Create a map to aggregate product data
    const productMap = new Map()

    // Process each transaction
    transactions.forEach((transaction: any) => {
      // Each transaction may have multiple products
      transaction.products?.forEach((product: any) => {
        const existingProduct = productMap.get(product.id)

        if (existingProduct) {
          existingProduct.quantity += product.quantity
          existingProduct.revenue += product.quantity * product.price
        } else {
          productMap.set(product.id, {
            id: product.id,
            product: product.name,
            quantity: product.quantity,
            revenue: product.quantity * product.price,
          })
        }
      })
    })

    // Convert map to array
    const updatedProductData = Array.from(productMap.values())

    setFilteredProductData(updatedProductData.length > 0 ? updatedProductData : [])
  }

  // Update payment method data based on filtered transactions
  const updateFilteredPaymentData = (transactions: any[]) => {
    // Initialize payment method stats
    const paymentSummary = {
      Cash: { count: 0, amount: 0 },
      GCash: { count: 0, amount: 0 },
      "Credit Card": { count: 0, amount: 0 },
    }

    // Process each transaction
    transactions.forEach((transaction: any) => {
      if (paymentSummary[transaction.paymentMethod]) {
        paymentSummary[transaction.paymentMethod].count += 1
        paymentSummary[transaction.paymentMethod].amount += transaction.total
      }
    })

    // Convert to array format
    const updatedPaymentData = Object.keys(paymentSummary).map((method) => ({
      method,
      count: paymentSummary[method].count,
      amount: paymentSummary[method].amount,
    }))

    setFilteredPaymentData(updatedPaymentData)
  }

  // Calculate totals from filtered data
  const totalSales = filteredSalesData.reduce((sum, sale: any) => sum + sale.total, 0)
  const totalOrders = filteredSalesData.length
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-teal-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Coffee className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Babe Coffee Shop</h1>
          </div>
          <Button variant="ghost" className="text-white hover:bg-teal-700" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Sales Reports</h2>
              <p className="text-slate-600">View and analyze your sales data</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-md rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-slate-700">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-slate-800">₱{totalSales.toFixed(2)}</span>
                  <div className="p-3 rounded-full bg-emerald-100 text-emerald-800">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-slate-700">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-slate-800">{totalOrders}</span>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-800">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-slate-700">Average Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-slate-800">₱{averageOrderValue.toFixed(2)}</span>
                  <div className="p-3 rounded-full bg-violet-100 text-violet-800">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-none shadow-md rounded-2xl lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date-range" className="text-slate-700">
                    Date Range
                  </Label>
                  <Select
                    value={dateRange}
                    onValueChange={(value) => setDateRange(value as "today" | "week" | "month" | "custom")}
                  >
                    <SelectTrigger id="date-range" className="border-slate-200">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dateRange === "custom" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="start-date" className="text-slate-700">
                        Start Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                        <Input
                          id="start-date"
                          type="date"
                          className="pl-10 border-slate-200 focus:border-teal-500 rounded-xl"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="end-date" className="text-slate-700">
                        End Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                        <Input
                          id="end-date"
                          type="date"
                          className="pl-10 border-slate-200 focus:border-teal-500 rounded-xl"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="payment-method" className="text-slate-700">
                    Payment Method
                  </Label>
                  <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                    <SelectTrigger id="payment-method" className="border-slate-200">
                      <SelectValue placeholder="All Methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="gcash">GCash</SelectItem>
                      <SelectItem value="card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md rounded-2xl lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Sales Data</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="transactions">
                  <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger
                      value="transactions"
                      className="data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg"
                    >
                      Transactions
                    </TabsTrigger>
                    <TabsTrigger
                      value="products"
                      className="data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg"
                    >
                      Products
                    </TabsTrigger>
                    <TabsTrigger
                      value="payment"
                      className="data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg"
                    >
                      Payment Methods
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="transactions" className="space-y-4">
                    {filteredSalesData.length === 0 ? (
                      <div className="text-center py-8 text-slate-600">
                        <p>No transactions found for the selected filters.</p>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-100">
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Order ID</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Items</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Total</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSalesData.map((sale: any) => (
                                <tr key={sale.id} className="border-t border-slate-100 hover:bg-slate-50">
                                  <td className="px-4 py-3 text-slate-800">{sale.orderId}</td>
                                  <td className="px-4 py-3 text-slate-800">{sale.date}</td>
                                  <td className="px-4 py-3 text-slate-800">{sale.items}</td>
                                  <td className="px-4 py-3 text-slate-800">₱{sale.total.toFixed(2)}</td>
                                  <td className="px-4 py-3 text-slate-800">{sale.paymentMethod}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="products" className="space-y-4">
                    {filteredProductData.length === 0 ? (
                      <div className="text-center py-8 text-slate-600">
                        <p>No product data found for the selected filters.</p>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-100">
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Product</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Quantity Sold</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredProductData.map((product: any) => (
                                <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50">
                                  <td className="px-4 py-3 text-slate-800">{product.product}</td>
                                  <td className="px-4 py-3 text-slate-800">{product.quantity}</td>
                                  <td className="px-4 py-3 text-slate-800">₱{product.revenue.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="payment" className="space-y-4">
                    {filteredPaymentData.length === 0 ? (
                      <div className="text-center py-8 text-slate-600">
                        <p>No payment data found for the selected filters.</p>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-100">
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Payment Method</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Transaction Count</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Total Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPaymentData.map((payment, index) => (
                                <tr key={index} className="border-t border-slate-100 hover:bg-slate-50">
                                  <td className="px-4 py-3 text-slate-800">{payment.method}</td>
                                  <td className="px-4 py-3 text-slate-800">{payment.count}</td>
                                  <td className="px-4 py-3 text-slate-800">₱{payment.amount.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

