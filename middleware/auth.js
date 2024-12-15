const jwt=require("jsonwebtoken");
//this middleware function for checking user authorization
function auth(req,res,next){
    try{
        const token = req.cookies.token;
        //if use unauthorized person then execute this if statement
        if (!token) {
            return res.json({ errorMessage: "Unauthorized" });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;
        next();

    //if an unautherized person detected, then throws 401 error
    }catch(err){
        console.log(err);
        res.status(401).json({errorMessage :"Unauthorized"});
    }
}
module.exports= auth;