const UserService = require("../services/user_service");
const UserModel = require("../models/user.model");  // Ensure this import exists and is correct
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Add bcrypt import for Password comparison

exports.register = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;

    // Validate input data
    if (!Email || !Password) {
      return res.status(400).json({ status: false, error: "Email and Password are required" });
    }

    // Check if the user already exists
    const existingUser = await UserService.checkUser(Email);
    if (existingUser) {
      return res.status(400).json({ status: false, error: "User already exists" });
    }

    // Register the user
    const success = await UserService.registerUser(Email, Password);

    if (success) {
      res.json({ status: true, success: "User registered successfully" });
    } else {
      res.status(500).json({ status: false, error: "Failed to register user" });
    }
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body; // Fixed variable names to match request body

    // Validate input data
    if (!Email || !Password) {
      return res.status(400).json({ status: false, error: "Email and Password are required" });
    }

    // Check if the user exists
    const user = await UserService.checkUser(Email);
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    // Compare the Password
    const isMatch = await bcrypt.compare(Password, user.Password); // Compare hashed Passwords
    if (!isMatch) {
      return res.status(401).json({ status: false, error: "Invalid credentials" });
    }

    // Generate a JWT token
    const tokenData = { userId: user.userId, Email: user.Email };
    const token = await UserService.generateToken(tokenData, process.env.JWT_SECRET, "1h");

    // Set the token as an HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true, // Protect against XSS attacks
        secure: process.env.NODE_ENV === "production", // Use HTTPS only in production
        maxAge: 3600000, // 1 hour
        sameSite: "strict", // Strict cookie handling
      })
      .json({ status: true, message: "Login successful" });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};


exports.me = async (req, res) => {
  try {
    // Safely access the token
    const token = req.cookies?.token; 

    if (!token) {
      return res.status(401).json({ status: false, error: "Unauthorized - No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Respond with decoded user information
    res.status(200).json({ status: true, user: decoded });
  } catch (err) {
    console.error("Error validating token:", err);
    res.status(401).json({ status: false, error: "Invalid or expired token" });
  }
};
