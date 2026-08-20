import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Navigation, Phone, Radio, Siren } from "lucide-react";

const zones = [
  { name: "Zone A — Imaging", coords: "24.7136° N, 46.6753° E", staff: 2, status: "Safe" },
  { name: "Zone B — Nuclear Medicine", coords: "24.7141° N, 46.6760° E", staff: 2, status: "Safe" },
  { name: "Zone C — Restricted", coords: "24.7150° N, 46.6771° E", staff: 1, status: "Monitor" },
  { name: "Waste Storage", coords: "24.7158° N, 46.6784° E", staff: 1, status: "Critical" },
];

const badgeClass = (status: string) =>
  status === "Safe"
    ? "bg-emerald-100 text-emerald-800"
    : status === "Monitor"
    ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-800";

export function EmergencyGPS() {
  const [dispatched, setDispatched] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Emergency / GPS</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Live Facility Map
            </CardTitle>
            <CardDescription>Real-time staff and incident positioning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-slate-100 rounded-xl border border-slate-200 h-72 overflow-hidden">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgb(203_213_225)_1px,transparent_1px),linear-gradient(to_bottom,rgb(203_213_225)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="absolute left-[22%] top-[30%] flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="mt-1 text-xs text-slate-600">Zone A</span>
              </div>
              <div className="absolute left-[52%] top-[55%] flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="mt-1 text-xs text-slate-600">Zone C</span>
              </div>
              <div className="absolute left-[72%] top-[25%] flex flex-col items-center">
                <div className="h-4 w-4 rounded-full bg-red-500 animate-pulse" />
                <span className="mt-1 text-xs font-semibold text-red-700">Incident</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium">Waste Storage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Coordinates:</span>
                <span className="font-medium">24.7158° N, 46.6784° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dose rate:</span>
                <span className="font-medium text-red-600">2.3x threshold</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nearest exit:</span>
                <span className="font-medium">East corridor</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Response Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!dispatched ? (
                <Button
                  onClick={() => setDispatched(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  <Siren className="h-4 w-4 mr-2" />
                  Dispatch Response Team
                </Button>
              ) : (
                <Badge className="bg-emerald-500 text-white">
                  <Radio className="h-3 w-3 mr-1" />
                  Team Dispatched — ETA 3 min
                </Badge>
              )}
              <Button variant="outline" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Call RSO
              </Button>
              <Button variant="outline" className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Show Evacuation Route
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Zone Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {zones.map((zone) => (
            <div key={zone.name} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-slate-800">{zone.name}</p>
                  <p className="text-xs text-slate-500">
                    {zone.coords} • {zone.staff} staff on site
                  </p>
                </div>
                <Badge className={badgeClass(zone.status)}>{zone.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
