const jwt = require("jsonwebtoken");

const USER_SECRET = process.env.USER_SECRET_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;

const adminLog = (req, res, next) => {
  const token = req.cookies.token || req.cookies.adminToken;
  const secret = req.cookies.adminToken ? ADMIN_SECRET : USER_SECRET;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token found" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin || false;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = adminLog;
