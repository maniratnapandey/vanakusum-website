# Vana Kusum website

Static site on Vercel with Razorpay checkout.

| File | What it is |
|---|---|
| `products.js` | Products, sizes, prices (₹, incl. GST) and the shipping rule. **Edit prices here only.** |
| `index.html` | The page: design and copy. |
| `api/create-order.js` | Prices the cart from `products.js` and creates a Razorpay order. |
| `api/verify-payment.js` | Checks Razorpay's signature before showing "Order placed". |

## One-time Razorpay setup

1. In the Razorpay Dashboard, go to **Account & Settings → API Keys** and generate a key pair (start with **Test mode**).
2. In Vercel, open the project, go to **Settings → Environment Variables**, and add:
   - `RAZORPAY_KEY_ID`, e.g. `rzp_test_…`
   - `RAZORPAY_KEY_SECRET`
3. Redeploy (Deployments → ⋯ → Redeploy).
4. In Razorpay, check **Payment Capture** is set to **Automatic**.
5. Place a test order with Razorpay's test UPI ID `success@razorpay`, then check it appears in the Razorpay Dashboard under **Orders**.
6. When KYC is approved, swap both variables for the **Live** keys and redeploy.

## Where orders show up

Each paid order is in the Razorpay Dashboard under **Payments**. The customer's name, phone, address, PIN and items are in the **Notes** section of the payment.

Never put the key secret in `index.html` or `products.js`. It belongs only in Vercel's environment variables.
