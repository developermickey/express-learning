const checkAuth = (req) => {
  try {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
module.exports = checkAuth;
