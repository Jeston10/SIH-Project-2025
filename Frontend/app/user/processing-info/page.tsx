"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { Home, MapPin, Building2, Package, FlaskConical, Search, CheckCircle, Thermometer } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: Home, current: false },
  { name: "Harvest Origins", href: "/user/harvest-origins", icon: MapPin, current: false },
  { name: "Processing Info", href: "/user/processing-info", icon: Building2, current: true },
  { name: "Order Tracking", href: "/user/order-tracking", icon: Package, current: false },
  { name: "Quality Reports", href: "/user/quality-reports", icon: FlaskConical, current: false },
]

const processingData = [
  {
    id: "P001",
    batchId: "B001",
    product: "Organic Wheat Flour",
    facilityName: "Central Processing Facility",
    facilityLocation: "Processing District, NY",
    startDate: "2024-01-11",
    completionDate: "2024-01-13",
    status: "completed",
    steps: [
      {
        name: "Drying",
        status: "completed",
        startTime: "2024-01-11 08:00",
        endTime: "2024-01-12 08:00",
        duration: "24 hours",
        temperature: "60°C",
        notes: "Optimal moisture reduction achieved",
      },
      {
        name: "Grinding",
        status: "completed",
        startTime: "2024-01-12 09:00",
        endTime: "2024-01-12 11:00",
        duration: "2 hours",
        meshSize: "Fine",
        notes: "Consistent particle size maintained",
      },
      {
        name: "Packaging",
        status: "completed",
        startTime: "2024-01-12 14:00",
        endTime: "2024-01-13 10:00",
        duration: "20 hours",
        packageType: "Sealed bags",
        notes: "Quality sealed in nitrogen atmosphere",
      },
    ],
    qualityChecks: [
      { parameter: "Moisture Content", value: "12.5%", standard: "≤14%", status: "pass" },
      { parameter: "Protein Content", value: "13.2%", standard: "≥12%", status: "pass" },
      { parameter: "Particle Size", value: "Fine", standard: "Uniform", status: "pass" },
    ],
  },
  {
    id: "P002",
    batchId: "B002",
    product: "Premium Rice",
    facilityName: "Rice Processing Center",
    facilityLocation: "Valley Processing, CA",
    startDate: "2024-01-09",
    completionDate: "2024-01-11",
    status: "completed",
    steps: [
      {
        name: "Drying",
        status: "completed",
        startTime: "2024-01-09 10:00",
        endTime: "2024-01-10 10:00",
        duration: "24 hours",
        temperature: "55°C",
        notes: "Gentle drying to preserve grain quality",
      },
      {
        name: "Milling",
        status: "completed",
        startTime: "2024-01-10 11:00",
        endTime: "2024-01-10 15:00",
        duration: "4 hours",
        process: "Stone milling",
        notes: "Traditional milling process used",
      },
      {
        name: "Packaging",
        status: "completed",
        startTime: "2024-01-10 16:00",
        endTime: "2024-01-11 08:00",
        duration: "16 hours",
        packageType: "Vacuum sealed",
        notes: "Premium packaging for freshness",
      },
    ],
    qualityChecks: [
      { parameter: "Moisture Content", value: "13.8%", standard: "≤14%", status: "pass" },
      { parameter: "Broken Grains", value: "2.1%", standard: "≤5%", status: "pass" },
      { parameter: "Foreign Matter", value: "0.1%", standard: "≤0.5%", status: "pass" },
    ],
  },
]

export default function ProcessingInfoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProcessing, setSelectedProcessing] = useState<string | null>(null)

  const filteredProcessing = processingData.filter(
    (processing) =>
      processing.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processing.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processing.batchId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedProcessingData = processingData.find((p) => p.id === selectedProcessing)

  return (
    <DashboardLayout userType="user" userName="John Consumer" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Processing Information</h1>
          <p className="text-muted-foreground">View facility processing logs and batch tracking data</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by product, facility, or batch ID..."
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
          {/* Processing List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Processing Records</CardTitle>
                <CardDescription>Select a batch to view processing details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredProcessing.map((processing) => (
                    <div
                      key={processing.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedProcessing === processing.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                      onClick={() => setSelectedProcessing(processing.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{processing.product}</h4>
                          <Badge variant="outline">{processing.batchId}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{processing.facilityName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {processing.facilityLocation}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {processing.startDate} - {processing.completionDate}
                          </p>
                          <Badge className="bg-primary/10 text-primary">
                            {processing.status === "completed" ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Details */}
          <div className="lg:col-span-2">
            {selectedProcessingData ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      {selectedProcessingData.product} - {selectedProcessingData.batchId}
                    </CardTitle>
                    <CardDescription>Processing facility and timeline information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Facility Name</p>
                          <p className="font-medium">{selectedProcessingData.facilityName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{selectedProcessingData.facilityLocation}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Processing Period</p>
                          <p className="font-medium">
                            {selectedProcessingData.startDate} - {selectedProcessingData.completionDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge className="bg-primary/10 text-primary">{selectedProcessingData.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Steps</CardTitle>
                    <CardDescription>Detailed processing timeline and parameters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedProcessingData.steps.map((step, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{step.name}</h4>
                                <p className="text-sm text-muted-foreground">Duration: {step.duration}</p>
                              </div>
                            </div>
                            <Badge className="bg-primary/10 text-primary">Completed</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Start Time</p>
                              <p className="font-medium">{step.startTime}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">End Time</p>
                              <p className="font-medium">{step.endTime}</p>
                            </div>
                          </div>

                          {/* Step-specific parameters */}
                          {step.name === "Drying" && (
                            <div className="p-3 bg-muted rounded mb-3">
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Temperature: {step.temperature}</span>
                              </div>
                            </div>
                          )}

                          {step.name === "Grinding" && (
                            <div className="p-3 bg-muted rounded mb-3">
                              <p className="text-sm">
                                <strong>Mesh Size:</strong> {step.meshSize}
                              </p>
                            </div>
                          )}

                          {step.name === "Milling" && (
                            <div className="p-3 bg-muted rounded mb-3">
                              <p className="text-sm">
                                <strong>Process:</strong> {step.process}
                              </p>
                            </div>
                          )}

                          {step.name === "Packaging" && (
                            <div className="p-3 bg-muted rounded mb-3">
                              <p className="text-sm">
                                <strong>Package Type:</strong> {step.packageType}
                              </p>
                            </div>
                          )}

                          <div className="p-3 bg-primary/5 rounded">
                            <p className="text-sm">
                              <strong>Notes:</strong> {step.notes}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quality Checks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Control Checks</CardTitle>
                    <CardDescription>Quality parameters verified during processing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedProcessingData.qualityChecks.map((check, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{check.parameter}</p>
                            <p className="text-sm text-muted-foreground">Standard: {check.standard}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{check.value}</p>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              <span className="text-sm text-primary font-medium">Pass</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Timeline</CardTitle>
                    <CardDescription>Visual timeline of processing steps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedProcessingData.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-primary" />
                            {index < selectedProcessingData.steps.length - 1 && (
                              <div className="w-0.5 h-8 bg-primary/30 mt-2" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{step.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {step.startTime} - {step.endTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-primary/10 text-primary">Completed</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Processing Record</h3>
                  <p className="text-muted-foreground">Choose a batch from the list to view its processing details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
