const express = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken, jwtAuthMiddleware } = require("../middlewares/jwt");
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
      return res.status(400).render("signup", {
        title: "Sign Up",
        error: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).render("signup", {
        title: "Sign Up",
        error: "User already exists",
      });
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

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    // ✅ Redirect to profile
    res.redirect("/profile");
  } catch (error) {
    res.status(500).render("signup", {
      title: "Sign Up",
      error: "Server Error: " + error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).render("login", {
        title: "Login",
        error: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).render("login", {
        title: "Login",
        error: "Invalid email or password",
        isLoggedIn: false,
      });
    }

    const token = generateToken({ id: user._id });

    // ✅ Set cookie with proper options
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour (matching JWT expiry)
    });

    // ✅ Redirect to profile page
    res.redirect("/profile");
  } catch (error) {
    res.status(500).render("login", {
      title: "Login",
      error: "Server Error: " + error.message,
      isLoggedIn: false,
    });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).render("error", {
        title: "Error",
        message: "User not found",
        isLoggedIn: false,
      });
    }

    res.render("profile", {
      title: "User Profile",
      user,
      isLoggedIn: true,
    });
  } catch (error) {
    res.status(500).render("error", {
      title: "Server Error",
      message: error.message,
      isLoggedIn: false,
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
