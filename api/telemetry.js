export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const TB_URL      = "http://70.153.136.4:8080";
  const TB_EMAIL    = process.env.TB_EMAIL;
  const TB_PASSWORD = process.env.TB_PASSWORD;
  const TB_DEVICE_ID = process.env.TB_DEVICE_ID;

  try {
    const loginRes = await fetch(`${TB_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: TB_EMAIL, password: TB_PASSWORD })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    if (!token) {
      return res.status(401).json({ success: false, error: "Login failed", loginData });
    }

    const keys = "distance,temperature,humidity,pressure,rainPercent,rainStatus,level";
    const telRes = await fetch(
      `${TB_URL}/api/plugins/telemetry/DEVICE/${TB_DEVICE_ID}/values/timeseries?keys=${keys}`,
      { headers: { "X-Authorization": `Bearer ${token}` } }
    );
    const telData = await telRes.json();

    res.status(200).json({ success: true, data: telData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}