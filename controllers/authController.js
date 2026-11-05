const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER / SIGNUP
const register = async (req, res) => {
  try {
    const { name, username, businessName, email, password, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // check user already exists
    const existingUser = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const resolvedName = (name || username || businessName || "User").trim();

    // create user
    const user = await User.create({
      name: resolvedName,
      username: resolvedName,
      businessName: businessName || resolvedName,
      email: String(email).trim().toLowerCase(),
      password: hashedPassword,
      role: role || "user"
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret124",
      { expiresIn: "7d" }
    );

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    res.status(201).json({
      message: "User registered successfully",
      response: userObj,
      user: userObj,
      token
    });

  } catch (err) {
    console.error("Auth register error:", err);
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // find user
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret124",
      { expiresIn: "7d" }
    );

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    res.json({
      message: "Login successful",
      response: userObj,
      user: userObj,
      token
    });

  } catch (err) {
    console.error("Auth login error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  signup: register,
  login
};
