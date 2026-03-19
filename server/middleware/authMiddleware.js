import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req,res,next)=>{
  try {
    /*console.log("HEADERS:", req.headers.authorization);
    console.log("AUTH:", req.auth());
    console.log(userId,"authMiddleware");*/
    
    const { userId } = req.auth();
    //console.log(userId);
    if(!userId){
      console.log("User not authenticated");
      return res.json({
        success:false,
        message:"not authenticated"
      });
    }

    const user = await User.findById(userId);

    if(!user){
      return res.json({
        success:false,
        message:"User not found"
      });
    }

    req.user = user;

    next();

  } catch (error) {
    res.json({
      success:false,
      message:error.message
    });
  }
}