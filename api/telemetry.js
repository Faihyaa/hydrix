export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const TB_URL = "http://70.153.136.4:8080";
  const TB_TOKEN = "kxKsQ1pTh9xzjc9Buyrb";

  try {
    // Cuba guna telemetry endpoint
    const keys = "distance,temperature,humidity,pressure,rainPercent,rainStatus,level";
    const url = `${TB_URL}/api/v1/${TB_TOKEN}/telemetry?keys=${keys}`;
    const response = await fetch(url);
    const text = await response.text();
    
    // Log untuk debug
    console.log("ThingsBoard response:", text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    
    res.status(200).json({ success: true, data, raw: text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}