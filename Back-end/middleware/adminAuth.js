const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

const JWT_SECRET = process.env.ADMIN_SECRET_KEY;

const adminAuth = (req, res, next) => {
  const token = req.cookies?.adminToken;

  if (!token) {
    return res.status(401).json({ message: "Admin access denied: No token" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    console.log(decodedToken);
    
    req.admin = {
      _id: decodedToken._id || decodedToken.id || decodedToken.userId
    };

    console.log("Authenticated admin ID:", req.admin._id);

    next();
  } catch (err) {
    console.error("Admin JWT error:", err);
    return res.status(403).json({ message: "Invalid admin token" });
  }
};

module.exports = adminAuth;
