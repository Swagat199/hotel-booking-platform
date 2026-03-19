import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";


//Function to Check Availbility of Room
const checkAvailbility = async ({ checkInDate,checkOutDate,room})=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate:{$lte:checkOutDate},
            checkOutDate:{$gte:checkInDate},
        });
        const isAvailble = bookings.length === 0;
        return isAvailble;
    } catch (error) {
        console.error(error.message);
    }
}

// API to check availbility of room
// POST /api/bookings/check-availbility
export const checkAvailbilityAPI = async (req,res)=>{
    try {
       const {room,checkInDate,checkOutDate} = req.body;
       const isAvailble = await checkAvailbility({checkInDate,checkOutDate,room});
       res.json({success:true,isAvailble});
    } catch (error) {
       res.json({success:false,message:error.message});
    }
}
 
// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req,res)=>{
    try {
        const {room,checkInDate,checkOutDate,guests} = req.body;
        const user = req.user._id;

        //Before Booking Check Availbility
        const isAvailble = await checkAvailbility({
            checkInDate,
            checkOutDate,
            room,
        });

        if(!isAvailble){
            return res.json({success:false,message:"Room is not availble"});
        }

        // Get totalprice from Room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        // Calculate totalPrice based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime()-checkIn.getTime();
        const nights = Math.ceil(timeDiff/(1000*3600*24));
        
        totalPrice *=nights; 
        const booking = await Booking.create({
            user,
            room,
            hotel:roomData.hotel._id,
            guests:+guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        const mailOptions = {
            // from:process.env.SENDER_EMAIL,
            // to:req.user.email,
            // subject:'Hotel Booking  Details',
            // html:
            //     `<h2>Your Booking Details</h2>
            //      <p>Dear ${req.user.username},</p>
            //      <p>Thank you for your booking! Here are your details:</p>
            //      <ul>
            //         <li><strong>Booking ID:</strong> ${booking._id}</li>
            //         <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
            //         <li><strong>Location:</strong> ${roomData.hotel.address}</li>
            //         <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
            //         <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || '₹'} ${booking.totalPrice}/night</li>
            //      </ul>
            //      <p>We look forward to welcoming you!</p>
            //      <p>If you need to make any changes, feel free to cntact us. </p>
            //     `
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: "🎉 Booking Confirmed | Your Stay is Ready!",
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; padding: 20px; font-size: 16px; line-height: 1.6;">
  
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <div style="background: #0f172a; padding: 20px; text-align: center;">
                    <img src="https://ezgif.com/save/ezgif-72de56f57010d5b3.png" alt="Logo" style="height: 50px;" />
                    </div>

                    <!-- Animated Banner (GIF) -->
                    <div style="text-align: center;">
                    <img src="https://media.giphy.com/media/OkJat1YNdoD3W/giphy.gif" 
                    alt="Booking Confirmed" 
                    style="width: 100%; max-height: 200px; object-fit: cover;" />
                </div>

             <!-- Hero -->
            <div style="padding: 20px; text-align: center;">
                <h2 style="color: #38bdf8;">🎉 Booking Confirmed!</h2>
                <p style="color: #555;">Your perfect stay is waiting for you ✨</p>
            </div>

             <!-- Content -->
            <div style="padding: 20px; color: #333;">
            <h3>Hello ${req.user.username}, 👋</h3>
      
            <p>We’re excited to host you! Here are your booking details:</p>

            <!-- Details -->
            <div style="background: #f1f5f9; border-radius: 10px; padding: 15px;">
            <p><strong>🆔 Booking ID:</strong> ${booking._id}</p>
            <p><strong>🏨 Hotel:</strong> ${roomData.hotel.name}</p>
            <p><strong>📍 Location:</strong> ${roomData.hotel.address}</p>
            <p><strong>📅 Date:</strong> ${booking.checkInDate.toDateString()}</p>
            <p><strong>💰 Amount:</strong> ${process.env.CURRENCY || '₹'} ${booking.totalPrice} / night</p>
            </div>

        <!-- Animated Button -->
      <div style="text-align: center; margin: 25px 0;">
        <a href="http://localhost:5173/my-bookings" 
           style="
             display: inline-block;
             background: linear-gradient(135deg, #4facfe, #00f2fe);
             color: white;
             padding: 14px 22px;
             border-radius: 8px;
             text-decoration: none;
             font-weight: bold;
             transition: all 0.3s ease;
           ">
           🚀 View Booking
        </a>
      </div>

      <p style="text-align:center;">✨ We can’t wait to welcome you!</p>
    </div>

    <!-- Footer -->
    <div style="background: #0f172a; text-align: center; padding: 15px; color: #94a3b8;">
      <p>© 2026 QuickStay</p>
    </div>

  </div>
</div>
`
        }

        await transporter.sendMail(mailOptions);
        

        res.json({success:true,message:"Booking created successfully"});

    } catch (error) {
        res.json({success:false,message:"Failed to create booking"});
    }
}

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req,res)=>{
    try {
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate("room hotel")
        .sort({createdAt:-1})
        res.json({success:true,bookings});
    } catch (error) {
        res.json({success:false,message:"Failed to fetch bookings"});
    }
}

 
export const getHotelBookings = async (req,res)=>{
    try {
        const hotel = await Hotel.findOne({owner:req.auth().userId});

        if(!hotel){
            return res.json({success:false,message:"No Hotel found"});
        }

        const bookings = await Booking.find({hotel:hotel._id}).populate("room hotel user").sort({createdat:-1});

        const totalBookings = bookings.length;

        const totalRevenue = bookings.reduce((acc,booking)=>acc+booking.totalPrice,0);

        res.json({success:true,dashboardData :{totalBookings,totalRevenue,bookings}});

    } catch (error) {
         res.json({success:false,message:"Failed to fetch bookings"});
    }
}