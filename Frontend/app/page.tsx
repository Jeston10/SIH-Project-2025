"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers"
import { getErrorMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Building2, FlaskConical, Shield, ShoppingCart, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"
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

export default function LoginPage() {
  const [selectedUserType, setSelectedUserType] = useState("")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleLogin = async () => {
    if (!selectedUserType || !email || !password) return
    setError(null)
    setLoading(true)
    try {
      const ok = await login(email, password)
      if (ok) {
        window.location.href = `/${selectedUserType}/dashboard`
      } else {
        setError('Invalid credentials')
      }
    } catch (e: any) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
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
              Welcome back to the next generation of agricultural supply chain management
            </p>
          </motion.div>

          {/* User Type Carousel */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Select Your Role</h2>
            
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

        {/* Right side - Login Form */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border-l border-slate-200 flex flex-col justify-center px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Sign in to your AyurChakra account
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
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
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
                  onClick={handleLogin}
                  disabled={loading || !selectedUserType || !email || !password}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-slate-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}