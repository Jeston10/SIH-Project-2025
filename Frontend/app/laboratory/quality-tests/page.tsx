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
import { Home, FlaskConical, Dna, Bug, Plus, BarChart3 } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/laboratory/dashboard", icon: Home, current: false },
  { name: "Quality Tests", href: "/laboratory/quality-tests", icon: FlaskConical, current: true },
  { name: "DNA Barcoding", href: "/laboratory/dna-barcoding", icon: Dna, current: false },
  { name: "Pesticide Analysis", href: "/laboratory/pesticide-analysis", icon: Bug, current: false },
]

const testTypes = [
  { id: "nutritional", name: "Nutritional Analysis", duration: "4 hours" },
  { id: "moisture", name: "Moisture Content", duration: "2 hours" },
  { id: "protein", name: "Protein Content", duration: "3 hours" },
  { id: "fat", name: "Fat Content", duration: "3 hours" },
  { id: "fiber", name: "Fiber Content", duration: "4 hours" },
  { id: "ash", name: "Ash Content", duration: "5 hours" },
]

export default function QualityTestsPage() {
  const [newTest, setNewTest] = useState({
    sampleId: "",
    batchId: "",
    testType: "",
    priority: "",
    notes: "",
  })

  const [isCreatingTest, setIsCreatingTest] = useState(false)

  const activeTests = [
    {
      id: "QT001",
      sampleId: "S001",
      batchId: "B001",
      testType: "Nutritional Analysis",
      status: "in-progress",
      progress: 75,
      startTime: "09:00 AM",
      estimatedCompletion: "01:00 PM",
      results: {
        protein: "12.5%",
        moisture: "14.2%",
        fat: "2.1%",
        fiber: "3.8%",
      },
    },
    {
      id: "QT002",
      sampleId: "S002",
      batchId: "B002",
      testType: "Moisture Content",
      status: "completed",
      progress: 100,
      startTime: "08:00 AM",
      estimatedCompletion: "10:00 AM",
      results: {
        moisture: "13.8%",
      },
    },
    {
      id: "QT003",
      sampleId: "S003",
      batchId: "B003",
      testType: "Protein Content",
      status: "pending",
      progress: 0,
      startTime: "Not started",
      estimatedCompletion: "03:00 PM",
      results: {},
    },
  ]

  const handleCreateTest = () => {
    if (newTest.sampleId && newTest.testType) {
      setIsCreatingTest(false)
      alert(`Quality test ${newTest.sampleId} created successfully!`)
    }
  }

  const updateTestStatus = (testId: string, status: string) => {
    alert(`Test ${testId} status updated to ${status}`)
  }

  return (
    <DashboardLayout userType="laboratory" userName="Dr. Smith" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quality Tests</h1>
            <p className="text-muted-foreground">Conduct comprehensive quality assessments and nutritional analysis</p>
          </div>
          <Button onClick={() => setIsCreatingTest(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Test
          </Button>
        </div>

        {/* Create New Test */}
        {isCreatingTest && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Quality Test</CardTitle>
              <CardDescription>Initialize a new quality assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sampleId">Sample ID</Label>
                  <Input
                    id="sampleId"
                    placeholder="e.g., S004"
                    value={newTest.sampleId}
                    onChange={(e) => setNewTest((prev) => ({ ...prev, sampleId: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Select
                    value={newTest.batchId}
                    onValueChange={(value) => setNewTest((prev) => ({ ...prev, batchId: value }))}
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
                  <Label htmlFor="testType">Test Type</Label>
                  <Select
                    value={newTest.testType}
                    onValueChange={(value) => setNewTest((prev) => ({ ...prev, testType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      {testTypes.map((test) => (
                        <SelectItem key={test.id} value={test.name}>
                          {test.name} ({test.duration})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTest.priority}
                    onValueChange={(value) => setNewTest((prev) => ({ ...prev, priority: value }))}
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
                  value={newTest.notes}
                  onChange={(e) => setNewTest((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateTest} disabled={!newTest.sampleId || !newTest.testType}>
                  Create Test
                </Button>
                <Button variant="outline" onClick={() => setIsCreatingTest(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Active Quality Tests</CardTitle>
            <CardDescription>Monitor ongoing quality assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeTests.map((test) => (
                <div key={test.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FlaskConical className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {test.id} - Sample {test.sampleId}
                        </h3>
                        <p className="text-muted-foreground">
                          {test.testType} • Batch {test.batchId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          test.status === "completed"
                            ? "bg-primary text-primary-foreground"
                            : test.status === "in-progress"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {test.status === "in-progress"
                          ? "In Progress"
                          : test.status === "completed"
                            ? "Completed"
                            : "Pending"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Time</p>
                      <p className="font-medium">{test.startTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Est. Completion</p>
                      <p className="font-medium">{test.estimatedCompletion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="font-medium">{test.progress}%</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Test Progress</span>
                      <span>{test.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${test.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Results */}
                  {Object.keys(test.results).length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Test Results
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(test.results).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground capitalize">{key}</p>
                            <p className="font-semibold text-lg">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {test.status === "pending" && (
                      <Button size="sm" onClick={() => updateTestStatus(test.id, "in-progress")}>
                        Start Test
                      </Button>
                    )}
                    {test.status === "in-progress" && (
                      <Button size="sm" onClick={() => updateTestStatus(test.id, "completed")}>
                        Complete Test
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => alert(`Viewing details for ${test.id}`)}>
                      View Details
                    </Button>
                    {test.status === "completed" && (
                      <Button size="sm" variant="outline" onClick={() => alert(`Generating report for ${test.id}`)}>
                        Generate Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Standards */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Standards</CardTitle>
            <CardDescription>Reference values for quality assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border border-border rounded-lg">
                <h4 className="font-medium">Protein Content</h4>
                <p className="text-sm text-muted-foreground">Wheat: 10-15%</p>
                <p className="text-sm text-muted-foreground">Rice: 6-8%</p>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <h4 className="font-medium">Moisture Content</h4>
                <p className="text-sm text-muted-foreground">Max: 14%</p>
                <p className="text-sm text-muted-foreground">Optimal: 12-13%</p>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <h4 className="font-medium">Fat Content</h4>
                <p className="text-sm text-muted-foreground">Wheat: 1.5-3%</p>
                <p className="text-sm text-muted-foreground">Rice: 0.5-1%</p>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <h4 className="font-medium">Fiber Content</h4>
                <p className="text-sm text-muted-foreground">Min: 2%</p>
                <p className="text-sm text-muted-foreground">Optimal: 3-5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
