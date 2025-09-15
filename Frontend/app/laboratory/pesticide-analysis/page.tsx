"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { Home, FlaskConical, Dna, Bug, Plus, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/laboratory/dashboard", icon: Home, current: false },
  { name: "Quality Tests", href: "/laboratory/quality-tests", icon: FlaskConical, current: false },
  { name: "DNA Barcoding", href: "/laboratory/dna-barcoding", icon: Dna, current: false },
  { name: "Pesticide Analysis", href: "/laboratory/pesticide-analysis", icon: Bug, current: true },
]

const pesticideTypes = [
  { id: "organophosphates", name: "Organophosphates", method: "GC-MS" },
  { id: "organochlorines", name: "Organochlorines", method: "GC-ECD" },
  { id: "carbamates", name: "Carbamates", method: "LC-MS/MS" },
  { id: "pyrethroids", name: "Pyrethroids", method: "GC-MS" },
  { id: "triazines", name: "Triazines", method: "LC-MS/MS" },
  { id: "multi-residue", name: "Multi-Residue Screen", method: "LC-MS/MS + GC-MS" },
]

export default function PesticideAnalysisPage() {
  const [newAnalysis, setNewAnalysis] = useState({
    sampleId: "",
    batchId: "",
    analysisType: "",
    priority: "",
    notes: "",
  })

  const [isCreatingAnalysis, setIsCreatingAnalysis] = useState(false)

  const activeAnalyses = [
    {
      id: "PA001",
      sampleId: "S001",
      batchId: "B001",
      analysisType: "Multi-Residue Screen",
      status: "completed",
      progress: 100,
      startTime: "09:00 AM",
      completionTime: "03:00 PM",
      result: "Pass",
      detectedResidues: [
        { name: "Chlorpyrifos", detected: 0.02, limit: 0.05, unit: "mg/kg", status: "pass" },
        { name: "Malathion", detected: 0.01, limit: 0.02, unit: "mg/kg", status: "pass" },
      ],
      totalCompounds: 150,
      detected: 2,
    },
    {
      id: "PA002",
      sampleId: "S002",
      batchId: "B002",
      analysisType: "Organophosphates",
      status: "in-progress",
      progress: 70,
      startTime: "11:00 AM",
      completionTime: "05:00 PM",
      result: "Pending",
      detectedResidues: [],
      totalCompounds: 45,
      detected: 0,
    },
    {
      id: "PA003",
      sampleId: "S003",
      batchId: "B003",
      analysisType: "Carbamates",
      status: "pending",
      progress: 0,
      startTime: "Not started",
      completionTime: "Tomorrow 2:00 PM",
      result: "Pending",
      detectedResidues: [],
      totalCompounds: 30,
      detected: 0,
    },
  ]

  const handleCreateAnalysis = () => {
    if (newAnalysis.sampleId && newAnalysis.analysisType) {
      setIsCreatingAnalysis(false)
      alert(`Pesticide analysis ${newAnalysis.sampleId} created successfully!`)
    }
  }

  const updateAnalysisStatus = (analysisId: string, status: string) => {
    alert(`Pesticide analysis ${analysisId} status updated to ${status}`)
  }

  return (
    <DashboardLayout userType="laboratory" userName="Dr. Smith" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pesticide Analysis</h1>
            <p className="text-muted-foreground">Chemical residue detection and safety compliance testing</p>
          </div>
          <Button onClick={() => setIsCreatingAnalysis(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Create New Analysis */}
        {isCreatingAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Pesticide Analysis</CardTitle>
              <CardDescription>Initialize chemical residue screening</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sampleId">Sample ID</Label>
                  <Input
                    id="sampleId"
                    placeholder="e.g., S004"
                    value={newAnalysis.sampleId}
                    onChange={(e) => setNewAnalysis((prev) => ({ ...prev, sampleId: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Select
                    value={newAnalysis.batchId}
                    onValueChange={(value) => setNewAnalysis((prev) => ({ ...prev, batchId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B001">B001 - Wheat Flour</SelectItem>
                      <SelectItem value="B002">B002 - Rice</SelectItem>
                      <SelectItem value="B003">B003 - Corn Meal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysisType">Analysis Type</Label>
                  <Select
                    value={newAnalysis.analysisType}
                    onValueChange={(value) => setNewAnalysis((prev) => ({ ...prev, analysisType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      {pesticideTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name} ({type.method})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newAnalysis.priority}
                    onValueChange={(value) => setNewAnalysis((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Special instructions or observations..."
                  value={newAnalysis.notes}
                  onChange={(e) => setNewAnalysis((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateAnalysis} disabled={!newAnalysis.sampleId || !newAnalysis.analysisType}>
                  Create Analysis
                </Button>
                <Button variant="outline" onClick={() => setIsCreatingAnalysis(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Analyses */}
        <Card>
          <CardHeader>
            <CardTitle>Pesticide Analyses</CardTitle>
            <CardDescription>Monitor chemical residue screening processes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeAnalyses.map((analysis) => (
                <div key={analysis.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Bug className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {analysis.id} - Sample {analysis.sampleId}
                        </h3>
                        <p className="text-muted-foreground">
                          {analysis.analysisType} • Batch {analysis.batchId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          analysis.status === "completed"
                            ? analysis.result === "Pass"
                              ? "bg-primary text-primary-foreground"
                              : "bg-destructive text-destructive-foreground"
                            : analysis.status === "in-progress"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {analysis.status === "in-progress"
                          ? "In Progress"
                          : analysis.status === "completed"
                            ? analysis.result
                            : "Pending"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Time</p>
                      <p className="font-medium">{analysis.startTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completion</p>
                      <p className="font-medium">{analysis.completionTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="font-medium">{analysis.progress}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Compounds Tested</p>
                      <p className="font-medium">{analysis.totalCompounds}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Analysis Progress</span>
                      <span>{analysis.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analysis.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Results */}
                  {analysis.status === "completed" && analysis.detectedResidues.length > 0 && (
                    <div className="mb-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Detected Residues ({analysis.detected})</h4>
                        {analysis.result === "Pass" ? (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                      </div>

                      <div className="space-y-2">
                        {analysis.detectedResidues.map((residue, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{residue.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Detected: {residue.detected} {residue.unit}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                Limit: {residue.limit} {residue.unit}
                              </p>
                              <div className="flex items-center gap-1">
                                {residue.status === "pass" ? (
                                  <CheckCircle className="w-3 h-3 text-primary" />
                                ) : (
                                  <AlertTriangle className="w-3 h-3 text-destructive" />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    residue.status === "pass" ? "text-primary" : "text-destructive"
                                  }`}
                                >
                                  {residue.status === "pass" ? "Within Limit" : "Exceeds Limit"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.status === "completed" && analysis.detected === 0 && (
                    <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <p className="font-medium text-primary">No Pesticide Residues Detected</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sample passed screening for all {analysis.totalCompounds} tested compounds
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {analysis.status === "pending" && (
                      <Button size="sm" onClick={() => updateAnalysisStatus(analysis.id, "in-progress")}>
                        Start Analysis
                      </Button>
                    )}
                    {analysis.status === "in-progress" && (
                      <Button size="sm" onClick={() => updateAnalysisStatus(analysis.id, "completed")}>
                        Complete Analysis
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => alert(`Viewing details for ${analysis.id}`)}>
                      View Details
                    </Button>
                    {analysis.status === "completed" && (
                      <Button size="sm" variant="outline" onClick={() => alert(`Generating report for ${analysis.id}`)}>
                        Generate Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Limits Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Maximum Residue Limits (MRL)</CardTitle>
            <CardDescription>Reference safety limits for common pesticides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Organophosphates</h4>
                <div className="space-y-1 mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Chlorpyrifos:</span>
                    <span>0.05 mg/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Malathion:</span>
                    <span>0.02 mg/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diazinon:</span>
                    <span>0.01 mg/kg</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Organochlorines</h4>
                <div className="space-y-1 mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>DDT:</span>
                    <span>0.05 mg/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aldrin:</span>
                    <span>0.01 mg/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Endrin:</span>
                    <span>0.01 mg/kg</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Carbamates</h4>
                <div className="space-y-1 mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Carbaryl:</span>
                    <span>0.1 mg/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aldicarb:</span>
                    <span>0.01 mg/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Methomyl:</span>
                    <span>0.02 mg/kg</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
