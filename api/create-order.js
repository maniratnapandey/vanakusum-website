// POST /api/create-order  { items:[{id, w, qty}], customer:{name, phone, email, address, pin} }
// Prices the cart from products.js, creates a Razorpay order, and returns what Checkout needs.
const { priceCart, cleanCustomer, buildNotes, keys, HttpError, handler } = require("./_lib");

module.exports = handler(async (body) => {
  const priced = priceCart(body.items);
  const customer = cleanCustomer(body.customer);
  const { id, secret } = keys();

  const receipt = `VK-${Date.now().toString(36).toUpperCase()}`;
  const r = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    },
    body: JSON.stringify({
      amount: priced.grandTotal * 100, // paise
      currency: "INR",
      receipt,
      notes: buildNotes(customer, priced),
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.error("Razorpay order failed", r.status, data);
    throw new HttpError(502, "Couldn't start the payment. Please try again in a minute.");
  }

  return {
    keyId: id,
    orderId: data.id,
    amount: data.amount,
    receipt,
    itemsTotal: priced.itemsTotal,
    shipping: priced.shipping,
    grandTotal: priced.grandTotal,
    customer: { name: customer.name, phone: customer.phone, email: customer.email },
  };
});
