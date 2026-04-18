module.exports = (req, res) => {
  const trackingCode = "WLC-" + Date.now();
  return res.status(200).json({
    tracking_code: trackingCode,
    tracking_url: "",
    order_id: req.body?.order_id || null
  });
};
