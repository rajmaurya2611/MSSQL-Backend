const UserModel = require("../models/user.model"); // Uses the MSSQL-based user model
const jwt = require("jsonwebtoken");

class UserService {
  // Register a new user
  static async registerUser(email, password) {
    try {
      // Validate the email and password format (Basic example)
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Use the createUser function from the user model
      const userCreated = await UserModel.createUser(email, password);
      if (!userCreated) {
        throw new Error("Failed to create user in database");
      }

      return true;  // User was successfully created
    } catch (err) {
      console.error("Error registering user:", err);
      throw new Error("Failed to register user. Please try again later.");
    }
  }

  // Check if a user exists by email
  static async checkUser(email) {
    try {
      if (!email) {
        throw new Error("Email is required to check for an existing user");
      }

      const user = await UserModel.findUserByEmail(email); // Find user by email
      return user;  // Return the user object or null/undefined if not found
    } catch (err) {
      console.error("Error checking user:", err);
      throw new Error("Error checking user existence. Please try again later.");
    }
  }

  // Generate a JWT token
  static async generateToken(tokenData, secretKey, expiresIn) {
    try {
      // It's better to store your JWT secret in an environment variable
      const jwtSecretKey = process.env.JWT_SECRET || secretKey;  // Use an environment variable
      const token = jwt.sign(tokenData, jwtSecretKey, { expiresIn });
      return token;
    } catch (err) {
      console.error("Error generating JWT token:", err);
      throw new Error("Failed to generate token. Please try again later.");
    }
  }
}

module.exports = UserService;
