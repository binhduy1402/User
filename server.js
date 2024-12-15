const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const dotenv=require("dotenv");
const connectDB =require('./connection');
const app=express();
const cookieParser = require("cookie-parser");
dotenv.config()
var multer = require('multer');

const PORT = process.env.PORT || 8070;
connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors(
    { 
       origin:["http://localhost:3000"],
       credentials: true,
    }
));

app.use(bodyParser.json());

//User Management
const UserManagement=require('./api/UserManagement/UserManagement.api');
app.use('/user-management',UserManagement);

//Authentication
const Authentication=require('./api/Authentication/Auth.api');
app.use('/auth',Authentication);

app.listen(PORT,() =>{
    console.log('User management service is running');
});
