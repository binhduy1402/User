const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require('./connection'); // Kết nối database
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;

// Kết nối database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Cấu hình CORS
app.use(cors({
    origin: "*", // Cho phép tất cả các nguồn
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Cho phép các phương thức HTTP
    allowedHeaders: ["Content-Type", "Authorization"], // Cho phép các tiêu đề
    credentials: true, // Hỗ trợ cookies
}));

// Xử lý yêu cầu preflight (OPTIONS)
app.options("*", cors());

// API User Management
const UserManagement = require('./api/UserManagement/UserManagement.api');
app.use('/user-management', UserManagement);

// API Authentication
const Authentication = require('./api/Authentication/Auth.api');
app.use('/auth', Authentication);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
