"use client"

import { useEffect } from "react"
import { fetchLabDashboard } from "@/lib/api"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"
import { Home, FlaskConical, Dna, Bug, BarChart3, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const QualityVisualization3D = dynamic(() => import("@/components/3d-quality-visualization"), { ssr: false })

const navigation = [
  { name: "Dashboard", href: "/laboratory/dashboard", icon: Home, current: true },
  { name: "Quality Tests", href: "/laboratory/quality-tests", icon: FlaskConical, current: false },
  { name: "DNA Barcoding", href: "/laboratory/dna-barcoding", icon: Dna, current: false },
  { name: "Pesticide Analysis", href: "/laboratory/pesticide-analysis", icon: Bug, current: false },
]

const stats = [
  { name: "Tests Completed", value: "156", change: "+12", changeType: "positive" },
  { name: "Pending Analysis", value: "8", change: "-3", changeType: "positive" },
  { name: "DNA Samples", value: "24", change: "+6", changeType: "positive" },
  { name: "Quality Score", value: "98%", change: "+1%", changeType: "positive" },
]

const recentTests = [
  { id: "T001", sample: "Wheat Batch B001", type: "Quality Test", status: "Completed", result: "Pass" },
  { id: "T002", sample: "Rice Batch B002", type: "DNA Barcoding", status: "In Progress", result: "Pending" },
  { id: "T003", sample: "Corn Batch B003", type: "Pesticide Analysis", status: "Completed", result: "Pass" },
  { id: "T004", sample: "Barley Batch B004", type: "Quality Test", status: "Pending", result: "Pending" },
]

const testQueue = [
  { id: "Q001", sample: "Wheat Sample #45", priority: "High", estimatedTime: "2 hours" },
  { id: "Q002", sample: "Rice Sample #23", priority: "Medium", estimatedTime: "4 hours" },
  { id: "Q003", sample: "Corn Sample #67", priority: "Low", estimatedTime: "6 hours" },
]

export default function LaboratoryDashboard() {
  useEffect(() => {
    fetchLabDashboard().catch(() => {})
  }, [])
  return (
    <DashboardLayout userType="laboratory" userName="Dr. Smith" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laboratory Dashboard</h1>
          <p className="text-muted-foreground">Manage quality tests, DNA analysis, and pesticide screening</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics Visualization</CardTitle>
            <CardDescription>Interactive 3D view of current sample quality parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <QualityVisualization3D />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                Quality Tests
              </CardTitle>
              <CardDescription>Conduct comprehensive quality assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="w-4 h-4" />
                  <span>Nutritional analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>Purity testing</span>
                </div>
                <Link href="/laboratory/quality-tests">
                  <Button className="w-full">
                    <FlaskConical className="w-4 h-4 mr-2" />
                    Manage Quality Tests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="w-5 h-5 text-primary" />
                DNA Barcoding
              </CardTitle>
              <CardDescription>Genetic identification and authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Dna className="w-4 h-4" />
                  <span>Species verification</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>Authenticity confirmation</span>
                </div>
                <Link href="/laboratory/dna-barcoding">
                  <Button className="w-full" variant="secondary">
                    <Dna className="w-4 h-4 mr-2" />
                    DNA Analysis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-primary" />
                Pesticide Analysis
              </CardTitle>
              <CardDescription>Chemical residue detection and safety testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bug className="w-4 h-4" />
                  <span>Residue screening</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>Safety compliance</span>
                </div>
                <Link href="/laboratory/pesticide-analysis">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Bug className="w-4 h-4 mr-2" />
                    Pesticide Testing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tests</CardTitle>
              <CardDescription>Latest laboratory analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {test.id} - {test.sample}
                      </p>
                      <p className="text-sm text-muted-foreground">{test.type}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          test.status === "Completed"
                            ? "bg-primary/10 text-primary"
                            : test.status === "In Progress"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {test.status}
                      </span>
                      <p className="text-xs text-muted-foreground">Result: {test.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Test Queue</CardTitle>
              <CardDescription>Upcoming laboratory analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testQueue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {item.id} - {item.sample}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ETA: {item.estimatedTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.priority === "High"
                            ? "bg-destructive/10 text-destructive"
                            : item.priority === "Medium"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <CardDescription>Laboratory equipment availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <FlaskConical className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Spectrometer</p>
                <p className="text-sm text-primary">Available</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Dna className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium">PCR Machine</p>
                <p className="text-sm text-primary">Available</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Bug className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="font-medium">GC-MS</p>
                <p className="text-sm text-secondary">In Use</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
