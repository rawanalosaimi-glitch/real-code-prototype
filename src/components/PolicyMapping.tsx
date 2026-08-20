import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, Link2 } from "lucide-react";
import { generateReadings, runAnomalyModel } from "@/lib/anomaly";
import { CHUNKS, DOC_BY_ID } from "@/lib/rag/corpus";

// AI COMPONENT -> RISK DETECTION -> APPLICABLE POLICY -> NRRC/IAEA -> REQUIREMENT -> ACTION
const RULES: {
  component: string;
  risk: string;
  chunkId: string;
  trigger: (m: ReturnType<typeof runAnomalyModel>) => boolean;
}[] = [
  {
    component: "Anomaly detection (EWMA + z-score)",
    risk: "Elevated ambient dose rate in a controlled area",
    chunkId: "nrrc-waste-areas",
    trigger: (m) => m.anomalies.some((a) => a.severity === "Critical"),
  },
  {
    component: "Time-series forecast (least squares)",
    risk: "Projected exposure approaching the applicable dose limit",
    chunkId: "nrrc-dose-limits",
    trigger: (m) => m.slopePerHour > 0.05,
  },
  {
    component: "Risk scoring model",
    risk: "Aggregate facility risk above the review threshold",
    chunkId: "iaea-risk-assessment",
    trigger: (m) => m.riskScore >= 55,
  },
  {
    component: "Access & zone monitoring",
    risk: "Unverified presence in a restricted zone",
    chunkId: "iaea-access-control",
    trigger: (m) => m.scored.some((s) => s.room.includes("Restricted") && s.anomaly),
  },
  {
    component: "Optimisation advisor",
    risk: "Exposure time reducible under ALARA",
    chunkId: "iaea-optimisation",
    trigger: () => true,
  },
  {
    component: "Dose record governance",
    risk: "Confidential dose data accessed outside radiation protection scope",
    chunkId: "facility-data-privacy",
    trigger: () => true,
  },
];

export function PolicyMapping() {
  const [seed] = useState(7);
  const model = useMemo(() => runAnomalyModel(generateReadings(seed)), [seed]);

  const rows = RULES.map((rule) => {
    const chunk = CHUNKS.find((c) => c.id === rule.chunkId)!;
    const doc = DOC_BY_ID[chunk.docId]!;
    const active = rule.trigger(model);
    return { rule, chunk, doc, active };
  });

  const activeCount = rows.filter((r) => r.active).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Policy Mapping</h2>
        <p className="text-sm text-slate-500">
          AI component → risk detection → applicable policy → issuing body → requirement → action.
          Triggers are evaluated against the live anomaly-detection model output.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Mapped Rules", value: String(rows.length), desc: "AI outputs linked to policy" },
          { label: "Currently Triggered", value: String(activeCount), desc: "From live model output" },
          {
            label: "Model Risk Score",
            value: `${model.riskScore}/100`,
            desc: `${model.riskLabel} risk`,
          },
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
            Mapping Chain
          </CardTitle>
          <CardDescription>Each AI signal resolves to a citable requirement and an action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map(({ rule, chunk, doc, active }) => (
            <div
              key={rule.chunkId + rule.component}
              className={`rounded-lg p-4 border ${
                active ? "border-red-200 bg-red-50/50" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                  <span className="font-semibold text-slate-800">{rule.component}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span>{rule.risk}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <Badge className="bg-slate-200 text-slate-800">{doc.issuer}</Badge>
                </div>
                <Badge className={active ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}>
                  {active ? "Action Required" : "Monitoring"}
                </Badge>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-600 underline decoration-dotted"
                  >
                    {doc.title}
                  </a>
                  — {chunk.section} • Page {chunk.page}
                </p>
                <p className="text-xs text-slate-600">Requirement: {chunk.text.slice(0, 190)}…</p>
                <p className="text-xs font-medium text-emerald-800">
                  Action: {chunk.recommendedAction}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-500" />
            Indexed Reference Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(DOC_BY_ID).map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-50 rounded-lg p-3 border border-slate-200 hover:border-indigo-300 transition-colors"
            >
              <p className="font-medium text-sm text-slate-800">{doc.title}</p>
              <p className="text-xs text-slate-500">
                {doc.reference} • {CHUNKS.filter((c) => c.docId === doc.id).length} chunks indexed
              </p>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
