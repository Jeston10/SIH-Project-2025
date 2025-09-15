"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"
import { Home, MapPin, Building2, Package, FlaskConical, Truck, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const HarvestGlobe = dynamic(() => import("@/components/3d-harvest-globe"), { ssr: false })
const SupplyChain3D = dynamic(() => import("@/components/3d-supply-chain"), { ssr: false })

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: Home, current: true },
  { name: "Harvest Origins", href: "/user/harvest-origins", icon: MapPin, current: false },
  { name: "Processing Info", href: "/user/processing-info", icon: Building2, current: false },
  { name: "Order Tracking", href: "/user/order-tracking", icon: Package, current: false },
  { name: "Quality Reports", href: "/user/quality-reports", icon: FlaskConical, current: false },
]

const userStats = [
  { name: "Active Orders", value: "3", change: "+1", changeType: "positive" },
  { name: "Products Tracked", value: "12", change: "+4", changeType: "positive" },
  { name: "Quality Score", value: "98%", change: "+2%", changeType: "positive" },
  { name: "Verified Origins", value: "8", change: "+2", changeType: "positive" },
]

const recentOrders = [
  {
    id: "ORD001",
    product: "Organic Wheat Flour",
    quantity: "5 kg",
    status: "delivered",
    orderDate: "2024-01-10",
    deliveryDate: "2024-01-15",
    batchId: "B001",
  },
  {
    id: "ORD002",
    product: "Premium Rice",
    quantity: "10 kg",
    status: "in-transit",
    orderDate: "2024-01-12",
    deliveryDate: "2024-01-18",
    batchId: "B002",
  },
  {
    id: "ORD003",
    product: "Corn Meal",
    quantity: "3 kg",
    status: "processing",
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-20",
    batchId: "B003",
  },
]

const featuredProducts = [
  {
    id: "P001",
    name: "Organic Wheat Flour",
    origin: "Green Valley Farm",
    qualityScore: 98,
    certifications: ["Organic", "Non-GMO"],
    image: "/organic-wheat-flour.jpg",
  },
  {
    id: "P002",
    name: "Premium Basmati Rice",
    origin: "Sunrise Fields",
    qualityScore: 96,
    certifications: ["Premium", "Pesticide-Free"],
    image: "/basmati-rice.png",
  },
  {
    id: "P003",
    name: "Stone Ground Corn Meal",
    origin: "Heritage Farm",
    qualityScore: 94,
    certifications: ["Traditional", "Chemical-Free"],
    image: "/corn-meal.jpg",
  },
]

export default function UserDashboard() {
  return (
    <DashboardLayout userType="user" userName="John Consumer" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Consumer Dashboard</h1>
          <p className="text-muted-foreground">Track your orders and explore product origins and quality</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userStats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${stat.changeType === "positive" ? "text-primary" : "text-destructive"}`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Harvest Origins - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Global Harvest Origins</CardTitle>
            <CardDescription>Interactive 3D view of your product sources</CardDescription>
          </CardHeader>
          <CardContent>
            <HarvestGlobe />
          </CardContent>
        </Card>

        {/* Supply Chain Journey - Full Width Below */}
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Journey</CardTitle>
            <CardDescription>3D visualization of your product's journey</CardDescription>
          </CardHeader>
          <CardContent>
            <SupplyChain3D />
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Harvest Origins
              </CardTitle>
              <CardDescription>View farm locations and harvest photos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/user/harvest-origins">
                <Button className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Explore Origins
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Processing Info
              </CardTitle>
              <CardDescription>Track processing and facility data</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/user/processing-info">
                <Button className="w-full" variant="secondary">
                  <Building2 className="w-4 h-4 mr-2" />
                  View Processing
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Tracking
              </CardTitle>
              <CardDescription>Track your orders and deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/user/order-tracking">
                <Button className="w-full bg-transparent" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Track Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                Quality Reports
              </CardTitle>
              <CardDescription>View lab results and quality data</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/user/quality-reports">
                <Button className="w-full" variant="secondary">
                  <FlaskConical className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest product orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {order.id} - {order.product}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {order.quantity} • Batch: {order.batchId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ordered: {order.orderDate} • Delivery: {order.deliveryDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {order.status === "delivered" ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : order.status === "in-transit" ? (
                        <Truck className="w-4 h-4 text-secondary" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-primary/10 text-primary"
                            : order.status === "in-transit"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {order.status === "in-transit" ? "In Transit" : order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Products */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Products</CardTitle>
            <CardDescription>Discover high-quality products with verified origins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="border border-border rounded-lg overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/diverse-products-still-life.png"
                    }}
                  />
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {product.origin}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Quality Score</p>
                        <p className="text-lg font-bold text-primary">{product.qualityScore}%</p>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-wrap gap-1">
                          {product.certifications.map((cert) => (
                            <span
                              key={cert}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust & Transparency */}
        <Card>
          <CardHeader>
            <CardTitle>Trust & Transparency</CardTitle>
            <CardDescription>Why you can trust AyurChakra products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Verified Origins</h4>
                <p className="text-sm text-muted-foreground">
                  Every product is traced back to its source farm with GPS coordinates and photos
                </p>
              </div>
              <div className="text-center p-4">
                <FlaskConical className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Lab Tested</h4>
                <p className="text-sm text-muted-foreground">
                  All products undergo rigorous quality testing and pesticide screening
                </p>
              </div>
              <div className="text-center p-4">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Certified Quality</h4>
                <p className="text-sm text-muted-foreground">
                  Products meet or exceed all regulatory standards and quality requirements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
