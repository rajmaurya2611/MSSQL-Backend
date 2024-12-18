const UserService = require("../services/user_service");
const UserModel = require("../models/user.model");  // Ensure this import exists and is correct
const bcrypt = require("bcrypt"); // Add bcrypt import for password comparison

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input data
    if (!Email || !Password) {
      return res.status(400).json({ status: false, error: "Email and password are required" });
    }

    // Check if the user already exists
    const existingUser = await UserService.checkUser(Email);
    if (existingUser) {
      return res.status(400).json({ status: false, error: "User already exists" });
    }

    // Register the user
    const success = await UserService.registerUser(email, password);

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
    const { Email, Password } = req.body;

    // Validate input data
    if (!Email || !Password) {
      return res.status(400).json({ status: false, error: "Email and password are required" });
    }

    // Check if the user exists
    const user = await UserService.checkUser(Email);
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(Password, user.Password); // Compare hashed passwords
    if (!isMatch) {
      return res.status(401).json({ status: false, error: "Invalid credentials" });
    }

    // Generate a JWT token
    const tokenData = { UserId: user.UserId, Email: user.Email };
    const token = await UserService.generateToken(tokenData, "secretkey", "1h");

    res.status(200).json({ status: true, token: token });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};
