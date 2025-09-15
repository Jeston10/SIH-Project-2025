"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { Home, Shield, AlertTriangle, CheckCircle, XCircle, Clock, FileText, Users, Building2 } from "lucide-react"

const navigation = [{ name: "Dashboard", href: "/regulatory/dashboard", icon: Home, current: true }]

const complianceStats = [
  { name: "Overall Compliance", value: "94%", change: "+2%", changeType: "positive" },
  { name: "Active Violations", value: "3", change: "-2", changeType: "positive" },
  { name: "Pending Reviews", value: "12", change: "+4", changeType: "neutral" },
  { name: "Certified Facilities", value: "28", change: "+1", changeType: "positive" },
]

const recentAlerts = [
  {
    id: "A001",
    type: "Quality Violation",
    entity: "Facility F003",
    description: "Moisture content exceeds limit in Batch B045",
    severity: "high",
    status: "investigating",
    timestamp: "2 hours ago",
  },
  {
    id: "A002",
    type: "Documentation Missing",
    entity: "Farmer F012",
    description: "Missing harvest documentation for Field N-12",
    severity: "medium",
    status: "pending",
    timestamp: "4 hours ago",
  },
  {
    id: "A003",
    type: "Pesticide Limit Exceeded",
    entity: "Lab L001",
    description: "Sample S089 shows pesticide residue above MRL",
    severity: "high",
    status: "resolved",
    timestamp: "1 day ago",
  },
]

const complianceByEntity = [
  { entity: "Farmers", total: 45, compliant: 42, percentage: 93, violations: 3 },
  { entity: "Facilities", total: 12, compliant: 11, percentage: 92, violations: 1 },
  { entity: "Laboratories", total: 5, compliant: 5, percentage: 100, violations: 0 },
  { entity: "Transporters", total: 8, compliant: 7, percentage: 88, violations: 1 },
]

const recentInspections = [
  {
    id: "I001",
    entity: "Green Valley Farm",
    type: "Routine Inspection",
    date: "2024-01-15",
    inspector: "Inspector Smith",
    status: "passed",
    score: 95,
  },
  {
    id: "I002",
    entity: "Central Processing Facility",
    type: "Compliance Audit",
    date: "2024-01-14",
    inspector: "Inspector Johnson",
    status: "conditional",
    score: 78,
  },
  {
    id: "I003",
    entity: "Quality Labs Inc",
    type: "Certification Review",
    date: "2024-01-13",
    inspector: "Inspector Davis",
    status: "passed",
    score: 98,
  },
]

const regulatoryFramework = [
  { standard: "ISO 22000", description: "Food Safety Management", compliance: 89 },
  { standard: "HACCP", description: "Hazard Analysis Critical Control Points", compliance: 94 },
  { standard: "Organic Standards", description: "Organic Certification Requirements", compliance: 87 },
  { standard: "Pesticide Regulations", description: "Maximum Residue Limits", compliance: 96 },
]

export default function RegulatoryDashboard() {
  return (
    <DashboardLayout userType="regulatory" userName="Inspector General" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Regulatory Compliance Dashboard</h1>
          <p className="text-muted-foreground">Monitor compliance across the entire agricultural supply chain</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceStats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-primary"
                          : stat.changeType === "negative"
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Recent Compliance Alerts
            </CardTitle>
            <CardDescription>Latest violations and compliance issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        alert.severity === "high"
                          ? "bg-destructive"
                          : alert.severity === "medium"
                            ? "bg-secondary"
                            : "bg-muted-foreground"
                      }`}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{alert.type}</p>
                        <Badge variant="outline" className="text-xs">
                          {alert.entity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        alert.status === "resolved"
                          ? "bg-primary/10 text-primary"
                          : alert.status === "investigating"
                            ? "bg-secondary/10 text-secondary"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {alert.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance by Entity */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance by Entity Type</CardTitle>
              <CardDescription>Compliance rates across different stakeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceByEntity.map((item) => (
                  <div key={item.entity} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.entity === "Farmers" && <Users className="w-4 h-4 text-primary" />}
                        {item.entity === "Facilities" && <Building2 className="w-4 h-4 text-primary" />}
                        {item.entity === "Laboratories" && <Shield className="w-4 h-4 text-primary" />}
                        {item.entity === "Transporters" && <Building2 className="w-4 h-4 text-primary" />}
                        <span className="font-medium">{item.entity}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{item.percentage}%</span>
                        <p className="text-xs text-muted-foreground">
                          {item.compliant}/{item.total} compliant
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    {item.violations > 0 && (
                      <p className="text-xs text-destructive">{item.violations} active violations</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Inspections */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Inspections</CardTitle>
              <CardDescription>Latest compliance inspections and audits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInspections.map((inspection) => (
                  <div
                    key={inspection.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{inspection.entity}</p>
                      <p className="text-sm text-muted-foreground">{inspection.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {inspection.date} • {inspection.inspector}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        {inspection.status === "passed" ? (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        ) : inspection.status === "conditional" ? (
                          <Clock className="w-4 h-4 text-secondary" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <Badge
                          className={
                            inspection.status === "passed"
                              ? "bg-primary/10 text-primary"
                              : inspection.status === "conditional"
                                ? "bg-secondary/10 text-secondary"
                                : "bg-destructive/10 text-destructive"
                          }
                        >
                          {inspection.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">Score: {inspection.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regulatory Framework Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Framework Compliance</CardTitle>
            <CardDescription>Compliance rates for key regulatory standards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regulatoryFramework.map((framework) => (
                <div key={framework.standard} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{framework.standard}</h4>
                      <p className="text-sm text-muted-foreground">{framework.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{framework.compliance}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        framework.compliance >= 95
                          ? "bg-primary"
                          : framework.compliance >= 85
                            ? "bg-secondary"
                            : "bg-destructive"
                      }`}
                      style={{ width: `${framework.compliance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Action Items</CardTitle>
            <CardDescription>Immediate compliance actions required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="font-medium text-foreground">High Priority: Pesticide Violation</p>
                    <p className="text-sm text-muted-foreground">
                      Facility F003 requires immediate remediation for Batch B045
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="destructive">
                  Take Action
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-secondary/20 bg-secondary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="font-medium text-foreground">Medium Priority: Documentation Review</p>
                    <p className="text-sm text-muted-foreground">12 entities pending documentation review</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary">
                  Review
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-primary/20 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Scheduled: Quarterly Compliance Report</p>
                    <p className="text-sm text-muted-foreground">Due in 5 days - Generate comprehensive report</p>
                  </div>
                </div>
                <Button size="sm">Generate Report</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Compliance Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Real-time compliance tracking and alerts</p>
              <Button className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Monitor Compliance
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Inspection Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Generate and manage inspection reports</p>
              <Button className="w-full" variant="secondary">
                <FileText className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Violation Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Track and resolve compliance violations</p>
              <Button className="w-full bg-transparent" variant="outline">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Manage Violations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
