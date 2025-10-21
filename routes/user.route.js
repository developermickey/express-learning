const express = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middlewares/jwt");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, firstname, lastname, profileimage, email, password } =
      req.body;
    if (
      !String(username || "").trim() ||
      !String(firstname || "").trim() ||
      !String(lastname || "").trim() ||
      !String(profileimage || "").trim() ||
      !String(email || "").trim() ||
      !String(password || "").trim()
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        message: "User already exists",
        success: false,
      });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      firstname,
      lastname,
      profileimage,
      email,
      password: hashPassword,
    });

    const token = generateToken({ id: newUser._id });
    res.status(201).json({
      message: "User created successfully",
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
