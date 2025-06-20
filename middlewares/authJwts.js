const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

const authenticateUser = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user || user.role !== 0) {
      return res.status(403).json({ message: "Forbidden: Not a valid user" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("User Auth Error:", error);
    return res.status(500).json({ message: "Authentication Failed" });
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    const token = header.split(" ")[1]; 

    console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
console.log("Token received:", token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user || user.role !== 1) {
      return res.status(403).json({ message: "Forbidden: Not a valid admin" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return res.status(500).json({ message: "Authentication Failed" });
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin
};
