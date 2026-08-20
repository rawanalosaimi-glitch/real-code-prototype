// Real (if intentionally simple) statistical anomaly-detection and forecasting model.
//
// Input features per reading: dose rate, time, room, procedure, staff id.
//   -> EWMA baseline + robust z-score  -> anomaly flags
//   -> weighted anomaly + trend blend  -> risk score (0-100)
//   -> ordinary least squares on the series -> forecast
//
// Everything below is computed at runtime from the input series; no result is
// hardcoded. The readings themselves are simulated prototype telemetry.

export type Reading = {
  t: string; // HH:MM
  doseRate: number; // µSv/h
  room: string;
  procedure: string;
  staffId: string;
};

export type Scored = Reading & {
  baseline: number;
  z: number;
  anomaly: boolean;
  severity: "Critical" | "Warning" | "Info";
};

export type ModelOutput = {
  scored: Scored[];
  anomalies: Scored[];
  riskScore: number;
  riskLabel: "Low" | "Moderate" | "Elevated" | "High";
  forecast: { t: string; doseRate: number }[];
  slopePerHour: number;
  meanAbsDeviation: number;
  accuracy: number;
  recomputedAt: string;
};

const ALPHA = 0.3; // EWMA smoothing factor
const Z_WARN = 2.0;
const Z_CRIT = 3.0;

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

/** Median absolute deviation, scaled to be comparable with a standard deviation. */
function mad(values: number[]) {
  const m = median(values);
  const dev = values.map((v) => Math.abs(v - m));
  return 1.4826 * median(dev) || 1e-6;
}

function leastSquares(values: number[]) {
  const n = values.length;
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - meanX) * (values[i]! - meanY);
    den += (i - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  return { slope, intercept: meanY - slope * meanX };
}

function addMinutes(t: string, minutes: number) {
  const [h, m] = t.split(":").map(Number) as [number, number];
  const total = (h * 60 + m + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function runAnomalyModel(readings: Reading[], stepMinutes = 15): ModelOutput {
  const values = readings.map((r) => r.doseRate);
  const spread = mad(values);

  let ewma = values[0]!;
  const scored: Scored[] = readings.map((r, i) => {
    const baseline = ewma;
    const z = i === 0 ? 0 : (r.doseRate - baseline) / spread;
    ewma = ALPHA * r.doseRate + (1 - ALPHA) * ewma;
    const abs = Math.abs(z);
    const severity: Scored["severity"] =
      abs >= Z_CRIT ? "Critical" : abs >= Z_WARN ? "Warning" : "Info";
    return { ...r, baseline: +baseline.toFixed(2), z: +z.toFixed(2), anomaly: abs >= Z_WARN, severity };
  });

  const anomalies = scored.filter((s) => s.anomaly);

  const { slope, intercept } = leastSquares(values);
  const n = values.length;
  const forecast = Array.from({ length: 4 }, (_, k) => {
    const idx = n - 1 + (k + 1);
    return {
      t: addMinutes(readings[n - 1]!.t, stepMinutes * (k + 1)),
      doseRate: +Math.max(0, intercept + slope * idx).toFixed(2),
    };
  });

  // Risk score: anomaly pressure (max |z|), anomaly density and upward trend.
  const maxZ = Math.max(...scored.map((s) => Math.abs(s.z)));
  const density = anomalies.length / n;
  const trend = Math.max(0, slope) / (spread || 1);
  const raw = 0.55 * Math.min(maxZ / Z_CRIT, 1.4) + 0.25 * density * 2 + 0.2 * Math.min(trend, 1.5);
  const riskScore = Math.round(Math.min(100, raw * 70));
  const riskLabel: ModelOutput["riskLabel"] =
    riskScore >= 75 ? "High" : riskScore >= 55 ? "Elevated" : riskScore >= 30 ? "Moderate" : "Low";

  // In-sample fit quality of the trend model, reported as a simple accuracy proxy.
  const fitted = values.map((_, i) => intercept + slope * i);
  const meanAbsDeviation =
    values.reduce((acc, v, i) => acc + Math.abs(v - fitted[i]!), 0) / n;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  const accuracy = +Math.max(0, Math.min(100, 100 - (meanAbsDeviation / (meanY || 1)) * 100)).toFixed(1);

  return {
    scored,
    anomalies,
    riskScore,
    riskLabel,
    forecast,
    slopePerHour: +(slope * (60 / stepMinutes)).toFixed(2),
    meanAbsDeviation: +meanAbsDeviation.toFixed(2),
    accuracy,
    recomputedAt: new Date().toISOString(),
  };
}

/** Simulated prototype telemetry — replace with the calibrated dosimetry feed. */
export function generateReadings(seed = 7, count = 24): Reading[] {
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  const rooms = ["Zone A — Imaging", "Zone B — Nuclear Medicine", "Zone C — Restricted", "Waste Storage"];
  const procedures = ["CT scan", "Isotope prep", "Waste handling", "Equipment maintenance"];
  const staff = ["EMP-001", "EMP-002", "EMP-003", "EMP-004", "EMP-005"];

  return Array.from({ length: count }, (_, i) => {
    const room = rooms[i % rooms.length]!;
    const base = room === "Waste Storage" ? 3.4 : 1.8;
    const noise = (rand() - 0.5) * 0.6;
    const drift = i * 0.035;
    const spike = i === count - 4 && room === "Waste Storage" ? 6.2 : i === 11 ? 2.4 : 0;
    return {
      t: addMinutes("08:00", i * 15),
      doseRate: +Math.max(0.1, base + noise + drift + spike).toFixed(2),
      room,
      procedure: procedures[i % procedures.length]!,
      staffId: staff[i % staff.length]!,
    };
  });
}
