import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Droplets, Thermometer, Wind, CloudRain, History } from "lucide-react";

// ── palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:     "#12161c",
  card:   "#1a2030",
  border: "#252d3d",
  header: "#1e2738",
  text:   "#e2e8f0",
  muted:  "#6b7fa3",
  cyan:   "#22d3ee",
  orange: "#f97316",
  purple: "#a78bfa",
  green:  "#22c55e",
  red:    "#ef4444",
  yellow: "#eab308",
};

// ── helpers ───────────────────────────────────────────────────────────────────
function fmtTime(d) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/*function genPt(prev) {
  return {
    time:              fmtTime(new Date()),
    rainfallIntensity: Math.max(0,   Math.min(100,  (prev?.rainfallIntensity ?? 0)    + (Math.random() - 0.5) * 12)),
    humidity:          Math.max(0,   Math.min(100,  (prev?.humidity          ?? 45)   + (Math.random() - 0.5) * 4)),
    temperature:       Math.max(20,  Math.min(40,   (prev?.temperature       ?? 26)   + (Math.random() - 0.5) * 1.2)),
    rainPercent:       Math.max(0,   Math.min(100,  (prev?.rainPercent       ?? 0)    + (Math.random() - 0.5) * 8)),
    waterLevel:        Math.max(0,   Math.min(300,  (prev?.waterLevel        ?? 21.52)+ (Math.random() - 0.5) * 0.5)),
  };
}*/

// ── WaterLevelCard ────────────────────────────────────────────────────────────
function WaterLevelCard({ value }) {
  const pct  = Math.min(100, Math.max(0, (value / 300) * 100));
  const status = value < 50 ? "SAFE" : value < 150 ? "WARNING" : "DANGER";
  const sc     = value < 50 ? C.green  : value < 150 ? C.yellow  : C.red;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 22px 20px", flex: "1 1 0", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Droplets size={16} style={{ color: C.cyan }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Water Level</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: C.cyan, lineHeight: 1.1, marginBottom: 14 }}>
        {value.toFixed(2)}<span style={{ fontSize: 18, marginLeft: 5, color: C.muted }}>cm</span>
      </div>
      <div style={{ height: 6, background: "#2a3550", borderRadius: 3, position: "relative", marginBottom: 4 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: C.green, borderRadius: 3 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginBottom: 10 }}>
        <span>0</span><span>300 cm</span>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${sc}22`, border: `1px solid ${sc}55`, borderRadius: 20, padding: "3px 10px" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: sc }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: sc }}>{status}</span>
      </div>
    </div>
  );
}

// ── RainfallPercentCard ───────────────────────────────────────────────────────
function RainfallPercentCard({ value }) {
  const pct       = Math.round(value);
  const markerPct = Math.min(100, Math.max(0, value));
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 22px 20px", flex: "1 1 0", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, width: 14, height: 14 }}>
          {[C.red, C.green, C.yellow, C.cyan].map((c, i) => (
            <div key={i} style={{ background: c, borderRadius: 1 }} />
          ))}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Rainfall Percent</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: C.orange, lineHeight: 1.1, marginBottom: 18 }}>
        {pct}<span style={{ fontSize: 18, marginLeft: 4, color: C.muted }}>%</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: `linear-gradient(to right, ${C.green}, ${C.yellow}, ${C.red})`, marginBottom: 4 }}>
        <div style={{ position: "absolute", top: "50%", left: `${markerPct}%`, transform: "translate(-50%, -50%)", width: 10, height: 10, borderRadius: "50%", background: "#fff", border: `2px solid ${C.orange}` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
        <span>0% Dry</span><span>30% Light</span><span>70%+ Heavy</span>
      </div>
    </div>
  );
}

// ── RainStatusCard ────────────────────────────────────────────────────────────
function RainStatusCard({ rainPercent, lastTime }) {
  const status = rainPercent === 0 ? "Dry" : rainPercent < 30 ? "Light Rain" : rainPercent < 70 ? "Moderate Rain" : "Heavy Rain";
  const sc     = rainPercent === 0 ? C.cyan : rainPercent < 30 ? C.green : rainPercent < 70 ? C.yellow : C.red;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 22px 20px", flex: "1 1 0", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <CloudRain size={16} style={{ color: C.purple }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Rain Status</span>
      </div>
      <div style={{ fontSize: 34, fontWeight: 700, color: sc, lineHeight: 1.15, marginBottom: 8 }}>
        {status}
      </div>
      <div style={{ fontSize: 11, color: C.muted }}>Last update · {lastTime}</div>
    </div>
  );
}

// ── TopCard ───────────────────────────────────────────────────────────────────
function TopCard({ title, icon: Icon, iconColor, value, unit, subtitle }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 22px 20px", flex: "1 1 0", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        {Icon && <Icon size={16} style={{ color: iconColor }} />}
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: iconColor, lineHeight: 1.1 }}>
        {value}{unit && <span style={{ fontSize: 18, marginLeft: 5, color: C.muted }}>{unit}</span>}
      </div>
      {subtitle && <div style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>{subtitle}</div>}
    </div>
  );
}

// ── SensorChart (full width) ──────────────────────────────────────────────────
function SensorChart({ data }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 22px 14px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <Wind size={14} style={{ color: C.purple }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Sensor Readings — Realtime</span>
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>
        Last 20 readings · updates on every Firebase change
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#252d3d" />
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: C.muted }} interval={3} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 9, fill: C.muted }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: C.header, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.text }} labelStyle={{ color: C.muted }} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: C.muted, paddingTop: 6 }} />
          <Line type="monotone" dataKey="rainfallIntensity" name="Rainfall Intensity" stroke={C.purple} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="humidity"          name="Humidity"           stroke={C.green}  strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="temperature"       name="Temperature"        stroke={C.red}    strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="rainPercent"       name="Rain %"             stroke={C.yellow} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const MAX_POINTS = 20;

export default function Dashboard() {
  const [data, setData] = useState(() => {
    const pts = []; let prev = null;
    for (let i = 0; i < MAX_POINTS; i++) { const p = genPt(prev); pts.push(p); prev = p; }
    return pts;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => {
        const next = genPt(prev[prev.length - 1]);
        return [...prev.slice(-MAX_POINTS + 1), next];
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const latest   = data[data.length - 1];
  const lastTime = latest.time;

  return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>

        {/* ── Header ── */}
        <div style={{ background: C.header, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #22d3ee)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Droplets size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>FlooDeT</div>
              <div style={{ fontSize: 11, color: C.muted }}>Smart Flood Detection System</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#252d3d", border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 14px", color: C.text, fontSize: 12, cursor: "pointer" }}>
              <History size={13} /> View History
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${C.green}22`, border: `1px solid ${C.green}55`, borderRadius: 20, padding: "4px 12px" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>SAFE</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12 }}>Clock · {lastTime}</div>
              <div style={{ fontSize: 10, color: C.muted }}>Last data · {lastTime}</div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: "14px 14px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* ROW 1: Water Level | Rainfall Percent | Rain Status | Temperature | Humidity */}
          <div style={{ display: "flex", gap: 12 }}>
            <WaterLevelCard value={latest.waterLevel} />
            <RainfallPercentCard value={latest.rainPercent} />
            <RainStatusCard rainPercent={latest.rainPercent} lastTime={lastTime} />
            <TopCard
              title="Temperature" icon={Thermometer} iconColor={C.orange}
              value={latest.temperature.toFixed(1)} unit="°C"
              subtitle={`Last update · ${lastTime}`}
            />
            <TopCard
              title="Humidity" icon={Droplets} iconColor={C.cyan}
              value={latest.humidity.toFixed(1)} unit="%"
              subtitle={`Last update · ${lastTime}`}
            />
          </div>

          {/* ROW 2: Full-width Sensor Readings chart */}
          <div style={{ display: "flex" }}>
            <SensorChart data={data} />
          </div>

        </div>
      </div>
  );
}
