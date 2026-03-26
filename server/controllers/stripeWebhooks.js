import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhook
export const stripeWebhooks = async (req,res)=>{
    // stripe gateway initialize
        console.log("🔥 Webhook hit");

if (event.type === "checkout.session.completed") {
    console.log("🎉 SUCCESS EVENT");
}
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const sig = req.headers['stripe-signature'];
        let event;

    try {  
        event=stripeInstance.webhooks.constructEvent(req.body,sig,
            process.env.STRIPE_WEBHOOK_SECRET);
    }catch(error){
        res.status(400).send(`Webhook Error: ${error.message}`)
    } 

    // Handle the event
    if(event.type === 'checkout.session.completed'){
        // const paymentIntent = event.data.object;
        // const paymentIntentId = paymentIntent.id;

        // // Getting Session Metadata
        // const session = await stripeInstance.checkout.sessions.list({
        //     payment_intent:paymentIntentId,
        // }); 

        // const {bookingId} = session.data[0].metadata;
        const session = event.data.object;

        const bookingId = session.metadata.bookingId;

        console.log("✅ Payment success for booking:", bookingId);
        // Mark Payment as Paid
        await Booking.findByIdAndUpdate(bookingId,{isPaid:true,paymentMethod:"Stripe"});
         
    }else{
        console.log("Unhandled event type :",event.type);
    }
    res.json({ received:true});
}