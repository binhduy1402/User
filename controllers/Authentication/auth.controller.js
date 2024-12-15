const express = require("express");
let router = express.Router();
const AuthenticationModel = require("../../models/AuthenticationModel");
const UserManagement = require("../../models/UserManagementModel");
const bcrypt = require("bcryptjs");
let jwt = require('jsonwebtoken');

const Register = async (req, res) => {
  try {
    const { FirstName, LastName, Email, Contact, Password, CPassword } = req.body;
    const Role = "User";
    const Branch = " ";

    if (!FirstName || !LastName || !Email || !Contact || !Password || !CPassword || !Role)
      return res
        .status(200)
        .json({ errorMessage: "Vui lòng nhập đầy đủ thông tin yêu cầu" });

    if (Password.length < 6)
      return res
        .status(200)
        .json({
          errorMessage: "Mật khẩu phải có ít nhất 6 ký tự",
        });

    if (Password !== CPassword)
      return res
        .status(200)
        .json({ errorMessage: "Mật khẩu không khớp" });

    const existingUser = await AuthenticationModel.findOne({ Email });

    if (existingUser)
      return res
        .status(200)
        .json({ errorMessage: "Tài khoản với email này đã tồn tại" });

    const salt = await bcrypt.genSalt();
    const PasswordHash = await bcrypt.hash(Password, salt);

    const newUser = new AuthenticationModel({
      FirstName,
      LastName,
      Email,
      Contact,
      Role,
      Branch,
      PasswordHash
    });
    const saveUser = await newUser.save();
    res.status(200).json({ Success: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).send("Đã xảy ra lỗi trong quá trình xử lý");
  }
};

const Login = async (req, res) => {
  try {
    const { Email, Password, Dates, time } = req.body;

    if (!Email || !Password) {
      return res
        .status(400)
        .json({ errorMessage: "Vui lòng nhập đầy đủ thông tin yêu cầu" });
    }
    const existingUser = await AuthenticationModel.findOne({ Email });

    if (!existingUser) {
      return res.status(401).json({ errorMessage: "Email hoặc mật khẩu không đúng" });
    }
    const passwordCorrect = await bcrypt.compare(
      Password,
      existingUser.PasswordHash
    );

    if (!passwordCorrect) {
      return res.status(401).json({ errorMessage: "Email hoặc mật khẩu không đúng" });
    }

    UserManagement.updateOne({
      LastLoginDate: Dates,
      LastLoginTime: time
    }).then(() => {
      const token = jwt.sign({
        user: existingUser._id
      }, process.env.JWT_SECRET);

      res.cookie("token", token, {
        httpOnly: true,
      }).send({
        users: existingUser,
      });
    }).catch((err) => {
      console.log(err);
    })
  } catch (err) {
    console.log(err);
  }
};

const Logout = async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send({ message: "Đăng xuất thành công" });
};

module.exports = {
  Register,
  Login,
  Logout,
};
