const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API running");
});

// health check for Render warm-up
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });