require("dotenv").config(); // Load environment variables from .env file
const sql = require("mssql");

// Read database configuration from environment variables
const config = {
  user: process.env.DB_USER, // SQL Server username
  password: process.env.DB_PASSWORD, // SQL Server password
  server: process.env.DB_SERVER, // SQL Server server
  database: process.env.DB_DATABASE, // SQL Server database name
  options: {
    encrypt: process.env.DB_ENCRYPT === "true", // Convert to boolean
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === "true", // Convert to boolean
  },
};

let pool;

// Initialize connection pool
async function initializePool() {
  try {
    pool = await sql.connect(config); // Create connection pool
    console.log("SQL Server connection pool initialized.");
  } catch (err) {
    console.error("Error initializing connection pool:", err);
  }
}

// Query example to be used throughout the app
async function queryDatabase() {
  if (!pool) {
    console.error("Pool is not initialized.");
    return;
  }

  try {
    const result = await pool.request().query("SELECT 1 AS Test");
    console.log("Test Query Result:", result.recordset);
  } catch (err) {
    console.error("Error querying database:", err);
  }
}

// Call initializePool once when your app starts
initializePool().then(() => {
  queryDatabase(); // Query the database after initialization
});

// Gracefully close the connection pool during shutdown
async function closePool() {
  if (pool) {
    await pool.close();
    console.log("SQL Server connection pool closed.");
  }
}

// Example to close the pool when the app shuts down (e.g., via process signals)
process.on("SIGINT", closePool);
process.on("SIGTERM", closePool);
