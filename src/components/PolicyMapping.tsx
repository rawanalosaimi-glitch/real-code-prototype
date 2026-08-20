import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, FileText, Link2 } from "lucide-react";

const mappings = [
  {
    event: "Dose rate spike detected in Waste Storage",
    policy: "NRRC RSR Art. 12 — Control of radioactive waste areas",
    action: "Restrict access, notify RSO within 1 hour, log incident",
    status: "Mapped",
  },
  {
    event: "Staff member entered restricted zone",
    policy: "IAEA GSR Part 3 — Requirement 24 (Access control)",
    action: "Verify authorization, review dosimeter reading, retrain staff",
    status: "Mapped",
  },
  {
    event: "Dose limit approaching for EMP-003",
    policy: "IAEA BSS — Occupational dose limit 20 mSv/year",
    action: "Reassign duties, schedule medical review",
    status: "Action Required",
  },
  {
    event: "Dosimeter calibration overdue",
    policy: "Facility SOP RS-07 — Instrument calibration schedule",
    action: "Calibrate within 30 days, document results",
    status: "Pending",
  },
];

const documents = [
  { title: "NRRC Radiation Safety Regulations", version: "v3.1", clauses: 84 },
  { title: "IAEA GSR Part 3 — Basic Safety Standards", version: "2014", clauses: 132 },
  { title: "Facility ALARA Program", version: "v2.4", clauses: 41 },
  { title: "Emergency Response Plan", version: "v1.9", clauses: 27 },
];

const badgeClass = (status: string) =>
  status === "Mapped"
    ? "bg-emerald-100 text-emerald-800"
    : status === "Action Required"
    ? "bg-red-100 text-red-800"
    : "bg-amber-100 text-amber-800";

export function PolicyMapping() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Policy Mapping</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Events Mapped", value: "128", desc: "Last 30 days" },
          { label: "Compliance Rate", value: "96.1%", desc: "Against NRRC & IAEA" },
          { label: "Open Actions", value: "2", desc: "Require RSO review" },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-md">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Link2 className="h-5 w-5 text-indigo-600" />
            Event → Policy Mapping
          </CardTitle>
          <CardDescription>Each detected event is linked to its governing requirement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mappings.map((m) => (
            <div key={m.event} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-medium text-sm text-slate-800">{m.event}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {m.policy}
                  </p>
                  <p className="text-xs text-slate-600">Required action: {m.action}</p>
                </div>
                <Badge className={badgeClass(m.status)}>{m.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-500" />
            Reference Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map((doc) => (
            <div key={doc.title} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="font-medium text-sm text-slate-800">{doc.title}</p>
              <p className="text-xs text-slate-500">
                {doc.version} • {doc.clauses} clauses indexed
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
