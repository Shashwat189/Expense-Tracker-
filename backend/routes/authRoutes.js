const express = require("express");

console.log("AUTH ROUTES FILE LOADED");

const router = express.Router();

const {
  signup,
  login,
} = require("../controllers/authController");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("AUTH ROUTE WORKING");
});

// SIGNUP ROUTE
router.post("/signup", signup);

// LOGIN ROUTE
router.post("/login", login);

module.exports = router;