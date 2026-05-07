// src/app/pages/Dashboard.tsx
// Gantikan SERVER_URL dengan URL Render.com anda bila dah deploy
 
import { useState, useEffect } from "react";
 
// TYPES
interface SensorReading {
  value: string;
  ts: number;
}
 
interface SensorData {
  distance?: SensorReading[];
  temperature?: SensorReading[];
  humidity?: SensorReading[];
  pressure?: SensorReading[];
  rainPercent?: SensorReading[];
  rainStatus?: SensorReading[];
  level?: SensorReading[];
}
 
interface AlertItem {
  message: string;
  level: string;
  distance: number;
  rainStatus: string;
  time: string;
}
 
// CONFIG — tukar ke URL Render.com anda lepas deploy
const SERVER_URL = "https://floodet2.vercel.app";
 
// HOOK
function useSensorData() {
  const [data, setData] = useState<SensorData>({});
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/telemetry`);
        const result = await res.json();
        if (result.success) setData(result.data);
 
        const alertRes = await fetch(`${SERVER_URL}/api/alerts`);
        const alertData = await alertRes.json();
        setAlerts(alertData);
 
        setLastUpdate(new Date());
        setError(null);
      } catch {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);
 
  const getValue = (key: keyof SensorData): string =>
    data[key]?.[0]?.value ?? "--";
 
  return { data, alerts, loading, error, getValue, lastUpdate };
}

// MINI SPARKLINE (SVG chart ringkas)
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 120;
  const h = 40;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
 
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}
 
// WATER LEVEL BAR
function WaterLevelBar({ value }: { value: number }) {
  const pct = Math.min(Math.max((value / 300) * 100, 0), 100);
  const color =
    value <= 4 ? "#ef4444" : value <= 8 ? "#f59e0b" : "#10b981";
 
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "999px",
          height: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "999px",
            transition: "width 0.8s ease",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "rgba(255,255,255,0.4)",
          marginTop: "4px",
        }}
      >
        <span>0</span>
        <span>300 cm</span>
      </div>
    </div>
  );
}

// ALERT BADGE
function LevelBadge({ level }: { level: string }) {
  const cfg: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    SAFE:  { bg: "rgba(16,185,129,0.15)",  text: "#10b981", dot: "#10b981", label: "SAFE" },
    WARN:  { bg: "rgba(245,158,11,0.15)",  text: "#f59e0b", dot: "#f59e0b", label: "WARNING" },
    ALERT: { bg: "rgba(239,68,68,0.15)",   text: "#ef4444", dot: "#ef4444", label: "DANGER" },
  };
  const c = cfg[level] ?? cfg["SAFE"];
 
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.text}40`,
        borderRadius: "999px",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: c.dot,
          display: "inline-block",
          animation: level === "ALERT" ? "pulse 1s infinite" : "none",
        }}
      />
      {c.label}
    </span>
  );
}
 
// SENSOR CARD
interface CardProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
  color: string;
  sub?: string;
  sparkValues?: number[];
}
 
function SensorCard({ icon, label, value, unit, color, sub, sparkValues }: CardProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        backdropFilter: "blur(8px)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${color}22`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>{icon}</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 500, letterSpacing: "0.05em" }}>
            {label}
          </span>
        </div>
        {sparkValues && <Sparkline values={sparkValues} color={color} />}
      </div>
 
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "4px" }}>
        <span style={{ fontSize: "36px", fontWeight: 700, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {value}
        </span>
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{unit}</span>
      </div>
 
      {sub && (
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
          {sub}
        </span>
      )}
    </div>
  );
}
// MAIN DASHBOARD
export default function Dashboard() {
  const { loading, error, getValue, alerts, lastUpdate } = useSensorData();
  const [tick, setTick] = useState(0);
 
  // Countdown refresh
  useEffect(() => {
    const t = setInterval(() => setTick((p) => (p + 1) % 5), 1000);
    return () => clearInterval(t);
  }, []);
 
  const level = getValue("level");
  const distance = parseFloat(getValue("distance")) || 0;
  const rainPct = parseFloat(getValue("rainPercent")) || 0;
  const rainStatus = getValue("rainStatus");
 
  const levelBg =
    level === "ALERT"
      ? "radial-gradient(ellipse at top left, rgba(239,68,68,0.12) 0%, transparent 60%)"
      : level === "WARN"
      ? "radial-gradient(ellipse at top left, rgba(245,158,11,0.10) 0%, transparent 60%)"
      : "radial-gradient(ellipse at top left, rgba(16,185,129,0.08) 0%, transparent 60%)";
 
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c1220",
        backgroundImage: levelBg,
        color: "#fff",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .dash-card { animation: fadeIn 0.4s ease both; }
      `}</style>
 
      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            🌊
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" }}>
              FlooDeT
            </h1>
            <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              Smart Flood Detection System
            </p>
          </div>
        </div>
 
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LevelBadge level={level} />
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            Realtime · refreshing in {4 - tick}s
            {lastUpdate && (
              <span style={{ color: "rgba(255,255,255,0.2)", marginLeft: 4 }}>
                · {lastUpdate.toLocaleTimeString("en-MY")}
              </span>
            )}
          </div>
        </div>
      </div>
 
      {/* ── ERROR / LOADING ── */}
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px",
            padding: "12px 16px",
            color: "#ef4444",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          ⚠ {error} — Please check your server.js
        </div>
      )}
 
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
          Loading sensor data...
        </div>
      ) : (
        <>
          {/* ── ROW 1: WATER LEVEL (besar) + 3 sensor ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {/* Water Level — card besar */}
            <div
              className="dash-card"
              style={{
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "16px",
                padding: "24px",
                animationDelay: "0ms",
              }}
            >
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 500, marginBottom: "8px" }}>
                💧 Water Level
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "52px", fontWeight: 700, color: "#60a5fa", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {getValue("distance")}
                </span>
                <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)" }}>cm</span>
              </div>
              <WaterLevelBar value={distance} />
              <div style={{ marginTop: "12px" }}>
                <LevelBadge level={level} />
              </div>
            </div>
 
            {/* Temperature */}
            <div className="dash-card" style={{ animationDelay: "60ms" }}>
              <SensorCard
                icon="🌡"
                label="Temperature"
                value={getValue("temperature")}
                unit="°C"
                color="#f97316"
                sub="Last update just now"
              />
            </div>
 
            {/* Humidity */}
            <div className="dash-card" style={{ animationDelay: "120ms" }}>
              <SensorCard
                icon="💦"
                label="Humidity"
                value={getValue("humidity")}
                unit="%"
                color="#38bdf8"
                sub="Last update just now"
              />
            </div>
 
            {/* Air Pressure */}
            <div className="dash-card" style={{ animationDelay: "180ms" }}>
              <SensorCard
                icon="🌬"
                label="Air Pressure"
                value={getValue("pressure")}
                unit="hPa"
                color="#a78bfa"
                sub="Last update just now"
              />
            </div>
          </div>
 
          {/* ── ROW 2: Rain gauge + Rain Status + Rain% + Alert Log ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {/* Rain gauge bar */}
            <div
              className="dash-card"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "20px 24px",
                animationDelay: "240ms",
              }}
            >
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", fontWeight: 500 }}>
                🌧 Rainfall Intensity — Realtime
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {/* Big rain % */}
                <div>
                  <span style={{ fontSize: "48px", fontWeight: 700, color: "#60a5fa", fontVariantNumeric: "tabular-nums" }}>
                    {getValue("rainPercent")}
                  </span>
                  <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", marginLeft: "4px" }}>%</span>
                </div>
                {/* Vertical bar */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      height: "12px",
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${rainPct}%`,
                        height: "100%",
                        background:
                          rainPct >= 70
                            ? "linear-gradient(90deg,#3b82f6,#ef4444)"
                            : rainPct >= 30
                            ? "linear-gradient(90deg,#3b82f6,#f59e0b)"
                            : "#3b82f6",
                        borderRadius: "999px",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.3)",
                      marginTop: "4px",
                    }}
                  >
                    <span>0% Dry</span>
                    <span>30% Light</span>
                    <span>70%+ Heavy</span>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Rain Status */}
            <div
              className="dash-card"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "20px 22px",
                animationDelay: "300ms",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                🌦 Rain Status
              </div>
              <div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    color:
                      rainStatus === "Heavy Rain"
                        ? "#ef4444"
                        : rainStatus === "Light Rain"
                        ? "#f59e0b"
                        : "#10b981",
                    lineHeight: 1.2,
                    marginBottom: "4px",
                  }}
                >
                  {rainStatus}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                  Last update just now
                </div>
              </div>
            </div>
 
            {/* Rainfall % card */}
            <div className="dash-card" style={{ animationDelay: "360ms" }}>
              <SensorCard
                icon="📊"
                label="Rainfall Percent"
                value={getValue("rainPercent")}
                unit="%"
                color="#818cf8"
                sub="Last update just now"
              />
            </div>
          </div>
 
          {/* ── ROW 3: Alert Log ── */}
          <div
            className="dash-card"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "20px 24px",
              animationDelay: "420ms",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                🔔 Recent Alert Log
              </span>
              <span
                style={{
                  fontSize: "11px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "999px",
                  padding: "2px 10px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {alerts.length} records
              </span>
            </div>
 
            {alerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
                No alerts at this time ✓
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {alerts.slice(0, 6).map((alert, i) => {
                  const col =
                    alert.level === "ALERT"
                      ? "#ef4444"
                      : alert.level === "WARN"
                      ? "#f59e0b"
                      : "#10b981";
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: `${col}0d`,
                        border: `1px solid ${col}22`,
                        borderRadius: "10px",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: col,
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ color: col, fontWeight: 600 }}>{alert.message}</span>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                          · Distance {alert.distance} cm · {alert.rainStatus}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.25)",
                          whiteSpace: "nowrap",
                          marginLeft: "12px",
                        }}
                      >
                        {new Date(alert.time).toLocaleTimeString("en-MY")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
 
      {/* FOOTER */}
      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          fontSize: "11px",
          color: "rgba(255,255,255,0.15)",
        }}
      >
        FlooDeT © 2025 · Data updates every 5 seconds · Powered by IoT Sensor + ThingsBoard
      </div>
    </div>
  );
}