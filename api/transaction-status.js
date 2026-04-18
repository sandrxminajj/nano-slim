const WAYMB_BASE = "https://api.waymb.com";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { transaction_id } = req.body || {};
  if (!transaction_id) {
    return res.status(400).json({ error: "transaction_id obrigatório." });
  }

  try {
    const r = await fetch(`${WAYMB_BASE}/transactions/info`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: transaction_id })
    });

    const rawText = await r.text();
    console.log("[WayMB status]", r.status, rawText.slice(0, 200));

    let data = {};
    try { data = JSON.parse(rawText); } catch (_) {}

    if (!r.ok) return res.status(200).json({ status: "PENDING" });

    // WayMB statuses: PENDING | COMPLETED | DECLINED
    const st = (data.status || "PENDING").toUpperCase();
    return res.status(200).json({ status: st });

  } catch (err) {
    console.error("[WayMB status crash]", err.message);
    return res.status(200).json({ status: "PENDING" });
  }
};
