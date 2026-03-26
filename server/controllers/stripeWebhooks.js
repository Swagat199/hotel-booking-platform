import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (req, res) => {

    console.log("🔥 Webhook hit");

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("RAW BODY TYPE:", typeof req.body);
        console.log("HEADERS:", req.headers);
        console.log("✅ Signature verified");
        console.log("👉 Event type:", event.type);

    } catch (error) {
        console.log("❌ Webhook Error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // ✅ NOW use event
    if (
  event.type === "checkout.session.completed" ||
  event.type === "payment_intent.succeeded"
) {
  console.log("🎉 PAYMENT SUCCESS EVENT");

  let bookingId;

  if (event.type === "checkout.session.completed") {
    bookingId = event.data.object.metadata.bookingId;
  }

  if (event.type === "payment_intent.succeeded") {
    bookingId = event.data.object.metadata?.bookingId;
  }

  console.log("Booking ID:", bookingId);

  if (bookingId) {
    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "Stripe",
      status: "confirmed",
    });

    console.log("✅ DB UPDATED");
  } else {
    console.log("❌ bookingId missing in metadata");
  }
}

    res.json({ received: true });
};