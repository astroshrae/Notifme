// api/send.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  try {
    const body = req.body || {};
    // Build OneSignal payload
    const payload = {
      app_id: "cee819a2-2372-4c54-915a-d3268fcd94c8",
      headings: body.headings || { en: "Notification" },
      contents: body.contents || { en: "Message" },
      included_segments: ["All"],
      url: body.url || "https://notifme.netlify.app"
    };

    if (body.chrome_web_icon) payload.chrome_web_icon = body.chrome_web_icon;
    if (body.big_picture) payload.big_picture = body.big_picture;

    const resp = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // REST API key kept on server
        "Authorization": "Basic os_v2_app_z3ubtirdojgfjek22mti7tmuzbdfa7x3b2tul7fkph73apurtytbmmwd4tqlln2htx7jh2y3pvgbkkqkv2hc3g3e34kopbqnpxe6qua"
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    // forward OneSignal response
    res.status(resp.ok ? 200 : 500).json(data);
  } catch (err) {
    console.error('Error in /api/send', err);
    res.status(500).json({ error: err.message });
  }
}
