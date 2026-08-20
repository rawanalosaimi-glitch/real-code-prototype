import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Siren, Phone, XCircle, Radio, MapPin, Activity, Shield, Bell, LayoutDashboard, Users, BellRing, History, Brain, Radar, Link2, Menu, X } from "lucide-react";
import { EmergencyGPS } from "@/components/EmergencyGPS";
import { AIAssistant } from "@/components/AIAssistant";
import { PolicyMapping } from "@/components/PolicyMapping";

export default function AlaradApp() {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [officersNotified, setOfficersNotified] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSimulate = () => {
    setSimulationActive(true);
    setEmergencyActive(true);
    setTimeout(() => setSimulationActive(false), 3000);
  };

  const handleNotifyOfficers = () => {
    setOfficersNotified(true);
    setTimeout(() => setOfficersNotified(false), 3000);
  };

  const handleReset = () => {
    setEmergencyActive(false);
    setOfficersNotified(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "staff", label: "Staff Monitoring", icon: Users },
    { id: "alerts", label: "Alerts", icon: BellRing },
    { id: "exposure", label: "Exposure Log", icon: History },
    { id: "ai-recommendations", label: "AI Recommendations", icon: Brain },
    { id: "anomaly", label: "Anomaly Detection", icon: Radar },
    { id: "emergency", label: "Emergency / GPS", icon: MapPin },
    { id: "ask-ai", label: "Ask AI", icon: Bot },
    { id: "policies", label: "Policy Mapping", icon: Link2 },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "emergency":
        return <EmergencyGPS />;
      case "ask-ai":
        return <AIAssistant />;
      case "policies":
        return <PolicyMapping />;
      case "staff":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Staff Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Ahmed Al-Otaibi", id: "EMP-001", dose: "0.42 mSv", status: "Safe", location: "Zone A" },
                { name: "Sara Al-Harbi", id: "EMP-002", dose: "0.38 mSv", status: "Safe", location: "Zone B" },
                { name: "Khalid Al-Zahrani", id: "EMP-003", dose: "1.20 mSv", status: "Monitor", location: "Zone C" },
                { name: "Nora Al-Qahtani", id: "EMP-004", dose: "0.15 mSv", status: "Safe", location: "Zone A" },
                { name: "Fahad Al-Dossari", id: "EMP-005", dose: "0.75 mSv", status: "Safe", location: "Zone B" },
                { name: "Maha Al-Shehri", id: "EMP-006", dose: "2.10 mSv", status: "Monitor", location: "Zone D" },
              ].map((staff) => (
                <Card key={staff.id} className="shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-800">{staff.name}</p>
                        <p className="text-xs text-slate-500">{staff.id}</p>
                      </div>
                      <Badge
                        className={
                          staff.status === "Safe"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {staff.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Dose:</span>
                        <span className="font-medium">{staff.dose}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Location:</span>
                        <span className="font-medium">{staff.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "alerts":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Alerts & Notifications</h2>
            <div className="space-y-3">
              {[
                { time: "14:32", msg: "Dose rate spike detected in Waste Storage", level: "Critical", desc: "Radiation level exceeded threshold by 2.3x" },
                { time: "13:15", msg: "Staff member entered restricted zone", level: "Warning", desc: "Unauthorized access detected in Zone C" },
                { time: "11:40", msg: "Routine calibration completed", level: "Info", desc: "Dosimeter calibration successful" },
                { time: "10:05", msg: "Dose limit approaching for EMP-003", level: "Warning", desc: "Khalid Al-Zahrani at 85% of monthly limit" },
                { time: "09:30", msg: "System health check passed", level: "Info", desc: "All sensors operational" },
              ].map((alert) => (
                <Card key={alert.time} className="shadow-sm">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            alert.level === "Critical"
                              ? "bg-red-100 text-red-800"
                              : alert.level === "Warning"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {alert.level}
                        </Badge>
                        <div>
                          <p className="font-medium text-slate-800">{alert.msg}</p>
                          <p className="text-sm text-slate-500">{alert.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{alert.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "exposure":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Exposure Log</h2>
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="bg-slate-100 rounded-xl p-6 border border-slate-200 h-64 flex items-center justify-center">
                  <p className="text-slate-400">Historical exposure chart placeholder</p>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { date: "2024-01-15", staff: "Ahmed Al-Otaibi", dose: "0.42 mSv", activity: "Routine inspection" },
                { date: "2024-01-15", staff: "Sara Al-Harbi", dose: "0.38 mSv", activity: "Equipment maintenance" },
                { date: "2024-01-14", staff: "Khalid Al-Zahrani", dose: "1.20 mSv", activity: "Waste handling" },
                { date: "2024-01-14", staff: "Nora Al-Qahtani", dose: "0.15 mSv", activity: "Documentation" },
              ].map((log) => (
                <Card key={log.date + log.staff} className="shadow-sm">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-800">{log.staff}</p>
                        <p className="text-sm text-slate-500">{log.activity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">{log.dose}</p>
                        <p className="text-xs text-slate-400">{log.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "ai-recommendations":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">AI Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Reduce exposure time in Zone C", priority: "High", reason: "Staff member approaching dose limit" },
                { title: "Schedule maintenance for Waste Storage", priority: "Medium", reason: "Dose rate fluctuation detected" },
                { title: "Review safety protocols for Zone D", priority: "High", reason: "Multiple staff members in monitoring status" },
                { title: "Update dosimeter calibration schedule", priority: "Low", reason: "Routine maintenance recommended" },
              ].map((rec) => (
                <Card key={rec.title} className="shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-800">{rec.title}</p>
                        <p className="text-sm text-slate-500">{rec.reason}</p>
                      </div>
                      <Badge
                        className={
                          rec.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : rec.priority === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "anomaly":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Anomaly Detection</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Risk Score", value: "87/100", color: "text-red-600", desc: "Elevated risk detected" },
                { label: "Anomalies Found", value: "3", color: "text-amber-600", desc: "In last 24 hours" },
                { label: "Model Accuracy", value: "94.2%", color: "text-emerald-600", desc: "Current model performance" },
              ].map((stat) => (
                <Card key={stat.label} className="shadow-md">
                  <CardContent className="pt-6">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Detected Anomalies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { time: "14:32", location: "Waste Storage", type: "Dose rate spike", severity: "Critical" },
                  { time: "13:15", location: "Zone C", type: "Unauthorized access", severity: "Warning" },
                  { time: "11:40", location: "Zone B", type: "Sensor drift", severity: "Info" },
                ].map((anomaly) => (
                  <div key={anomaly.time} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{anomaly.type}</p>
                        <p className="text-xs text-slate-500">{anomaly.location} • {anomaly.time}</p>
                      </div>
                      <Badge
                        className={
                          anomaly.severity === "Critical"
                            ? "bg-red-100 text-red-800"
                            : anomaly.severity === "Warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {anomaly.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Emergency Alert Banner */}
            {emergencyActive && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-bold text-red-800 text-lg">CRITICAL ALERT ACTIVE</p>
                      <p className="text-sm text-red-700">
                        Radiation leak detected in Waste Storage area. Dose rate: 2.3x normal threshold.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!officersNotified ? (
                      <Button
                        onClick={handleNotifyOfficers}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Report to RSO
                      </Button>
                    ) : (
                      <Badge className="bg-emerald-500 text-white">
                        <Radio className="h-3 w-3 mr-1" />
                        Officers Notified
                      </Badge>
                    )}
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-100"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Dose Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Today", value: "0.42", unit: "mSv", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "This Week", value: "2.10", unit: "mSv", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "This Month", value: "8.40", unit: "mSv", color: "text-amber-600", bg: "bg-amber-50" },
                { label: "This Year", value: "86.70", unit: "mSv", color: "text-red-600", bg: "bg-red-50" },
              ].map((dose) => (
                <Card key={dose.label} className="shadow-md">
                  <CardContent className="pt-6">
                    <p className="text-sm text-slate-500 font-medium">{dose.label}</p>
                    <p className={`text-3xl font-bold ${dose.color}`}>
                      {dose.value} <span className="text-sm font-medium">{dose.unit}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-600" />
                      Dose Rate Trend
                    </CardTitle>
                    <CardDescription>Real-time radiation exposure monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-100 rounded-xl p-6 border border-slate-200 h-64 flex items-center justify-center">
                      <p className="text-slate-400">Chart placeholder — dose rate over time</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Bell className="h-5 w-5 text-amber-600" />
                      Recent Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { time: "14:32", msg: "Dose rate spike detected in Waste Storage", level: "Critical" },
                      { time: "13:15", msg: "Staff member entered restricted zone", level: "Warning" },
                      { time: "11:40", msg: "Routine calibration completed", level: "Info" },
                    ].map((alert) => (
                      <div key={alert.time} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{alert.msg}</p>
                          <Badge
                            className={
                              alert.level === "Critical"
                                ? "bg-red-100 text-red-800"
                                : alert.level === "Warning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {alert.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Staff Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Ahmed Al-Otaibi", dose: "0.42 mSv", status: "Safe" },
                      { name: "Sara Al-Harbi", dose: "0.38 mSv", status: "Safe" },
                      { name: "Khalid Al-Zahrani", dose: "1.20 mSv", status: "Monitor" },
                    ].map((staff) => (
                      <div key={staff.name} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{staff.name}</p>
                          <Badge
                            className={
                              staff.status === "Safe"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }
                          >
                            {staff.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Dose: {staff.dose}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white shadow-md">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <p className="font-semibold">Safety Notice</p>
                    </div>
                    <p className="text-sm text-slate-400">
                      All staff must wear dosimeters at all times. Report any anomalies immediately.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-400" />
            <h1 className="text-lg font-bold">ALARAD</h1>
          </div>
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 h-8 w-8"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activePage === item.id
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400">System Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sm text-emerald-400 font-medium">All Systems Operational</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 h-8 w-8"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h2 className="text-lg font-semibold">
                {navItems.find((item) => item.id === activePage)?.label || "Dashboard"}
              </h2>
              <p className="text-xs text-slate-400">Radiation Safety Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {emergencyActive && (
              <Badge className="bg-red-500 text-white animate-pulse">
                <Siren className="h-3 w-3 mr-1" />
                CRITICAL
              </Badge>
            )}
            <Button
              onClick={handleSimulate}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              {simulationActive ? "⚠️ Simulating..." : "🧪 Test Emergency"}
            </Button>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto w-full">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}