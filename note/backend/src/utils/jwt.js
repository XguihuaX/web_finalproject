const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

const secretKey = "12345678"; // Secret key for signing JWTs

// Generate JWT
exports.generateToken = (user) => {
  try {
    const token = jwt.sign(
      { userId: user.userId, status: user.status },
      secretKey,
      { expiresIn: "720h" } // 720 hours expiration directly
    );
    console.log("Generated Token:", token);
    return token;
  } catch (err) {
    console.error("Error generating token:", err);
    throw new Error("Token generation failed");
  }
};

// Verify JWT
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Verified Token:", decoded);
    return decoded;
  } catch (err) {
    console.error("Error verifying token:", err.message);
    throw new Error("Token验证失败");
  }
};

// Middleware for verifying user tokens
exports.verifyUserToken = (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({ message: "未提供token" });
    }

    const decoded = jwt.verify(token, secretKey); // Verify token
    console.log("Decoded Token:", decoded);

    req.user = decoded; // Attach decoded data to request
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ message: "无效的token" });
  }
};

// Middleware for verifying admin tokens
exports.verifyAdminToken = (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({ message: "未提供token" });
    }

    const decoded = jwt.verify(token, secretKey); // Verify token
    console.log("Decoded Token:", decoded);

    if (decoded.status !== "admin") {
      return res.status(403).json({ message: "需要管理员权限" });
    }

    req.user = decoded; // Attach decoded data to request
    next();
  } catch (err) {
    console.error("Error verifying admin token:", err);
    return res.status(401).json({ message: "无效的token" });
  }
};
