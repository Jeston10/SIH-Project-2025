"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Building2, FlaskConical, Shield, ShoppingCart, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { registerRequest, getErrorMessage } from "@/lib/api"
import { useAuth } from "@/components/providers"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const userTypes = [
  { 
    id: "farmer", 
    label: "Farmer", 
    icon: Leaf, 
    description: "Upload harvest data and environmental conditions",
    features: ["Geo-tagged harvesting", "Quality documentation", "Blockchain verification"],
    gradient: "from-emerald-500 to-green-600"
  },
  { 
    id: "facility", 
    label: "Facility Manager", 
    icon: Building2, 
    description: "Manage supply chain and processing operations",
    features: ["Processing oversight", "Quality control", "Inventory management"],
    gradient: "from-blue-500 to-cyan-600"
  },
  { 
    id: "laboratory", 
    label: "Laboratory", 
    icon: FlaskConical, 
    description: "Conduct quality tests and detailed analysis",
    features: ["Advanced testing", "Quality certificates", "Compliance reports"],
    gradient: "from-purple-500 to-indigo-600"
  },
  { 
    id: "regulatory", 
    label: "Regulatory Authority", 
    icon: Shield, 
    description: "Monitor compliance and regulatory standards",
    features: ["Compliance monitoring", "Audit trails", "Regulatory oversight"],
    gradient: "from-orange-500 to-red-600"
  },
  { 
    id: "user", 
    label: "End User", 
    icon: ShoppingCart, 
    description: "Track products and view quality reports",
    features: ["Product traceability", "Quality insights", "Transparency access"],
    gradient: "from-teal-500 to-emerald-600"
  },
]

export default function SignupPage() {
  const [selectedUserType, setSelectedUserType] = useState("")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { login } = useAuth()
  const router = useRouter()

  // Ensure we're on the client side before starting the carousel
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Auto-rotate carousel every 4 seconds, but only on client
  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % userTypes.length)
    }, 4000) // Change card every 4 seconds

    return () => clearInterval(interval)
  }, [isClient])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user types
  }

  const handleSignup = async () => {
    if (
      !selectedUserType ||
      !formData.name ||
      !formData.email ||
      !formData.password ||
      formData.password !== formData.confirmPassword
    ) {
      setError("Please fill in all fields correctly")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Parse name into first and last name
      const nameParts = formData.name.trim().split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || "User" // Provide default last name if not provided

      if (!firstName) {
        setError("Please provide at least a first name")
        return
      }

      // Register the user
      const registerPayload = {
        email: formData.email,
        password: formData.password,
        userType: selectedUserType as 'farmer' | 'facility' | 'laboratory' | 'regulatory' | 'user',
        profile: {
          firstName,
          lastName,
        }
      }

      console.log('Registration payload:', registerPayload) // Debug log

      const registerResult = await registerRequest(registerPayload)
      
      // Auto-login after successful registration
      const loginSuccess = await login(formData.email, formData.password)
      
      if (loginSuccess) {
        // Small delay to ensure auth state is updated
        await new Promise(resolve => setTimeout(resolve, 100))
        // Redirect to respective dashboard after successful signup and login
        router.push(`/${selectedUserType}/dashboard`)
      } else {
        setError("Registration successful, but login failed. Please try logging in manually.")
      }
    } catch (err: any) {
      console.error('Registration error:', err) // Debug log
      
      // Check if it's a validation error with specific field errors
      if (err?.response?.data?.errors) {
        const fieldErrors = err.response.data.errors.map((e: any) => e.msg || e.message).join(', ')
        setError(`Validation failed: ${fieldErrors}`)
      } else {
        setError(getErrorMessage(err))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    {/* Top navbar with About button */}
    <div className="fixed top-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-end gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white/80 hover:bg-white text-slate-700 px-4 py-2 shadow-sm border border-slate-200 backdrop-blur-md transition-colors">
          <span>Sign in</span>
        </Link>
        <button
          onClick={() => alert('AyurChakra: End-to-end agricultural transparency with GPS traceability, lab quality verification, and blockchain-backed provenance.')}
          className="inline-flex items-center gap-2 rounded-full bg-white/80 hover:bg-white text-slate-700 px-4 py-2 shadow-sm border border-slate-200 backdrop-blur-md transition-colors"
        >
          <span>About</span>
        </button>
      </div>
    </div>

    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-blue-50 to-purple-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl animate-bounce" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding & User Type Carousel */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  AyurChakra
                </h1>
                <p className="text-emerald-600 font-medium">Enterprise Agriculture Platform</p>
              </div>
            </div>
            <p className="text-xl text-slate-600 max-w-md leading-relaxed">
              Join the next generation of agricultural supply chain management with blockchain-powered transparency
            </p>
          </motion.div>

          {/* User Type Carousel */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Choose Your Role</h2>
            
            <div className="relative">
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCardIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full"
                  >
                    <Card 
                      className={`p-6 border-0 shadow-xl bg-gradient-to-br ${userTypes[currentCardIndex].gradient} text-white transform transition-all duration-300 hover:scale-105`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                          {(() => {
                            const IconComponent = userTypes[currentCardIndex].icon
                            return <IconComponent className="w-8 h-8 text-white" />
                          })()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold">{userTypes[currentCardIndex].label}</h3>
                          </div>
                          <p className="text-white/90 mb-4">{userTypes[currentCardIndex].description}</p>
                          <div className="space-y-2">
                            {userTypes[currentCardIndex].features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                                <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Auto-playing Indicator Dots */}
              <div className="flex justify-center items-center mt-8">
                <div className="flex gap-3">
                  {userTypes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCardIndex(index)}
                      className={`relative transition-all duration-500 ${
                        index === currentCardIndex ? 'w-8 h-3' : 'w-3 h-3'
                      }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-full transition-all duration-500 ${
                          index === currentCardIndex 
                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg' 
                            : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                      {index === currentCardIndex && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right side - Signup Form */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border-l border-slate-200 flex flex-col justify-center px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Start your journey with AyurChakra
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="userType" className="text-slate-700 font-medium">User Type</Label>
                    <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-slate-700 font-medium">Organization</Label>
                    <Input
                      id="organization"
                      placeholder="Enter your organization"
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={handleSignup}
                  disabled={
                    isLoading ||
                    !selectedUserType ||
                    !formData.name ||
                    !formData.email ||
                    !formData.password ||
                    formData.password !== formData.confirmPassword
                  }
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-slate-600">
                    Already have an account?{" "}
                    <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer with social icons from public */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/60 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-slate-600">© 2025 AyurChakra. All rights reserved. No copyright trademark.</p>
          <div className="flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src="/instagram.png" alt="Instagram" className="w-5 h-5 hover:opacity-80" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <img src="/facebook.png" alt="Facebook" className="w-5 h-5 hover:opacity-80" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <img src="/twitter.png" alt="Twitter" className="w-5 h-5 hover:opacity-80" />
            </a>
            <a href="https://reddit.com" target="_blank" rel="noreferrer" aria-label="Reddit">
              <img src="/reddit.png" alt="Reddit" className="w-5 h-5 hover:opacity-80" />
            </a>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
