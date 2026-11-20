// POST /api/create-order  { items:[{id, w, qty}], customer:{name, phone, email, address, pin} }
// Prices the cart from products.js, creates a Razorpay order, and returns what Checkout needs.
const { priceCart, cleanCustomer, buildNotes, keys, HttpError, handler } = require("./_lib");

module.exports = handler(async (body) => {
  const priced = priceCart(body.items);
  const customer = cleanCustomer(body.customer);
  const { id, secret } = keys();

  const amount = priced.grandTotal * 100; // paise
  if (!Number.isInteger(amount) || amount < 100) throw new HttpError(400, "Order total must be at least ₹1.");

  const receipt = `VK-${Date.now().toString(36).toUpperCase()}`;
  const r = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt,
      notes: buildNotes(customer, priced),
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401) {
    console.error("Razorpay rejected the API keys — check RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET", data);
    throw new HttpError(401, "Online payment isn't available right now. Please try again later.");
  }
  if (!r.ok || !data.id) {
    console.error("Razorpay order failed", r.status, data);
    throw new HttpError(500, "Couldn't start the payment. Please try again in a minute.");
  }

  return {
    keyId: id, // public key only; the secret never leaves the server
    orderId: data.id,
    order_id: data.id,
    amount: data.amount,
    currency: data.currency || "INR",
    receipt,
    itemsTotal: priced.itemsTotal,
    shipping: priced.shipping,
    grandTotal: priced.grandTotal,
    customer: { name: customer.name, phone: customer.phone, email: customer.email },
  };
});
