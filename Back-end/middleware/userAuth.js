const jwt = require('jsonwebtoken')
const env = require('dotenv').config()

const JWT_SECRET = process.env.USER_SECRET_KEY

const userAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = {
            _id: decodedToken._id || decodedToken.id || decodedToken.userId
        };
        
        next();
    } catch (err) {
        console.log("JWT error:", err);
        res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = userAuth;