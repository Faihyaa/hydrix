import { useState, useEffect } from "react";
import { database } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";

export interface SensorData {
  distance?: string | null;
  temperature?: string | null;
  humidity?: string | null;
  pressure?: string | null;
  rainPercent?: string | null;
  rainStatus?: string | null;
  level?: string | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sensorRef = ref(database, "sensorData/latest");

    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setData(val);
          setError(null);
        }
        setLoading(false);
      },
      (err) => {
        setError("Fail to connect to Firebase");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getValue = (key: keyof SensorData): string => {
    return data[key] ?? "--";
  };

  return { data, alerts: [] as AlertItem[], loading, error, getValue };
}