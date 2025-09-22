"use client"

 import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/providers"
import { getErrorMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
 import { Leaf, Building2, FlaskConical, Shield, ShoppingCart, Sparkles, CheckCircle2, Info, Globe, MessageCircle, Share2, AtSign } from "lucide-react"
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
   const videoRef = useRef<HTMLVideoElement | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
   const [showAbout, setShowAbout] = useState(false)

  // Ensure we're on the client side before starting the carousel
  useEffect(() => {
    setIsClient(true)
  }, [])

   // Auto-rotate carousel every 4 seconds, but only on client (kept in case we revert to carousel)
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
      <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-blue-50 to-purple-100 relative overflow-hidden">
       {/* Top navbar */}
       <div className="fixed top-0 left-0 right-0 z-20">
         <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-end">
           <button
             onClick={() => setShowAbout(true)}
             className="inline-flex items-center gap-2 rounded-full bg-white/80 hover:bg-white text-slate-700 px-4 py-2 shadow-sm border border-slate-200 backdrop-blur-md transition-colors"
           >
             <Info className="w-4 h-4" />
             About
           </button>
         </div>
       </div>

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

           {/* Background video (auto-play, muted by default, no controls) */}
           <motion.div 
             className="mb-8"
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
           >
             <div className="relative rounded-2xl overflow-hidden shadow-2xl">
               <video
                 ref={videoRef}
                 className="w-full h-[320px] md:h-[360px] lg:h-[420px] object-cover"
                 src="/3195351-uhd_3840_2160_25fps.mp4"
                 autoPlay
                 muted
                 loop
                 playsInline
                 controls={false}
               />
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

       {/* Footer */}
       <footer className="relative z-10 border-t border-slate-200 bg-white/60 backdrop-blur-md">
           <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
           <p className="text-xs text-slate-600">
             © {new Date().getFullYear()} AyurChakra. All rights reserved. No copyright trademark.
           </p>
           <div className="flex items-center gap-3 text-slate-700">
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

      {/* About overlay */}
      {showAbout && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAbout(false)}>
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">About AyurChakra</h3>
              </div>
              <button onClick={() => setShowAbout(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <div className="p-6 space-y-4 text-slate-700">
              <p>
                AyurChakra is an enterprise-grade platform delivering end-to-end transparency for the agricultural
                supply chain. We combine GPS-powered traceability, laboratory quality verification, and blockchain-backed
                provenance so every stakeholder—from farmers to consumers—can trust what they grow, move, test, and buy.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Traceability
                  </div>
                  <p className="text-sm text-emerald-800/80">Geo-tagged events across harvest, processing, logistics, and sale.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Quality Assurance
                  </div>
                  <p className="text-sm text-blue-800/80">Laboratory results and compliance embedded into every product journey.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Blockchain Provenance
                  </div>
                  <p className="text-sm text-purple-800/80">Immutable records ensure authenticity and tamper-evidence.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Sustainability
                  </div>
                  <p className="text-sm text-amber-800/80">Metrics and audit trails that promote ethical sourcing and compliance.</p>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setShowAbout(false)} className="w-full h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors">Got it</button>
            </div>
          </div>
        </div>
      )}
      </>
    )
}