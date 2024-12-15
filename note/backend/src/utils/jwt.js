const jwt = require("jsonwebtoken");
const secretKey = "12345678"; // 请使用更安全的密钥

// 生成JWT
exports.generateToken = (user) => {
  return jwt.sign({ userId: user.userId, status: user.status }, secretKey, {
    expiresIn: "24h",
  });
};

// 验证JWT
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (_err) {
    throw new Error("Token验证失败");
  }
};

// 普通token验证中间件
exports.verifyUserToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "未提供token" });
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (_err) {
    return res.status(401).json({ message: "无效的token" });
  }
};

// 管理员token验证
exports.verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "未提供token" });
    }

    const decoded = jwt.verify(token, secretKey);
    if (decoded.status !== "admin") {
      return res.status(403).json({ message: "需要管理员权限" });
    }

    req.user = decoded;
    next();
  } catch (_err) {
    return res.status(401).json({ message: "无效的token" });
  }
};
