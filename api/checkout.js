const CLIENT_ID     = process.env.WAYMB_CLIENT_ID;
const CLIENT_SECRET = process.env.WAYMB_CLIENT_SECRET;
const ACCOUNT_EMAIL = process.env.WAYMB_ACCOUNT_EMAIL;
const WAYMB_BASE    = "https://api.waymb.com";

// Email helper (Resend) — load lazy
const { sendOrderConfirmation } = require("./_email.js");
// Tracking (Track n' Fast) — DESATIVADO automático.
// Eliezer vai criar manualmente no painel quando expedir pelos CTT
// (poupa créditos e não cria rastreio pra pedidos não pagos).
// Pra reativar, descomentar e voltar a chamar createTrackingOrder().
// const { createTrackingOrder } = require("./_tracking.js");
// CALLBACK_URL auto-detectado pelo Vercel (VERCEL_URL = URL do deploy atual).
// Pra usar domínio custom como callback, definir env var CALLBACK_URL no Vercel dashboard.
const CALLBACK_URL  = process.env.CALLBACK_URL || `https://${process.env.VERCEL_URL}/api/webhook`;

// CORS — só permite origem do próprio site (anti-abuso cross-origin)
const ALLOWED_ORIGIN = process.env.CALLBACK_URL
  ? process.env.CALLBACK_URL.replace("/api/webhook", "")
  : `https://${process.env.VERCEL_URL}`;

// Rate limiting simples em memória (por IP, janela 1 min, máx 10 req)
const rateLimit = new Map();
function checkRate(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const maxReq = 10;
  const arr = (rateLimit.get(ip) || []).filter(t => now - t < windowMs);
  if (arr.length >= maxReq) return false;
  arr.push(now);
  rateLimit.set(ip, arr);
  return true;
}

module.exports = async (req, res) => {
  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit por IP (anti-spam/abuse)
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.headers["x-real-ip"] || "unknown";
  if (!checkRate(ip)) {
    return res.status(429).json({ error: "Demasiadas tentativas. Aguarda um momento." });
  }

  const { name, email, phone, document: doc, amount, method, product, shipping } = req.body || {};

  if (!name || !email || !phone || !amount || !method) {
    return res.status(400).json({ error: "Campos obrigatórios em falta." });
  }

  // Normaliza telefone — garante +351 na frente
  const rawPhone   = String(phone).replace(/[\s\-()]/g, "").replace(/^(00|\+)?351/, "");
  const fullPhone  = `+351${rawPhone}`;

  const payload = {
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
    account_email: ACCOUNT_EMAIL,
    amount:        Number(Number(amount).toFixed(2)),
    method:        method === "multibanco" ? "multibanco" : "mbway",
    currency:      "EUR",
    payer: {
      name,
      email,
      phone:    fullPhone,
      document: doc || "000000000"
    }
    // callbackUrl removido — WayMB estava a gerar erro porque o webhook não retornava 200.
    // Ativação manual: ver dashboard WayMB -> Transactions -> status "Paid"
    // Futuramente: configurar webhook acessível + adicionar CALLBACK_URL na env var
  };

  let rawText = "";
  try {
    const r = await fetch(`${WAYMB_BASE}/transactions/create`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload)
    });

    rawText = await r.text();
    // Log sanitizado — não expõe PII (email completo, telemóvel, morada)
    const maskedEmail = email ? email.replace(/(.{2}).*(@.*)/, "$1***$2") : "?";
    console.log("[WayMB create]", r.status, "email:", maskedEmail, "amount:", amount, "method:", method);

    let data = {};
    try { data = JSON.parse(rawText); } catch (_) {
      return res.status(502).json({ error: `Gateway: ${rawText.slice(0, 120)}` });
    }

    if (!r.ok || data.statusCode >= 400) {
      const msg = data?.message || data?.error || "Erro no gateway de pagamento.";
      return res.status(502).json({ error: msg });
    }

    // Resposta para o frontend
    const response = {
      id:     data.transactionID || data.id,
      status: "pending"
    };

    // Multibanco — devolve referência
    if (method === "multibanco" && data.referenceData) {
      response.referenceData = {
        entity:     data.referenceData.entity,
        reference:  data.referenceData.reference,
        expiration: data.referenceData.expiresAt || null
      };
    }

    // Envia email de confirmação (fire-and-forget — não bloqueia resposta)
    // BCC pra apoio@nanoslimoficial.com → Eliezer recebe cópia de cada venda
    // (com nome/email/morada/telemóvel completos), sem depender do WayMB.
    try {
      sendOrderConfirmation({
        email,
        name,
        phone: fullPhone,
        document: doc,
        productName: product?.name || `Nano Slim · ${amount} €`,
        amount,
        method,
        txId: response.id,
        mbEntity: response.referenceData?.entity || null,
        mbRef:    response.referenceData?.reference || null,
        // Endereço completo (importante pra expedição CTT)
        shipping: {
          address:    shipping?.address    || "",
          number:     shipping?.number     || "",
          complement: shipping?.complement || "",
          postal:     shipping?.postal     || "",
          city:       shipping?.city       || "",
          country:    "PT"
        }
      }).catch(err => console.error("[email send fail]", err.message));
    } catch (e) {
      console.error("[email integration]", e.message);
    }

    return res.status(200).json(response);

  } catch (err) {
    console.error("[WayMB crash]", err.message, "raw:", rawText.slice(0, 200));
    return res.status(500).json({ error: "Erro de ligação ao gateway. Tenta novamente." });
  }
};
