const jwt = require("jsonwebtoken");

const redirectIfLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      // Verify if token is valid
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // If valid, redirect to profile
      return res.redirect("/profile");
    }

    // No token, continue to login/signup page
    next();
  } catch (error) {
    // Invalid token, clear it and continue to login/signup
    res.clearCookie("token");
    next();
  }
};

module.exports = redirectIfLoggedIn;
