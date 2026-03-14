import express from "express"
import "dotenv/config";
import cors from "cors";
import { connect } from "mongoose";
import connectDB from "./configs/db.js";
import  { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import { v2 as cloudinary } from "cloudinary";

connectDB();
connectCloudinary();

const app = express();
app.use(cors());

app.use("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);
app.use(express.json());
app.use(clerkMiddleware());

//clerkWebhooks();
//app.use("/api/clerk",clerkWebhooks);


app.get('/',(req,res)=>res.send("API is working fine!"));

app.use("/api/user",userRouter);
app.use("/api/hotels",hotelRouter);   
app.use("/api/rooms",roomRouter);
app.use("/api/bookings",bookingRouter);


app.get('/health',(req,res)=>res.send("API is w fine!"));
app.get("/cloud-test", async (req,res)=>{
  try{
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    );
    res.json(result);
  }catch(err){
    console.log(err);
    res.json(err);
  }
});

const PORT = 5000;
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));
