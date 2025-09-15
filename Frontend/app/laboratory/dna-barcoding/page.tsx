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
import { Home, FlaskConical, Dna, Bug, Plus, CheckCircle, AlertCircle } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/laboratory/dashboard", icon: Home, current: false },
  { name: "Quality Tests", href: "/laboratory/quality-tests", icon: FlaskConical, current: false },
  { name: "DNA Barcoding", href: "/laboratory/dna-barcoding", icon: Dna, current: true },
  { name: "Pesticide Analysis", href: "/laboratory/pesticide-analysis", icon: Bug, current: false },
]

export default function DNABarcodingPage() {
  const [newAnalysis, setNewAnalysis] = useState({
    sampleId: "",
    batchId: "",
    expectedSpecies: "",
    priority: "",
    notes: "",
  })

  const [isCreatingAnalysis, setIsCreatingAnalysis] = useState(false)

  const activeAnalyses = [
    {
      id: "DNA001",
      sampleId: "S001",
      batchId: "B001",
      expectedSpecies: "Triticum aestivum (Wheat)",
      status: "completed",
      progress: 100,
      startTime: "08:00 AM",
      completionTime: "02:00 PM",
      result: "Confirmed",
      confidence: "99.8%",
      sequence: "ATCGATCGATCGATCG...",
      matchedSpecies: "Triticum aestivum",
    },
    {
      id: "DNA002",
      sampleId: "S002",
      batchId: "B002",
      expectedSpecies: "Oryza sativa (Rice)",
      status: "in-progress",
      progress: 65,
      startTime: "10:00 AM",
      completionTime: "04:00 PM",
      result: "Pending",
      confidence: "N/A",
      sequence: "Processing...",
      matchedSpecies: "N/A",
    },
    {
      id: "DNA003",
      sampleId: "S003",
      batchId: "B003",
      expectedSpecies: "Zea mays (Corn)",
      status: "pending",
      progress: 0,
      startTime: "Not started",
      completionTime: "06:00 PM",
      result: "Pending",
      confidence: "N/A",
      sequence: "N/A",
      matchedSpecies: "N/A",
    },
  ]

  const handleCreateAnalysis = () => {
    if (newAnalysis.sampleId && newAnalysis.expectedSpecies) {
      setIsCreatingAnalysis(false)
      alert(`DNA analysis ${newAnalysis.sampleId} created successfully!`)
    }
  }

  const updateAnalysisStatus = (analysisId: string, status: string) => {
    alert(`DNA analysis ${analysisId} status updated to ${status}`)
  }

  return (
    <DashboardLayout userType="laboratory" userName="Dr. Smith" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">DNA Barcoding</h1>
            <p className="text-muted-foreground">Genetic identification and species authentication</p>
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
              <CardTitle>Create New DNA Analysis</CardTitle>
              <CardDescription>Initialize genetic identification process</CardDescription>
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
                  <Label htmlFor="expectedSpecies">Expected Species</Label>
                  <Select
                    value={newAnalysis.expectedSpecies}
                    onValueChange={(value) => setNewAnalysis((prev) => ({ ...prev, expectedSpecies: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expected species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Triticum aestivum">Triticum aestivum (Wheat)</SelectItem>
                      <SelectItem value="Oryza sativa">Oryza sativa (Rice)</SelectItem>
                      <SelectItem value="Zea mays">Zea mays (Corn)</SelectItem>
                      <SelectItem value="Hordeum vulgare">Hordeum vulgare (Barley)</SelectItem>
                      <SelectItem value="Glycine max">Glycine max (Soybean)</SelectItem>
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
                <Button onClick={handleCreateAnalysis} disabled={!newAnalysis.sampleId || !newAnalysis.expectedSpecies}>
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
            <CardTitle>DNA Barcoding Analyses</CardTitle>
            <CardDescription>Monitor genetic identification processes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeAnalyses.map((analysis) => (
                <div key={analysis.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Dna className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {analysis.id} - Sample {analysis.sampleId}
                        </h3>
                        <p className="text-muted-foreground">
                          Expected: {analysis.expectedSpecies} • Batch {analysis.batchId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          analysis.status === "completed"
                            ? "bg-primary text-primary-foreground"
                            : analysis.status === "in-progress"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {analysis.status === "in-progress"
                          ? "In Progress"
                          : analysis.status === "completed"
                            ? "Completed"
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
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="font-medium">{analysis.confidence}</p>
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
                  {analysis.status === "completed" && (
                    <div className="mb-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Analysis Results</h4>
                        {analysis.result === "Confirmed" ? (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Identification Result</p>
                          <p className="font-semibold text-lg">{analysis.result}</p>
                          <p className="text-sm">Matched Species: {analysis.matchedSpecies}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Confidence Level</p>
                          <p className="font-semibold text-lg">{analysis.confidence}</p>
                          <p className="text-sm">High confidence match</p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">DNA Sequence (partial)</p>
                        <p className="font-mono text-sm bg-background p-2 rounded border">{analysis.sequence}</p>
                      </div>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert(`Generating certificate for ${analysis.id}`)}
                      >
                        Generate Certificate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Species Database */}
        <Card>
          <CardHeader>
            <CardTitle>Species Reference Database</CardTitle>
            <CardDescription>Common agricultural species for identification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Triticum aestivum</h4>
                <p className="text-sm text-muted-foreground">Common Wheat</p>
                <p className="text-xs text-muted-foreground mt-1">Barcode: rbcL, matK</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Oryza sativa</h4>
                <p className="text-sm text-muted-foreground">Asian Rice</p>
                <p className="text-xs text-muted-foreground mt-1">Barcode: rbcL, matK</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Zea mays</h4>
                <p className="text-sm text-muted-foreground">Corn/Maize</p>
                <p className="text-xs text-muted-foreground mt-1">Barcode: rbcL, matK</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Hordeum vulgare</h4>
                <p className="text-sm text-muted-foreground">Barley</p>
                <p className="text-xs text-muted-foreground mt-1">Barcode: rbcL, matK</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Glycine max</h4>
                <p className="text-sm text-muted-foreground">Soybean</p>
                <p className="text-xs text-muted-foreground mt-1">Barcode: rbcL, matK</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Avena sativa</h4>
                <p className="text-sm text-muted-foreground">Oat</p>
                <p className="text-xs text-muted-foreground mt-1">Barcode: rbcL, matK</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
