"use client"

import { useEffect, useState } from "react"
import { fetchFacilityDashboard } from "@/lib/api"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"
import { Home, Package, Truck, BarChart3, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

const navigation = [
  { name: "Dashboard", href: "/facility/dashboard", icon: Home, current: true },
  { name: "Processing & Batches", href: "/facility/processing", icon: Package, current: false },
  { name: "Transportation", href: "/facility/transportation", icon: Truck, current: false },
]

const defaultStats = [
  { name: "Active Batches", value: "12", change: "+3", changeType: "positive" },
  { name: "Processing Steps", value: "48", change: "+8", changeType: "positive" },
  { name: "Shipments Today", value: "6", change: "+2", changeType: "positive" },
  { name: "Quality Score", value: "96%", change: "+2%", changeType: "positive" },
]

const defaultActiveBatches = [
  { id: "B001", product: "Wheat Flour", stage: "Grinding", progress: 75, status: "In Progress" },
  { id: "B002", product: "Rice", stage: "Drying", progress: 45, status: "In Progress" },
  { id: "B003", product: "Corn Meal", stage: "Packaging", progress: 90, status: "In Progress" },
  { id: "B004", product: "Barley", stage: "Quality Check", progress: 100, status: "Completed" },
]

const defaultRecentShipments = [
  { id: "S001", destination: "Mumbai Distribution Center", status: "In Transit", eta: "2 hours" },
  { id: "S002", destination: "Delhi Warehouse", status: "Delivered", eta: "Completed" },
  { id: "S003", destination: "Bangalore Hub", status: "Loading", eta: "4 hours" },
]

export default function FacilityDashboard() {
  const [stats, setStats] = useState(defaultStats)
  const [activeBatches, setActiveBatches] = useState(defaultActiveBatches)
  const [recentShipments, setRecentShipments] = useState(defaultRecentShipments)

  useEffect(() => {
    fetchFacilityDashboard()
      .then((res) => {
        const data = res?.data || res
        if (!data) return
        if (Array.isArray(data.stats)) {
          setStats(
            data.stats.map((s: any) => ({
              name: s.name ?? "",
              value: String(s.value ?? "0"),
              change: String(s.change ?? ""),
              changeType: s.changeType === "negative" ? "negative" : "positive",
            }))
          )
        }
        if (Array.isArray(data.activeBatches)) {
          setActiveBatches(
            data.activeBatches.map((b: any) => ({
              id: b.id ?? b.batchId ?? "",
              product: b.product ?? "",
              stage: b.stage ?? b.phase ?? "",
              progress: Number(b.progress ?? 0),
              status: b.status ?? "In Progress",
            }))
          )
        }
        if (Array.isArray(data.recentShipments)) {
          setRecentShipments(
            data.recentShipments.map((s: any) => ({
              id: s.id ?? "",
              destination: s.destination ?? s.to ?? "",
              status: s.status ?? "In Transit",
              eta: s.eta ?? s.estimatedTime ?? "",
            }))
          )
        }
      })
      .catch(() => {})
  }, [])
  return (
    <DashboardLayout userType="facility" userName="Sarah Manager" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Facility Dashboard</h1>
          <p className="text-muted-foreground">Manage processing operations and supply chain logistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Processing & Batch Management
              </CardTitle>
              <CardDescription>Track drying, grinding, and packaging operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="w-4 h-4" />
                  <span>Real-time batch tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Processing timeline management</span>
                </div>
                <Link href="/facility/processing">
                  <Button className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Processing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Transportation & Distribution
              </CardTitle>
              <CardDescription>Coordinate shipments and delivery logistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  <span>Fleet and route management</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>Delivery tracking and confirmation</span>
                </div>
                <Link href="/facility/transportation">
                  <Button className="w-full" variant="secondary">
                    <Truck className="w-4 h-4 mr-2" />
                    Manage Transportation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Batches */}
          <Card>
            <CardHeader>
              <CardTitle>Active Batches</CardTitle>
              <CardDescription>Current processing operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBatches.map((batch) => (
                  <div key={batch.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {batch.id} - {batch.product}
                        </p>
                        <p className="text-sm text-muted-foreground">{batch.stage}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            batch.status === "Completed"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          {batch.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${batch.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{batch.progress}% complete</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Shipments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>Transportation status updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{shipment.id}</p>
                      <p className="text-sm text-muted-foreground">{shipment.destination}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          shipment.status === "Delivered"
                            ? "bg-primary/10 text-primary"
                            : shipment.status === "In Transit"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {shipment.status}
                      </span>
                      <p className="text-xs text-muted-foreground">ETA: {shipment.eta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
