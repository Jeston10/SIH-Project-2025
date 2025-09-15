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
import { Home, Package, Truck, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/facility/dashboard", icon: Home, current: false },
  { name: "Processing & Batches", href: "/facility/processing", icon: Package, current: true },
  { name: "Transportation", href: "/facility/transportation", icon: Truck, current: false },
]

const processingSteps = [
  { id: "drying", name: "Drying", duration: "24 hours", temperature: "60°C" },
  { id: "grinding", name: "Grinding", duration: "2 hours", mesh: "Fine" },
  { id: "packaging", name: "Packaging", duration: "4 hours", type: "Sealed bags" },
]

export default function ProcessingPage() {
  const [selectedBatch, setSelectedBatch] = useState("")
  const [newBatch, setNewBatch] = useState({
    id: "",
    product: "",
    quantity: "",
    source: "",
    startDate: "",
    notes: "",
  })
  const [batchSteps, setBatchSteps] = useState<
    Array<{
      step: string
      status: "pending" | "in-progress" | "completed"
      startTime?: string
      endTime?: string
      notes?: string
    }>
  >([])

  const [isCreatingBatch, setIsCreatingBatch] = useState(false)

  const existingBatches = [
    { id: "B001", product: "Wheat Flour", status: "In Progress", stage: "Grinding" },
    { id: "B002", product: "Rice", status: "In Progress", stage: "Drying" },
    { id: "B003", product: "Corn Meal", status: "Completed", stage: "Packaging" },
  ]

  const handleCreateBatch = () => {
    if (newBatch.id && newBatch.product && newBatch.quantity) {
      // Initialize batch with processing steps
      setBatchSteps(
        processingSteps.map((step) => ({
          step: step.id,
          status: "pending" as const,
        })),
      )
      setIsCreatingBatch(false)
      alert(`Batch ${newBatch.id} created successfully!`)
    }
  }

  const updateStepStatus = (stepIndex: number, status: "pending" | "in-progress" | "completed") => {
    setBatchSteps((prev) =>
      prev.map((step, index) =>
        index === stepIndex
          ? {
              ...step,
              status,
              startTime: status === "in-progress" ? new Date().toLocaleTimeString() : step.startTime,
              endTime: status === "completed" ? new Date().toLocaleTimeString() : undefined,
            }
          : step,
      ),
    )
  }

  return (
    <DashboardLayout userType="facility" userName="Sarah Manager" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Processing & Batch Management</h1>
            <p className="text-muted-foreground">
              Track drying, grinding, and packaging operations with batch tracking
            </p>
          </div>
          <Button onClick={() => setIsCreatingBatch(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Batch
          </Button>
        </div>

        {/* Create New Batch Modal */}
        {isCreatingBatch && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Batch</CardTitle>
              <CardDescription>Initialize a new processing batch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Input
                    id="batchId"
                    placeholder="e.g., B004"
                    value={newBatch.id}
                    onChange={(e) => setNewBatch((prev) => ({ ...prev, id: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product">Product Type</Label>
                  <Select
                    value={newBatch.product}
                    onValueChange={(value) => setNewBatch((prev) => ({ ...prev, product: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat-flour">Wheat Flour</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="corn-meal">Corn Meal</SelectItem>
                      <SelectItem value="barley">Barley</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1000"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch((prev) => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source Farm</Label>
                  <Input
                    id="source"
                    placeholder="Farm name or ID"
                    value={newBatch.source}
                    onChange={(e) => setNewBatch((prev) => ({ ...prev, source: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newBatch.startDate}
                    onChange={(e) => setNewBatch((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional batch information..."
                  value={newBatch.notes}
                  onChange={(e) => setNewBatch((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateBatch} disabled={!newBatch.id || !newBatch.product || !newBatch.quantity}>
                  Create Batch
                </Button>
                <Button variant="outline" onClick={() => setIsCreatingBatch(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batch Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Batch</CardTitle>
              <CardDescription>Choose a batch to manage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingBatches.map((batch) => (
                <div
                  key={batch.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedBatch === batch.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  }`}
                  onClick={() => setSelectedBatch(batch.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{batch.id}</p>
                      <p className="text-sm text-muted-foreground">{batch.product}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={batch.status === "Completed" ? "default" : "secondary"}>{batch.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{batch.stage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Processing Steps */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Processing Steps</CardTitle>
                <CardDescription>
                  {selectedBatch ? `Managing batch ${selectedBatch}` : "Select a batch to view processing steps"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedBatch ? (
                  <div className="space-y-6">
                    {processingSteps.map((step, index) => {
                      const batchStep = batchSteps[index] || { status: "pending" }
                      return (
                        <div key={step.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  batchStep.status === "completed"
                                    ? "bg-primary text-primary-foreground"
                                    : batchStep.status === "in-progress"
                                      ? "bg-secondary text-secondary-foreground"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {batchStep.status === "completed" ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : batchStep.status === "in-progress" ? (
                                  <Clock className="w-4 h-4" />
                                ) : (
                                  <AlertCircle className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold">{step.name}</h3>
                                <p className="text-sm text-muted-foreground">Duration: {step.duration}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStepStatus(index, "in-progress")}
                                disabled={batchStep.status === "completed"}
                              >
                                Start
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateStepStatus(index, "completed")}
                                disabled={batchStep.status !== "in-progress"}
                              >
                                Complete
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Start Time:</p>
                              <p>{batchStep.startTime || "Not started"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">End Time:</p>
                              <p>{batchStep.endTime || "In progress"}</p>
                            </div>
                          </div>

                          {step.id === "drying" && (
                            <div className="mt-3 p-3 bg-muted rounded">
                              <p className="text-sm">
                                <strong>Temperature:</strong> {step.temperature}
                              </p>
                            </div>
                          )}

                          {step.id === "grinding" && (
                            <div className="mt-3 p-3 bg-muted rounded">
                              <p className="text-sm">
                                <strong>Mesh Size:</strong> {step.mesh}
                              </p>
                            </div>
                          )}

                          {step.id === "packaging" && (
                            <div className="mt-3 p-3 bg-muted rounded">
                              <p className="text-sm">
                                <strong>Package Type:</strong> {step.type}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a batch to view and manage processing steps</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
