const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

module.exports = router;
