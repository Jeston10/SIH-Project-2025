"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { Home, MapPin, Building2, Package, FlaskConical, Search, Calendar, Thermometer, Droplets } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: Home, current: false },
  { name: "Harvest Origins", href: "/user/harvest-origins", icon: MapPin, current: true },
  { name: "Processing Info", href: "/user/processing-info", icon: Building2, current: false },
  { name: "Order Tracking", href: "/user/order-tracking", icon: Package, current: false },
  { name: "Quality Reports", href: "/user/quality-reports", icon: FlaskConical, current: false },
]

const harvestData = [
  {
    id: "H001",
    batchId: "B001",
    product: "Organic Wheat",
    farmName: "Green Valley Farm",
    farmerName: "John Smith",
    location: { lat: 40.7128, lng: -74.006, address: "Green Valley, NY" },
    harvestDate: "2024-01-10",
    quantity: "500 kg",
    qualityGrade: "Premium (A+)",
    photos: ["/wheat-field-harvest.jpg", "/wheat-grain-close-up.jpg", "/farmer-harvesting-wheat.jpg"],
    environmentalConditions: {
      temperature: "22°C",
      humidity: "65%",
      rainfall: "15mm",
      soilMoisture: "45%",
      weatherCondition: "Sunny",
    },
  },
  {
    id: "H002",
    batchId: "B002",
    product: "Premium Rice",
    farmName: "Sunrise Fields",
    farmerName: "Maria Garcia",
    location: { lat: 34.0522, lng: -118.2437, address: "Sunrise Valley, CA" },
    harvestDate: "2024-01-08",
    quantity: "750 kg",
    qualityGrade: "High (A)",
    photos: ["/lush-rice-paddy.png", "/rice-grains.jpg", "/rice-harvest.jpg"],
    environmentalConditions: {
      temperature: "28°C",
      humidity: "78%",
      rainfall: "25mm",
      soilMoisture: "85%",
      weatherCondition: "Partly Cloudy",
    },
  },
  {
    id: "H003",
    batchId: "B003",
    product: "Stone Ground Corn",
    farmName: "Heritage Farm",
    farmerName: "Robert Johnson",
    location: { lat: 41.8781, lng: -87.6298, address: "Heritage Valley, IL" },
    harvestDate: "2024-01-05",
    quantity: "300 kg",
    qualityGrade: "Standard (B)",
    photos: ["/endless-cornfield.png", "/corn-cobs.jpg", "/corn-harvest-machinery.jpg"],
    environmentalConditions: {
      temperature: "18°C",
      humidity: "55%",
      rainfall: "8mm",
      soilMoisture: "35%",
      weatherCondition: "Clear",
    },
  },
]

export default function HarvestOriginsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHarvest, setSelectedHarvest] = useState<string | null>(null)

  const filteredHarvests = harvestData.filter(
    (harvest) =>
      harvest.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harvest.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harvest.batchId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedHarvestData = harvestData.find((h) => h.id === selectedHarvest)

  return (
    <DashboardLayout userType="user" userName="John Consumer" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Harvest Origins</h1>
          <p className="text-muted-foreground">Explore the farms and locations where your food was grown</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by product, farm, or batch ID..."
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
          {/* Harvest List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Available Harvests</CardTitle>
                <CardDescription>Select a harvest to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredHarvests.map((harvest) => (
                    <div
                      key={harvest.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedHarvest === harvest.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                      }`}
                      onClick={() => setSelectedHarvest(harvest.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{harvest.product}</h4>
                          <Badge variant="outline">{harvest.batchId}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{harvest.farmName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {harvest.location.address}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {harvest.harvestDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Harvest Details */}
          <div className="lg:col-span-2">
            {selectedHarvestData ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {selectedHarvestData.product} - {selectedHarvestData.batchId}
                    </CardTitle>
                    <CardDescription>Harvest details and farm information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Farm Name</p>
                          <p className="font-medium">{selectedHarvestData.farmName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Farmer</p>
                          <p className="font-medium">{selectedHarvestData.farmerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{selectedHarvestData.location.address}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedHarvestData.location.lat}, {selectedHarvestData.location.lng}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Harvest Date</p>
                          <p className="font-medium">{selectedHarvestData.harvestDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-medium">{selectedHarvestData.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quality Grade</p>
                          <Badge className="bg-primary/10 text-primary">{selectedHarvestData.qualityGrade}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Photos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Harvest Photos</CardTitle>
                    <CardDescription>Visual documentation from the farm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedHarvestData.photos.map((photo, index) => (
                        <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Harvest photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/farm-field.png"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Conditions</CardTitle>
                    <CardDescription>Weather and soil conditions during harvest</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Thermometer className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="font-semibold">{selectedHarvestData.environmentalConditions.temperature}</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Droplets className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p className="font-semibold">{selectedHarvestData.environmentalConditions.humidity}</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Droplets className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Rainfall</p>
                        <p className="font-semibold">{selectedHarvestData.environmentalConditions.rainfall}</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Droplets className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Soil Moisture</p>
                        <p className="font-semibold">{selectedHarvestData.environmentalConditions.soilMoisture}</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Weather</p>
                        <p className="font-semibold">{selectedHarvestData.environmentalConditions.weatherCondition}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Map Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Farm Location</CardTitle>
                    <CardDescription>Geographic location of the harvest</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                        <p className="font-medium">Interactive Map</p>
                        <p className="text-sm text-muted-foreground">{selectedHarvestData.location.address}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Coordinates: {selectedHarvestData.location.lat}, {selectedHarvestData.location.lng}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Harvest</h3>
                  <p className="text-muted-foreground">Choose a harvest from the list to view its origin details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
