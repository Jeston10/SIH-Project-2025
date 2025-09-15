"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, LogOut, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: string
  userName?: string
  navigation: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    current?: boolean
  }>
}

export default function DashboardLayout({ children, userType, userName = "User", navigation }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <motion.nav
        className="bg-card border-b border-border"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <motion.button
                type="button"
                className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
              <motion.div
                className="flex items-center gap-3 ml-4 lg:ml-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
                  whileHover={{
                    rotateY: 180,
                    boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)",
                  }}
                  transition={{ duration: 0.15 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Leaf className="w-4 h-4 text-primary-foreground" />
                </motion.div>
                <h1 className="text-xl font-bold text-foreground">AyurChakra</h1>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.1 }}
              >
                <User className="w-4 h-4" />
                <span>{userName}</span>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full capitalize font-medium">
                  {userType}
                </span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          className={`${sidebarOpen ? "block" : "hidden"} lg:block w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)]`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <nav className="p-4 space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                  whileHover={{
                    x: 4,
                    scale: 1.02,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.current
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ duration: 0.1 }}>
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    {item.name}
                  </Link>
                </motion.div>
              )
            })}
          </nav>
        </motion.div>

        {/* Main Content */}
        <motion.main
          className="flex-1 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
