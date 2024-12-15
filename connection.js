const mongoose = require("mongoose");

const MONGODB_URL = 'mongodb+srv://admin:admin@app.zfrzf.mongodb.net/?retryWrites=true&w=majority&appName=app';

const connectDB = async () => {
    await mongoose.connect(MONGODB_URL, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    });
    console.log('Kết nối cơ sở dữ liệu quản lý người dùng đang chạy');
};

module.exports = connectDB;
