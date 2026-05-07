export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const TB_URL = "http://70.153.136.4:8080";
  const TB_TOKEN = "kxKsQ1pTh9xzjc9Buyrb";

  try {
    const results = {};

    // Test endpoint 1 — attributes
    try {
      const r1 = await fetch(`${TB_URL}/api/v1/${TB_TOKEN}/attributes`);
      results.attributes = await r1.json();
    } catch (e) { results.attributes = e.message; }

    // Test endpoint 2 — telemetry
    try {
      const r2 = await fetch(`${TB_URL}/api/v1/${TB_TOKEN}/telemetry`);
      results.telemetry = await r2.json();
    } catch (e) { results.telemetry = e.message; }

    // Test endpoint 3 — attributes dengan keys
    try {
      const keys = "distance,temperature,humidity,pressure,rainPercent,rainStatus,level";
      const r3 = await fetch(`${TB_URL}/api/v1/${TB_TOKEN}/attributes?clientKeys=${keys}&sharedKeys=${keys}`);
      results.attributesWithKeys = await r3.json();
    } catch (e) { results.attributesWithKeys = e.message; }

    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}