const jwt = require("jsonwebtoken");
const jwtAuthMiddleware = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
      success: false,
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Invalid token",
      success: false,
    });
  }
};

const generateToken = (userData) => {
  return jwt.sign({ user: userData }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
};

module.exports = { jwtAuthMiddleware, generateToken };
