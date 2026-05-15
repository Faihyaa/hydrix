export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const TB_URL = "http://70.153.136.4:8080";
  const TB_USER = "tenant@thingsboard.org"; // tukar kalau berbeza
  const TB_PASS = "tenant";                  // tukar kalau berbeza

  try {
    // Step 1: Login untuk dapat JWT token
    const loginRes = await fetch(`${TB_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: TB_USER, password: TB_PASS })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    if (!token) {
      return res.status(401).json({ success: false, error: "Login failed", loginData });
    }

    // Step 2: Ambil senarai devices
    const devicesRes = await fetch(`${TB_URL}/api/tenant/devices?pageSize=10&page=0`, {
      headers: { "X-Authorization": `Bearer ${token}` }
    });
    const devicesData = await devicesRes.json();
    const deviceId = devicesData.data?.[0]?.id?.id;

    if (!deviceId) {
      return res.status(404).json({ success: false, error: "No device found", devicesData });
    }

    // Step 3: Ambil telemetry terkini
    const keys = "distance,temperature,humidity,pressure,rainPercent,rainStatus,level";
    const telRes = await fetch(
      `${TB_URL}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${keys}`,
      { headers: { "X-Authorization": `Bearer ${token}` } }
    );
    const telData = await telRes.json();

    res.status(200).json({ success: true, data: telData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}