import { useState, useEffect } from "react";
import { useSensorData } from "../utils/useSensorsData";
import { useAppTheme } from "../context/ThemeContext";
import { database } from "../../lib/firebase";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface HistoryRecord {
  id: string;
  distance: string | null;
  temperature: string | null;
  humidity: string | null;
  pressure: string | null;
  rainPercent: string | null;
  rainStatus: string | null;
  level: string | null;
  timestamp: string | null;
}

interface ChartPoint {
  time: string;
  humidity: number | null;
  temperature: number | null;
  rainPercent: number | null;
  distance: number | null;
}

export default function Dashboard() {
  const { getValue } = useSensorData();
  const { isDark } = useAppTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [allHistory, setAllHistory] = useState<HistoryRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("--");

  const level = getValue("level");
  const distance = getValue("distance");
  const rainPercent = parseFloat(getValue("rainPercent")) || 0;

  const levelColor =
    level === "ALERT" ? "#ef4444" :
    level === "WARN"  ? "#f59e0b" :
                        "#22c55e";

  const levelBg =
    level === "ALERT" ? "rgba(239,68,68,0.15)" :
    level === "WARN"  ? "rgba(245,158,11,0.15)" :
                        "rgba(34,197,94,0.15)";

  const distanceNum = parseFloat(distance);
  const maxDistance = 300;
  const progressPercent = isNaN(distanceNum) ? 0 : Math.min((distanceNum / maxDistance) * 100, 100);

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );

  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-MY", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      }));
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  // ==== FIX: REALTIME CHART — direct Firebase listener, not dependent on getValue ====
  useEffect(() => {
    const sensorRef = ref(database, "sensorData/latest");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) return;

      // Update last-updated time using the Firebase timestamp field
      if (val.timestamp) {
        const d = new Date(
          typeof val.timestamp === "number" ? val.timestamp : Number(val.timestamp)
        );
        setLastUpdated(
          d.toLocaleTimeString("en-MY", {
            hour: "2-digit", minute: "2-digit", second: "2-digit"
          })
        );
      }

      const time = new Date().toLocaleTimeString("en-MY", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });

      const newPoint: ChartPoint = {
        time,
        humidity: parseFloat(val.humidity) || null,
        temperature: parseFloat(val.temperature) || null,
        rainPercent: parseFloat(val.rainPercent) || null,
        distance: parseFloat(val.distance) || null,
      };

      // Only add a new point if something actually changed
      setChartData(prev => {
        const last = prev[prev.length - 1];
        if (
          last &&
          last.humidity === newPoint.humidity &&
          last.temperature === newPoint.temperature &&
          last.rainPercent === newPoint.rainPercent &&
          last.distance === newPoint.distance
        ) {
          return prev; // no change, don't add duplicate point
        }
        return [...prev, newPoint].slice(-20);
      });
    });

    return () => unsubscribe();
  }, []); // runs once on mount, listens forever

  // ==== FETCH HISTORY FROM REALTIME DATABASE ====
  useEffect(() => {
    if (!showHistory) return;
    setHistoryLoading(true);

    const historyRef = query(
      ref(database, "sensorHistory"),
      orderByChild("timestamp"),
      limitToLast(200)
    );

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const records: HistoryRecord[] = [];
      snapshot.forEach((child) => {
        const data = child.val();
        // Handle both Unix ms number and string timestamps
        let isoTimestamp: string | null = null;
        if (data.timestamp) {
          const ts = typeof data.timestamp === "number"
            ? data.timestamp
            : Number(data.timestamp);
          isoTimestamp = isNaN(ts) ? null : new Date(ts).toISOString();
        }
        records.push({
          id: child.key || "",
          distance: data.distance ?? null,
          temperature: data.temperature ?? null,
          humidity: data.humidity ?? null,
          pressure: data.pressure ?? null,
          rainPercent: data.rainPercent ?? null,
          rainStatus: data.rainStatus ?? null,
          level: data.level ?? null,
          timestamp: isoTimestamp,
        });
      });
      const sorted = records.reverse(); // latest first
      setAllHistory(sorted);
      setHistoryLoading(false);
    });

    return () => unsubscribe();
  }, [showHistory]);

  // ==== FILTER HISTORY CLIENT-SIDE ====
  useEffect(() => {
    if (!allHistory.length) return;

    let filtered = [...allHistory];

    if (timeFilter) {
      const hours = parseInt(timeFilter);
      const from = Date.now() - hours * 60 * 60 * 1000;
      filtered = filtered.filter((r) =>
        r.timestamp ? new Date(r.timestamp).getTime() >= from : false
      );
    } else if (startDate && endDate) {
      const start = new Date(startDate + "T00:00:00").getTime();
      const end = new Date(endDate + "T23:59:59").getTime();
      filtered = filtered.filter((r) => {
        if (!r.timestamp) return false;
        const t = new Date(r.timestamp).getTime();
        return t >= start && t <= end;
      });
    } else if (startDate && !endDate) {
      const start = new Date(startDate + "T00:00:00").getTime();
      const end = new Date(startDate + "T23:59:59").getTime();
      filtered = filtered.filter((r) => {
        if (!r.timestamp) return false;
        const t = new Date(r.timestamp).getTime();
        return t >= start && t <= end;
      });
    }

    setHistory(filtered);
  }, [allHistory, timeFilter, startDate, endDate]);

  // ==== EXPORT EXCEL ====
  const exportToExcel = () => {
    const exportData = history.map((record) => ({
      "Date": record.timestamp ? new Date(record.timestamp).toLocaleDateString("en-MY") : "-",
      "Time": record.timestamp ? new Date(record.timestamp).toLocaleTimeString("en-MY") : "-",
      "Water Level (cm)": record.distance ?? "-",
      "Temperature (°C)": record.temperature ?? "-",
      "Humidity (%)": record.humidity ?? "-",
      "Pressure (hPa)": record.pressure ?? "-",
      "Rainfall (%)": record.rainPercent ?? "-",
      "Rain Status": record.rainStatus ?? "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    worksheet["!cols"] = [
      { wch: 14 }, { wch: 12 }, { wch: 16 },
      { wch: 16 }, { wch: 14 }, { wch: 18 },
      { wch: 14 }, { wch: 14 },
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor History");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `FlooDeT_History_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const card = {
    background: "var(--card)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid var(--border)",
    color: "var(--card-foreground)",
  };

  const pageStyle = {
    padding: "24px",
    background: "var(--background)",
    minHeight: "100vh",
    color: "var(--foreground)",
  };

  const sectionTitleStyle = {
    fontSize: "13px",
    color: "var(--muted-foreground)",
    margin: 0,
  };

  const subtleTextStyle = {
    fontSize: "12px",
    color: "var(--muted-foreground)",
    margin: 0,
  };

  return (
    <div style={pageStyle}>

      {/* ===== HEADER ===== */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setShowHistory(true)}
            style={{
              padding: "8px 16px",
              background: "#1e293b",
              color: "#94a3b8",
              border: "1px solid #334155",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            📊 View History
          </button>
          <div style={{
            padding: "6px 16px",
            borderRadius: "999px",
            background: levelBg,
            border: `1px solid ${levelColor}`,
            color: levelColor,
            fontWeight: "700",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: levelColor, display: "inline-block"
            }}/>
            {level === "--" ? "..." : level}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Clock · {currentTime}
            </div>
            <div style={{ fontSize: "11px", color: "#475569" }}>
              Last data · {lastUpdated}
            </div>
          </div>
        </div>
      </div>

      {/* ===== ROW 1: Water Level + Temp + Humidity + Pressure ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>

        {/* Water Level */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span>💧</span>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Water Level</p>
          </div>
          <p style={{ fontSize: "40px", fontWeight: "700", color: "#3b82f6", margin: "0 0 16px" }}>
            {distance} <span style={{ fontSize: "20px" }}>cm</span>
          </p>
          <div style={{ background: "var(--border)", borderRadius: "999px", height: "6px", marginBottom: "6px" }}>
            <div style={{
              background: levelColor,
              borderRadius: "999px",
              height: "6px",
              width: `${progressPercent}%`,
              transition: "width 0.5s ease"
            }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#475569", marginBottom: "12px" }}>
            <span>0</span><span>300 cm</span>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 12px", borderRadius: "999px",
            background: levelBg, color: levelColor,
            fontSize: "13px", fontWeight: "700",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: levelColor, display: "inline-block" }}/>
            {level === "--" ? "..." : level}
          </div>
        </div>

        {/* Temperature */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span>🌡️</span>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Temperature</p>
          </div>
          <p style={{ fontSize: "40px", fontWeight: "700", color: "#f97316", margin: "0 0 8px" }}>
            {getValue("temperature")} <span style={{ fontSize: "18px" }}>°C</span>
          </p>
          <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>Last update · {lastUpdated}</p>
        </div>

        {/* Humidity */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span>💦</span>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Humidity</p>
          </div>
          <p style={{ fontSize: "40px", fontWeight: "700", color: "#06b6d4", margin: "0 0 8px" }}>
            {getValue("humidity")} <span style={{ fontSize: "18px" }}>%</span>
          </p>
          <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>Last update · {lastUpdated}</p>
        </div>

        {/* Pressure */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span>🌬️</span>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Pressure</p>
          </div>
          <p style={{ fontSize: "40px", fontWeight: "700", color: "#a78bfa", margin: "0 0 8px" }}>
            {getValue("pressure")} <span style={{ fontSize: "18px" }}>hPa</span>
          </p>
          <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>Last update · {lastUpdated}</p>
        </div>

      </div>

      {/* ===== ROW 2: Realtime Chart + Rain Status + Rainfall Percent ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>

        {/* Realtime Line Chart */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span>☔</span>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Sensor Readings — Realtime</p>
          </div>
          <p style={{ fontSize: "11px", color: "#475569", margin: "0 0 12px" }}>
            Last 20 readings · updates on every Firebase change
          </p>
          {chartData.length < 2 ? (
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#475569", fontSize: "13px" }}>
                Collecting data... waiting for sensor updates
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#475569", fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fill: "#475569", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                <Line type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} dot={false} name="Humidity (%)" />
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} name="Temp (°C)" />
                <Line type="monotone" dataKey="rainPercent" stroke="#fbbf24" strokeWidth={2} dot={false} name="Rain (%)" />
                <Line type="monotone" dataKey="distance" stroke="#a78bfa" strokeWidth={2} dot={false} name="Distance (cm)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Rain Status */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span>🌧️</span>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Rain Status</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "700", color: "#38bdf8", margin: "0 0 8px" }}>
            {getValue("rainStatus")}
          </p>
          <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>Last update · {lastUpdated}</p>
        </div>

        {/* Rainfall Percent */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span>📊</span>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Rainfall Percent</p>
          </div>
          <p style={{ fontSize: "40px", fontWeight: "700", color: "#818cf8", margin: "0 0 12px" }}>
            {getValue("rainPercent")} <span style={{ fontSize: "18px" }}>%</span>
          </p>
          <div style={{ background: "var(--border)", borderRadius: "999px", height: "6px", marginBottom: "6px" }}>
            <div style={{
              background: rainPercent >= 70 ? "#ef4444" : rainPercent >= 30 ? "#f59e0b" : "#3b82f6",
              borderRadius: "999px",
              height: "6px",
              width: `${Math.min(rainPercent, 100)}%`,
              transition: "width 0.5s ease"
            }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#475569" }}>
            <span>0% Dry</span>
            <span>30% Light</span>
            <span>70%+ Heavy</span>
          </div>
        </div>

      </div>

      {/* ===== FOOTER ===== */}
      <p style={{ textAlign: "center", fontSize: "10px", color: "var(--muted-foreground)", marginTop: "8px" }}>
        FlooDeT © 2025 · Powered by IoT Sensor → ThingsBoard → Firebase
      </p>

      {/* ===== HISTORY MODAL ===== */}
      {showHistory && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "var(--card)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "1000px",
            maxHeight: "85vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--border)",
          }}>

            {/* Modal Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #334155",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: "white" }}>📊 Sensor History</h2>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>
                  Filter by date or time range, then export to Excel
                </p>
              </div>
              <button
                onClick={() => { setShowHistory(false); setStartDate(""); setEndDate(""); setTimeFilter(""); }}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            {/* Filter Bar */}
            <div style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              background: "var(--card)",
            }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { label: "1h ago", value: "1" },
                  { label: "3h ago", value: "3" },
                  { label: "6h ago", value: "6" },
                  { label: "12h ago", value: "12" },
                  { label: "24h ago", value: "24" },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => { setTimeFilter(value); setStartDate(""); setEndDate(""); }}
                    style={{
                      padding: "6px 12px",
                      background: timeFilter === value ? "#3b82f6" : "var(--card)",
                      color: timeFilter === value ? "white" : "var(--muted-foreground)",
                      border: `1px solid ${timeFilter === value ? "#3b82f6" : "var(--border)"}`,
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <span style={{ color: "var(--border)" }}>|</span>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "12px", color: "#64748b" }}>From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => { setStartDate(e.target.value); setTimeFilter(""); }}
                  style={{
                    padding: "6px 10px", border: "1px solid #334155",
                    borderRadius: "6px", fontSize: "12px",
                    background: "#1e293b", color: "white", outline: "none",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "12px", color: "#64748b" }}>To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => { setEndDate(e.target.value); setTimeFilter(""); }}
                  style={{
                    padding: "6px 10px", border: "1px solid #334155",
                    borderRadius: "6px", fontSize: "12px",
                    background: "#1e293b", color: "white", outline: "none",
                  }}
                />
              </div>

              <button
                onClick={() => { setStartDate(""); setEndDate(""); setTimeFilter(""); }}
                style={{
                  padding: "6px 12px", background: "var(--card)",
                  border: "1px solid var(--border)", borderRadius: "6px",
                  fontSize: "12px", cursor: "pointer", color: "var(--muted-foreground)",
                }}
              >
                Clear
              </button>

              <div style={{ marginLeft: "auto" }}>
                <button
                  onClick={exportToExcel}
                  style={{
                    padding: "8px 16px", background: "#16a34a",
                    color: "white", border: "none", borderRadius: "8px",
                    fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  }}
                >
                  📥 Export Excel ({history.length} records)
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {historyLoading ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>Loading history...</p>
              ) : history.length === 0 ? (
                <p style={{ textAlign: "center", color: "#475569", padding: "40px" }}>No records found.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead style={{ position: "sticky", top: 0 }}>
                    <tr style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                      {["Date & Time", "Water (cm)", "Temp (°C)", "Humidity (%)", "Pressure (hPa)", "Rain (%)", "Rain Status"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#64748b", fontWeight: "600", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, i) => (
                      <tr key={record.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                        <td style={{ padding: "10px 12px", color: "#94a3b8", whiteSpace: "nowrap" }}>
                          {record.timestamp ? new Date(record.timestamp).toLocaleString("en-MY") : "-"}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#3b82f6", fontWeight: "600" }}>{record.distance ?? "-"}</td>
                        <td style={{ padding: "10px 12px", color: "#f97316" }}>{record.temperature ?? "-"}</td>
                        <td style={{ padding: "10px 12px", color: "#06b6d4" }}>{record.humidity ?? "-"}</td>
                        <td style={{ padding: "10px 12px", color: "#a78bfa" }}>{record.pressure ?? "-"}</td>
                        <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{record.rainPercent ?? "-"}</td>
                        <td style={{ padding: "10px 12px", color: "#38bdf8" }}>{record.rainStatus ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}