"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/dashboard-layout"
import { Home, Upload, Camera, Cloud, Thermometer, Droplets, Wind, Sun } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/farmer/dashboard", icon: Home, current: false },
  { name: "Harvest Data", href: "/farmer/harvest-data", icon: Upload, current: false },
  { name: "Photos & Environment", href: "/farmer/photos-environment", icon: Camera, current: true },
]

export default function PhotosEnvironmentPage() {
  const [formData, setFormData] = useState({
    fieldName: "",
    photoDate: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    windSpeed: "",
    soilMoisture: "",
    weatherCondition: "",
    notes: "",
  })

  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedPhotos((prev) => [...prev, ...files])
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    alert("Photos and environmental data uploaded successfully!")
  }

  return (
    <DashboardLayout userType="farmer" userName="John Farmer" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Photos & Environmental Data</h1>
          <p className="text-muted-foreground">Upload field photos and record environmental conditions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Photo Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Field Photos
              </CardTitle>
              <CardDescription>Upload photos of your field conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="photoDate">Photo Date</Label>
                <Input
                  id="photoDate"
                  type="date"
                  value={formData.photoDate}
                  onChange={(e) => handleInputChange("photoDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photos">Upload Photos</Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Select multiple photos (JPG, PNG). Max 10MB per file.</p>
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Photos ({uploadedPhotos.length})</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-center mt-1 truncate">{photo.name}</p>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environmental Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                Environmental Conditions
              </CardTitle>
              <CardDescription>Record weather and soil conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Temperature (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="25"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange("temperature", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="humidity" className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    Humidity (%)
                  </Label>
                  <Input
                    id="humidity"
                    type="number"
                    placeholder="65"
                    value={formData.humidity}
                    onChange={(e) => handleInputChange("humidity", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rainfall" className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    Rainfall (mm)
                  </Label>
                  <Input
                    id="rainfall"
                    type="number"
                    placeholder="0"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange("rainfall", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="windSpeed" className="flex items-center gap-2">
                    <Wind className="w-4 h-4" />
                    Wind Speed (km/h)
                  </Label>
                  <Input
                    id="windSpeed"
                    type="number"
                    placeholder="10"
                    value={formData.windSpeed}
                    onChange={(e) => handleInputChange("windSpeed", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
                <Input
                  id="soilMoisture"
                  type="number"
                  placeholder="45"
                  value={formData.soilMoisture}
                  onChange={(e) => handleInputChange("soilMoisture", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weatherCondition" className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Weather Condition
                </Label>
                <Select
                  value={formData.weatherCondition}
                  onValueChange={(value) => handleInputChange("weatherCondition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunny">Sunny</SelectItem>
                    <SelectItem value="partly-cloudy">Partly Cloudy</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="stormy">Stormy</SelectItem>
                    <SelectItem value="foggy">Foggy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional observations about field conditions..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Summary</CardTitle>
            <CardDescription>Current conditions overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Thermometer className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-lg font-semibold">{formData.temperature || "--"}°C</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Droplets className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg font-semibold">{formData.humidity || "--"}%</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Wind className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="text-lg font-semibold">{formData.windSpeed || "--"} km/h</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Sun className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="text-lg font-semibold capitalize">{formData.weatherCondition || "--"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.fieldName || uploadedPhotos.length === 0}
            className="min-w-32"
          >
            {isSubmitting ? "Uploading..." : "Upload Photos & Data"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
