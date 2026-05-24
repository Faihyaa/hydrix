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
      setAllHistory(records.reverse());
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
    saveAs(blob, `HydriX_History_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ===== STYLES =====
  const card: React.CSSProperties = {
    background: "#161c2d",
    borderRadius: "14px",
    padding: "14px 16px 12px",
    border: "1px solid #1e2a42",
  };

  const cardLabel: React.CSSProperties = {
    fontSize: "10px",
    color: "#6b7a99",
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
    opacity: 0.65,
  };

  const progressBar: React.CSSProperties = {
    height: "5px",
    background: "#1e2a42",
    borderRadius: "4px",
    marginTop: "9px",
    overflow: "hidden",
  };

  return (
    // ── ROOT: locked to viewport, no scroll ──
    <div style={{
      padding: "12px 16px",
      background: "#0f1117",
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#e2e8f0",
      boxSizing: "border-box",
    }}>

      {/* ===== HEADER ===== */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setShowHistory(true)}
            style={{
              padding: "5px 12px",
              background: "transparent",
              color: "#a0aec0",
              border: "1px solid #2a3454",
              borderRadius: "7px",
              fontSize: "11px",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
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
            <div style={{ fontSize: "11px", color: "#6b7a99" }}>Realtime · {currentTime}</div>
            <div style={{ fontSize: "10px", color: "#475569" }}>Last data · {lastUpdated}</div>
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
          <p style={{ ...cardValue, color: "#38bdf8" }}>
            {distance}<span style={cardUnit}>cm</span>
          </p>
          <div style={progressBar}>
            <div style={{
              background: "#38bdf8",
              borderRadius: "4px",
              height: "5px",
              width: `${progressPercent}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6b7a99", marginTop: "4px" }}>
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
          <p style={{ ...cardValue, color: "#a78bfa" }}>
            {getValue("rainPercent")}<span style={cardUnit}>%</span>
          </p>
          <div style={progressBar}>
            <div style={{
              background: rainPercent >= 70 ? "#ef4444" : rainPercent >= 30 ? "#f59e0b" : "#a78bfa",
              borderRadius: "4px",
              height: "5px",
              width: `${Math.min(rainPercent, 100)}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginTop: "4px" }}>
            <span style={{ color: "#6b7a99" }}>0% Dry</span>
            <span style={{ color: "#a78bfa" }}>70%+ Heavy</span>
          </div>
        </div>

        {/* Rain Status */}
        <div style={card}>
          <div style={cardLabel}>⛈️ Rain Status</div>
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#f59e42", margin: "4px 0 0" }}>
            {getValue("rainStatus")}
          </p>
          <p style={{ fontSize: "10px", color: "#6b7a99", margin: "10px 0 0" }}>Last update · {lastUpdated}</p>
        </div>

        {/* Temperature */}
        <div style={card}>
          <div style={cardLabel}>🌡️ Temperature</div>
          <p style={{ ...cardValue, color: "#f97316" }}>
            {getValue("temperature")}<span style={cardUnit}>°C</span>
          </p>
          <p style={{ fontSize: "10px", color: "#6b7a99", margin: "10px 0 0" }}>Last update · {lastUpdated}</p>
        </div>

        {/* Humidity */}
        <div style={card}>
          <div style={cardLabel}>💦 Humidity</div>
          <p style={{ ...cardValue, color: "#06d6a0" }}>
            {getValue("humidity")}<span style={cardUnit}>%</span>
          </p>
          <div style={progressBar}>
            <div style={{
              background: "#06d6a0",
              borderRadius: "4px",
              height: "5px",
              width: `${Math.min(parseFloat(getValue("humidity")) || 0, 100)}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <p style={{ fontSize: "10px", color: "#6b7a99", margin: "6px 0 0" }}>Last update · {lastUpdated}</p>
        </div>

      </div>

      {/* ===== ROW 2: REALTIME CHART — fills remaining height ===== */}
      <div style={{
        ...card,
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px", flexShrink: 0 }}>
          <span>☔</span>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#c8d3f0", margin: 0 }}>Rainfall Intensity — Realtime</p>
        </div>
        <p style={{ fontSize: "10px", color: "#6b7a99", margin: "0 0 10px", flexShrink: 0 }}>
          Last 20 readings · updates on every Firebase change
        </p>

        {/* Chart area fills remaining flex space */}
        <div style={{ flex: 1, minHeight: 0 }}>
          {chartData.length < 2 ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#475569", fontSize: "13px" }}>Collecting data... waiting for sensor updates</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#6b7a99", fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fill: "#6b7a99", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1e2a42",
                    border: "1px solid #2a3454",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#c8d3f0" }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", color: "#8898bb" }} />
                <Line type="monotone" dataKey="humidity"    stroke="#06d6a0" strokeWidth={2} dot={false} name="Humidity (%)" />
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} name="Temp (°C)" />
                <Line type="monotone" dataKey="rainPercent" stroke="#a78bfa" strokeWidth={2} dot={false} name="Rain (%)" />
                <Line type="monotone" dataKey="distance"   stroke="#38bdf8" strokeWidth={2} dot={false} name="Distance (cm)" />
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
          background: "rgba(0,0,0,0.7)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "#161c2d",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "1000px",
            maxHeight: "85vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #1e2a42",
          }}>

            {/* Modal Header */}
            <div style={{
              padding: "18px 24px",
              borderBottom: "1px solid #1e2a42",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: "#f0f4ff" }}>📊 Sensor History</h2>
                <p style={{ fontSize: "11px", color: "#6b7a99", margin: "6px 0 0" }}>
                  Filter by date or time range, then export to Excel
                </p>
              </div>
              <button
                onClick={() => { setShowHistory(false); setStartDate(""); setEndDate(""); setTimeFilter(""); }}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7a99" }}
              >
                ✕
              </button>
            </div>

            {/* Filter Bar */}
            <div style={{
              padding: "14px 24px",
              borderBottom: "1px solid #1e2a42",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              background: "#0f1117",
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
                      background: timeFilter === value ? "#1a6cf6" : "#161c2d",
                      color: timeFilter === value ? "white" : "#94a3b8",
                      border: `1px solid ${timeFilter === value ? "#1a6cf6" : "#1e2a42"}`,
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

              <span style={{ color: "#1e2a42" }}>|</span>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "#6b7a99" }}>From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => { setStartDate(e.target.value); setTimeFilter(""); }}
                  style={{
                    padding: "5px 10px", border: "1px solid #1e2a42",
                    borderRadius: "6px", fontSize: "11px",
                    background: "#161c2d", color: "white", outline: "none",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "#6b7a99" }}>To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => { setEndDate(e.target.value); setTimeFilter(""); }}
                  style={{
                    padding: "5px 10px", border: "1px solid #1e2a42",
                    borderRadius: "6px", fontSize: "11px",
                    background: "#161c2d", color: "white", outline: "none",
                  }}
                />
              </div>

              <button
                onClick={() => { setStartDate(""); setEndDate(""); setTimeFilter(""); }}
                style={{
                  padding: "5px 11px", background: "#161c2d",
                  border: "1px solid #1e2a42", borderRadius: "6px",
                  fontSize: "11px", cursor: "pointer", color: "#94a3b8",
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

            {/* Table — scrollable inside modal only */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {historyLoading ? (
                <p style={{ textAlign: "center", color: "#6b7a99", padding: "40px" }}>Loading history...</p>
              ) : history.length === 0 ? (
                <p style={{ textAlign: "center", color: "#475569", padding: "40px" }}>No records found.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead style={{ position: "sticky", top: 0 }}>
                    <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2a42" }}>
                      {["Date & Time", "Water (cm)", "Temp (°C)", "Humidity (%)", "Pressure (hPa)", "Rain (%)", "Rain Status"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#6b7a99", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, i) => (
                      <tr key={record.id} style={{ borderBottom: "1px solid #161c2d", background: i % 2 === 0 ? "#161c2d" : "#111827" }}>
                        <td style={{ padding: "9px 12px", color: "#94a3b8", whiteSpace: "nowrap" }}>
                          {record.timestamp ? new Date(record.timestamp).toLocaleString("en-MY") : "-"}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#38bdf8", fontWeight: 600 }}>{record.distance ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#f97316" }}>{record.temperature ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#06d6a0" }}>{record.humidity ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#a78bfa" }}>{record.pressure ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#94a3b8" }}>{record.rainPercent ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#f59e42" }}>{record.rainStatus ?? "-"}</td>
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
