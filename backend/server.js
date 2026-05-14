const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// root route
app.get("/", (req, res) => {
  res.send("API running");
});

// health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// connect db + start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`,
      );
    });
  })
  .catch((err) => {
    console.error(
      "MongoDB connection failed:",
      err,
    );
  });