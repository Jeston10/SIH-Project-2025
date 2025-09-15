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
  CheckCircle,
  AlertTriangle,
  Shield,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: Home, current: false },
  { name: "Harvest Origins", href: "/user/harvest-origins", icon: MapPin, current: false },
  { name: "Processing Info", href: "/user/processing-info", icon: Building2, current: false },
  { name: "Order Tracking", href: "/user/order-tracking", icon: Package, current: false },
  { name: "Quality Reports", href: "/user/quality-reports", icon: FlaskConical, current: true },
]

const qualityReports = [
  {
    id: "QR001",
    batchId: "B001",
    product: "Organic Wheat Flour",
    testDate: "2024-01-11",
    laboratory: "Quality Labs Inc",
    overallScore: 98,
    status: "passed",
    qualityTests: {
      protein: { value: "13.2%", standard: "≥12%", status: "pass" },
      moisture: { value: "12.5%", standard: "≤14%", status: "pass" },
      fat: { value: "2.1%", standard: "1.5-3%", status: "pass" },
      fiber: { value: "3.8%", standard: "≥3%", status: "pass" },
      ash: { value: "0.8%", standard: "≤1%", status: "pass" },
    },
    dnaAnalysis: {
      expectedSpecies: "Triticum aestivum",
      identifiedSpecies: "Triticum aestivum",
      confidence: "99.8%",
      status: "confirmed",
      sequence: "ATCGATCGATCGATCG...",
    },
    pesticideAnalysis: {
      totalCompounds: 150,
      detected: 2,
      status: "pass",
      residues: [
        { name: "Chlorpyrifos", detected: 0.02, limit: 0.05, unit: "mg/kg", status: "pass" },
        { name: "Malathion", detected: 0.01, limit: 0.02, unit: "mg/kg", status: "pass" },
      ],
    },
    certifications: ["Organic", "Non-GMO", "Pesticide-Free"],
  },
  {
    id: "QR002",
    batchId: "B002",
    product: "Premium Rice",
    testDate: "2024-01-09",
    laboratory: "AgriTest Laboratory",
    overallScore: 96,
    status: "passed",
    qualityTests: {
      protein: { value: "7.2%", standard: "6-8%", status: "pass" },
      moisture: { value: "13.8%", standard: "≤14%", status: "pass" },
      brokenGrains: { value: "2.1%", standard: "≤5%", status: "pass" },
      foreignMatter: { value: "0.1%", standard: "≤0.5%", status: "pass" },
      chalkiness: { value: "3%", standard: "≤5%", status: "pass" },
    },
    dnaAnalysis: {
      expectedSpecies: "Oryza sativa",
      identifiedSpecies: "Oryza sativa",
      confidence: "99.5%",
      status: "confirmed",
      sequence: "GCTAGCTAGCTAGCTA...",
    },
    pesticideAnalysis: {
      totalCompounds: 120,
      detected: 0,
      status: "pass",
      residues: [],
    },
    certifications: ["Premium", "Chemical-Free"],
  },
  {
    id: "QR003",
    batchId: "B003",
    product: "Stone Ground Corn Meal",
    testDate: "2024-01-07",
    laboratory: "Food Safety Labs",
    overallScore: 94,
    status: "passed",
    qualityTests: {
      protein: { value: "8.5%", standard: "7-10%", status: "pass" },
      moisture: { value: "13.2%", standard: "≤14%", status: "pass" },
      fat: { value: "3.8%", standard: "3-5%", status: "pass" },
      fiber: { value: "7.2%", standard: "≥6%", status: "pass" },
      starch: { value: "72%", standard: "≥70%", status: "pass" },
    },
    dnaAnalysis: {
      expectedSpecies: "Zea mays",
      identifiedSpecies: "Zea mays",
      confidence: "99.2%",
      status: "confirmed",
      sequence: "TACGTACGTACGTACG...",
    },
    pesticideAnalysis: {
      totalCompounds: 100,
      detected: 1,
      status: "pass",
      residues: [{ name: "Atrazine", detected: 0.005, limit: 0.01, unit: "mg/kg", status: "pass" }],
    },
    certifications: ["Traditional", "Stone Ground"],
  },
]

export default function QualityReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const filteredReports = qualityReports.filter(
    (report) =>
      report.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedReportData = qualityReports.find((r) => r.id === selectedReport)

  return (
    <DashboardLayout userType="user" userName="John Consumer" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quality Reports</h1>
          <p className="text-muted-foreground">View comprehensive lab results and quality analysis</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by product, batch ID, or report ID..."
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
          {/* Reports List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quality Reports</CardTitle>
                <CardDescription>Select a report to view detailed results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedReport === report.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{report.product}</h4>
                          <Badge variant="outline">{report.batchId}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{report.laboratory}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Test Date: {report.testDate}</p>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-primary">{report.overallScore}%</p>
                            </div>
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Details */}
          <div className="lg:col-span-2">
            {selectedReportData ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-primary" />
                      Quality Report {selectedReportData.id}
                    </CardTitle>
                    <CardDescription>Comprehensive quality analysis results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Product</p>
                          <p className="font-medium">{selectedReportData.product}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Batch ID</p>
                          <Badge variant="outline">{selectedReportData.batchId}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Laboratory</p>
                          <p className="font-medium">{selectedReportData.laboratory}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Test Date</p>
                          <p className="font-medium">{selectedReportData.testDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Overall Score</p>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-primary">{selectedReportData.overallScore}%</p>
                            <CheckCircle className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Certifications</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedReportData.certifications.map((cert) => (
                              <Badge key={cert} variant="secondary">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-emerald-600" />
                      Quality Tests
                    </CardTitle>
                    <CardDescription>Nutritional and physical quality analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedReportData.qualityTests).map(([test, data]) => (
                        <div key={test} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium capitalize">{test}</h4>
                            <Badge variant={data.status === "pass" ? "default" : "destructive"}>{data.status}</Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Result: </span>
                              <span className="font-medium">{data.value}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Standard: </span>
                              <span className="font-medium">{data.standard}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      DNA Barcoding Analysis
                    </CardTitle>
                    <CardDescription>Species authentication and genetic verification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Species</p>
                          <p className="font-medium">{selectedReportData.dnaAnalysis.expectedSpecies}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Identified Species</p>
                          <p className="font-medium">{selectedReportData.dnaAnalysis.identifiedSpecies}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Confidence Level</p>
                          <p className="text-lg font-bold text-blue-600">{selectedReportData.dnaAnalysis.confidence}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge
                            variant={selectedReportData.dnaAnalysis.status === "confirmed" ? "default" : "destructive"}
                          >
                            {selectedReportData.dnaAnalysis.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">DNA Sequence Sample</p>
                      <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                        {selectedReportData.dnaAnalysis.sequence}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Pesticide Analysis
                    </CardTitle>
                    <CardDescription>Chemical residue screening and safety assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {selectedReportData.pesticideAnalysis.totalCompounds}
                        </p>
                        <p className="text-sm text-muted-foreground">Compounds Tested</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">
                          {selectedReportData.pesticideAnalysis.detected}
                        </p>
                        <p className="text-sm text-muted-foreground">Residues Detected</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Badge
                          variant={selectedReportData.pesticideAnalysis.status === "pass" ? "default" : "destructive"}
                          className="text-lg px-4 py-2"
                        >
                          {selectedReportData.pesticideAnalysis.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {selectedReportData.pesticideAnalysis.residues.length > 0 ? (
                      <div>
                        <h4 className="font-medium mb-3">Detected Residues</h4>
                        <div className="space-y-3">
                          {selectedReportData.pesticideAnalysis.residues.map((residue, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{residue.name}</h5>
                                <Badge variant={residue.status === "pass" ? "default" : "destructive"}>
                                  {residue.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Detected: </span>
                                  <span className="font-medium">
                                    {residue.detected} {residue.unit}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Limit: </span>
                                  <span className="font-medium">
                                    {residue.limit} {residue.unit}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
                        <p className="font-medium text-primary">No Pesticide Residues Detected</p>
                        <p className="text-sm text-muted-foreground">This product is free from chemical residues</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Quality Report</h3>
                  <p className="text-muted-foreground">
                    Choose a report from the list to view detailed analysis results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
