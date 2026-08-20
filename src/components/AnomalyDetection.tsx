import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Radar, RefreshCw, TrendingUp } from "lucide-react";
import { generateReadings, runAnomalyModel } from "@/lib/anomaly";

const badgeClass = (severity: string) =>
  severity === "Critical"
    ? "bg-red-100 text-red-800"
    : severity === "Warning"
    ? "bg-amber-100 text-amber-800"
    : "bg-blue-100 text-blue-800";

export function AnomalyDetection() {
  const [seed, setSeed] = useState(7);
  const model = useMemo(() => runAnomalyModel(generateReadings(seed)), [seed]);

  const max = Math.max(
    ...model.scored.map((s) => s.doseRate),
    ...model.forecast.map((f) => f.doseRate),
  );

  const riskColor =
    model.riskLabel === "High"
      ? "text-red-600"
      : model.riskLabel === "Elevated"
      ? "text-amber-600"
      : model.riskLabel === "Moderate"
      ? "text-blue-600"
      : "text-emerald-600";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Anomaly Detection</h2>
          <p className="text-sm text-slate-500">
            Live model: dose rate + time + room + procedure + staff → EWMA baseline with robust
            z-scores → risk score → least-squares forecast. Every number below is computed at
            runtime from the input series.
          </p>
        </div>
        <Button
          onClick={() => setSeed((s) => s + 1)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Recalculate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Risk Score</p>
            <p className={`text-3xl font-bold ${riskColor}`}>{model.riskScore}/100</p>
            <p className="text-xs text-slate-400 mt-1">{model.riskLabel} risk</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Anomalies Found</p>
            <p className="text-3xl font-bold text-amber-600">{model.anomalies.length}</p>
            <p className="text-xs text-slate-400 mt-1">of {model.scored.length} readings (|z| ≥ 2)</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Trend Fit</p>
            <p className="text-3xl font-bold text-emerald-600">{model.accuracy}%</p>
            <p className="text-xs text-slate-400 mt-1">MAD {model.meanAbsDeviation} µSv/h</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Trend</p>
            <p className="text-3xl font-bold text-indigo-600">
              {model.slopePerHour > 0 ? "+" : ""}
              {model.slopePerHour}
            </p>
            <p className="text-xs text-slate-400 mt-1">µSv/h per hour</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Dose Rate Series &amp; Forecast
          </CardTitle>
          <CardDescription>
            Bars = observed readings (red = detected anomaly), striped = model forecast for the next
            hour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-56 border-b border-slate-200 pb-1">
            {model.scored.map((s) => (
              <div key={s.t} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  title={`${s.t} — ${s.doseRate} µSv/h (z=${s.z}) — ${s.room}`}
                  className={`w-full rounded-t ${
                    s.severity === "Critical"
                      ? "bg-red-500"
                      : s.severity === "Warning"
                      ? "bg-amber-400"
                      : "bg-indigo-400"
                  }`}
                  style={{ height: `${(s.doseRate / max) * 100}%` }}
                />
              </div>
            ))}
            {model.forecast.map((f) => (
              <div key={f.t} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  title={`${f.t} — forecast ${f.doseRate} µSv/h`}
                  className="w-full rounded-t border border-indigo-300 bg-[repeating-linear-gradient(45deg,rgb(199_210_254),rgb(199_210_254)_4px,transparent_4px,transparent_8px)]"
                  style={{ height: `${(f.doseRate / max) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{model.scored[0]?.t}</span>
            <span>{model.forecast[model.forecast.length - 1]?.t} (forecast)</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Radar className="h-5 w-5 text-red-600" />
            Detected Anomalies
          </CardTitle>
          <CardDescription>Flagged by the model, not by a predefined list</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {model.anomalies.length === 0 && (
            <p className="text-sm text-slate-500">No anomalies in the current series.</p>
          )}
          {model.anomalies.map((a) => (
            <div key={a.t} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-slate-800">
                    {a.doseRate} µSv/h vs baseline {a.baseline} µSv/h (z = {a.z})
                  </p>
                  <p className="text-xs text-slate-500">
                    {a.room} • {a.procedure} • {a.staffId} • {a.t}
                  </p>
                </div>
                <Badge className={badgeClass(a.severity)}>{a.severity}</Badge>
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-400">
            Model recalculated at {new Date(model.recomputedAt).toLocaleTimeString()}. Input series is
            simulated prototype telemetry — connect the calibrated dosimetry feed before clinical use.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
