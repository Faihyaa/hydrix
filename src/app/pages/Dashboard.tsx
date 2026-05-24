import { useState, useEffect } from "react";
import { useSensorData } from "../utils/useSensorsData";
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
    level === "ALERT" ? "rgba(239,68,68,0.1)" :
    level === "WARN"  ? "rgba(245,158,11,0.1)" :
                        "rgba(34,197,94,0.1)";

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

  // ==== REALTIME CHART ====
  useEffect(() => {
    const sensorRef = ref(database, "sensorData/latest");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) return;

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

      setChartData(prev => {
        const last = prev[prev.length - 1];
        if (
          last &&
          last.humidity === newPoint.humidity &&
          last.temperature === newPoint.temperature &&
          last.rainPercent === newPoint.rainPercent &&
          last.distance === newPoint.distance
        ) {
          return prev;
        }
        return [...prev, newPoint].slice(-20);
      });
    });
    return () => unsubscribe();
  }, []);

  // ==== FETCH HISTORY ====
  useEffect(() => {
    if (!showHistory) return;
    setHistoryLoading(true);

    const historyRef = query(
      ref(database, "sensorHistory"),
      orderByChild("timestamp"),
      limitToLast(1000)
    );

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const records: HistoryRecord[] = [];
      snapshot.forEach((child) => {
        const data = child.val();
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
      setAllHistory(records);
      setHistoryLoading(false);
    });

    return () => unsubscribe();
  }, [showHistory]);

  // ==== FILTER HISTORY ====
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
      "Rainfall (%)": record.rainPercent ?? "-",
      "Rain Status": record.rainStatus ?? "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    worksheet["!cols"] = [
      { wch: 14 }, { wch: 12 }, { wch: 16 },
      { wch: 16 }, { wch: 14 },
      { wch: 14 }, { wch: 14 },
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor History");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `HydriX_History_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ===== LIGHT THEME STYLES =====
  const card: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "14px 16px 12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  };

  const cardLabel: React.CSSProperties = {
    fontSize: "10px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
  };

  const cardValue: React.CSSProperties = {
    fontSize: "26px",
    fontWeight: 700,
    lineHeight: 1.1,
    margin: 0,
  };

  const cardUnit: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 400,
    marginLeft: "2px",
    opacity: 0.55,
  };

  const progressBar: React.CSSProperties = {
    height: "5px",
    background: "#e2e8f0",
    borderRadius: "4px",
    marginTop: "9px",
    overflow: "hidden",
  };

  return (
    <div style={{
      padding: "12px 16px",
      background: "#f0f6ff",
      height: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#1e293b",
      boxSizing: "border-box",
    }}>

      {/* ===== HEADER ===== */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}></div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setShowHistory(true)}
            style={{
              padding: "5px 12px",
              background: "#ffffff",
              color: "#475569",
              border: "1px solid #cbd5e1",
              borderRadius: "7px",
              fontSize: "11px",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            📊 View History
          </button>
          <div style={{
            padding: "4px 12px",
            borderRadius: "999px",
            background: levelBg,
            border: `1px solid ${levelColor}`,
            color: levelColor,
            fontWeight: 700,
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: levelColor, display: "inline-block" }} />
            {level === "--" ? "..." : level}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#64748b" }}>Realtime · {currentTime}</div>
            <div style={{ fontSize: "10px", color: "#94a3b8" }}>Last data · {lastUpdated}</div>
          </div>
        </div>
      </div>

      {/* ===== ROW 1: 5 SENSOR CARDS ===== */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: "10px",
        flexShrink: 0,
      }}>

        {/* Water Level */}
        <div style={card}>
          <div style={cardLabel}>💧 Water Level</div>
          <p style={{ ...cardValue, color: "#0ea5e9" }}>
            {distance}<span style={cardUnit}>cm</span>
          </p>
          <div style={progressBar}>
            <div style={{
              background: "#0ea5e9",
              borderRadius: "4px",
              height: "5px",
              width: `${progressPercent}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>
            <span>0</span><span>300 cm</span>
          </div>
          <div style={{ marginTop: "8px" }}>
            <span style={{
              background: levelBg, color: levelColor,
              fontSize: "10px", fontWeight: 600,
              padding: "2px 9px", borderRadius: "999px",
              border: `1px solid ${levelColor}`,
              display: "inline-flex", alignItems: "center", gap: "4px",
            }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: levelColor, display: "inline-block" }} />
              {level === "--" ? "..." : level}
            </span>
          </div>
        </div>

        {/* Rainfall Percent */}
        <div style={card}>
          <div style={cardLabel}>🌧️ Rainfall Percent</div>
          <p style={{ ...cardValue, color: "#7c3aed" }}>
            {getValue("rainPercent")}<span style={cardUnit}>%</span>
          </p>
          <div style={progressBar}>
            <div style={{
              background: rainPercent >= 70 ? "#ef4444" : rainPercent >= 30 ? "#f59e0b" : "#7c3aed",
              borderRadius: "4px",
              height: "5px",
              width: `${Math.min(rainPercent, 100)}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginTop: "4px" }}>
            <span style={{ color: "#94a3b8" }}>0% Dry</span>
            <span style={{ color: "#7c3aed" }}>70%+ Heavy</span>
          </div>
        </div>

        {/* Rain Status */}
        <div style={card}>
          <div style={cardLabel}>⛈️ Rain Status</div>
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#d97706", margin: "4px 0 0" }}>
            {getValue("rainStatus")}
          </p>
          <p style={{ fontSize: "10px", color: "#94a3b8", margin: "10px 0 0" }}>Last update · {lastUpdated}</p>
        </div>

        {/* Temperature */}
        <div style={card}>
          <div style={cardLabel}>🌡️ Temperature</div>
          <p style={{ ...cardValue, color: "#ea580c" }}>
            {getValue("temperature")}<span style={cardUnit}>°C</span>
          </p>
          <p style={{ fontSize: "10px", color: "#94a3b8", margin: "10px 0 0" }}>Last update · {lastUpdated}</p>
        </div>

        {/* Humidity */}
        <div style={card}>
          <div style={cardLabel}>💦 Humidity</div>
          <p style={{ ...cardValue, color: "#059669" }}>
            {getValue("humidity")}<span style={cardUnit}>%</span>
          </p>
          <div style={progressBar}>
            <div style={{
              background: "#059669",
              borderRadius: "4px",
              height: "5px",
              width: `${Math.min(parseFloat(getValue("humidity")) || 0, 100)}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <p style={{ fontSize: "10px", color: "#94a3b8", margin: "6px 0 0" }}>Last update · {lastUpdated}</p>
        </div>

      </div>

      {/* ===== ROW 2: REALTIME CHART ===== */}
      <div style={{
        ...card,
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px", flexShrink: 0 }}>
          <span>☔</span>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>Rainfall Intensity — Realtime</p>
        </div>
        <p style={{ fontSize: "10px", color: "#94a3b8", margin: "0 0 10px", flexShrink: 0 }}>
          Last 20 readings · updates on every Firebase change
        </p>

        <div style={{ flex: 1, minHeight: 0 }}>
          {chartData.length < 2 ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: "13px" }}>Collecting data... waiting for sensor updates</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{ color: "#334155" }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", color: "#64748b" }} />
                <Line type="monotone" dataKey="humidity"    stroke="#059669" strokeWidth={2} dot={false} name="Humidity (%)" />
                <Line type="monotone" dataKey="temperature" stroke="#ea580c" strokeWidth={2} dot={false} name="Temp (°C)" />
                <Line type="monotone" dataKey="rainPercent" stroke="#7c3aed" strokeWidth={2} dot={false} name="Rain (%)" />
                <Line type="monotone" dataKey="distance"   stroke="#0ea5e9" strokeWidth={2} dot={false} name="Distance (cm)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ===== HISTORY MODAL ===== */}
      {showHistory && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,17,27,0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "1000px",
            maxHeight: "85vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e2e8f0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}>

            {/* Modal Header */}
            <div style={{
              padding: "18px 24px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: "#1e293b" }}>📊 Sensor History</h2>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0" }}>
                  Filter by date or time range, then export to Excel
                </p>
              </div>
              <button
                onClick={() => { setShowHistory(false); setStartDate(""); setEndDate(""); setTimeFilter(""); }}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8" }}
              >
                ✕
              </button>
            </div>

            {/* Filter Bar */}
            <div style={{
              padding: "14px 24px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              background: "#f8fafc",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", gap: "6px" }}>
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
                      padding: "5px 11px",
                      background: timeFilter === value ? "#1a6cf6" : "#ffffff",
                      color: timeFilter === value ? "white" : "#64748b",
                      border: `1px solid ${timeFilter === value ? "#1a6cf6" : "#cbd5e1"}`,
                      borderRadius: "6px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <span style={{ color: "#cbd5e1" }}>|</span>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "#64748b" }}>From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => { setStartDate(e.target.value); setTimeFilter(""); }}
                  style={{
                    padding: "5px 10px", border: "1px solid #cbd5e1",
                    borderRadius: "6px", fontSize: "11px",
                    background: "#ffffff", color: "#1e293b", outline: "none",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "#64748b" }}>To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => { setEndDate(e.target.value); setTimeFilter(""); }}
                  style={{
                    padding: "5px 10px", border: "1px solid #cbd5e1",
                    borderRadius: "6px", fontSize: "11px",
                    background: "#ffffff", color: "#1e293b", outline: "none",
                  }}
                />
              </div>

              <button
                onClick={() => { setStartDate(""); setEndDate(""); setTimeFilter(""); }}
                style={{
                  padding: "5px 11px", background: "#ffffff",
                  border: "1px solid #cbd5e1", borderRadius: "6px",
                  fontSize: "11px", cursor: "pointer", color: "#64748b",
                }}
              >
                Clear
              </button>

              <div style={{ marginLeft: "auto" }}>
                <button
                  onClick={exportToExcel}
                  style={{
                    padding: "7px 14px", background: "#16a34a",
                    color: "white", border: "none", borderRadius: "7px",
                    fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  📥 Export Excel ({history.length} records)
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {historyLoading ? (
                <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>Loading history...</p>
              ) : history.length === 0 ? (
                <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No records found.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead style={{ position: "sticky", top: 0 }}>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {["Date & Time", "Water (cm)", "Temp (°C)", "Humidity (%)", "Rain (%)", "Rain Status"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, i) => (
                      <tr key={record.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                        <td style={{ padding: "9px 12px", color: "#64748b", whiteSpace: "nowrap" }}>
                          {record.timestamp ? new Date(record.timestamp).toLocaleString("en-MY") : "-"}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#0ea5e9", fontWeight: 600 }}>{record.distance ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#ea580c" }}>{record.temperature ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#059669" }}>{record.humidity ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#64748b" }}>{record.rainPercent ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#d97706" }}>{record.rainStatus ?? "-"}</td>
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
