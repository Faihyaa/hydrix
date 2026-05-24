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

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-MY", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  );

  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-MY", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  // ===== REALTIME SENSOR CHART =====
  useEffect(() => {
    const sensorRef = ref(database, "sensorData/latest");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) return;

      if (val.timestamp) {
        const d = new Date(Number(val.timestamp));
        setLastUpdated(d.toLocaleTimeString("en-MY"));
      }

      const newPoint: ChartPoint = {
        time: new Date().toLocaleTimeString("en-MY"),
        humidity: parseFloat(val.humidity) || null,
        temperature: parseFloat(val.temperature) || null,
        rainPercent: parseFloat(val.rainPercent) || null,
        distance: parseFloat(val.distance) || null,
      };

      setChartData(prev => [...prev, newPoint].slice(-20));
    });

    return () => unsubscribe();
  }, []);

  // ===== HISTORY FROM FIREBASE =====
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

        records.push({
          id: child.key || "",
          distance: data.distance ?? null,
          temperature: data.temperature ?? null,
          humidity: data.humidity ?? null,
          pressure: data.pressure ?? null,
          rainPercent: data.rainPercent ?? null,
          rainStatus: data.rainStatus ?? null,
          level: data.level ?? null,
          timestamp: data.timestamp ? new Date(Number(data.timestamp)).toISOString() : null,
        });
      });

      setAllHistory(records.reverse());
      setHistoryLoading(false);
    });

    return () => unsubscribe();
  }, [showHistory]);

  // ===== FILTER HISTORY =====
  useEffect(() => {
    let filtered = [...allHistory];

    if (timeFilter) {
      const hours = parseInt(timeFilter);
      const from = Date.now() - hours * 60 * 60 * 1000;

      filtered = filtered.filter(r =>
        r.timestamp ? new Date(r.timestamp).getTime() >= from : false
      );
    }

    setHistory(filtered);
  }, [allHistory, timeFilter]);

  // ===== EXPORT EXCEL =====
  const exportToExcel = () => {
    const exportData = history.map(r => ({
      Date: r.timestamp ? new Date(r.timestamp).toLocaleDateString("en-MY") : "-",
      Time: r.timestamp ? new Date(r.timestamp).toLocaleTimeString("en-MY") : "-",
      Water: r.distance ?? "-",
      Temp: r.temperature ?? "-",
      Humidity: r.humidity ?? "-",
      Pressure: r.pressure ?? "-",
      Rain: r.rainPercent ?? "-",
      Status: r.rainStatus ?? "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "History");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });

    saveAs(blob, `HydriX_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div style={{ padding: "24px", background: "#0f172a", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ color: "white" }}>FlooDeT Dashboard</h1>
        <div style={{ color: "#94a3b8" }}>
          {currentTime}
        </div>
      </div>

      {/* BASIC DATA */}
      <div style={{ color: "white", marginTop: 20 }}>
        <p>Level: {level}</p>
        <p>Distance: {distance}</p>
        <p>Rain: {rainPercent}%</p>
      </div>

      {/* CHART */}
      <div style={{ height: 300, marginTop: 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="humidity" stroke="#06b6d4" />
            <Line dataKey="temperature" stroke="#f97316" />
            <Line dataKey="rainPercent" stroke="#fbbf24" />
            <Line dataKey="distance" stroke="#a78bfa" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}