import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Droplets, Thermometer, Wind, CloudRain, History } from "lucide-react";
import { database } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";

// ── palette ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#12161c",
  card: "#1a2030",
  border: "#252d3d",
  header: "#1e2738",
  text: "#e2e8f0",
  muted: "#6b7fa3",
  cyan: "#22d3ee",
  orange: "#f97316",
  purple: "#a78bfa",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
};

// ── helpers ───────────────────────────────────────────────────────────────────
function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ── Water Level Card ──────────────────────────────────────────────────────────
function WaterLevelCard({ value = 0 }) {
  const pct = Math.min(100, Math.max(0, (value / 300) * 100));
  const status = value < 50 ? "SAFE" : value < 150 ? "WARNING" : "DANGER";
  const sc = value < 50 ? C.green : value < 150 ? C.yellow : C.red;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
        <Droplets size={16} style={{ color: C.cyan }} />
        <span style={{ color: C.text, fontSize: 13 }}>Water Level</span>
      </div>

      <div style={{ fontSize: 34, fontWeight: 700, color: C.cyan }}>
        {value ?? 0} <span style={{ fontSize: 16, color: C.muted }}>cm</span>
      </div>

      <div style={{ height: 6, background: "#2a3550", borderRadius: 3, marginTop: 10 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: sc, borderRadius: 3 }} />
      </div>

      <div style={{ marginTop: 10 }}>
        <span style={{ color: sc, fontWeight: 700, fontSize: 12 }}>{status}</span>
      </div>
    </div>
  );
}

// ── Rain Status ───────────────────────────────────────────────────────────────
function RainStatusCard({ rainPercent = 0, lastTime = "--" }) {
  const status =
    rainPercent === 0
      ? "Dry"
      : rainPercent < 30
      ? "Light Rain"
      : rainPercent < 70
      ? "Moderate Rain"
      : "Heavy Rain";

  const sc =
    rainPercent === 0
      ? C.cyan
      : rainPercent < 30
      ? C.green
      : rainPercent < 70
      ? C.yellow
      : C.red;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px" }}>
      <CloudRain size={16} style={{ color: C.purple }} />
      <div style={{ fontSize: 28, fontWeight: 700, color: sc }}>{status}</div>
      <div style={{ fontSize: 11, color: C.muted }}>Last update · {lastTime}</div>
    </div>
  );
}

// ── Sensor Chart ─────────────────────────────────────────────────────────────
function SensorChart({ data = [] }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 }}>
      <div style={{ fontSize: 13, color: C.text, marginBottom: 10 }}>
        Sensor Readings (Realtime Firebase)
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid stroke="#252d3d" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: C.muted }} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="humidity" stroke={C.green} />
          <Line type="monotone" dataKey="temperature" stroke={C.orange} />
          <Line type="monotone" dataKey="rainPercent" stroke={C.yellow} />
          <Line type="monotone" dataKey="waterLevel" stroke={C.cyan} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [latest, setLatest] = useState<any>({});
  const [lastTime, setLastTime] = useState("--");

  // REAL FIREBASE LISTENER
  useEffect(() => {
    const sensorRef = ref(database, "sensorData/latest");

    const unsub = onValue(sensorRef, (snap) => {
      const v = snap.val();
      if (!v) return;

      const time = fmtTime(new Date());

      const point = {
        time,
        humidity: Number(v.humidity) || 0,
        temperature: Number(v.temperature) || 0,
        rainPercent: Number(v.rainPercent) || 0,
        waterLevel: Number(v.distance) || 0,
      };

      setLatest(point);
      setLastTime(time);

      setData((prev) => [...prev.slice(-19), point]);
    });

    return () => unsub();
  }, []);

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, padding: 14 }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>FlooDeT</div>
            <div style={{ fontSize: 11, color: C.muted }}>Realtime Flood Monitoring</div>
          </div>

          <div style={{ fontSize: 11, color: C.muted }}>
            Last update: {lastTime}
          </div>
        </div>

        {/* CARDS */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <WaterLevelCard value={latest.waterLevel} />
          <RainStatusCard rainPercent={latest.rainPercent} lastTime={lastTime} />

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 }}>
            <Thermometer size={14} />
            <div style={{ fontSize: 28, color: C.orange }}>
              {latest.temperature ?? 0}°C
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 }}>
            <Droplets size={14} />
            <div style={{ fontSize: 28, color: C.cyan }}>
              {latest.humidity ?? 0}%
            </div>
          </div>
        </div>

        {/* CHART */}
        <div style={{ marginTop: 14 }}>
          <SensorChart data={data} />
        </div>

      </div>
    </Layout>
  );
}