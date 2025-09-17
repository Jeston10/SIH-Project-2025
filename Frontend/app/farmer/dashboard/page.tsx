"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"
import { useEffect, useState } from "react"
import { fetchFarmerDashboard } from "@/lib/api"
import { Home, Upload, Camera, BarChart3, MapPin, Thermometer } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const navigation = [
  { name: "Dashboard", href: "/farmer/dashboard", icon: Home, current: true },
  { name: "Harvest Data", href: "/farmer/harvest-data", icon: Upload, current: false },
  { name: "Photos & Environment", href: "/farmer/photos-environment", icon: Camera, current: false },
]

const defaultStats = [
  { name: "Total Harvests", value: "24", change: "+12%", changeType: "positive" },
  { name: "Active Fields", value: "8", change: "+2", changeType: "positive" },
  { name: "Data Uploads", value: "156", change: "+23%", changeType: "positive" },
  { name: "Quality Score", value: "94%", change: "+5%", changeType: "positive" },
]

const defaultRecentUploads = [
  { id: 1, field: "North Field A", crop: "Wheat", date: "2024-01-15", status: "Verified" },
  { id: 2, field: "South Field B", crop: "Rice", date: "2024-01-14", status: "Processing" },
  { id: 3, field: "East Field C", crop: "Corn", date: "2024-01-13", status: "Verified" },
]

export default function FarmerDashboard() {
  const [stats, setStats] = useState(defaultStats)
  const [recentUploads, setRecentUploads] = useState(defaultRecentUploads)

  useEffect(() => {
    fetchFarmerDashboard()
      .then((res) => {
        const data = res?.data || res
        if (!data) return
        if (data.stats && Array.isArray(data.stats)) {
          setStats(
            data.stats.map((s: any) => ({
              name: s.name ?? "",
              value: String(s.value ?? "0"),
              change: String(s.change ?? ""),
              changeType: s.changeType === "negative" ? "negative" : "positive",
            }))
          )
        }
        if (data.recentUploads && Array.isArray(data.recentUploads)) {
          setRecentUploads(
            data.recentUploads.map((u: any, i: number) => ({
              id: u.id ?? i,
              field: u.field ?? u.location ?? "Unknown Field",
              crop: u.crop ?? u.product ?? "",
              date: u.date ?? u.createdAt ?? "",
              status: u.status ?? "Pending",
            }))
          )
        }
      })
      .catch(() => {})
  }, [])
  return (
    <DashboardLayout userType="farmer" userName="John Farmer" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold text-foreground">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Manage your harvest data and environmental monitoring</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{
                y: -4,
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              <Card>
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
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{
              y: -6,
              rotateY: 2,
              boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ duration: 0.1 }}>
                    <Upload className="w-5 h-5 text-primary" />
                  </motion.div>
                  Upload Harvest Data
                </CardTitle>
                <CardDescription>Record geo-tagged harvest information for your fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>GPS coordinates automatically captured</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="w-4 h-4" />
                    <span>Yield and quality metrics tracking</span>
                  </div>
                  <Link href="/farmer/harvest-data">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Harvest Data
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{
              y: -6,
              rotateY: -2,
              boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div whileHover={{ rotate: -10, scale: 1.1 }} transition={{ duration: 0.1 }}>
                    <Camera className="w-5 h-5 text-primary" />
                  </motion.div>
                  Photos & Environment
                </CardTitle>
                <CardDescription>Upload field photos and environmental condition data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Camera className="w-4 h-4" />
                    <span>Field condition photography</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Thermometer className="w-4 h-4" />
                    <span>Weather and soil condition logging</span>
                  </div>
                  <Link href="/farmer/photos-environment">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full" variant="secondary">
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photos & Data
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Uploads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          whileHover={{
            y: -3,
            boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Your latest harvest data submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUploads.map((upload, index) => (
                  <motion.div
                    key={upload.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{
                      x: 4,
                      scale: 1.01,
                      backgroundColor: "rgba(16, 185, 129, 0.02)",
                    }}
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{upload.field}</p>
                      <p className="text-sm text-muted-foreground">
                        {upload.crop} • {upload.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <motion.span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          upload.status === "Verified" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {upload.status}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
