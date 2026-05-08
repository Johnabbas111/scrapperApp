const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userData = await User.findById(userId).select("-password");
    if (!userData) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports = authMiddleware;
