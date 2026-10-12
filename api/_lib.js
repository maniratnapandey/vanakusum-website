// Shared helpers for the payment functions. Files starting with "_" are not exposed as routes by Vercel.
const crypto = require("crypto");
const CATALOG = require("../products.js");

const MAX_QTY = 40;

// Rebuild the order from the catalog. Never trust prices sent by the browser.
function priceCart(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    throw new HttpError(400, "Your cart is empty.");
  }
  const lines = items.map((it) => {
    const p = CATALOG.products.find((x) => x.id === it.id);
    const s = p && p.sizes.find((x) => x.w === it.w);
    const qty = Number(it.qty);
    if (!p || !s) throw new HttpError(400, "One of the items is no longer available. Please refresh the page.");
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new HttpError(400, "Invalid quantity.");
    return { id: p.id, name: p.name, w: s.w, price: s.price, qty, total: s.price * qty };
  });
  const itemsTotal = lines.reduce((t, l) => t + l.total, 0);
  const shipping = shippingFor(itemsTotal);
  return { lines, itemsTotal, shipping, grandTotal: itemsTotal + shipping };
}

function shippingFor(itemsTotal) {
  const { flat, freeAbove } = CATALOG.shipping;
  return itemsTotal >= freeAbove ? 0 : flat;
}

function cleanCustomer(c = {}) {
  const s = (v, n) => String(v || "").replace(/\s+/g, " ").trim().slice(0, n);
  const out = {
    name: s(c.name, 80),
    phone: String(c.phone || "").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, ""),
    email: s(c.email, 120),
    address: s(c.address, 250),
    pin: String(c.pin || "").replace(/\D/g, ""),
  };
  if (out.name.length < 2) throw new HttpError(400, "Please enter your name.");
  if (!/^[6-9]\d{9}$/.test(out.phone)) throw new HttpError(400, "Please enter a valid 10-digit mobile number.");
  if (out.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(out.email)) throw new HttpError(400, "Please check your email address.");
  if (out.address.length < 10) throw new HttpError(400, "Please enter your full delivery address.");
  if (!/^[1-9]\d{5}$/.test(out.pin)) throw new HttpError(400, "Please enter a valid 6-digit PIN code.");
  return out;
}

// Razorpay allows 15 notes, 256 characters each. Item lines are split across items_1..items_4.
function buildNotes(customer, priced) {
  const itemText = priced.lines.map((l) => `${l.qty}x ${l.name} ${l.w} (Rs ${l.total})`);
  const chunks = [];
  let cur = "";
  for (const t of itemText) {
    const next = cur ? `${cur}; ${t}` : t;
    if (next.length > 250) { chunks.push(cur); cur = t; } else cur = next;
  }
  if (cur) chunks.push(cur);
  const notes = {
    name: customer.name,
    phone: customer.phone,
    email: customer.email || "-",
    address: customer.address,
    pin: customer.pin,
    items_total: `Rs ${priced.itemsTotal}`,
    shipping: `Rs ${priced.shipping}`,
  };
  chunks.slice(0, 4).forEach((c, i) => (notes[`items_${i + 1}`] = c));
  return notes;
}

function keys() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new HttpError(503, "Online payment isn't set up yet. Please try again later.");
  return { id, secret };
}

function verifySignature(orderId, paymentId, signature, secret) {
  if (!orderId || !paymentId || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function handler(fn) {
  return async (req, res) => {
    if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      res.status(200).json(await fn(body));
    } catch (e) {
      const status = e.status || 500;
      if (status >= 500) console.error(e);
      res.status(status).json({ error: status >= 500 && !e.status ? "Something went wrong. Please try again." : e.message });
    }
  };
}

module.exports = { priceCart, cleanCustomer, buildNotes, keys, verifySignature, HttpError, handler, CATALOG };
