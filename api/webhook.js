module.exports = (req, res) => {
  // WayMB exige 200 imediato
  res.status(200).json({ received: true });

  try {
    const { transactionId, id, status, amount, currency, payer } = req.body || {};
    console.log("[WayMB Webhook]", { transactionId: transactionId || id, status, amount, currency, payer });

    switch (status) {
      case "COMPLETED":
        console.log(`✅ Pagamento confirmado — ${transactionId || id} — €${amount}`);
        break;
      case "DECLINED":
        console.log(`❌ Pagamento recusado — ${transactionId || id}`);
        break;
      case "PENDING":
        console.log(`⏳ Pagamento pendente — ${transactionId || id}`);
        break;
      default:
        console.log(`[Webhook] Status desconhecido: ${status}`);
    }
  } catch (err) {
    console.error("[Webhook error]", err.message);
  }
};
