const sql = require("mssql");
const bcrypt = require("bcrypt");

// SQL Server table name
const tableName = "users";

// Function to create a new user
async function createUser(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Log the password to ensure it's valid
    console.log("Password received for hashing:", password);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt); // Ensure password and salt are valid

    console.log("Hashed password:", hashpass);

    // Insert the user into the database
    const pool = await sql.connect(require("../config/db"));
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashpass)
      .query(
        `INSERT INTO ${tableName} (email, password) VALUES (@email, @password)`
      );

    return result.rowsAffected > 0;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}


// Function to find a user by email
async function findUserByEmail(email) {
  try {
    console.log("Searching for user with email:", email);  // Log the email
    const pool = await sql.connect(require("../config/db"));
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(`SELECT * FROM ${tableName} WHERE email = @email`);

    return result.recordset[0]; // Return the first matched user or undefined
  } catch (err) {
    console.error("Error finding user:", err);
    throw err;
  }
}

// Function to compare passwords
async function comparePassword(storedPassword, inputPassword) {
  try {
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    return isMatch;
  } catch (err) {
    console.error("Error comparing passwords:", err);
    throw err;
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  comparePassword,
};
