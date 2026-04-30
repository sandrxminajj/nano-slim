// ===================================================================
// Track n' Fast (fastntrack.lovable.app) — integração API
// Cria rastreio automático no momento do checkout
// Documentação: docs do fastntrack
// ===================================================================

const TRACKING_STORE_ID = process.env.TRACKING_STORE_ID;
const TRACKING_API_KEY = process.env.TRACKING_API_KEY;
const TRACKING_ENDPOINT = process.env.TRACKING_ENDPOINT
  || "https://oqlxylestvtfmvxbrlfm.supabase.co/functions/v1/api-tracking";

// Cria rastreio no Track n' Fast quando pedido é criado.
// Retorna tracking_code (ex: "FRKT-XXXX-YYYY") que vai pro email do cliente.
//
// Format esperado pela API (docs Track n' Fast):
// Headers: x-api-key, x-store-id, Content-Type
// Body: { order_id, customer_name, customer_email, products[], shipping_address }
async function createTrackingOrder(data) {
  if (!TRACKING_STORE_ID || !TRACKING_API_KEY) {
    console.warn("[tracking] env vars não configuradas — skip");
    return { ok: false, reason: "no_credentials" };
  }
  if (!data.txId || !data.name) {
    console.warn("[tracking] order_id ou customer_name em falta — skip");
    return { ok: false, reason: "missing_required" };
  }

  // Payload no formato esperado pela API Track n' Fast
  const payload = {
    order_id:       String(data.txId),
    customer_name:  String(data.name),
    customer_email: data.email || undefined,
    products: [{
      title:    data.productName || "Nano Slim",
      quantity: data.quantity || 1,
      price:    String(Number(data.amount || 0).toFixed(2))
    }],
    shipping_address: {
      address1: data.address || "",
      city:     data.city || "",
      province: data.province || data.city || "",   // Track n' Fast espera "province" (estado/distrito)
      country:  "PT",
      zip:      data.postal || ""
    }
  };

  try {
    // Timeout 6s — não trava o checkout se a API estiver lenta
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const r = await fetch(TRACKING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key":    TRACKING_API_KEY,
        "x-store-id":   TRACKING_STORE_ID
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const text = await r.text();
    let response = {};
    try { response = JSON.parse(text); } catch (_) { response = { raw: text }; }

    if (!r.ok) {
      console.error("[tracking] HTTP", r.status, "·", text.slice(0, 200));
      return { ok: false, status: r.status, error: text.slice(0, 200) };
    }

    const trackingCode = response.tracking_code || response.code || null;
    console.log("[tracking] criado · order:", data.txId, "· code:", trackingCode || "(no code)");

    return { ok: true, trackingCode, data: response };
  } catch (err) {
    if (err.name === "AbortError") {
      console.warn("[tracking] timeout 6s · order:", data.txId);
      return { ok: false, reason: "timeout" };
    }
    console.error("[tracking] erro:", err.message);
    return { ok: false, reason: err.message };
  }
}

module.exports = { createTrackingOrder };
