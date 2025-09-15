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
import { Home, Package, Truck, Plus, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/facility/dashboard", icon: Home, current: false },
  { name: "Processing & Batches", href: "/facility/processing", icon: Package, current: false },
  { name: "Transportation", href: "/facility/transportation", icon: Truck, current: true },
]

const shipmentStatuses = [
  { id: "preparing", name: "Preparing", color: "bg-muted text-muted-foreground" },
  { id: "loading", name: "Loading", color: "bg-secondary/10 text-secondary" },
  { id: "in-transit", name: "In Transit", color: "bg-primary/10 text-primary" },
  { id: "delivered", name: "Delivered", color: "bg-primary text-primary-foreground" },
]

export default function TransportationPage() {
  const [newShipment, setNewShipment] = useState({
    id: "",
    batchId: "",
    destination: "",
    vehicle: "",
    driver: "",
    scheduledDate: "",
    estimatedDelivery: "",
    notes: "",
  })

  const [isCreatingShipment, setIsCreatingShipment] = useState(false)

  const existingShipments = [
    {
      id: "S001",
      batchId: "B001",
      destination: "Mumbai Distribution Center",
      vehicle: "TRK-001",
      driver: "Raj Kumar",
      status: "in-transit",
      progress: 65,
      eta: "2 hours",
    },
    {
      id: "S002",
      batchId: "B002",
      destination: "Delhi Warehouse",
      vehicle: "TRK-002",
      driver: "Amit Singh",
      status: "delivered",
      progress: 100,
      eta: "Completed",
    },
    {
      id: "S003",
      batchId: "B003",
      destination: "Bangalore Hub",
      vehicle: "TRK-003",
      driver: "Suresh Patel",
      status: "loading",
      progress: 25,
      eta: "4 hours",
    },
  ]

  const handleCreateShipment = () => {
    if (newShipment.id && newShipment.batchId && newShipment.destination) {
      setIsCreatingShipment(false)
      alert(`Shipment ${newShipment.id} created successfully!`)
    }
  }

  const updateShipmentStatus = (shipmentId: string, newStatus: string) => {
    alert(`Shipment ${shipmentId} status updated to ${newStatus}`)
  }

  return (
    <DashboardLayout userType="facility" userName="Sarah Manager" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transportation & Distribution</h1>
            <p className="text-muted-foreground">Coordinate shipments and delivery logistics</p>
          </div>
          <Button onClick={() => setIsCreatingShipment(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Shipment
          </Button>
        </div>

        {/* Create New Shipment */}
        {isCreatingShipment && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Shipment</CardTitle>
              <CardDescription>Schedule a new delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipmentId">Shipment ID</Label>
                  <Input
                    id="shipmentId"
                    placeholder="e.g., S004"
                    value={newShipment.id}
                    onChange={(e) => setNewShipment((prev) => ({ ...prev, id: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Select
                    value={newShipment.batchId}
                    onValueChange={(value) => setNewShipment((prev) => ({ ...prev, batchId: value }))}
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
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="Delivery address"
                    value={newShipment.destination}
                    onChange={(e) => setNewShipment((prev) => ({ ...prev, destination: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select
                    value={newShipment.vehicle}
                    onValueChange={(value) => setNewShipment((prev) => ({ ...prev, vehicle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRK-001">TRK-001 (Available)</SelectItem>
                      <SelectItem value="TRK-002">TRK-002 (Available)</SelectItem>
                      <SelectItem value="TRK-003">TRK-003 (In Use)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver">Driver</Label>
                  <Select
                    value={newShipment.driver}
                    onValueChange={(value) => setNewShipment((prev) => ({ ...prev, driver: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raj-kumar">Raj Kumar</SelectItem>
                      <SelectItem value="amit-singh">Amit Singh</SelectItem>
                      <SelectItem value="suresh-patel">Suresh Patel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={newShipment.scheduledDate}
                    onChange={(e) => setNewShipment((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                  <Input
                    id="estimatedDelivery"
                    type="datetime-local"
                    value={newShipment.estimatedDelivery}
                    onChange={(e) => setNewShipment((prev) => ({ ...prev, estimatedDelivery: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea
                  id="notes"
                  placeholder="Delivery instructions, handling requirements..."
                  value={newShipment.notes}
                  onChange={(e) => setNewShipment((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateShipment}
                  disabled={!newShipment.id || !newShipment.batchId || !newShipment.destination}
                >
                  Create Shipment
                </Button>
                <Button variant="outline" onClick={() => setIsCreatingShipment(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Shipments */}
        <Card>
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>
            <CardDescription>Track and manage ongoing deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {existingShipments.map((shipment) => (
                <div key={shipment.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {shipment.id} - Batch {shipment.batchId}
                        </h3>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {shipment.destination}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          shipmentStatuses.find((s) => s.id === shipment.status)?.color ||
                          "bg-muted text-muted-foreground"
                        }
                      >
                        {shipmentStatuses.find((s) => s.id === shipment.status)?.name || shipment.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ETA: {shipment.eta}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle</p>
                      <p className="font-medium">{shipment.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Driver</p>
                      <p className="font-medium">{shipment.driver}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="font-medium">{shipment.progress}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Delivery Progress</span>
                      <span>{shipment.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateShipmentStatus(shipment.id, "loading")}
                      disabled={shipment.status === "delivered"}
                    >
                      Update Status
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => alert(`Tracking shipment ${shipment.id}`)}>
                      Track
                    </Button>
                    {shipment.status === "in-transit" && (
                      <Button size="sm" onClick={() => updateShipmentStatus(shipment.id, "delivered")}>
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fleet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Fleet Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="font-medium text-primary">2 vehicles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">In Transit</span>
                  <span className="font-medium text-secondary">1 vehicle</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Maintenance</span>
                  <span className="font-medium text-muted-foreground">0 vehicles</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Today's Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-medium text-primary">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <span className="font-medium text-secondary">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Scheduled</span>
                  <span className="font-medium text-muted-foreground">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-2 bg-secondary/10 rounded text-sm">
                  <p className="font-medium">Route Delay</p>
                  <p className="text-muted-foreground">S001 delayed by 30 mins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
