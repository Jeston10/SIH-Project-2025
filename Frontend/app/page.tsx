"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Building2, FlaskConical, Shield, ShoppingCart, MapPin, Zap, QrCode, Globe, Info } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const userTypes = [
  { id: "farmer", label: "Farmer", icon: Leaf, description: "Upload harvest data and environmental conditions" },
  { id: "facility", label: "Facility Manager", icon: Building2, description: "Manage supply chain and processing" },
  { id: "laboratory", label: "Laboratory", icon: FlaskConical, description: "Conduct quality tests and analysis" },
  { id: "regulatory", label: "Regulatory Authority", icon: Shield, description: "Monitor compliance and regulations" },
  { id: "user", label: "End User", icon: ShoppingCart, description: "Track products and view quality reports" },
]

const features = [
  {
    icon: MapPin,
    title: "Geo-Tagged Traceability",
    description: "GPS-enabled tracking from harvest to consumer with immutable blockchain records",
  },
  {
    icon: Zap,
    title: "Smart Contracts",
    description: "Automated compliance validation and quality gate enforcement",
  },
  {
    icon: QrCode,
    title: "Consumer Transparency",
    description: "QR code scanning for complete product provenance and authenticity",
  },
  {
    icon: Globe,
    title: "Sustainable Sourcing",
    description: "Conservation compliance and fair-trade verification for ethical practices",
  },
]

export default function LoginPage() {
  const [selectedUserType, setSelectedUserType] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showAbout, setShowAbout] = useState(false)

  const handleLogin = () => {
    if (selectedUserType && email && password) {
      // Redirect to respective dashboard
      window.location.href = `/${selectedUserType}/dashboard`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <motion.button
        onClick={() => setShowAbout(true)}
        className="absolute top-6 right-6 z-10 bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-full p-3 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        <Info className="w-5 h-5 text-primary" />
      </motion.button>

      <motion.div
        className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left side - Branding */}
        <motion.div
          className="space-y-8 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="space-y-6">
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{
                  rotateY: 180,
                  boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
                }}
                transition={{ duration: 0.15 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Leaf className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1
                className="text-5xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                AyurChakra
              </motion.h1>
            </motion.div>
            <motion.p
              className="text-xl text-muted-foreground max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Blockchain-powered traceability for authentic Ayurvedic herbs from harvest to consumer
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, staggerChildren: 0.1 }}
          >
            {userTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{
                    y: -8,
                    rotateX: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                  transition={{ duration: 0.1 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ duration: 0.1 }}>
                        <Icon className="w-10 h-10 text-primary mx-auto mb-3" />
                      </motion.div>
                      <h3 className="font-semibold text-base mb-2">{type.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{
            y: -5,
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          }}
          transition={{ duration: 0.1 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base">Sign in to your AyurChakra account</CardDescription>
              </CardHeader>
            </motion.div>
            <CardContent className="space-y-6 px-8 pb-8">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Label htmlFor="userType" className="text-sm font-medium">
                  User Type
                </Label>
                <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                  <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
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
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
                  <Button
                    onClick={handleLogin}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 transition-all duration-300"
                    disabled={!selectedUserType || !email || !password}
                  >
                    Sign In
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showAbout && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                      About AyurChakra
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAbout(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      AyurChakra addresses the critical challenges in India's Ayurvedic herbal supply chain through
                      innovative blockchain technology. Our platform creates an immutable, decentralized ledger that
                      records every step of an herb's journey from GPS-tagged collection events through processing,
                      testing, and formulation.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <motion.div
                          key={index}
                          className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-emerald-50 border border-primary/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ duration: 0.1 }}
                        >
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <div className="bg-gradient-to-r from-primary/5 to-emerald-50 rounded-xl p-6 border border-primary/10">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To revolutionize the Ayurvedic herbal supply chain by providing end-to-end transparency, ensuring
                      authenticity, and supporting sustainable sourcing practices. Through blockchain technology and
                      smart contracts, we enable consumers to verify the provenance of their herbal products while
                      supporting ethical farming and conservation efforts.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
