"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/dashboard-layout"
import { Home, Upload, Camera, MapPin, Wheat } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/farmer/dashboard", icon: Home, current: false },
  { name: "Harvest Data", href: "/farmer/harvest-data", icon: Upload, current: true },
  { name: "Photos & Environment", href: "/farmer/photos-environment", icon: Camera, current: false },
]

export default function HarvestDataPage() {
  const [formData, setFormData] = useState({
    fieldName: "",
    cropType: "",
    harvestDate: "",
    quantity: "",
    unit: "",
    quality: "",
    latitude: "",
    longitude: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Reset form or show success message
    alert("Harvest data uploaded successfully!")
  }

  return (
    <DashboardLayout userType="farmer" userName="John Farmer" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Harvest Data</h1>
          <p className="text-muted-foreground">Record geo-tagged harvest information for your fields</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-primary" />
                  Harvest Information
                </CardTitle>
                <CardDescription>Enter details about your harvest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input
                      id="fieldName"
                      placeholder="e.g., North Field A"
                      value={formData.fieldName}
                      onChange={(e) => handleInputChange("fieldName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select value={formData.cropType} onValueChange={(value) => handleInputChange("cropType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="barley">Barley</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="harvestDate">Harvest Date</Label>
                    <Input
                      id="harvestDate"
                      type="date"
                      value={formData.harvestDate}
                      onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex gap-2">
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="0"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                      />
                      <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="tons">tons</SelectItem>
                          <SelectItem value="bushels">bushels</SelectItem>
                          <SelectItem value="pounds">pounds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="quality">Quality Grade</Label>
                    <Select value={formData.quality} onValueChange={(value) => handleInputChange("quality", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium (A+)</SelectItem>
                        <SelectItem value="high">High (A)</SelectItem>
                        <SelectItem value="standard">Standard (B)</SelectItem>
                        <SelectItem value="low">Low (C)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about this harvest..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  GPS Location
                </CardTitle>
                <CardDescription>Geo-tag your harvest location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={getCurrentLocation} variant="outline" className="w-full bg-transparent">
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Current Location
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="0.000000"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="0.000000"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                  />
                </div>

                {formData.latitude && formData.longitude && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Location captured:</p>
                    <p className="text-sm font-mono">
                      {formData.latitude}, {formData.longitude}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Field:</span>
                  <span>{formData.fieldName || "Not specified"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Crop:</span>
                  <span className="capitalize">{formData.cropType || "Not specified"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span>
                    {formData.quantity && formData.unit ? `${formData.quantity} ${formData.unit}` : "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{formData.latitude && formData.longitude ? "✓ Set" : "Not set"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.fieldName || !formData.cropType || !formData.quantity}
            className="min-w-32"
          >
            {isSubmitting ? "Uploading..." : "Upload Data"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
