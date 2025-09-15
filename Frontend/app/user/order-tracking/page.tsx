"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Home,
  MapPin,
  Building2,
  Package,
  FlaskConical,
  Search,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: Home, current: false },
  { name: "Harvest Origins", href: "/user/harvest-origins", icon: MapPin, current: false },
  { name: "Processing Info", href: "/user/processing-info", icon: Building2, current: false },
  { name: "Order Tracking", href: "/user/order-tracking", icon: Package, current: true },
  { name: "Quality Reports", href: "/user/quality-reports", icon: FlaskConical, current: false },
]

const orderData = [
  {
    id: "ORD001",
    product: "Organic Wheat Flour",
    quantity: "5 kg",
    orderDate: "2024-01-10",
    estimatedDelivery: "2024-01-15",
    actualDelivery: "2024-01-15",
    status: "delivered",
    batchId: "B001",
    trackingNumber: "TRK001234567",
    shippingAddress: "123 Main St, New York, NY 10001",
    timeline: [
      { status: "Order Placed", timestamp: "2024-01-10 09:00", completed: true },
      { status: "Processing", timestamp: "2024-01-10 14:00", completed: true },
      { status: "Quality Check", timestamp: "2024-01-11 10:00", completed: true },
      { status: "Packaging", timestamp: "2024-01-12 08:00", completed: true },
      { status: "Shipped", timestamp: "2024-01-13 15:00", completed: true },
      { status: "Out for Delivery", timestamp: "2024-01-15 08:00", completed: true },
      { status: "Delivered", timestamp: "2024-01-15 14:30", completed: true },
    ],
    carrier: "Express Logistics",
    vehicle: "TRK-001",
    driver: "John Delivery",
  },
  {
    id: "ORD002",
    product: "Premium Rice",
    quantity: "10 kg",
    orderDate: "2024-01-12",
    estimatedDelivery: "2024-01-18",
    actualDelivery: null,
    status: "in-transit",
    batchId: "B002",
    trackingNumber: "TRK001234568",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    timeline: [
      { status: "Order Placed", timestamp: "2024-01-12 11:00", completed: true },
      { status: "Processing", timestamp: "2024-01-12 16:00", completed: true },
      { status: "Quality Check", timestamp: "2024-01-13 09:00", completed: true },
      { status: "Packaging", timestamp: "2024-01-14 10:00", completed: true },
      { status: "Shipped", timestamp: "2024-01-15 12:00", completed: true },
      { status: "Out for Delivery", timestamp: "2024-01-18 09:00", completed: false },
      { status: "Delivered", timestamp: null, completed: false },
    ],
    carrier: "Fast Freight",
    vehicle: "TRK-002",
    driver: "Sarah Transport",
  },
  {
    id: "ORD003",
    product: "Stone Ground Corn Meal",
    quantity: "3 kg",
    orderDate: "2024-01-14",
    estimatedDelivery: "2024-01-20",
    actualDelivery: null,
    status: "processing",
    batchId: "B003",
    trackingNumber: "TRK001234569",
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    timeline: [
      { status: "Order Placed", timestamp: "2024-01-14 13:00", completed: true },
      { status: "Processing", timestamp: "2024-01-14 17:00", completed: true },
      { status: "Quality Check", timestamp: "2024-01-15 11:00", completed: false },
      { status: "Packaging", timestamp: null, completed: false },
      { status: "Shipped", timestamp: null, completed: false },
      { status: "Out for Delivery", timestamp: null, completed: false },
      { status: "Delivered", timestamp: null, completed: false },
    ],
    carrier: "Reliable Shipping",
    vehicle: "TRK-003",
    driver: "Mike Carrier",
  },
]

export default function OrderTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const filteredOrders = orderData.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedOrderData = orderData.find((o) => o.id === selectedOrder)

  return (
    <DashboardLayout userType="user" userName="John Consumer" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Tracking</h1>
          <p className="text-muted-foreground">Track your orders and monitor delivery progress</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by order ID, product, or tracking number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>Select an order to view tracking details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOrder === order.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                      }`}
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{order.id}</h4>
                          <Badge
                            className={
                              order.status === "delivered"
                                ? "bg-primary/10 text-primary"
                                : order.status === "in-transit"
                                  ? "bg-secondary/10 text-secondary"
                                  : "bg-muted text-muted-foreground"
                            }
                          >
                            {order.status === "in-transit" ? "In Transit" : order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.product}</p>
                        <p className="text-xs text-muted-foreground">Quantity: {order.quantity}</p>
                        <p className="text-xs text-muted-foreground">
                          Ordered: {order.orderDate} • ETA: {order.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedOrderData ? (
              <div className="space-y-6">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Order {selectedOrderData.id}
                    </CardTitle>
                    <CardDescription>Order details and shipping information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Product</p>
                          <p className="font-medium">{selectedOrderData.product}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-medium">{selectedOrderData.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Batch ID</p>
                          <Badge variant="outline">{selectedOrderData.batchId}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tracking Number</p>
                          <p className="font-medium font-mono">{selectedOrderData.trackingNumber}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Order Date</p>
                          <p className="font-medium">{selectedOrderData.orderDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                          <p className="font-medium">{selectedOrderData.estimatedDelivery}</p>
                        </div>
                        {selectedOrderData.actualDelivery && (
                          <div>
                            <p className="text-sm text-muted-foreground">Actual Delivery</p>
                            <p className="font-medium text-primary">{selectedOrderData.actualDelivery}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge
                            className={
                              selectedOrderData.status === "delivered"
                                ? "bg-primary/10 text-primary"
                                : selectedOrderData.status === "in-transit"
                                  ? "bg-secondary/10 text-secondary"
                                  : "bg-muted text-muted-foreground"
                            }
                          >
                            {selectedOrderData.status === "in-transit" ? "In Transit" : selectedOrderData.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Shipping Details
                    </CardTitle>
                    <CardDescription>Carrier and delivery information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Carrier</p>
                          <p className="font-medium">{selectedOrderData.carrier}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Vehicle</p>
                          <p className="font-medium">{selectedOrderData.vehicle}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Driver</p>
                          <p className="font-medium">{selectedOrderData.driver}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Shipping Address</p>
                          <p className="font-medium">{selectedOrderData.shippingAddress}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Timeline</CardTitle>
                    <CardDescription>Track your order progress step by step</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedOrderData.timeline.map((step, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.completed
                                  ? "bg-primary text-primary-foreground"
                                  : index === selectedOrderData.timeline.findIndex((s) => !s.completed)
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : index === selectedOrderData.timeline.findIndex((s) => !s.completed) ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <AlertCircle className="w-4 h-4" />
                              )}
                            </div>
                            {index < selectedOrderData.timeline.length - 1 && (
                              <div
                                className={`w-0.5 h-8 mt-2 ${
                                  step.completed ? "bg-primary/30" : "bg-muted-foreground/30"
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {step.status}
                            </p>
                            {step.timestamp && <p className="text-sm text-muted-foreground">{step.timestamp}</p>}
                          </div>
                          <div>
                            {step.completed ? (
                              <Badge className="bg-primary/10 text-primary">Completed</Badge>
                            ) : index === selectedOrderData.timeline.findIndex((s) => !s.completed) ? (
                              <Badge className="bg-secondary/10 text-secondary">In Progress</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Actions</CardTitle>
                    <CardDescription>Available actions for this order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button variant="outline">
                        <Package className="w-4 h-4 mr-2" />
                        View Invoice
                      </Button>
                      <Button variant="outline">
                        <Truck className="w-4 h-4 mr-2" />
                        Contact Carrier
                      </Button>
                      {selectedOrderData.status === "delivered" && (
                        <Button>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Order</h3>
                  <p className="text-muted-foreground">Choose an order from the list to view tracking details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
