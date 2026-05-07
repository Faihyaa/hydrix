let alerts = [];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "POST") {
    const data = req.body;
    const newAlert = {
      message: `Flood ${data.level || "ALERT"} detected!`,
      level: data.level,
      distance: data.distance,
      rainStatus: data.rainStatus,
      time: new Date().toISOString()
    };
    alerts.unshift(newAlert);
    if (alerts.length > 50) alerts = alerts.slice(0, 50);
    return res.status(200).json({ received: true });
  }

  if (req.method === "GET") {
    return res.status(200).json(alerts);
  }
}