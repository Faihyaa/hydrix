import { useSensorData } from "../utils/useSensorsData";

export default function Dashboard() {
  const { loading, error, getValue, alerts } = useSensorData();

  const level = getValue("level");
  const distance = getValue("distance");

  const levelColor =
    level === "ALERT" ? "#dc2626" :
    level === "WARN"  ? "#d97706" :
                        "#16a34a";

  const levelBg =
    level === "ALERT" ? "#fef2f2" :
    level === "WARN"  ? "#fffbeb" :
                        "#f0fdf4";

  const distanceNum = parseFloat(distance);
  const maxDistance = 300;
  const progressPercent = isNaN(distanceNum) ? 0 : Math.min((distanceNum / maxDistance) * 100, 100);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>

      {/* ===== HEADER ===== */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>FlooDeT Dashboard</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>
            Realtime · refreshing every 5s
          </p>
        </div>
        {!loading && !error && (
          <div style={{
            padding: "6px 16px",
            borderRadius: "999px",
            background: levelBg,
            border: `1px solid ${levelColor}`,
            color: levelColor,
            fontWeight: "600",
            fontSize: "14px"
          }}>
            ● {level === "--" ? "..." : level}
          </div>
        )}
      </div>

      {/* ===== ERROR BAR ===== */}
      {error && (
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fca5a5",
          color: "#dc2626",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px"
        }}>
          ⚠️ {error} — Pastikan server.js running: <code>node server.js</code>
        </div>
      )}

      {/* ===== SENSOR CARDS ===== */}
      {loading ? (
        <p style={{ color: "#6b7280" }}>Memuatkan data sensor...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>

          {/* Water Level */}
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px", gridColumn: "span 2" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px" }}>💧 Water Level</p>
            <p style={{ fontSize: "36px", fontWeight: "700", color: "#2563eb", margin: "0 0 12px" }}>
              {distance} <span style={{ fontSize: "18px" }}>cm</span>
            </p>
            <div style={{ background: "#e5e7eb", borderRadius: "999px", height: "8px" }}>
              <div style={{
                background: levelColor,
                borderRadius: "999px",
                height: "8px",
                width: `${progressPercent}%`,
                transition: "width 0.5s ease"
              }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
              <span>0</span>
              <span>300 cm</span>
            </div>
            <div style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "4px 12px",
              borderRadius: "999px",
              background: levelBg,
              color: levelColor,
              fontSize: "13px",
              fontWeight: "600"
            }}>
              ● {level}
            </div>
          </div>

          {/* Temperature */}
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px" }}>🌡️ Temperature</p>
            <p style={{ fontSize: "32px", fontWeight: "700", color: "#f97316", margin: 0 }}>
              {getValue("temperature")} <span style={{ fontSize: "16px" }}>°C</span>
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0" }}>Last update just now</p>
          </div>

          {/* Humidity */}
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px" }}>💦 Humidity</p>
            <p style={{ fontSize: "32px", fontWeight: "700", color: "#06b6d4", margin: 0 }}>
              {getValue("humidity")} <span style={{ fontSize: "16px" }}>%</span>
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0" }}>Last update just now</p>
          </div>

          {/* Air Pressure */}
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px" }}>🌬️ Air Pressure</p>
            <p style={{ fontSize: "32px", fontWeight: "700", color: "#8b5cf6", margin: 0 }}>
              {getValue("pressure")} <span style={{ fontSize: "16px" }}>hPa</span>
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0" }}>Last update just now</p>
          </div>

          {/* Rain Status */}
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px" }}>🌧️ Rain Status</p>
            <p style={{ fontSize: "24px", fontWeight: "700", color: "#1e40af", margin: 0 }}>
              {getValue("rainStatus")}
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0" }}>Last update just now</p>
          </div>

          {/* Rainfall Percent */}
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px" }}>🌂 Rainfall Percent</p>
            <p style={{ fontSize: "32px", fontWeight: "700", color: "#3b82f6", margin: 0 }}>
              {getValue("rainPercent")} <span style={{ fontSize: "16px" }}>%</span>
            </p>
            <div style={{ background: "#e5e7eb", borderRadius: "999px", height: "6px", marginTop: "10px" }}>
              <div style={{
                background: "#3b82f6",
                borderRadius: "999px",
                height: "6px",
                width: `${Math.min(parseFloat(getValue("rainPercent")) || 0, 100)}%`,
                transition: "width 0.5s ease"
              }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
              <span>0% Dry</span>
              <span>30% Light</span>
              <span>70%+ Heavy</span>
            </div>
          </div>

        </div>
      )}

      {/* ===== ALERT LOG ===== */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>🔔 Recent Alert Log</h2>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>{alerts.length} records</span>
        </div>
        {alerts.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
            No alerts at this time ✓
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {alerts.slice(0, 10).map((alert, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: "8px",
                background: alert.level === "ALERT" ? "#fef2f2" : alert.level === "WARN" ? "#fffbeb" : "#f0fdf4",
                border: `1px solid ${alert.level === "ALERT" ? "#fca5a5" : alert.level === "WARN" ? "#fcd34d" : "#86efac"}`
              }}>
                <span style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: alert.level === "ALERT" ? "#dc2626" : alert.level === "WARN" ? "#d97706" : "#16a34a"
                }}>
                  {alert.message}
                </span>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                  {new Date(alert.time).toLocaleTimeString("ms-MY")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af" }}>
        FlooDeT © 2025 · Data updates every 5 seconds · Powered by IoT Sensor → ThingsBoard
      </p>

    </div>
  );
}