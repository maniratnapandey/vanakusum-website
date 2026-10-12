// POST /api/verify-payment  { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Confirms the payment really came from Razorpay before the site shows "order placed".
const { keys, verifySignature, HttpError, handler } = require("./_lib");

module.exports = handler(async (body) => {
  const { secret } = keys();
  const ok = verifySignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature, secret);
  if (!ok) throw new HttpError(400, "We couldn't verify this payment. If money was deducted, it will be refunded automatically — or contact us.");
  return { ok: true, paymentId: body.razorpay_payment_id, orderId: body.razorpay_order_id };
});
