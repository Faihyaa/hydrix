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

// ── helpers ───────────────────────────────────────────────────────────────────
function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

// ── simulate burst rainfall (your improved logic kept) ────────────────────────
function genPt(prev: any) {
  const rainBurst = Math.random() < 0.35;

  const baseRain = prev?.rainfallIntensity ?? 0;
  const basePercent = prev?.rainPercent ?? 0;
  const baseWater = prev?.waterLevel ?? 21.52;

  const rainIntensity = rainBurst
    ? 60 + Math.random() * 40
    : Math.max(0, Math.min(100, baseRain + (Math.random() - 0.5) * 15));

  const rainPercent = rainBurst
    ? 50 + Math.random() * 50
    : Math.max(0, Math.min(100, basePercent + (Math.random() - 0.5) * 12));

  const waterLevel = rainBurst
    ? Math.min(300, baseWater + 5 + Math.random() * 12)
    : Math.max(0, Math.min(300, baseWater + (Math.random() - 0.5) * 0.8));

  return {
    time: fmtTime(new Date()),
    rainfallIntensity: rainIntensity,
    humidity: Math.max(0, Math.min(100, (prev?.humidity ?? 45) + (Math.random() - 0.5) * 5)),
    temperature: Math.max(20, Math.min(40, (prev?.temperature ?? 26) + (Math.random() - 0.5) * 1.5)),
    rainPercent,
    waterLevel,
  };
}

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
  const [lastUpdated, setLastUpdated] = useState("--");

  const level = getValue("level");
  const distance = getValue("distance");
  const rainPercent = parseFloat(getValue("rainPercent")) || 0;

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-MY", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  );

  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }));
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  // ── realtime firebase chart ────────────────────────────────────────────────
  useEffect(() => {
    const sensorRef = ref(database, "sensorData/latest");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) return;

      const time = fmtTime(new Date());

      const newPoint: ChartPoint = {
        time,
        humidity: parseFloat(val.humidity) || null,
        temperature: parseFloat(val.temperature) || null,
        rainPercent: parseFloat(val.rainPercent) || null,
        distance: parseFloat(val.distance) || null,
      };

      setChartData(prev => [...prev, newPoint].slice(-20));
    });

    return () => unsubscribe();
  }, []);

  // ── history fetch ───────────────────────────────────────────────────────────
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

        let isoTimestamp: string | null = null;
        if (data.timestamp) {
          const ts = Number(data.timestamp);
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

  // ── filter history ──────────────────────────────────────────────────────────
  useEffect(() => {
    setHistory(allHistory);
  }, [allHistory]);

  // ── export excel ────────────────────────────────────────────────────────────
  const exportToExcel = () => {
    const exportData = history.map(r => ({
      Date: r.timestamp ? new Date(r.timestamp).toLocaleDateString("en-MY") : "-",
      Time: r.timestamp ? new Date(r.timestamp).toLocaleTimeString("en-MY") : "-",
      "Water Level": r.distance ?? "-",
      Temperature: r.temperature ?? "-",
      Humidity: r.humidity ?? "-",
      Pressure: r.pressure ?? "-",
      Rain: r.rainPercent ?? "-",
      Status: r.rainStatus ?? "-"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "History");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });

    saveAs(blob, `HydriX_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Dashboard</h1>
        <button onClick={() => setShowHistory(true)}>History</button>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line dataKey="humidity" stroke="#06b6d4" />
          <Line dataKey="temperature" stroke="#f97316" />
          <Line dataKey="rainPercent" stroke="#fbbf24" />
          <Line dataKey="distance" stroke="#a78bfa" />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}