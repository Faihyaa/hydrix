export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const TB_URL = "http://70.153.136.4:8080";
  const TB_TOKEN = "kxKsQ1pTh9xzjc9Buyrb";

  try {
    const keys = "distance,temperature,humidity,pressure,rainPercent,rainStatus,level";
    const url = `${TB_URL}/api/v1/${TB_TOKEN}/attributes?clientKeys=${keys}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}