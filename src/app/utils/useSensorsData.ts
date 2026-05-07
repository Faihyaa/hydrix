import { useState, useEffect } from "react";

const SERVER_URL = "http://localhost:3000";

export interface SensorReading {
  value: string;
  ts: number;
}

export interface SensorData {
  distance?: SensorReading[];
  temperature?: SensorReading[];
  humidity?: SensorReading[];
  pressure?: SensorReading[];
  rainPercent?: SensorReading[];
  rainStatus?: SensorReading[];
  level?: SensorReading[];
}

export interface AlertItem {
  message: string;
  level: string;
  distance: number;
  rainStatus: string;
  time: string;
}

export function useSensorData() {
  const [data, setData] = useState<SensorData>({});
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/telemetry`);
        const result = await res.json();
        if (result.success) setData(result.data);

        const alertRes = await fetch(`${SERVER_URL}/api/alerts`);
        const alertData = await alertRes.json();
        setAlerts(alertData);

        setError(null);
      } catch (err) {
        setError("Gagal sambung ke server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getValue = (key: keyof SensorData): string => {
    return data[key]?.[0]?.value ?? "--";
  };

  return { data, alerts, loading, error, getValue };
};