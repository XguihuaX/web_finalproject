const User = require("../models/user.js");
const jwtUtils = require("../utils/jwt.js");

tolowerCase = (status) => {
  if (status === "User" || status === "user"){
    return "user";
  } else if (status === "Administrator"|| status === "admin"){
    return "admin";
  } else {
    return null;
  }
}
exports.register = async (req, res) => {
  try {
    let { username, password, status } = req.body;
    console.log(req.body);
    status = tolowerCase(status);

    if (!["user", "admin"].includes(status)) {
      return res.status(400).json({ message: "无效的用户状态" + status });
    }

    // 检查必填字段
    if (!username || !password) {
      return res.status(400).json({ message: "用户名和密码为必填项" });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "用户名已存在" });
    }

    // 创建用户对象,status字段会使用schema中的默认值"user"
    const user = new User({
      username,
      password,
      ...(status && { status }),
    });
    const savedUser = await user.save();

    // 返回用户信息（不包含密码）
    const userResponse = {
      userId: savedUser.userId,
      username: savedUser.username,
      status: savedUser.status,
    };
    console.log("register user:", userResponse);

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查必填字段
    if (!username || !password) {
      return res.status(400).json({ message: "用户名和密码为必填项" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    const token = jwtUtils.generateToken(user);
    console.log(user);
    // 返回用户信息和token
    res.json({
      token,
      user: {
        userId: user.userId,
        username: user.username,
        status: user.status,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
