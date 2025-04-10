"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Coffee, Home, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Receipt type
type Receipt = {
  items: {
    id: number
    name: string
    price: number
    quantity: number
  }[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  cashAmount: number | null
  change: number | null
  timestamp: string
  orderId: string
}

export default function ReceiptPage() {
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get receipt from localStorage
    const savedReceipt = localStorage.getItem("receipt")
    if (savedReceipt) {
      setReceipt(JSON.parse(savedReceipt))
    } else {
      // Redirect back to dashboard if no receipt exists
      router.push("/dashboard")
    }
  }, [router])

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - Babe Procia System</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
                h1, h2 { text-align: center; }
                .divider { border-top: 1px dashed #ccc; margin: 10px 0; }
                .flex { display: flex; justify-content: space-between; margin: 5px 0; }
                .total { font-weight: bold; font-size: 1.1em; }
                .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #666; }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
              <div className="footer">Thank you for visiting Babe Procia System!</div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    }
  }

  if (!receipt) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-teal-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Coffee className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Babe Procia System</h1>
          </div>
          <Button variant="ghost" className="text-white hover:bg-teal-700" onClick={() => router.push("/dashboard")}>
            <Home className="h-5 w-5 mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Card className="border-none shadow-lg rounded-2xl mb-6">
            <CardContent className="p-6">
              <div ref={receiptRef}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-teal-800">Babe Procia System</h2>
                  <p className="text-teal-700">123 Coffee Street, Brewville</p>
                  <p className="text-teal-700">Tel: (123) 456-7890</p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-teal-700">
                    <span>Order #:</span>
                    <span>{receipt.orderId}</span>
                  </div>
                  <div className="flex justify-between text-sm text-teal-700">
                    <span>Date:</span>
                    <span>{formatDate(receipt.timestamp)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-teal-700">
                    <span>Cashier:</span>
                    <span>Grace Procia</span>
                  </div>
                </div>

                <Separator className="my-4 bg-teal-200" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between font-medium text-teal-800">
                    <span>Item</span>
                    <div className="flex gap-8">
                      <span>Qty</span>
                      <span>Price</span>
                    </div>
                  </div>
                  {receipt.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-teal-700">
                      <span>{item.name}</span>
                      <div className="flex gap-8">
                        <span className="w-8 text-center">{item.quantity}</span>
                        <span className="w-16 text-right">₱{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4 bg-teal-200" />

                <div className="space-y-2">
                  <div className="flex justify-between text-teal-700">
                    <span>Subtotal</span>
                    <span>₱{receipt.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-teal-700">
                    <span>Tax (10%)</span>
                    <span>₱{receipt.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-teal-800">
                    <span>Total</span>
                    <span>₱{receipt.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4 bg-teal-200" />

                <div className="space-y-2">
                  <div className="flex justify-between text-teal-700">
                    <span>Payment Method</span>
                    <span className="capitalize">{receipt.paymentMethod}</span>
                  </div>
                  {receipt.paymentMethod === "cash" && (
                    <>
                      <div className="flex justify-between text-teal-700">
                        <span>Cash Amount</span>
                        <span>₱{receipt.cashAmount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-teal-700">
                        <span>Change</span>
                        <span>₱{receipt.change?.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-center mt-6 text-teal-700">
                  <p>Thank you for your purchase!</p>
                  <p className="text-sm">Visit us again soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              className="flex-1 py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all duration-200"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-5 w-5" />
              Print Receipt
            </Button>
            <Button
              className="flex-1 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

