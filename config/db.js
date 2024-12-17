const sql = require("mssql");

const config = {
  user: "sa", // Your SQL Server username
  password: "Mtsl@123", // Your SQL Server password
  server: "7193RAJMAU4136L", // Your SQL Server server
  database: "testdb2", // Your SQL Server database name
  options: {
    encrypt: false, // Set to true for Azure, false for local connections
    trustServerCertificate: true, // Change to true for development environments
  },
};

let pool;

// Initialize connection pool
async function initializePool() {
  try {
    // Create a connection pool and keep it open
    pool = await sql.connect(config);
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
  // Once the pool is initialized, you can query the database
  queryDatabase();
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
