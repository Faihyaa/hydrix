// src/pages/Dashboard.tsx

import { useSensorData } from "../utils/useSensorsData";

export default function Dashboard() {
  const { loading, error, getValue, alerts } = useSensorData();

  // Tentukan warna ikut tahap bahaya
  const level = getValue("level");
  const levelColor =
    level === "ALERT" ? "text-red-600" :
    level === "WARN"  ? "text-yellow-500" :
                        "text-green-600";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Memuatkan data sensor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">FlooDeT Dashboard</h1>

      {/* ===== GRID SENSOR CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Water Level</p>
          <p className="text-3xl font-bold text-blue-600">
            {getValue("distance")} cm
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Temperature</p>
          <p className="text-3xl font-bold text-orange-500">
            {getValue("temperature")} °C
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Humidity</p>
          <p className="text-3xl font-bold text-cyan-500">
            {getValue("humidity")} %
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Air Pressure</p>
          <p className="text-3xl font-bold text-purple-500">
            {getValue("pressure")} hPa
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Rainfall</p>
          <p className="text-3xl font-bold text-blue-400">
            {getValue("rainPercent")} %
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Rain Status</p>
          <p className="text-2xl font-bold text-blue-800">
            {getValue("rainStatus")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4 col-span-2">
          <p className="text-sm text-gray-500">Alert Level</p>
          <p className={`text-3xl font-bold ${levelColor}`}>{level}</p>
        </div>

      </div>

      {/* ===== ALERT LOG ===== */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Log Alert Terkini</h2>
        {alerts.length === 0 ? (
          <p className="text-gray-400 text-sm">Tiada alert buat masa ini.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.slice(0, 10).map((alert, i) => (
              <li key={i} className="flex justify-between text-sm border-b pb-1">
                <span className={
                  alert.level === "ALERT" ? "text-red-600 font-semibold" :
                  alert.level === "WARN"  ? "text-yellow-600 font-semibold" :
                  "text-green-600"
                }>
                  {alert.message}
                </span>
                <span className="text-gray-400">
                  {new Date(alert.time).toLocaleTimeString("ms-MY")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )};