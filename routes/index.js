const express = require("express");
const redirectIfLoggedIn = require("../middlewares/redirectIfLoggedIn");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();

router.get("/", (req, res) => {
  const isLoggedIn = checkAuth(req);
  res.render("index", { title: "Home Page", isLoggedIn });
});

router.get("/about", (req, res) => {
  const isLoggedIn = checkAuth(req);
  res.render("about", { title: "About Us", isLoggedIn });
});
router.get("/blog", (req, res) => {
  const isLoggedIn = checkAuth(req);
  res.render("blog", { title: "Blog", isLoggedIn });
});

router.get("/contact", (req, res) => {
  const isLoggedIn = checkAuth(req);
  res.render("contact", { title: "Contact Us", isLoggedIn });
});

router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("login", { title: "Login", isLoggedIn: false });
});

router.get("/signup", redirectIfLoggedIn, (req, res) => {
  res.render("signup", { title: "Sign Up", isLoggedIn: false });
});

module.exports = router;
