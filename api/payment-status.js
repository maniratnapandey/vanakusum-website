// GET /api/payment-status  — TEMPORARY diagnostic. Shows which Razorpay key the site is using
// and whether Razorpay accepts it. Never returns the secret, only its length.
module.exports = async (req, res) => {
  const id = (process.env.RAZORPAY_KEY_ID || "").trim();
  const secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
  const out = {
    keyId: id || "(missing)",
    keyIdLength: id.length,
    secretLength: secret.length,
    secretSet: !!secret,
    deployment: (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || "unknown",
  };
  if (id && secret) {
    try {
      const r = await fetch("https://api.razorpay.com/v1/orders?count=1", {
        headers: { Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64") },
      });
      const data = await r.json().catch(() => ({}));
      out.razorpayStatus = r.status;
      out.razorpaySays = r.ok ? "Keys accepted ✓" : (data.error && data.error.description) || "Rejected";
    } catch (e) {
      out.razorpaySays = "Couldn't reach Razorpay: " + e.message;
    }
  }
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(out);
};
