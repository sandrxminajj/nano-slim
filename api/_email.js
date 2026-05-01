// ===================================================================
// Helper de envio de emails transacionais via Resend
// Não é endpoint público (prefixo _ ignorado pelo Vercel routing)
// Para EDITAR TEXTOS dos emails: ver api/_email-config.js
// ===================================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Nano Slim <onboarding@resend.dev>";
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || "apoio@nanoslimoficial.com";

const CONFIG = require("./_email-config.js");

// Lazy-load Resend só quando precisar (evita crash se key não estiver setada)
let resendInstance = null;
function getResend() {
  if (resendInstance) return resendInstance;
  if (!RESEND_API_KEY) return null;
  try {
    const { Resend } = require("resend");
    resendInstance = new Resend(RESEND_API_KEY);
    return resendInstance;
  } catch (e) {
    console.error("[email] Resend SDK não carregou:", e.message);
    return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────
function fmtEUR(n) {
  return Number(n || 0).toFixed(2).replace(".", ",") + " €";
}

function escape(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Substitui {{var}} → valor (recursivo, lê do contexto data)
function tpl(text, data) {
  if (typeof text !== "string") return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    data[key] !== undefined && data[key] !== null ? String(data[key]) : ""
  );
}

// ─── Template do email de confirmação ────────────────────────────
function orderConfirmationHtml(data) {
  const { name, productName, amount, method, txId, mbEntity, mbRef, trackingCode, phone, document, shipping } = data;
  const cfg = CONFIG.orderConfirmation;
  const c = CONFIG.brand.color;

  // Monta linha de morada combinada
  const addr = shipping || {};
  const addressLine = [
    [addr.address, addr.number].filter(Boolean).join(", "),
    addr.complement || "",
    [addr.postal, addr.city].filter(Boolean).join(" "),
    addr.country || ""
  ].filter(Boolean).join(" · ");

  const firstName = (name || "").split(" ")[0] || "Cliente";
  const methodLabel = method === "multibanco" ? "Multibanco" : "MB Way";
  const txShort = String(txId || "").slice(0, 8).toUpperCase();

  // Contexto pra preencher {{vars}} no config
  const ctx = {
    firstName: escape(firstName),
    name: escape(name || ""),
    productName: escape(productName || ""),
    amount: fmtEUR(amount),
    method,
    methodLabel,
    txId: escape(txId || ""),
    txShort,
    year: new Date().getFullYear(),
    brandName: CONFIG.brand.name,
    supportEmail: CONFIG.brand.supportEmail,
    refundEmail: CONFIG.brand.refundEmail,
    siteUrl: CONFIG.brand.siteUrl
  };

  // Bloco de pagamento (Multibanco vs MB Way)
  let paymentBox = "";
  if (method === "multibanco" && mbEntity && mbRef) {
    paymentBox = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;">
      <tr><td style="background:linear-gradient(135deg,#FEF3C7 0%,#FDE68A 100%);border:2px solid ${c.warn};border-radius:14px;padding:22px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td style="padding-bottom:8px;">
            <span style="display:inline-block;background:${c.warn};color:#fff;font-size:11px;font-weight:800;letter-spacing:.6px;padding:4px 10px;border-radius:999px;text-transform:uppercase;">⏰ Pagamento pendente</span>
          </td></tr>
          <tr><td>
            <h3 style="margin:6px 0 8px;font-size:18px;font-weight:900;color:${c.warnDark};line-height:1.25;">${escape(tpl(cfg.multibancoBox.title, ctx))}</h3>
            <p style="margin:0 0 16px;font-size:14px;color:${c.warnDark};line-height:1.55;">${tpl(cfg.multibancoBox.body, ctx)}</p>
          </td></tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fff;border-radius:10px;padding:14px 16px;">
          <tr><td style="padding:6px 0;font-size:13px;color:${c.warnDark};font-weight:600;">Entidade</td><td style="padding:6px 0;text-align:right;font-size:20px;font-weight:900;color:${c.text};letter-spacing:1.5px;font-family:'SF Mono',Monaco,Menlo,Consolas,monospace;">${escape(mbEntity)}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:${c.warnDark};font-weight:600;border-top:1px dashed #E5D5A6;">Referência</td><td style="padding:6px 0;text-align:right;font-size:20px;font-weight:900;color:${c.text};letter-spacing:1.5px;font-family:'SF Mono',Monaco,Menlo,Consolas,monospace;border-top:1px dashed #E5D5A6;">${escape(mbRef)}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:${c.warnDark};font-weight:600;border-top:1px dashed #E5D5A6;">Valor</td><td style="padding:6px 0;text-align:right;font-size:22px;font-weight:900;color:${c.accentDark};border-top:1px dashed #E5D5A6;">${escape(fmtEUR(amount))}</td></tr>
        </table>
        <p style="margin:14px 0 0;font-size:12px;color:${c.warnDark};font-style:italic;">${escape(tpl(cfg.multibancoBox.validityNote, ctx))}</p>
      </td></tr>
    </table>`;
  } else {
    paymentBox = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;">
      <tr><td style="background:linear-gradient(135deg,#DCFCE7 0%,#BBF7D0 100%);border:2px solid ${c.accent};border-radius:14px;padding:22px;text-align:center;">
        <div style="font-size:44px;line-height:1;margin-bottom:8px;">📱</div>
        <h3 style="margin:0 0 8px;font-size:18px;font-weight:900;color:${c.accentDark};line-height:1.25;">${escape(tpl(cfg.mbwayBox.title, ctx))}</h3>
        <p style="margin:0;font-size:14px;color:#166534;line-height:1.55;">${tpl(cfg.mbwayBox.body, ctx)}</p>
      </td></tr>
    </table>`;
  }

  // Bloco de tracking (só aparece se trackingCode existir)
  let trackingBlock = "";
  if (trackingCode && cfg.trackingBox) {
    const tb = cfg.trackingBox;
    trackingBlock = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;">
      <tr><td style="background:linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%);border:1.5px solid ${c.primary};border-radius:14px;padding:22px;text-align:center;">
        <div style="font-size:34px;line-height:1;margin-bottom:8px;">📦</div>
        <h3 style="margin:0 0 8px;font-size:17px;font-weight:900;color:${c.primaryDark};line-height:1.25;">${escape(tpl(tb.title, ctx))}</h3>
        <p style="margin:0 0 14px;font-size:13.5px;color:#1E3A8A;line-height:1.55;">${escape(tpl(tb.body, ctx))}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 14px;">
          <tr><td style="background:#fff;border:2px dashed ${c.primary};border-radius:10px;padding:14px 24px;font-family:'SF Mono',Monaco,Menlo,Consolas,monospace;font-size:20px;font-weight:900;color:${c.primaryDark};letter-spacing:2px;">${escape(trackingCode)}</td></tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
          <tr><td style="background:${c.primary};border-radius:10px;padding:0;">
            <a href="${escape(tb.trackingPageUrl)}" target="_blank" style="display:inline-block;padding:11px 24px;color:#fff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:.3px;">${escape(tb.buttonLabel)} →</a>
          </td></tr>
        </table>
      </td></tr>
    </table>`;
  }

  // Próximos passos (lista numerada com bolinhas verdes)
  const stepsList = cfg.nextSteps.map((step, i) => `
    <tr><td style="padding:10px 0;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:top;width:32px;padding-right:12px;">
            <div style="width:28px;height:28px;background:${c.accent};color:#fff;border-radius:50%;text-align:center;font-size:14px;font-weight:900;line-height:28px;">${i + 1}</div>
          </td>
          <td style="vertical-align:top;font-size:14.5px;color:${c.text};line-height:1.6;font-weight:500;">${tpl(step, ctx)}</td>
        </tr>
      </table>
    </td></tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<title>${escape(tpl(cfg.subject, ctx))}</title>
</head>
<body style="margin:0;padding:0;background:${c.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${c.text};-webkit-font-smoothing:antialiased;">

<!-- Preheader (preview na inbox) -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:transparent;">${escape(tpl(cfg.preheader, ctx))}</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${c.bg};padding:32px 16px;">
  <tr><td align="center">

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 6px 20px rgba(15,31,46,.06);">

      <!-- HEADER · gradient azul com logo -->
      <tr><td style="background:linear-gradient(135deg,${c.primary} 0%,${c.primaryDark} 100%);padding:36px 28px;text-align:center;">
        <h1 style="margin:0;font-size:30px;font-weight:900;color:#fff;letter-spacing:-.7px;line-height:1;">${escape(CONFIG.brand.name)}</h1>
        <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,.85);font-weight:600;letter-spacing:.4px;">${escape(CONFIG.brand.tagline)}</p>
      </td></tr>

      <!-- ✓ checkmark grande de sucesso -->
      <tr><td style="padding:32px 28px 0;text-align:center;">
        <div style="display:inline-block;width:72px;height:72px;background:linear-gradient(135deg,${c.accent} 0%,${c.accentDark} 100%);border-radius:50%;line-height:72px;font-size:36px;color:#fff;font-weight:900;margin-bottom:16px;box-shadow:0 8px 24px rgba(34,197,94,.35);">✓</div>
      </td></tr>

      <!-- Saudação + headline -->
      <tr><td style="padding:0 28px 6px;text-align:center;">
        <p style="margin:0 0 6px;font-size:15px;color:${c.textSoft};font-weight:500;">${escape(tpl(cfg.greeting, ctx))}</p>
        <h2 style="margin:0;font-size:26px;font-weight:900;color:${c.text};line-height:1.2;letter-spacing:-.3px;">${escape(tpl(cfg.headline, ctx))}</h2>
      </td></tr>

      <tr><td style="padding:14px 28px 24px;text-align:center;">
        <p style="margin:0;font-size:15px;color:${c.textSoft};line-height:1.6;max-width:480px;margin-left:auto;margin-right:auto;">${escape(tpl(cfg.subheadline, ctx))}</p>
      </td></tr>

      <!-- Resumo da encomenda -->
      <tr><td style="padding:0 28px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:20px;">
          <tr><td colspan="2" style="padding-bottom:14px;border-bottom:1px solid #E2E8F0;">
            <p style="margin:0;font-size:11px;font-weight:800;color:${c.textSoft};letter-spacing:.8px;text-transform:uppercase;">📦 Resumo da encomenda</p>
          </td></tr>
          <tr><td style="padding:14px 0 8px;font-size:14px;color:${c.textSoft};font-weight:500;">Produto</td><td style="padding:14px 0 8px;text-align:right;font-size:14px;font-weight:700;color:${c.text};">${escape(productName)}</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:${c.textSoft};font-weight:500;border-top:1px dashed #CBD5E1;">Pagamento</td><td style="padding:8px 0;text-align:right;font-size:14px;font-weight:700;color:${c.text};border-top:1px dashed #CBD5E1;">${methodLabel}</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:${c.textSoft};font-weight:500;border-top:1px dashed #CBD5E1;">Nº Pedido</td><td style="padding:8px 0;text-align:right;font-size:11px;font-family:'SF Mono',Monaco,Menlo,Consolas,monospace;color:${c.textSoft};border-top:1px dashed #CBD5E1;word-break:break-all;">${escape(txId || "—")}</td></tr>
          <tr><td style="padding:14px 0 4px;font-size:15px;color:${c.text};font-weight:800;border-top:2px solid #CBD5E1;">Total</td><td style="padding:14px 0 4px;text-align:right;font-size:24px;font-weight:900;color:${c.accentDark};border-top:2px solid #CBD5E1;">${escape(fmtEUR(amount))}</td></tr>
        </table>
      </td></tr>

      <!-- Dados de entrega -->
      <tr><td style="padding:0 28px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:18px 20px;">
          <tr><td colspan="2" style="padding-bottom:12px;border-bottom:1px solid #E2E8F0;">
            <p style="margin:0;font-size:11px;font-weight:800;color:${c.textSoft};letter-spacing:.8px;text-transform:uppercase;">📍 Dados de entrega</p>
          </td></tr>
          <tr><td style="padding:12px 0 6px;font-size:13px;color:${c.textSoft};font-weight:500;width:90px;">Nome</td><td style="padding:12px 0 6px;font-size:13px;font-weight:600;color:${c.text};">${escape(name || "—")}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:${c.textSoft};font-weight:500;border-top:1px dashed #CBD5E1;">Email</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:${c.text};border-top:1px dashed #CBD5E1;word-break:break-all;">${escape(data.email || "—")}</td></tr>
          ${phone ? `<tr><td style="padding:6px 0;font-size:13px;color:${c.textSoft};font-weight:500;border-top:1px dashed #CBD5E1;">Telemóvel</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:${c.text};border-top:1px dashed #CBD5E1;">${escape(phone)}</td></tr>` : ""}
          ${document ? `<tr><td style="padding:6px 0;font-size:13px;color:${c.textSoft};font-weight:500;border-top:1px dashed #CBD5E1;">NIF</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:${c.text};border-top:1px dashed #CBD5E1;">${escape(document)}</td></tr>` : ""}
          ${addressLine ? `<tr><td style="padding:6px 0;font-size:13px;color:${c.textSoft};font-weight:500;border-top:1px dashed #CBD5E1;vertical-align:top;">Morada</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:${c.text};border-top:1px dashed #CBD5E1;line-height:1.5;">${escape(addressLine)}</td></tr>` : ""}
        </table>
      </td></tr>

      <!-- Caixa de pagamento (MB Way ou Multibanco) -->
      <tr><td style="padding:0 28px;">${paymentBox}</td></tr>

      <!-- Bloco de tracking (só aparece se houver código) -->
      ${trackingBlock ? `<tr><td style="padding:0 28px;">${trackingBlock}</td></tr>` : ""}

      <!-- Próximos passos -->
      <tr><td style="padding:8px 28px 24px;">
        <p style="margin:0 0 14px;font-size:11px;font-weight:800;color:${c.textSoft};letter-spacing:.8px;text-transform:uppercase;">🚀 Próximos passos</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${stepsList}
        </table>
      </td></tr>


      <!-- Suporte -->
      <tr><td style="padding:0 28px 32px;text-align:center;">
        <p style="margin:0 0 6px;font-size:14px;color:${c.text};font-weight:700;">${escape(tpl(cfg.support.label, ctx))}</p>
        <p style="margin:0;font-size:13px;color:${c.textSoft};line-height:1.55;">${tpl(cfg.support.body, ctx)}</p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:${c.footer};padding:24px 28px;text-align:center;">
        <p style="margin:0 0 8px;font-size:14px;color:#E2E8F0;font-weight:700;">${escape(tpl(cfg.footer.brandLine, ctx))}</p>
        <p style="margin:0 0 12px;font-size:11px;color:#94A3B8;line-height:1.5;font-style:italic;">${escape(tpl(cfg.footer.legalLine, ctx))}</p>
        <p style="margin:0;font-size:11px;color:#64748B;">${escape(tpl(cfg.footer.copyright, ctx))}</p>
      </td></tr>

    </table>

  </td></tr>
</table>

</body>
</html>`;
}

// Versão texto plano (deliverability — Gmail/Outlook gostam de ter ambos)
function orderConfirmationText(data) {
  const { name, productName, amount, method, txId, mbEntity, mbRef, trackingCode, phone, document, shipping } = data;
  const cfg = CONFIG.orderConfirmation;
  const firstName = (name || "").split(" ")[0] || "Cliente";
  const methodLabel = method === "multibanco" ? "Multibanco" : "MB Way";

  // Linha de morada
  const addr = shipping || {};
  const addressLine = [
    [addr.address, addr.number].filter(Boolean).join(", "),
    addr.complement || "",
    [addr.postal, addr.city].filter(Boolean).join(" "),
    addr.country || ""
  ].filter(Boolean).join(" · ");

  // Dados de entrega
  const deliveryBlock = `
DADOS DE ENTREGA
Nome:       ${name || "—"}
Email:      ${data.email || "—"}
${phone ? `Telemóvel:  ${phone}\n` : ""}${document ? `NIF:        ${document}\n` : ""}${addressLine ? `Morada:     ${addressLine}\n` : ""}`;

  let mb = "";
  if (method === "multibanco" && mbEntity && mbRef) {
    mb = `\n${cfg.multibancoBox.title.toUpperCase()}\n${cfg.multibancoBox.body}\n\nEntidade:    ${mbEntity}\nReferência:  ${mbRef}\nValor:       ${fmtEUR(amount)}\n\n${cfg.multibancoBox.validityNote}\n`;
  } else {
    mb = `\n${cfg.mbwayBox.title.toUpperCase()}\n${cfg.mbwayBox.body}\n`;
  }

  let tracking = "";
  if (trackingCode && cfg.trackingBox) {
    tracking = `\n${cfg.trackingBox.title.toUpperCase()}\n${cfg.trackingBox.body}\n\nCódigo de rastreio: ${trackingCode}\nAcompanhar: ${cfg.trackingBox.trackingPageUrl}\n`;
  }

  const steps = cfg.nextSteps
    .map((s, i) => `${i + 1}. ${s.replace(/<[^>]*>/g, "").replace(/\{\{methodLabel\}\}/g, methodLabel)}`)
    .join("\n");

  return `${cfg.greeting.replace("{{firstName}}", firstName)}

${cfg.headline}

${cfg.subheadline}

═══════════════════════════════════
RESUMO DA ENCOMENDA
═══════════════════════════════════
Produto:    ${productName}
Pagamento:  ${methodLabel}
Nº Pedido:  ${txId || "—"}
Total:      ${fmtEUR(amount)}
═══════════════════════════════════
${deliveryBlock}═══════════════════════════════════
${mb}${tracking}
PRÓXIMOS PASSOS:
${steps}

${cfg.support.label}
${cfg.support.body.replace(/<[^>]*>/g, "").replace(/\{\{supportEmail\}\}/g, CONFIG.brand.supportEmail)}

—
${CONFIG.brand.name} · Portugal
${cfg.footer.legalLine}
© ${new Date().getFullYear()} ${CONFIG.brand.name}
`;
}

// ─── Envio ───────────────────────────────────────────────────────
async function sendOrderConfirmation(data) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY não configurada — email não enviado");
    return { ok: false, reason: "no_api_key" };
  }
  if (!data.email) {
    console.warn("[email] sem email do cliente — pulando envio");
    return { ok: false, reason: "no_recipient" };
  }

  const cfg = CONFIG.orderConfirmation;
  const txShort = String(data.txId || "").slice(0, 8).toUpperCase();
  const ctx = { txShort };

  // BCC: cópia interna pra Eliezer ter histórico completo de cada venda na inbox
  // (evita depender do WayMB dashboard, que mostra dados errados)
  const BCC = process.env.EMAIL_BCC || EMAIL_REPLY_TO;

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      bcc: BCC,
      replyTo: EMAIL_REPLY_TO,
      subject: tpl(cfg.subject, ctx),
      html: orderConfirmationHtml(data),
      text: orderConfirmationText(data),
      headers: {
        "X-Entity-Ref-ID": data.txId || "unknown"
      },
      tags: [
        { name: "type", value: "order_confirmation" },
        { name: "method", value: data.method || "unknown" }
      ]
    });

    const maskedEmail = data.email.replace(/(.{2}).*(@.*)/, "$1***$2");
    console.log("[email] enviado · to:", maskedEmail, "· id:", result?.data?.id || "?");
    return { ok: true, id: result?.data?.id };
  } catch (err) {
    console.error("[email] erro ao enviar:", err.message);
    return { ok: false, reason: err.message };
  }
}

module.exports = { sendOrderConfirmation };
