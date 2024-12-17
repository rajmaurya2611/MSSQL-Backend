const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user.router");

const app = express();

// Enable CORS with specific configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies if needed
  })
);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Mount user routes
app.use("/", userRouter); // Use "/api" as prefix for all user routes

module.exports = app;
