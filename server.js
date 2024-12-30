const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require('./connection');
const app = express();
const cookieParser = require("cookie-parser");

dotenv.config();

const PORT = process.env.PORT || 8070;

// Kết nối database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Cấu hình CORS
const allowedOrigins = [
    "http://localhost:3000",  // Local development
    "https://fe-eplh.onrender.com",  // Frontend Render
    "https://www.binhduy1402.id.vn"  // Production domain
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Cho phép gửi cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Các phương thức cho phép
    allowedHeaders: ["Content-Type", "Authorization"], // Các tiêu đề cho phép
}));

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
