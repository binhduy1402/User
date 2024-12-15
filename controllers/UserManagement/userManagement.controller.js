const express = require("express");
let router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserManagement = require("../../models/UserManagementModel");
const AuthenticationModel = require("../../models/AuthenticationModel");

const AddUser = async (req, res) => {
  let FirstName = req.body.FirstName;
  let LastName = req.body.LastName;
  let Email = req.body.Email;
  let Contact = req.body.Contact;
  let Role = req.body.Role;
  let Branch = req.body.Branch;
  let Password = req.body.Password;
  let Profile = req.file.filename;
  let Address = " ";

  console.log(
    FirstName,
    LastName,
    Email,
    Contact,
    Password,
    Role,
    Branch,
    Profile
  );

  if (!FirstName || !LastName || !Email || !Contact || !Password || !Profile || !Role || !Branch)
    return res.status(200).json({ Message: "Vui lòng nhập đầy đủ thông tin yêu cầu." });

  const salt = await bcrypt.genSalt();
  const PasswordHash = await bcrypt.hash(Password, salt);

  const UserManage = new UserManagement({
    FirstName,
    LastName,
    Email,
    Contact,
    Role,
    Branch,
    PasswordHash,
    Profile,
  });

  const existingUser = await AuthenticationModel.findOne({ Email });

  if (existingUser)
    return res.status(200).json({ Message: "Email này đã được sử dụng." });

  await UserManage.save()
    .then(() => {
      const newUser = new AuthenticationModel({
        FirstName,
        LastName,
        Email,
        Contact,
        Address,
        Role,
        Branch,
        PasswordHash,
      });
      const saveUser = newUser.save();
      const token = jwt.sign(
        {
          user: saveUser._id,
        },
        process.env.JWT_SECRET
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      res.json({ Message: "Thêm người dùng thành công." });
    })
    .catch((err) => {
      console.log("Lỗi khi thêm người dùng.");
      console.log(err);
    });
};

const DisplayUser = async (req, res) => {
  await UserManagement.find()
    .then((UserManagement) => {
      console.log("HIỂN THỊ DỮ LIỆU NGƯỜI DÙNG");
      res.status(200).json(UserManagement);
    })
    .catch((err) => {
      console.log("LỖI KHI HIỂN THỊ DỮ LIỆU");
      console.log(err);
    });
};

const getOneUser = async (req, res) => {
  const _id = req.params.id;
  await UserManagement.findById(_id, (err, UserManagement) => {
    console.log(UserManagement);
    return res.status(200).json({
      success: true,
      UserManagement,
    });
  }).catch((err) => {
    console.log(err);
  });
};

const UpdateUser = async (req, res) => {
  const _id = req.params.id;
  let FirstName = req.body.FirstName;
  let LastName = req.body.LastName;
  let Email = req.body.Email;
  let Contact = req.body.Contact;
  let Role = req.body.Role;
  let Branch = req.body.Branch;

  console.log(FirstName, LastName, Email, Contact, Role, Branch);

  const update = await UserManagement.findByIdAndUpdate(_id, {
    FirstName: FirstName,
    LastName: LastName,
    Email: Email,
    Contact: Contact,
    Role: Role,
    Branch: Branch,
  })
    .then(() => {
      AuthenticationModel.updateOne({
        Email: Email,
        Role: Role,
      })
        .then((user) => {
          console.log("Đã cập nhật", update);
          res.status(200).send({ status: "Cập nhật thành công", user: update });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Lỗi khi cập nhật" });
    });
};

const DeleteUser = async (req, res) => {
  const _id = req.params.id;
  let Email = req.body.Email;

  await UserManagement.findByIdAndDelete(_id)
    .then((users) => {
      AuthenticationModel.remove({
        Email: Email,
      })
        .then((user) => {
          res.json({
            status: "Xóa thành công",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const ContactUser = async (req, res) => {
  const _id = req.params.id;
  await UserManagement.findById(_id, (err, UserManagement) => {
    return res.status(200).json({
      success: true,
      UserManagement,
    });
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = {
  AddUser,
  DisplayUser,
  getOneUser,
  UpdateUser,
  DeleteUser,
  ContactUser,
};
