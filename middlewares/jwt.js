const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  try {
    // ✅ Check if cookies exist
    if (!req.cookies) {
      console.error("req.cookies is undefined - cookie-parser not configured");
      return res.status(500).render("error", {
        title: "Server Error",
        message: "Cookie parser not configured properly",
      });
    }

    const token = req.cookies.token;

    if (!token) {
      // Redirect to login page instead of returning JSON
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // or decoded.user if you wrap it
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    // Clear invalid cookie and redirect to login
    res.clearCookie("token");
    return res.redirect("/login");
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
};

module.exports = { jwtAuthMiddleware, generateToken };
