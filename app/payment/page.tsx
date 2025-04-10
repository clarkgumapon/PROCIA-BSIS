"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Coffee, CreditCard, DollarSign, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Order type
type OrderItem = {
  id: number
  name: string
  price: number
  quantity: number
}

type Order = {
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
}

// Transaction type for sales report
type Transaction = {
  id: number
  date: string
  orderId: string
  items: number
  total: number
  paymentMethod: string
  products: {
    id: number
    name: string
    quantity: number
    price: number
  }[]
}

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [cashAmount, setCashAmount] = useState("")
  const [change, setChange] = useState(0)
  const [order, setOrder] = useState<Order | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // Get order from localStorage
    const savedOrder = localStorage.getItem("currentOrder")
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder))
    } else {
      // Redirect back to order page if no order exists
      router.push("/order")
    }
  }, [router])

  useEffect(() => {
    if (order && cashAmount) {
      const cashValue = Number.parseFloat(cashAmount)
      if (!isNaN(cashValue)) {
        setChange(cashValue - order.total)
      } else {
        setChange(0)
      }
    }
  }, [cashAmount, order])

  const handlePayment = () => {
    if (!order) return

    if (paymentMethod === "cash") {
      const cashValue = Number.parseFloat(cashAmount)
      if (isNaN(cashValue) || cashValue < order.total) {
        return // Insufficient funds
      }
    }

    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setShowConfirmation(true)
    }, 1500)
  }

  const completePayment = () => {
    if (!order) return

    // Generate order ID
    const orderId = `ORD-${Math.floor(Math.random() * 10000)}`
    const timestamp = new Date().toISOString()
    const dateStr = timestamp.split("T")[0]

    // Store receipt data
    const receiptData = {
      ...order,
      paymentMethod,
      cashAmount: paymentMethod === "cash" ? Number.parseFloat(cashAmount) : null,
      change: paymentMethod === "cash" ? change : null,
      timestamp,
      orderId,
    }
    localStorage.setItem("receipt", JSON.stringify(receiptData))

    // Update sales statistics
    updateSalesStatistics(order.total)

    // Record transaction in sales report
    recordTransaction({
      id: Date.now(),
      date: dateStr,
      orderId,
      items: order.items.reduce((sum, item) => sum + item.quantity, 0),
      total: order.total,
      paymentMethod: paymentMethod === "cash" ? "Cash" : paymentMethod === "gcash" ? "GCash" : "Credit Card",
      products: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    })

    router.push("/receipt")
  }

  // Update sales statistics in localStorage
  const updateSalesStatistics = (orderTotal: number) => {
    // Get current sales data
    const dailySales = localStorage.getItem("dailySales")
      ? Number.parseFloat(localStorage.getItem("dailySales") || "0")
      : 0
    const ordersCompleted = localStorage.getItem("ordersCompleted")
      ? Number.parseInt(localStorage.getItem("ordersCompleted") || "0")
      : 0

    // Update sales data
    const newDailySales = dailySales + orderTotal
    const newOrdersCompleted = ordersCompleted + 1

    // Store updated data
    localStorage.setItem("dailySales", newDailySales.toString())
    localStorage.setItem("ordersCompleted", newOrdersCompleted.toString())
  }

  // Record transaction in sales report
  const recordTransaction = (transaction: Transaction) => {
    // Get existing transactions
    const existingTransactions = localStorage.getItem("transactions")
      ? JSON.parse(localStorage.getItem("transactions") || "[]")
      : []

    // Add new transaction
    const updatedTransactions = [...existingTransactions, transaction]

    // Store updated transactions
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions))

    // Update product sales data
    updateProductSales(transaction.products)

    // Update payment method statistics
    updatePaymentMethodStats(transaction.paymentMethod, transaction.total)
  }

  // Update product sales statistics
  const updateProductSales = (products: { id: number; name: string; quantity: number; price: number }[]) => {
    // Get existing product sales data
    const existingProductSales = localStorage.getItem("productSales")
      ? JSON.parse(localStorage.getItem("productSales") || "[]")
      : []

    // Update product sales
    const updatedProductSales = [...existingProductSales]

    products.forEach((product) => {
      const existingProduct = updatedProductSales.find((p) => p.id === product.id)

      if (existingProduct) {
        existingProduct.quantity += product.quantity
        existingProduct.revenue += product.quantity * product.price
      } else {
        updatedProductSales.push({
          id: product.id,
          product: product.name,
          quantity: product.quantity,
          revenue: product.quantity * product.price,
        })
      }
    })

    // Store updated product sales
    localStorage.setItem("productSales", JSON.stringify(updatedProductSales))
  }

  // Update payment method statistics
  const updatePaymentMethodStats = (method: string, amount: number) => {
    // Get existing payment method stats
    const existingPaymentStats = localStorage.getItem("paymentStats")
      ? JSON.parse(localStorage.getItem("paymentStats") || "[]")
      : [
          { method: "Cash", count: 0, amount: 0 },
          { method: "GCash", count: 0, amount: 0 },
          { method: "Credit Card", count: 0, amount: 0 },
        ]

    // Update payment method stats
    const updatedPaymentStats = existingPaymentStats.map((stat: any) => {
      if (stat.method === method) {
        return {
          ...stat,
          count: stat.count + 1,
          amount: stat.amount + amount,
        }
      }
      return stat
    })

    // Store updated payment method stats
    localStorage.setItem("paymentStats", JSON.stringify(updatedPaymentStats))
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-teal-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Coffee className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Babe Procia System</h1>
          </div>
          <Button variant="ghost" className="text-white hover:bg-teal-700" onClick={() => router.push("/order")}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Order
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-none shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Payment</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-700 mb-3">Order Summary</h3>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-slate-600">
                            {item.quantity} x {item.name}
                          </span>
                          <span className="font-medium text-slate-800">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-3 bg-slate-200" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>₱{order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Tax (10%)</span>
                        <span>₱{order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-slate-800">
                        <span>Total</span>
                        <span>₱{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-slate-700 mb-3">Payment Method</h3>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                      <Label
                        htmlFor="cash"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:border-teal-300 peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:bg-teal-50 [&:has([data-state=checked])]:border-teal-600"
                      >
                        <DollarSign className="mb-3 h-6 w-6 text-teal-600" />
                        Cash
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="gcash" id="gcash" className="peer sr-only" />
                      <Label
                        htmlFor="gcash"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:border-teal-300 peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:bg-teal-50 [&:has([data-state=checked])]:border-teal-600"
                      >
                        <Smartphone className="mb-3 h-6 w-6 text-teal-600" />
                        GCash
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="card" id="card" className="peer sr-only" />
                      <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:border-teal-300 peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:bg-teal-50 [&:has([data-state=checked])]:border-teal-600"
                      >
                        <CreditCard className="mb-3 h-6 w-6 text-teal-600" />
                        Credit Card
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "cash" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="cash-amount" className="text-slate-700">
                        Cash Amount
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₱</span>
                        <Input
                          id="cash-amount"
                          type="number"
                          min={order.total}
                          step="0.01"
                          className="pl-8 border-slate-200 focus:border-teal-500 rounded-xl"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-800 font-medium">Change</span>
                        <span className="text-xl font-bold text-emerald-700">
                          ₱{change > 0 ? change.toFixed(2) : "0.00"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(paymentMethod === "gcash" || paymentMethod === "card") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-blue-50 p-4 rounded-xl border border-blue-200"
                  >
                    <p className="text-blue-800">
                      {paymentMethod === "gcash"
                        ? "Please prepare your phone to scan the GCash QR code."
                        : "Please prepare your card for payment."}
                    </p>
                  </motion.div>
                )}

                <div className="pt-4">
                  <Button
                    className="w-full py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all duration-200 text-lg font-medium"
                    onClick={handlePayment}
                    disabled={
                      processing ||
                      (paymentMethod === "cash" && (Number.parseFloat(cashAmount) < order.total || !cashAmount))
                    }
                  >
                    {processing ? "Processing..." : "Complete Payment"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-white rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-emerald-700">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center">Your payment has been processed successfully.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="bg-emerald-100 rounded-full p-3">
              <Check className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={completePayment}>
            View Receipt
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

